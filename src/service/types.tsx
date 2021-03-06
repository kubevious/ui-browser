
export interface LayerInfo
{
    kind?: LayerInfoKind;
    dataKey: string;
    parent?: string;
    selectedDn?: string;
    highlightedDn?: string;

    dnList?: string[];

    // isGridView?: boolean;

    depth: number;
}

export enum LayerInfoKind {
    Children = 'children',
    NodeList = 'node-list',
    Node = 'node',
}