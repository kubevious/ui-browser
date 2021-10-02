import _ from 'the-lodash';

import { DN_LIST } from './mock-data';
import { parseDn, makeDn }from '@kubevious/entity-meta';
import { IDiagramBrowserService } from '@kubevious/ui-middleware/dist';
import { DiagramChildrenChangeCallback, DiagramNodeChangeCallback, IDiagramBrowserServiceSubscriber, NodeConfig } from '@kubevious/ui-middleware/dist/services/diagram-browser';
import { parentDn } from '@kubevious/entity-meta/dist/dn-utils';

export class MockDiagramService implements IDiagramBrowserService
{
    private _nodes : { [dn : string] : NodeConfig }  = {};
    private _children : { [dn : string] : { [childDn: string] : boolean } }  = {};

    constructor()
    {
        for(const dn of DN_LIST)
        {
            this._addDn(dn);
        }

        console.log("[MockDiagramService], children:", this._children);
    }

    subscribeToChildren(cb: DiagramChildrenChangeCallback) : IDiagramBrowserServiceSubscriber
    {
        const subscriptions : Record<string, boolean> = {};

        return {
            update: (dnList : string[]) => {

                for(const dn of dnList)
                {
                    if (!subscriptions[dn]) {
                        subscriptions[dn] = true;
                        const childrenMap = this._children[dn];

                        setTimeout(() => {
                            cb(dn, _.keys(childrenMap ?? {}));
                        }, 100);
                    }
                }

            },
            close: () => {
                return
            }   
        }

    }

    subscribeToNodes(cb: DiagramNodeChangeCallback) : IDiagramBrowserServiceSubscriber
    {
        const subscriptions : Record<string, boolean> = {};

        return {
            update: (dnList : string[]) => {

                for(const dn of dnList)
                {
                    if (!subscriptions[dn]) {
                        subscriptions[dn] = true;
                        const config = this._nodes[dn];

                        setTimeout(() => {
                            cb(dn, config ?? null);
                        }, 100);
                    }
                }

            },
            close: () => {
                return;
            }   
        }

    }

    close()
    {
        return;
    }

    private _addDn(dn: string)
    {
        const parts = parseDn(dn);

        let current = parts[0].rn;
        this._registerDn(current);

        for(let i = 1; i < parts.length; i++)
        {
            current = makeDn(current, parts[i].rn);
            this._registerDn(current);
        }

        for(const dn of _.keys(this._children))
        {
            const parent = this._nodes[dn];
            if (parent) {
                parent.childrenCount = _.keys(this._children[dn]).length;
            }
        }

    }

    private _registerDn(dn: string)
    {
        const parts = parseDn(dn);
        const lastPart = _.last(parts)!;

        this._nodes[dn] = {
            dn: dn,
            kind: lastPart.kind,
            rn: lastPart.rn,
            name: lastPart.name!,
            childrenCount: 0,
            markers: [],
            selfAlertCount: {
                error: (random(10) >= 5) ? random(20) : 0,
                warn: (random(10) >= 7) ? random(30) : 0
            },
            alertCount: {
                error: (random(10) >= 5) ? random(20) : 0,
                warn: (random(10) >= 7) ? random(30) : 0
            }
        };

        const parent = parentDn(dn);

        if (!this._children[parent]) {
            this._children[parent] = {};
        }

        this._children[parent][dn] = true;
    }


}

function random(value: number)
{
    return Math.floor(Math.random() * value);
}

// export interface IDiagramServiceChildrenSubscriber
// {
//     update(dnList : string[]) : void;
//     close() : void;
// }

