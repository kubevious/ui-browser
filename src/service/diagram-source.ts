
import _ from 'the-lodash';
// import { WebSocketKind } from '@kubevious/saas-models'

import { IService } from '@kubevious/ui-framework';
import { NodeConfig, IDiagramBrowserService } from '@kubevious/ui-middleware/dist/services/diagram-browser';

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
        console.log("[DiagramSource] subscribeChildrenNodes :: ", dn);

        const nodeMap : Record<string, NodeConfig | null> = {};

        const notifyNodes = () => {
            const nodeList = _.values(nodeMap).filter(x => x);
            cb(<NodeConfig[]>nodeList);
        }

        let isTriggered = false;
        const triggerResultUpdated = () => {
            // notifyNodes();
            // return;
            if (isTriggered) {
                return;
            }
            isTriggered = true;
            setTimeout(() => {
                isTriggered = false;
                notifyNodes();
            }, 200);
        }

        const nodesSubscriber = this._service.subscribeToNodes((childDn, config) => {
            if (childDn in nodeMap)
            {
                if (config) {
                    nodeMap[childDn] = config;
                } else {
                    delete nodeMap[childDn];
                }
                triggerResultUpdated();
            }
        })

        const childrenSubscriber = this._service.subscribeToChildren((__, childrenDns) => {
            console.log("[DiagramSource] subscribeChildrenNodes :: ", dn, " :: ChildrenDNs: ", childrenDns);

            for(const childDn of childrenDns) {
                if (!nodeMap[childDn]) {
                    nodeMap[childDn] = null;
                }
            }
            
            const targetChildrenMap = _.makeBoolDict(childrenDns);
            for(const childDn of _.keys(nodeMap)) {
                if (!targetChildrenMap[childDn]) {
                    delete nodeMap[childDn];
                }
            }

            nodesSubscriber.update(childrenDns);
            notifyNodes();
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