
export interface LayerInfo
{
    kind?: LayerInfoKind;
    parent: string;
    selectedDn?: string;
    highlightedDn?: string;

    isGridView?: boolean;
}

export enum LayerInfoKind {
    Children = 'children',
    Node = 'node'
}