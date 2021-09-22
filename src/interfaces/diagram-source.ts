import { IService } from "@kubevious/ui-framework";
import { NodeConfig } from "@kubevious/ui-middleware/dist/services/diagram-browser";

export type DiagramSourceChildrenNodesChangeCallback = (nodes: NodeConfig[]) => void;
export type DiagramSourceNodesChangeCallback = (nodes: NodeConfig | null) => void;

export interface IDiagramSource extends IService
{
    subscribeNode(dn: string, cb: DiagramSourceNodesChangeCallback) : IService;
    subscribeChildrenNodes(dn: string, cb: DiagramSourceChildrenNodesChangeCallback) : IService;
}