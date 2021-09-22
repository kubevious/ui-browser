import { IDiagramSource } from "../interfaces/diagram-source";

export interface DiagramBrowserProps
{
    diagramSource: IDiagramSource;
    rootDn: string;

    initialExpandedDn?: string;
}