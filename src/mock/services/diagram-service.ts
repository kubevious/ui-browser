import _ from 'the-lodash';
import { DiagramChildrenChangeCallback, DiagramNodeChangeCallback, IDiagramService, IDiagramServiceSubscriber } from "../../interfaces/diagram-service";

import { DN_LIST } from './mock-data';
import * as DnUtils from '@kubevious/helpers/dist/dn-utils';
import { BundledNodeConfig } from "@kubevious/helpers/dist/registry-bundle-state";

export class MockDiagramService implements IDiagramService
{
    private _nodes : { [dn : string] : BundledNodeConfig }  = {};
    private _children : { [dn : string] : { [childDn: string] : boolean } }  = {};

    constructor()
    {
        for(const dn of DN_LIST)
        {
            this._addDn(dn);
        }

        console.log("[MockDiagramService], children:", this._children);
    }

    subscribeToChildren(cb: DiagramChildrenChangeCallback) : IDiagramServiceSubscriber
    {
        const subscriptions : Record<string, boolean> = {};

        return {
            update: (dnList : string[]) => {

                for(const dn of dnList)
                {
                    if (!subscriptions[dn]) {
                        subscriptions[dn] = true;
                        const childrenMap = this._children[dn];
                        cb(dn, _.keys(childrenMap ?? {}));
                    }
                }

            },
            close: () => {
                return
            }   
        }

    }

    subscribeToNodes(cb: DiagramNodeChangeCallback) : IDiagramServiceSubscriber
    {
        const subscriptions : Record<string, boolean> = {};

        return {
            update: (dnList : string[]) => {

                for(const dn of dnList)
                {
                    if (!subscriptions[dn]) {
                        subscriptions[dn] = true;
                        const config = this._nodes[dn];
                        cb(dn, config ?? null);
                    }
                }

            },
            close: () => {
                return
            }   
        }

    }

    private _addDn(dn: string)
    {
        const parts = DnUtils.parseDn(dn);

        let current = parts[0].rn;
        this._registerDn(current);

        for(let i = 1; i < parts.length; i++)
        {
            current = DnUtils.makeDn(current, parts[i].rn);
            this._registerDn(current);
        }
    }

    private _registerDn(dn: string)
    {
        const parts = DnUtils.parseDn(dn);
        const lastPart = _.last(parts)!;

        this._nodes[dn] = {
            kind: lastPart.kind,
            rn: lastPart.rn,
            name: lastPart.name!,
            childrenCount: 10,
            markers: [],
            selfAlertCount: {
                error: 4,
                warn: 5
            },
            alertCount: {
                error: 4,
                warn: 5
            }
        };

        const parent = DnUtils.parentDn(dn);

        if (!this._children[parent]) {
            this._children[parent] = {};
        }

        this._children[parent][dn] = true;
    }


}

// export interface IDiagramServiceChildrenSubscriber
// {
//     update(dnList : string[]) : void;
//     close() : void;
// }

