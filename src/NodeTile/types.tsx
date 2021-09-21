import { RefObject } from 'react';
import { NodeConfig } from '../types';

export interface NodeTileProps
{
    config: NodeConfig;
    isSelected?: boolean;
    isHighlighted?: boolean;

    scrollBoundaryRef? : RefObject<any>
}