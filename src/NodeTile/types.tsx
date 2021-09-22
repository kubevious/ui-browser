import { RefObject } from 'react';
import { NodeConfig } from "@kubevious/ui-middleware/dist/services/diagram-browser";

export interface NodeTileProps
{
    config: NodeConfig;
    isSelected?: boolean;
    isHighlighted?: boolean;

    scrollBoundaryRef? : RefObject<any>
}