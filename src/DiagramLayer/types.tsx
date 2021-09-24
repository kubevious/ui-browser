import { RefObject } from "react";
import { LayerInfo } from "../service/types";
import { DiagramBrowserLoader } from "../DiagramBrowser/diagram-browser-loader";
import { DiagramBrowserViewOptions } from "../DiagramBrowser/types";

export interface DiagramLayerProps
{
    loader: DiagramBrowserLoader;
    layer: LayerInfo;

    scrollBoundaryRef? : RefObject<any>;

    viewOptions?: Partial<DiagramBrowserViewOptions>;
}