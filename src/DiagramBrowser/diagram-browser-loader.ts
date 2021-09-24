import _ from 'the-lodash';
import { IDiagramSource } from "../interfaces/diagram-source";
import { app, IService, Subscriber } from '@kubevious/ui-framework';
import { DiagramBrowserViewOptions } from './types';
import { LayerInfo, LayerInfoKind } from "../service/types";
import { NodeConfig } from "@kubevious/ui-middleware/dist/services/diagram-browser";
import { CallbackHandler } from './callback-handler';
import { IClosable } from '@kubevious/ui-middleware/dist/common-types';
import * as DnUtils from '@kubevious/helpers/dist/dn-utils';

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
        const layers = this._calculateNewLayers();
        console.info("[DiagramBrowserLoader] _applyLayers :: Desired Layers; ", layers);

        const usedDataSourceKeys : Record<string, boolean> = {};
        for(const layer of layers)
        {
            this._applyLayer(layer, usedDataSourceKeys);
        }

        for(const internalLayer of _.values(this._layerData))
        {
            if (!usedDataSourceKeys[internalLayer.key])
            {
                if (internalLayer.subscription) {
                    internalLayer.subscription.close();
                    delete internalLayer.subscription;
                    delete this._layerData[internalLayer.key];
                }
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
            return;
        }

        layerInternalData = {
            key: layer.dataKey,
            layer: layer,
            nodes: [],
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
            const myDn = layer.parent;
            layerInternalData.subscription = this._diagramSource.subscribeChildrenNodes(myDn, (nodes) => {
                this._updateLayerNodes(layerInternalData, nodes);
            });
            return;
        }

        if (layer.kind == LayerInfoKind.Node)
        {
            const myDn = layer.highlightedDn!;
            layerInternalData.subscription = this._diagramSource.subscribeNode(myDn, (config) => {
                if (config) {
                    this._updateLayerNodes(layerInternalData, [config]);
                } else {
                    this._updateLayerNodes(layerInternalData, []);
                }
            });
            return;
        }
    }

    private _updateLayerNodes(layerInternalData : LayerInternalData, nodes: NodeConfig[])
    {
        layerInternalData.nodes = nodes;
        layerInternalData.handler.execute(x => x(layerInternalData.nodes));
    }

    private _calculateNewLayers() : LayerInfo[]
    {
        const dnParts = DnUtils.parseDn(this._currentExpandedDn);
        let parentDn : string | null = null;
        let currentDn : string | null = null;

        const layers : LayerInfo[] = [ ];

        let isMyHierarchy = false;
        for(const part of dnParts)
        {
            parentDn = currentDn;

            if (!currentDn) {
                currentDn = part.rn;
            } else {
                currentDn = DnUtils.makeDn(currentDn, part.rn);
            }

            if (isMyHierarchy) {
                layers.push({
                    depth: 0,
                    dataKey: null,
                    kind: LayerInfoKind.Children,
                    parent: parentDn!,
                    selectedDn: (this._currentSelectedDn && (this._currentSelectedDn === currentDn)) ? currentDn : undefined,
                });
            }

            if (currentDn == this._rootDn) {
                isMyHierarchy = true;
            }
        }

        if (this._viewOptions.useVerticalNodeView) {
            for(const layer of _.dropRight(layers, this._viewOptions.useVerticalNodeCount))
            {
                layer.kind = LayerInfoKind.Node;
            }
        }

        if (currentDn) {
            layers.push({
                depth: 0,
                dataKey: null,
                kind: LayerInfoKind.Children,
                parent: currentDn,
                // dn: currentDn
                isGridView: this._viewOptions.useGridView
            });
        }

        for(let i = 0; i < layers.length; i++)
        {
            const item = layers[i];
            item.depth = i;
        }

        for(let i = 0; i < layers.length - 1; i++)
        {
            const item = layers[i];
            const next = layers[i+1];
            if (!item.selectedDn) {
                item.highlightedDn = next.parent;
            }
        }

        for(const layer of layers)
        {
            layer.dataKey = this._getLayerDataKey(layer);
        }

        return layers;
    }

    private _getLayerDataKey(layer: LayerInfo) : string | null
    {
        if (layer.kind == LayerInfoKind.Children) {
            return `${layer.kind}-${layer.parent!}`;
        }
        if (layer.kind == LayerInfoKind.Node) {
            return `${layer.kind}-${layer.highlightedDn!}`;
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
    subscription?: IService;

    handler: CallbackHandler<LayerNodesChangeHandlerCallback>;
}
