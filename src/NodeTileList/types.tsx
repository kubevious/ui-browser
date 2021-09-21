import { RefObject } from 'react';
import { NodeConfig } from '../types';

export interface NodeTileListProps
{
    isGrid?: boolean;
    
    configs: NodeConfig[];

    selectedDn?: string;
    highlightedDn?: string;

    scrollBoundaryRef? : RefObject<any>
}