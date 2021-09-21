
import _ from 'the-lodash';
// import { WebSocketKind } from '@kubevious/saas-models'
import { LayerInfo, LayerInfoKind } from "./types"

import { IDiagramService, IDiagramServiceSubscriber } from "../interfaces/diagram-service";
import { NodeConfig } from '../types';

export type DiagramSourceChildrenNodesChangeCallback = (nodes: NodeConfig[]) => void;

export class DiagramSource
{
    private _service : IDiagramService;
    // private _nodeSubscriber : IDiagramServiceSubscriber;
    // private _childrenSubscriber : IDiagramServiceSubscriber;

    // private _childrenMap : Record<string, string[]> = {};

    constructor(service : IDiagramService)
    {
        console.log('[DiagramSource] constructor')
        this._service = service;

        // this._nodeSubscriber = this._service.subscribeToChildren(this._onChildrenChange.bind(this));
        // this._childrenSubscriber = this._service.subscribeToChildren(this._onChildrenChange.bind(this));
    }

    close()
    {
        console.log('[DiagramSource] close')
        // this._childrenSubscriber.close();
    }

    subscribeChildrenNodes(dn: string, cb: DiagramSourceChildrenNodesChangeCallback)
    {
        // console.log('[DiagramSource] subscribeChildrenNodes. dn: ', dn);
        const nodeMap : Record<string, NodeConfig> = {};

        const nodesSubscriber = this._service.subscribeToNodes((childDn, config) => {
            if (config) {
                nodeMap[childDn] = {
                    ...config,
                    dn: childDn
                }
            } else {
                delete nodeMap[childDn];
            }

            cb(_.values(nodeMap));
        })

        const childrenSubscriber = this._service.subscribeToChildren((parentDn, childrenDns) => {
            nodesSubscriber.update(childrenDns);
            if (childrenDns.length == 0) {
                cb([]);
            }
        })
        childrenSubscriber.update([dn]);

        return {
            close: () => {
                childrenSubscriber.close();
            }   
        }
    }

    // applyLayers(layers: LayerInfo[])
    // {
    //     console.log('[DiagramSource] applyLayers :: ', layers)

    //     const childrenDns = layers.filter(x => x.kind === LayerInfoKind.Children).map(x => x.parent);
    //     console.log('[DiagramSource] applyLayers :: parents: ', childrenDns)

    //     this._childrenSubscriber.update(childrenDns);

    //     this._calculateNodeSubscriptions();
    // }

    // private _onChildrenChange(parent: string, childrenDns: string[])
    // {
    //     console.log('[DiagramSource] _onChildrenChange :: parent, children:', parent, childrenDns);

    //     this._childrenMap[parent] = childrenDns;
    // }

    // private _calculateNodeSubscriptions()
    // {
    //     const dnMap : Record<string, boolean> = {};

    //     for(const childrenMap of _.values(this._childrenMap))
    //     {
    //         for(const childDn of childrenMap)
    //         {
    //             dnMap[childDn] = true;
    //         }
    //     }
    // }

}