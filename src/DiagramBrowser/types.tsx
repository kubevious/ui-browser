import { DiagramSource } from "../service/diagram-source";

export interface DiagramBrowserProps
{
    diagramSource: DiagramSource;
    rootDn: string;

    expandedDn: string;
}