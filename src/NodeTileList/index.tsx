import React, { FC } from 'react';
import { NodeTile } from '../NodeTile';
import { NodeTileListProps } from './types';

import styles from './styles.module.css';
import cx from 'classnames';

export const NodeTileList: FC<NodeTileListProps> = ({ isGrid, configs, selectedDn, highlightedDn, scrollBoundaryRef, viewOptions }) => {

    return <>
        <div className={cx(styles.container, {[styles.listContainer]: !isGrid, [styles.gridContainer]: isGrid})}>

            {configs.map((config) =>
                <div key={config.rn}
                     className={styles.nodeContainer}>
                    <NodeTile config={config}
                              isSelected={(selectedDn && config.dn == selectedDn) || false}
                              isHighlighted={(highlightedDn && config.dn == highlightedDn) || false}
                              scrollBoundaryRef={scrollBoundaryRef}
                              viewOptions={viewOptions}
                              />
                </div>
            )}
            
        </div>
    </>

}