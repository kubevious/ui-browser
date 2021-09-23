import { IDiagramSource } from "../interfaces/diagram-source";


export interface DiagramBrowserViewOptions
{
    useVerticalNodeView: boolean;
    useVerticalNodeCount: number;
    useGridView: boolean;
}

export interface DiagramBrowserProps
{
    diagramSource: IDiagramSource;
    rootDn: string;

    initialExpandedDn?: string;

    viewOptions?: Partial<DiagramBrowserViewOptions>;
}