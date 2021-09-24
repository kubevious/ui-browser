import React, { FC } from 'react';
import { NodeTile } from '../NodeTile';
import { NodeTileListProps } from './types';
import { NodeConfig } from '../types';

import styles from './styles.module.css';
import cx from 'classnames';

import { getLayerColor } from '../utils/diagram-utils';

export const NodeTileList: FC<NodeTileListProps> = ({ isGrid, depth, configs, selectedDn, highlightedDn, scrollBoundaryRef, viewOptions }) => {

    const renderNodeTile = (config: NodeConfig) => {
        const isSelected = (selectedDn && config.dn == selectedDn) || false;
        const isHighlighted = (highlightedDn && config.dn == highlightedDn) || false;

        const tileBackground = (isSelected || isHighlighted) ? getLayerColor((depth ?? 0) + 1) : undefined;

        return <div key={config.rn}
            className={cx(styles.nodeContainer, {[styles.nodeContainerHighlighted] : (isSelected || isHighlighted)})}
            style={{ backgroundColor: tileBackground }}
            >
            <NodeTile config={config}
                    isSelected={isSelected}
                    isHighlighted={isHighlighted && false}
                    scrollBoundaryRef={scrollBoundaryRef}
                    viewOptions={viewOptions}
                    />
        </div>  
    }

    return <>
        <div className={cx(styles.container, {[styles.listContainer]: !isGrid, [styles.gridContainer]: isGrid})}>
            {configs.map((config) => renderNodeTile(config))}
        </div>
    </>

}