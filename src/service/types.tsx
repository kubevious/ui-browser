
export interface LayerInfo
{
    kind?: LayerInfoKind;
    dataKey: string | null;
    parent: string;
    selectedDn?: string;
    highlightedDn?: string;

    isGridView?: boolean;
}

export enum LayerInfoKind {
    Children = 'children',
    Node = 'node'
}