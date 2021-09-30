import { RefObject } from 'react';
import { DiagramBrowserViewOptions } from '../DiagramBrowser/types';
import { NodeConfig } from '../types';

export interface NodeTileListProps
{
    isGrid?: boolean;
    
    configs: NodeConfig[];

    selectedDn?: string;
    highlightedDn?: string;

    scrollBoundaryRef? : RefObject<any>;

    viewOptions?: Partial<DiagramBrowserViewOptions>;

    depth?: number;

    separator?: boolean;
}