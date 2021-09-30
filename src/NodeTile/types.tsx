import { RefObject } from 'react';
import { NodeConfig } from "@kubevious/ui-middleware/dist/services/diagram-browser";
import { DiagramBrowserViewOptions } from '../DiagramBrowser/types';

export interface NodeTileProps
{
    config: NodeConfig;
    isSelected?: boolean;
    isHighlighted?: boolean;

    scrollBoundaryRef? : RefObject<any>;

    viewOptions?: Partial<DiagramBrowserViewOptions>;

    compact? : boolean;
}