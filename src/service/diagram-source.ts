
import _ from 'the-lodash';
// import { WebSocketKind } from '@kubevious/saas-models'

import { IService } from '@kubevious/ui-framework';
import { IDiagramBrowserService } from '@kubevious/ui-middleware/dist/services/diagram-browser';
import { NodeConfig } from '@kubevious/ui-middleware/dist/services/diagram-browser';

import { DiagramSourceChildrenNodesChangeCallback, DiagramSourceNodesChangeCallback, IDiagramSource } from '../interfaces/diagram-source';

export class DiagramSource implements IDiagramSource
{
    private _service : IDiagramBrowserService;

    constructor(service : IDiagramBrowserService)
    {
        console.log('[DiagramSource] constructor')
        this._service = service;
    }

    close()
    {
        console.log('[DiagramSource] close')
    }

    subscribeNode(dn: string, cb: DiagramSourceNodesChangeCallback) : IService
    {
        const nodesSubscriber = this._service.subscribeToNodes((_, config) => {
            if (config) {
                cb(config);
            } else {
                cb(null);
            }
        })
        nodesSubscriber.update([dn]);

        return {
            close: () => {
                nodesSubscriber.close();
            }   
        }
    }

    subscribeChildrenNodes(dn: string, cb: DiagramSourceChildrenNodesChangeCallback) : IService
    {
        const nodeMap : Record<string, NodeConfig> = {};

        const nodesSubscriber = this._service.subscribeToNodes((childDn, config) => {
            if (config) {
                nodeMap[childDn] = config;
            } else {
                delete nodeMap[childDn];
            }

            cb(_.values(nodeMap));
        })

        const childrenSubscriber = this._service.subscribeToChildren((_, childrenDns) => {
            nodesSubscriber.update(childrenDns);
            if (childrenDns.length == 0) {
                cb([]);
            }
        })
        childrenSubscriber.update([dn]);

        return {
            close: () => {
                childrenSubscriber.close();
                nodesSubscriber.close();
            }   
        }
    }

}