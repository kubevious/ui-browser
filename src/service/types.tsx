
export interface LayerInfo
{
    kind?: LayerInfoKind;
    parent: string;
    selectedDn?: string;
    highlightedDn?: string;
}

export enum LayerInfoKind {
    Children,
    Node
}