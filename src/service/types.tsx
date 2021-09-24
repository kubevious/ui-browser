
export interface LayerInfo
{
    kind?: LayerInfoKind;
    dataKey: string | null;
    parent: string;
    selectedDn?: string;
    highlightedDn?: string;

    isGridView?: boolean;

    depth: number;
}

export enum LayerInfoKind {
    Children = 'children',
    Node = 'node'
}