
import _ from 'the-lodash';
// import { WebSocketKind } from '@kubevious/saas-models'

import { IService } from '@kubevious/ui-framework';
import { NodeConfig, IDiagramBrowserService } from '@kubevious/ui-middleware/dist/services/diagram-browser';

import { DiagramSourceChildrenNodesChangeCallback, DiagramSourceNodeChangeCallback, IDiagramSource } from '../interfaces/diagram-source';


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

    subscribeNode(dn: string, cb: DiagramSourceNodeChangeCallback) : IService
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

        let targetChildrenDnMap : Record<string, boolean> = {};
        const waitingNodeConfig : Record<string, boolean> = {};
        const nodeConfigMap : Record<string, NodeConfig | null> = {};

        const notifyNodes = () => {
            const nodeList = _.values(nodeConfigMap).filter(x => x).map(x => x!);
            cb(nodeList, _.keys(waitingNodeConfig).length > 0);
        }

        let isTriggered = false;
        const triggerResultUpdated = () => {
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
            if (targetChildrenDnMap[childDn])
            {
                delete waitingNodeConfig[childDn];
                if (config) {
                    nodeConfigMap[childDn] = config;
                } else {
                    nodeConfigMap[childDn] = null;
                }
                triggerResultUpdated();
            }
        })

        const childrenSubscriber = this._service.subscribeToChildren((__, childrenDns) => {
            console.log("[DiagramSource] subscribeChildrenNodes :: ", dn, " :: ChildrenDNs: ", childrenDns);

            for(const childDn of childrenDns) {
                if (!(childDn in nodeConfigMap)) {
                    waitingNodeConfig[childDn] = true;
                    nodeConfigMap[childDn] = null;
                }
            }
            
            targetChildrenDnMap = _.makeBoolDict(childrenDns);
            for(const childDn of _.keys(nodeConfigMap)) {
                if (!targetChildrenDnMap[childDn]) {
                    delete waitingNodeConfig[childDn];
                    delete nodeConfigMap[childDn];
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