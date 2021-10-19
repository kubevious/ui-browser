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
export type LayerNodesChangeHandlerCallback = ((nodes: NodeConfig[], isLoading: boolean, totalNodeCount: number) => any);

export class DiagramBrowserLoader
{
    private _rootDn : string;
    private _diagramSource: IDiagramSource;
    private _selectedDnSubscriber : Subscriber;

    private _viewOptions: DiagramBrowserViewOptions;

    private _currentExpandedDn: string;
    private _currentSelectedDn: string | null = null;

    private _layerData : Record<string, LayerInternalData> = {};
    private _layerSearchConfig : Record<string, LayerSearchConfig> = {};

    private _latestLayers : LayerInfo[] = [];

    private _layersChangeHandler : CallbackHandler<LayersChangeHandlerCallback> = new CallbackHandler<LayersChangeHandlerCallback>();

    private _parentLayer: LayerInfo;
    private _parentLayerInternalData: LayerInternalData;

    private _childrenLayer?: LayerInfo;
    private _childrenLayerInternalData?: LayerInternalData;

    private _topParentDns : string[] = [];
    private _childrenParentDn : string;

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

        this._childrenParentDn = rootDn;

        this._parentLayer = {
            depth: 0,
            dataKey: '',
            kind: LayerInfoKind.NodeList,
            dnList: [],
            selectedDn: undefined
        }
        this._parentLayer.dataKey = this._getLayerDataKey(this._parentLayer);
        this._parentLayerInternalData = {
            key: this._parentLayer.dataKey,
            layer: this._parentLayer,
            nodeDict: {},
            isLoading: true,
            nodes: [],
            subscriptions: {},
            handler: new CallbackHandler<LayerNodesChangeHandlerCallback>()
        }
        this._layerData[this._parentLayerInternalData.key] = this._parentLayerInternalData;

        this._selectedDnSubscriber = app.sharedState.subscribe('selected_dn', this._handleSelectedDnChange.bind(this))
    }

    get viewOptions() {
        return this._viewOptions;
    }

    close()
    {
        this._layersChangeHandler.close();
        this._selectedDnSubscriber.close();

        for(const layerInternalData of _.values(this._layerData)) {
            this._closeLayerSubscriptions(layerInternalData);
        }
        this._layerData = {};
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
                cb(layerInternalData.nodes, layerInternalData.isLoading, layerInternalData.nodes.length);
                return layerInternalData.handler.on(cb);
            }
        }

        cb([], true, 0);

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

        console.log("[setLayerSearchConfig] %s => config: ", layer.parent, searchConfig);

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

        this._setupTopLayerSubscriptions();
    }

    private _setupTopLayerSubscriptions()
    {
        const layerInternalData = this._parentLayerInternalData;
        const layer = layerInternalData.layer;

        const topDns = this._extractTopDns();
        layer.dnList = topDns;

        for(const dn of topDns)
        {
            if (!layerInternalData.subscriptions[dn])
            {
                layerInternalData.subscriptions[dn] = this._diagramSource.subscribeNode(dn, (config) => {
                    if (config) {
                        layerInternalData.nodeDict[dn] = config;
                    } else {
                        layerInternalData.nodeDict[dn] = null;
                    }
                    this._updateTopLayerNodes(layerInternalData);
                });
            }
        }

        const usedTopDnsDict = _.makeBoolDict(topDns);
        for(const dn of _.keys(layerInternalData.nodeDict)) {
            if(!usedTopDnsDict[dn]) {
                delete layerInternalData.nodeDict[dn]
            }
        }

        this._closeLayerSubscriptions(layerInternalData, usedTopDnsDict)

        this._updateTopLayerNodes(layerInternalData);
    }

    private _updateTopLayerNodes(layerInternalData : LayerInternalData)
    {
        const layer = layerInternalData.layer;
        this._topParentDns = this._determineTopVisibleDns();

        layerInternalData.nodes = this._topParentDns.map(x => layerInternalData.nodeDict[x]).filter(x => x).map(x => x!);
       
        this._childrenParentDn = _.last(layerInternalData.nodes)?.dn ?? this._rootDn;

        this._notifyLayerNodes(layer);

        this._setupChildrenLayerSubscription();

        this._calculateGuiLayers();
    }

    private _determineTopVisibleDns()
    {
        let parentDns = this._parentLayer.dnList ?? [];

        const expandedNode = this._parentLayerInternalData.nodeDict[this._currentExpandedDn];
        if (expandedNode)
        {
            if (expandedNode.childrenCount == 0)
            {
                parentDns = parentDns.filter(x => x !== this._currentExpandedDn);
            }
        }   

        if (parentDns.length == 0)
        {
            parentDns = [this._rootDn];
        }

        return parentDns;
    }

    private _calculateGuiLayers()
    {
        const newLayers : LayerInfo[] = [];

        {
            const guiLayer : LayerInfo = {
                depth: 0,
                dataKey: '',
                kind: LayerInfoKind.NodeList,
                dnList: this._topParentDns,
                selectedDn: (this._currentSelectedDn && this._topParentDns.includes(this._currentSelectedDn)) ? this._currentSelectedDn : undefined,
            }
            newLayers.push(guiLayer);
        }
        
        {
            const guiLayer : LayerInfo = {
                depth: 1,
                dataKey: '',
                kind: LayerInfoKind.Children,
                parent: this._childrenParentDn,
                selectedDn: this._currentSelectedDn || undefined
            }
            newLayers.push(guiLayer);
        }

        for(const layer of newLayers)
        {
            layer.dataKey = this._getLayerDataKey(layer);
        }

        this._cleanupLayerSearchConfigs(newLayers);
        
        this._latestLayers = newLayers;
        this._layersChangeHandler.execute(x => x(this._latestLayers));
    }

    private _setupChildrenLayerSubscription()
    {
        if (this._childrenLayerInternalData) {
            if (this._childrenLayerInternalData.layer.parent === this._childrenParentDn) {
                return;
            }

            this._closeLayerSubscriptions(this._childrenLayerInternalData);

            delete this._layerData[this._childrenLayerInternalData.key];
            delete this._childrenLayerInternalData;
            delete this._childrenLayer;
        }

        const myChildrenParentDn = this._childrenParentDn;

        if (!myChildrenParentDn) {
            return;
        }

        this._childrenLayer = {
            depth: 1,
            dataKey: '',
            kind: LayerInfoKind.Children,
            parent: myChildrenParentDn,
            selectedDn: undefined
        }
        this._childrenLayer.dataKey = this._getLayerDataKey(this._childrenLayer);
        this._childrenLayerInternalData = {
            key: this._childrenLayer.dataKey,
            layer: this._childrenLayer,
            nodeDict: {},
            isLoading: true,
            nodes: [],
            subscriptions: {},
            handler: new CallbackHandler<LayerNodesChangeHandlerCallback>()
        }
        this._layerData[this._childrenLayerInternalData.key] = this._childrenLayerInternalData;

        this._childrenLayerInternalData.subscriptions[myChildrenParentDn] = 
            this._diagramSource.subscribeChildrenNodes(myChildrenParentDn, (nodes, isLoading) => {

                const myLayerData = this._childrenLayerInternalData!;
                if (!myLayerData) {
                    return;
                }
                if (myLayerData.layer.parent !== myChildrenParentDn) {
                    return;
                }

                myLayerData.nodeDict = _.makeDict(nodes, x => x.dn, x => x);
                myLayerData.isLoading = isLoading;
                this._updateChildrenLayerNodes(myLayerData);
            });
    }

    private _updateChildrenLayerNodes(layerInternalData : LayerInternalData)
    {
        const layer = layerInternalData.layer;
        layerInternalData.nodes = _.values(layerInternalData.nodeDict).filter(x => x).map(x => x!);

        this._notifyLayerNodes(layer);
    }

    private _notifyLayerNodes(layer : LayerInfo)
    {
        const layerInternalData = this._layerData[layer.dataKey];
        if (!layerInternalData) {
            return;
        }

        const nodes = this._applyLayerFilters(layerInternalData);
        layerInternalData.handler.execute(x => x(nodes, layerInternalData.isLoading, layerInternalData.nodes.length));
    }

    private _applyLayerFilters(layerInternalData : LayerInternalData)
    {
        let nodes = layerInternalData.nodes;

        if (layerInternalData.layer.depth !== 0)
        {
            const layerSearchConfig = this.getLayerSearchConfig(layerInternalData.layer);
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

            switch(layerSearchConfig.ordering)
            {
                case 'alph-asc': {
                    nodes = _.orderBy(nodes, [x => x.kind, x => x.name], ['asc', 'asc']);
                    break;
                }

                case 'alph-desc': {
                    nodes = _.orderBy(nodes, [x => x.kind, x => x.name], ['desc', 'desc']);
                    break;
                }

                case 'error-desc': {
                    nodes = _.orderBy(nodes, [x => x.alertCount?.error ?? 0, x => x.kind, x => x.name], ['desc', 'asc', 'asc']);
                    break;
                }

                case 'error-asc': {
                    nodes = _.orderBy(nodes, [x => x.alertCount?.error ?? 0, x => x.kind, x => x.name], ['asc', 'asc', 'asc']);
                    break;
                }

                case 'warn-desc': {
                    nodes = _.orderBy(nodes, [x => x.alertCount?.warn ?? 0, x => x.kind, x => x.name], ['desc', 'asc', 'asc']);
                    break;
                }

                case 'warn-asc': {
                    nodes = _.orderBy(nodes, [x => x.alertCount?.warn ?? 0, x => x.kind, x => x.name], ['asc', 'asc', 'asc']);
                    break;
                }
            }
        }
        return nodes;
    }

    private _extractTopDns()
    {
        const dnParts = parseDn(this._currentExpandedDn);
        let currentDn : string | null = null;
        let isMyHierarchy = false;
        const parentDns : string[] = [];
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
        return parentDns;
    }

    private _getLayerDataKey(layer: LayerInfo) : string
    {
        if (layer.kind === LayerInfoKind.Children) {
            return `${layer.kind}-${layer.parent!}`;
        }
        if (layer.kind === LayerInfoKind.Node) {
            return `${layer.kind}-${layer.highlightedDn!}`;
        }
        if (layer.kind === LayerInfoKind.NodeList) {
            return `${layer.kind}-${layer.depth}`;
        }
        throw new Error("Could not generate Layer Key");
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

    private _closeLayerSubscriptions(layerInternalData : LayerInternalData, usedSubscriptions? : Record<string, boolean>)
    {
        for(const subscriptionKey of _.keys(layerInternalData.subscriptions)) {
            if (!usedSubscriptions || !usedSubscriptions[subscriptionKey]) {
                layerInternalData.subscriptions[subscriptionKey].close();
                delete layerInternalData.subscriptions[subscriptionKey];
            }
        }
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
