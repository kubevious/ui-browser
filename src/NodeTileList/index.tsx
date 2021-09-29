import React, { FC } from 'react';
import { NodeTile } from '../NodeTile';
import { NodeTileListProps } from './types';
import { NodeConfig } from "@kubevious/ui-middleware/dist/services/diagram-browser";

import styles from './styles.module.css';
import cx from 'classnames';

export const NodeTileList: FC<NodeTileListProps> = ({ isGrid, configs, selectedDn, highlightedDn, scrollBoundaryRef, viewOptions }) => {

    const renderNodeTile = (config: NodeConfig) => {
        const isSelected = (selectedDn && config.dn == selectedDn) || false;
        const isHighlighted = (highlightedDn && config.dn == highlightedDn) || false;

        return <div key={config.rn}
            className={cx(styles.nodeContainer)}
            >
            <NodeTile config={config}
                    isSelected={isSelected}
                    isHighlighted={isHighlighted}
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