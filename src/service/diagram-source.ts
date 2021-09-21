import { IWebSocketService, WebSocketScope } from "@kubevious/ui-middleware"
// import { WebSocketKind } from '@kubevious/saas-models'
import { LayerInfo, LayerInfoKind } from "./types"

export class DiagramSource
{
    private _socket: IWebSocketService
    private _childrenScope: WebSocketScope;

    constructor()
    {
        console.log('[DiagramSource] constructor')

        if (this._socket) {
            this._childrenScope = this._socket.scope((value, target) => {
                // const expandedObjects = this._sharedState.get(
                //     "diagram_expanded_dns"
                // )
                // if (expandedObjects[target.dn]) {
                //     if (value) {
                //         const rnList = value as string[];
                //         this._nodeChildren[target.dn] = rnList.map(x => target.dn + '/' + x);
                //     } else {
                //         delete this._nodeChildren[target.dn]
                //     }
                //     this._updateMonitoredObjects()
                // }
                // this._handleTreeChange()
            })
        }

    }

    close()
    {
        console.log('[DiagramSource] close')
    }

    applyLayers(layers: LayerInfo[])
    {
        console.log('[DiagramSource] applyLayers :: ', layers)

        const childrenDns = layers.filter(x => x.kind === LayerInfoKind.Children).map(x => x.parent);
        console.log('[DiagramSource] childrenDns :: ', childrenDns)

        if (this._childrenScope) {
            this._childrenScope.replace(childrenDns.map(x => ({
                kind: 'children',
                dn: x,
            })));
        }

    }

}