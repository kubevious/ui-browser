import { IService } from "@kubevious/ui-framework";
import { NodeConfig } from "@kubevious/ui-middleware/dist/services/diagram-browser";

export type DiagramSourceChildrenNodesChangeCallback = (nodes: NodeConfig[], isLoading: boolean) => void;
export type DiagramSourceNodeChangeCallback = (node: NodeConfig | null) => void;

export interface IDiagramSource extends IService
{
    subscribeNode(dn: string, cb: DiagramSourceNodeChangeCallback) : IService;
    subscribeChildrenNodes(dn: string, cb: DiagramSourceChildrenNodesChangeCallback) : IService;
}