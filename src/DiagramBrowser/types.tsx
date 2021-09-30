import { IDiagramSource } from "../interfaces/diagram-source";

export interface DiagramBrowserViewOptions
{
    autoScrollHorizontally: boolean;
    autoScrollVertically: boolean;
}

export interface DiagramBrowserProps
{
    diagramSource: IDiagramSource;
    rootDn: string;

    initialExpandedDn?: string;

    viewOptions?: Partial<DiagramBrowserViewOptions>;
}