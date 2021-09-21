
export interface LayerInfo
{
    kind?: string;
    parent: string;
    selectedDn?: string;
    highlightedDn?: string;
}


export interface DiagramLayerProps
{
    layer: LayerInfo;
}