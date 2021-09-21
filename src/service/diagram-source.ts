import { IWebSocketService, WebSocketScope } from "@kubevious/ui-middleware"
// import { WebSocketKind } from '@kubevious/saas-models'
import { LayerInfo, LayerInfoKind } from "./types"

import { IDiagramService, IDiagramServiceChildrenSubscriber } from "../interfaces/diagram-service";

export class DiagramSource
{
    private _service : IDiagramService;
    private _childrenSubscriber : IDiagramServiceChildrenSubscriber;

    private _childrenMap : Record<string, string[]> = {};

    constructor(service : IDiagramService)
    {
        console.log('[DiagramSource] constructor')
        this._service = service;

        this._childrenSubscriber = this._service.subscribeToChildren(this._onChildrenChange.bind(this));
    }

    close()
    {
        console.log('[DiagramSource] close')
        this._childrenSubscriber.close();
    }

    applyLayers(layers: LayerInfo[])
    {
        console.log('[DiagramSource] applyLayers :: ', layers)

        const childrenDns = layers.filter(x => x.kind === LayerInfoKind.Children).map(x => x.parent);
        console.log('[DiagramSource] childrenDns :: ', childrenDns)

        this._childrenSubscriber.update(childrenDns);
    }

    private _onChildrenChange(parent: string, childrenDns: string[])
    {
        this._childrenMap[parent] = childrenDns;
    }

}