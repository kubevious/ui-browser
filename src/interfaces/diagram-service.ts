export type DiagramChildrenChangeCallback = (parentDn: string, childrenDns: string[]) => void;

export interface IDiagramService
{

    subscribeToChildren(cb: DiagramChildrenChangeCallback) : IDiagramServiceChildrenSubscriber

}

export interface IDiagramServiceChildrenSubscriber
{
    update(dnList : string[]) : void;
    close() : void;
}