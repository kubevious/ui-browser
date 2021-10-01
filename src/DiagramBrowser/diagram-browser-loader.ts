import _ from 'the-lodash';
import { IDiagramSource } from "../interfaces/diagram-source";
import { app, IService, Subscriber } from '@kubevious/ui-framework';
import { DiagramBrowserViewOptions } from './types';
import { LayerInfo, LayerInfoKind } from "../service/types";
import { NodeConfig } from "@kubevious/ui-middleware/dist/services/diagram-browser";
import { CallbackHandler } from './callback-handler';
import { IClosable } from '@kubevious/ui-middleware/dist/common-types';
import { parseDn, makeDn }from '@kubevious/entity-meta';
import { LayerSearchConfig } from '../types';

export type LayersChangeHandlerCallback = ((layers: LayerInfo[]) => any);
export type LayerNodesChangeHandlerCallback = ((nodes: NodeConfig[], isLoading: boolean) => any);

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
    private _layerSearchConfig : Record<string, LayerSearchConfig> = {};

    private _layersChangeHandler : CallbackHandler<LayersChangeHandlerCallback> = new CallbackHandler<LayersChangeHandlerCallback>();

    constructor(rootDn: string, diagramSource: IDiagramSource, viewOptions?: Partial<DiagramBrowserViewOptions>, initialExpandedDn? : string)
    {
        this._rootDn = rootDn;
        this._diagramSource = diagramSource;
        this._currentExpandedDn = initialExpandedDn || rootDn;

        this._viewOptions = {
            autoScrollHorizontally: viewOptions?.autoScrollHorizontally ?? true,
            autoScrollVertically: viewOptions?.autoScrollVertically ?? true,
        }

        console.log("[DiagramBrowserLoader] constructor: ", rootDn);

        this._selectedDnSubscriber = app.sharedState.subscribe('selected_dn', this._handleSelectedDnChange.bind(this))
    }

    get viewOptions() {
        return this._viewOptions;
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
                cb(layerInternalData.nodes, layerInternalData.isLoading);
                return layerInternalData.handler.on(cb);
            }
        }

        cb([], true);

        return {
            close: () => {
                return;
            }
        };
    }

    getLayerSearchConfig(layer: LayerInfo) : LayerSearchConfig
    {
        if (layer.kind !== LayerInfoKind.Children) {
            return {};
        }
        const searchConfig = this._layerSearchConfig[layer.parent!] ?? {};
        return searchConfig;
    }

    setLayerSearchConfig(layer: LayerInfo, searchConfig: LayerSearchConfig)
    {
        if (layer.kind !== LayerInfoKind.Children) {
            return;
        }
        this._layerSearchConfig[layer.parent!] = searchConfig;

        console.log("[setLayerSearchConfig] ", searchConfig)

        this._notifyLayerNodes(layer);
    }

    private _handleSelectedDnChange(selected_dn: string)
    {
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
        const layers = this._calculateNewLayersFlat();
        console.info("[DiagramBrowserLoader] _applyLayers :: Desired Layers: ", layers);

        const usedDataSourceKeys : Record<string, boolean> = {};
        for(const layer of layers)
        {
            this._applyLayer(layer, usedDataSourceKeys);
        }

        this._cleanupLayersData(usedDataSourceKeys);

        this._cleanupLayerSearchConfigs(layers);

        console.info("[DiagramBrowserLoader] _applyLayers :: FINAL LAYER DATA: ", this._layerData);

        this._latestLayers = layers;
        this._layersChangeHandler.execute(x => x(this._latestLayers));
    }

    private _applyLayer(layer : LayerInfo, usedDataSourceKeys : Record<string, boolean>)
    {
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
            isLoading: true,
            nodes: [],
            subscriptions: {},
            handler: new CallbackHandler<LayerNodesChangeHandlerCallback>()
        }
        this._layerData[layer.dataKey] = layerInternalData;

        if (!this._layerSearchConfig[layer.dataKey]) {
            this._layerSearchConfig[layer.dataKey] = { }
        }
        
        this._setupLayerSubscriptions(layerInternalData);
    }

    private _cleanupLayersData(usedDataSourceKeys : Record<string, boolean>)
    {
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
    }

    private _cleanupLayerSearchConfigs(layers : LayerInfo[])
    {
        const usedLayerDns : Record<string, boolean> = {};
        for(const layer of layers)
        {
            if (layer.dnList)
            {
                for(const dn of layer.dnList)
                {
                    usedLayerDns[dn] = true;
                }
            }
            if (layer.parent)
            {
                usedLayerDns[layer.parent] = true;
            }
        }

        for(const dn of _.keys(this._layerSearchConfig))
        {
            if (!usedLayerDns[dn]) {
                delete this._layerSearchConfig[dn];
            }
        }
    }

    private _setupLayerSubscriptions(layerInternalData : LayerInternalData)
    {
        const layer = layerInternalData.layer;
        if (layer.kind == LayerInfoKind.Children)
        {
            const myDn = layer.parent!;
            layerInternalData.subscriptions[myDn] = this._diagramSource.subscribeChildrenNodes(myDn, (nodes, isLoading) => {
                layerInternalData.nodeDict = _.makeDict(nodes, x => x.dn, x => x);
                layerInternalData.isLoading = isLoading;
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

        this._notifyLayerNodes(layerInternalData.layer);
    }

    private _notifyLayerNodes(layer : LayerInfo)
    {
        const layerInternalData = this._layerData[layer.dataKey];
        if (!layerInternalData) {
            return;
        }

        const layerSearchConfig = this.getLayerSearchConfig(layer);

        let nodes = layerInternalData.nodes;

        if (layerSearchConfig.searchCriteria) {
            const searchCriteria = _.toLower(layerSearchConfig.searchCriteria);
            nodes = nodes.filter(x => {
                if (x.name) {
                    const name = _.toLower(x.name);
                    return _.includes(name, searchCriteria);
                }
                return true;
            })
        }

        if (layerSearchConfig.errorFilter)
        {
            if (layerSearchConfig.errorFilter === 'present')
            {
                nodes = nodes.filter(x => {
                    const value = x.alertCount?.error ?? 0;
                    return value > 0;
                })
            }

            if (layerSearchConfig.errorFilter === 'not-present')
            {
                nodes = nodes.filter(x => {
                    const value = x.alertCount?.error ?? 0;
                    return value === 0;
                })
            }
        }

        if (layerSearchConfig.warningFilter)
        {
            if (layerSearchConfig.warningFilter === 'present')
            {
                nodes = nodes.filter(x => {
                    const value = x.alertCount?.warn ?? 0;
                    return value > 0;
                })
            }

            if (layerSearchConfig.warningFilter === 'not-present')
            {
                nodes = nodes.filter(x => {
                    const value = x.alertCount?.warn ?? 0;
                    return value === 0;
                })
            }
        }

        layerInternalData.handler.execute(x => x(nodes, layerInternalData.isLoading));
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
                dataKey: '',
                kind: LayerInfoKind.NodeList,
                dnList: parentDns,
                selectedDn: (this._currentSelectedDn && parentDns.includes(this._currentSelectedDn)) ? this._currentSelectedDn : undefined,
            });
        }

        if (this._currentExpandedDn) {
            layers.push({
                depth: 0,
                dataKey: '',
                kind: LayerInfoKind.Children,
                parent: this._currentExpandedDn,
                // dn: currentDn
                // isGridView: this._viewOptions.useGridView
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

    private _getLayerDataKey(layer: LayerInfo) : string
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
        throw new Error("Could not generate Layer Key");
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
    isLoading: boolean;
    nodes: NodeConfig[];
    nodeDict: Record<string, NodeConfig | null>;
    subscriptions: Record<string, IService>;

    handler: CallbackHandler<LayerNodesChangeHandlerCallback>;
}
