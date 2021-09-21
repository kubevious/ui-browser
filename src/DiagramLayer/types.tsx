import { RefObject } from "react";
import { DiagramSource } from "../service/diagram-source";
import { LayerInfo } from "../service/types";

export interface DiagramLayerProps
{
    diagramSource: DiagramSource;
    layer: LayerInfo;

    scrollBoundaryRef? : RefObject<any>
}