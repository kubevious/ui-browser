import _ from 'the-lodash';
import { IDiagramSource } from "../interfaces/diagram-source";
import { app, IService, Subscriber } from '@kubevious/ui-framework';
import { DiagramBrowserViewOptions } from './types';
import { LayerInfo, LayerInfoKind } from "../service/types";
import { NodeConfig } from "@kubevious/ui-middleware/dist/services/diagram-browser";
import { CallbackHandler } from './callback-handler';
import { IClosable } from '@kubevious/ui-middleware/dist/common-types';
import { parseDn, makeDn }from '@kubevious/entity-meta';

export type LayersChangeHandlerCallback = ((layers: LayerInfo[]) => any);
export type LayerNodesChangeHandlerCallback = ((nodes: NodeConfig[]) => any);

export class DiagramBrowserLoader
{
    private _rootDn : string;
    private _diagramSource: IDiagramSource;
    private _selectedDnSubscriber : Subscriber;

    private _viewOptions: DiagramBrowserViewOptions;

    private _currentExpandedDn: string;
    private _currentSelectedDn: string | null = null;

    private _latestLayers : LayerInfo[] = [];
    private _layerData : Record<string, LayerInternalData> = {};

    private _layersChangeHandler : CallbackHandler<LayersChangeHandlerCallback> = new CallbackHandler<LayersChangeHandlerCallback>();

    constructor(rootDn: string, diagramSource: IDiagramSource, viewOptions?: Partial<DiagramBrowserViewOptions>, initialExpandedDn? : string)
    {
        this._rootDn = rootDn;
        this._diagramSource = diagramSource;
        this._currentExpandedDn = initialExpandedDn || rootDn;

        this._viewOptions = {
            useVerticalNodeView: viewOptions?.useVerticalNodeView ?? true,
            useVerticalNodeCount: viewOptions?.useVerticalNodeCount ?? 2,
            useGridView: viewOptions?.useGridView ?? true,

            autoScrollHorizontally: viewOptions?.autoScrollHorizontally ?? true,
            autoScrollVertically: viewOptions?.autoScrollVertically ?? true,
        }

        console.log("[DiagramBrowserLoader] constructor: ", rootDn);

        this._selectedDnSubscriber = app.sharedState.subscribe('selected_dn', this._handleSelectedDnChange.bind(this))
    }

    close()
    {
        this._layersChangeHandler.close();
        this._selectedDnSubscriber.close();
    }

    onLayersChange(cb: LayersChangeHandlerCallback) : IClosable
    {
        const subscriber = this._layersChangeHandler.on(cb);

        cb(this._latestLayers);

        return subscriber;
    }

    onLayerNodesChange(layer: LayerInfo, cb: LayerNodesChangeHandlerCallback) : IClosable
    {
        if (layer.dataKey) {
            const layerInternalData = this._layerData[layer.dataKey];
            if (layerInternalData) {
                cb(layerInternalData.nodes);
                return layerInternalData.handler.on(cb);
            }
        }

        cb([]);

        return {
            close: () => {
                return;
            }
        };
    }

    private _handleSelectedDnChange(selected_dn: string)
    {
        console.info("[DiagramBrowserLoader] _handleSelectedDnChange :: ", selected_dn);

        if (selected_dn) {
            if (selected_dn.startsWith(this._rootDn)) {
                this._currentSelectedDn = selected_dn;
                this._currentExpandedDn = selected_dn;
            } else {
                this._currentSelectedDn = null;
            }
        } else {         
            this._currentSelectedDn = null;
        }

        this._applyLayers();
    }

    private _applyLayers()
    {
        // const layers = this._calculateNewLayersDeep();
        const layers = this._calculateNewLayersFlat();
        console.info("[DiagramBrowserLoader] _applyLayers :: Desired Layers: ", layers);

        const usedDataSourceKeys : Record<string, boolean> = {};
        for(const layer of layers)
        {
            this._applyLayer(layer, usedDataSourceKeys);
        }

        for(const internalLayer of _.values(this._layerData))
        {
            if (!usedDataSourceKeys[internalLayer.key])
            {
                for(const subscription of _.values(internalLayer.subscriptions)) {
                    subscription.close();
                }
                internalLayer.subscriptions = {};
                delete this._layerData[internalLayer.key];
            }
        }

        console.info("[DiagramBrowserLoader] _applyLayers :: FINAL LAYER DATA: ", this._layerData);

        this._latestLayers = layers;
        this._layersChangeHandler.execute(x => x(this._latestLayers));
    }

    private _applyLayer(layer : LayerInfo, usedDataSourceKeys : Record<string, boolean>)
    {
        if (!layer.dataKey) {
            return;
        }

        usedDataSourceKeys[layer.dataKey] = true;

        let layerInternalData = this._layerData[layer.dataKey];
        if (layerInternalData) {
            layerInternalData.layer = layer;
            this._updateLayerSubscription(layerInternalData);
            return;
        }

        layerInternalData = {
            key: layer.dataKey,
            layer: layer,
            nodeDict: {},
            nodes: [],
            subscriptions: {},
            handler: new CallbackHandler<LayerNodesChangeHandlerCallback>()
        }
        this._layerData[layer.dataKey] = layerInternalData;

        this._setupLayerSubscriptions(layerInternalData);
    }

    private _setupLayerSubscriptions(layerInternalData : LayerInternalData)
    {
        const layer = layerInternalData.layer;
        if (layer.kind == LayerInfoKind.Children)
        {
            const myDn = layer.parent!;
            layerInternalData.subscriptions[myDn] = this._diagramSource.subscribeChildrenNodes(myDn, (nodes) => {
                layerInternalData.nodeDict = _.makeDict(nodes, x => x.dn, x => x);
                this._updateLayerNodes(layerInternalData);
            });
            return;
        }

        if (layer.kind == LayerInfoKind.NodeList)
        {
            this._updateLayerSubscription(layerInternalData);
            return;
        }

        if (layer.kind == LayerInfoKind.Node)
        {
            const myDn = layer.highlightedDn!;
            layerInternalData.subscriptions[myDn] = this._diagramSource.subscribeNode(myDn, (config) => {
                if (config) {
                    layerInternalData.nodeDict[myDn] = config;
                } else {
                    layerInternalData.nodeDict[myDn] = null;
                }
                this._updateLayerNodes(layerInternalData);
            });
            return;
        }
    }

    private _updateLayerSubscription(layerInternalData : LayerInternalData)
    {
        const layer = layerInternalData.layer;
        if (layer.kind === LayerInfoKind.NodeList)
        {
            for(const dn of layer.dnList!)
            {
                if (!layerInternalData.subscriptions[dn])
                {
                    layerInternalData.subscriptions[dn] = this._diagramSource.subscribeNode(dn, (config) => {
                        if (config) {
                            layerInternalData.nodeDict[dn] = config;
                        } else {
                            layerInternalData.nodeDict[dn] = null;
                        }
                        this._updateLayerNodes(layerInternalData);
                    });
                }
            }

            for(const dn of _.keys(layerInternalData.subscriptions))
            {
                if (!layer.dnList!.includes(dn))
                {
                    delete layerInternalData.nodeDict[dn];
                    layerInternalData.subscriptions[dn].close()
                    delete layerInternalData.subscriptions[dn];
                    this._updateLayerNodes(layerInternalData);
                }
            }
            
        }
    }

    private _updateLayerNodes(layerInternalData : LayerInternalData)
    {
        layerInternalData.nodes = _.values(layerInternalData.nodeDict).filter(x => x).map(x => x!);

        layerInternalData.handler.execute(x => x(layerInternalData.nodes));
    }

    private _calculateNewLayersFlat() : LayerInfo[]
    {
        const layers : LayerInfo[] = [ ];

        const dnParts = parseDn(this._currentExpandedDn);

        let currentDn : string | null = null;

        const parentDns : string[] = [];

        let isMyHierarchy = false;
        for(const part of dnParts)
        {
            if (!currentDn) {
                currentDn = part.rn;
            } else {
                currentDn = makeDn(currentDn, part.rn);
            }

            if (currentDn == this._rootDn) {
                isMyHierarchy = true;
            }

            if (isMyHierarchy) {
                if (currentDn) {
                    parentDns.push(currentDn);
                }
            }
        }


        if (parentDns.length > 0) {
            layers.push({
                depth: 0,
                dataKey: null,
                kind: LayerInfoKind.NodeList,
                dnList: parentDns,
                selectedDn: (this._currentSelectedDn && parentDns.includes(this._currentSelectedDn)) ? this._currentSelectedDn : undefined,
            });
        }

        if (this._currentExpandedDn) {
            layers.push({
                depth: 0,
                dataKey: null,
                kind: LayerInfoKind.Children,
                parent: this._currentExpandedDn,
                // dn: currentDn
                isGridView: this._viewOptions.useGridView
            });
        }

        for(let i = 0; i < layers.length; i++)
        {
            const item = layers[i];
            item.depth = i;
        }

        for(const layer of layers)
        {
            layer.dataKey = this._getLayerDataKey(layer);
        }

        return layers;
    }

    // private _calculateNewLayersDeep() : LayerInfo[]
    // {
    //     const dnParts = parseDn(this._currentExpandedDn);
    //     let parentDn : string | null = null;
    //     let currentDn : string | null = null;

    //     const layers : LayerInfo[] = [ ];

    //     let isMyHierarchy = false;
    //     for(const part of dnParts)
    //     {
    //         parentDn = currentDn;

    //         if (!currentDn) {
    //             currentDn = part.rn;
    //         } else {
    //             currentDn = makeDn(currentDn, part.rn);
    //         }

    //         if (isMyHierarchy) {
    //             layers.push({
    //                 depth: 0,
    //                 dataKey: null,
    //                 kind: LayerInfoKind.Children,
    //                 parent: parentDn!,
    //                 selectedDn: (this._currentSelectedDn && (this._currentSelectedDn === currentDn)) ? currentDn : undefined,
    //             });
    //         }

    //         if (currentDn == this._rootDn) {
    //             isMyHierarchy = true;
    //         }
    //     }

    //     if (this._viewOptions.useVerticalNodeView) {
    //         for(const layer of _.dropRight(layers, this._viewOptions.useVerticalNodeCount))
    //         {
    //             layer.kind = LayerInfoKind.Node;
    //         }
    //     }

    //     if (currentDn) {
    //         layers.push({
    //             depth: 0,
    //             dataKey: null,
    //             kind: LayerInfoKind.Children,
    //             parent: currentDn,
    //             // dn: currentDn
    //             isGridView: this._viewOptions.useGridView
    //         });
    //     }

    //     for(let i = 0; i < layers.length; i++)
    //     {
    //         const item = layers[i];
    //         item.depth = i;
    //     }

    //     for(let i = 0; i < layers.length - 1; i++)
    //     {
    //         const item = layers[i];
    //         const next = layers[i+1];
    //         if (!item.selectedDn) {
    //             item.highlightedDn = next.parent;
    //         }
    //     }

    //     for(const layer of layers)
    //     {
    //         layer.dataKey = this._getLayerDataKey(layer);
    //     }

    //     return layers;
    // }

    private _getLayerDataKey(layer: LayerInfo) : string | null
    {
        if (layer.kind == LayerInfoKind.Children) {
            return `${layer.kind}-${layer.parent!}`;
        }
        if (layer.kind == LayerInfoKind.Node) {
            return `${layer.kind}-${layer.highlightedDn!}`;
        }
        if (layer.kind == LayerInfoKind.NodeList) {
            return `${layer.kind}-${layer.depth}`;
        }
        return null;
    }
}


export interface LayerData
{
    info: LayerInfo;
    nodes: NodeConfig[];
}

export class LayerInternalData
{
    key: string;
    layer: LayerInfo;
    nodes: NodeConfig[];
    nodeDict: Record<string, NodeConfig | null>;
    subscriptions: Record<string, IService>;

    handler: CallbackHandler<LayerNodesChangeHandlerCallback>;
}
