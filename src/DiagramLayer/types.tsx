import { RefObject } from "react";
import { LayerInfo } from "../service/types";
import { IDiagramSource } from "../interfaces/diagram-source";

export interface DiagramLayerProps
{
    diagramSource: IDiagramSource;
    layer: LayerInfo;

    scrollBoundaryRef? : RefObject<any>
}