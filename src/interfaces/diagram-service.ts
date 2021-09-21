import { BundledNodeConfig } from '@kubevious/helpers/dist/registry-bundle-state';

export type DiagramNodeChangeCallback = (dn: string, config: BundledNodeConfig | null) => void;
export type DiagramChildrenChangeCallback = (parentDn: string, childrenDns: string[]) => void;

export interface IDiagramService
{
    subscribeToNodes(cb: DiagramNodeChangeCallback) : IDiagramServiceSubscriber
    subscribeToChildren(cb: DiagramChildrenChangeCallback) : IDiagramServiceSubscriber

}

export interface IDiagramServiceSubscriber
{
    update(dnList : string[]) : void;
    close() : void;
}
