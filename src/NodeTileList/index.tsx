import React, { FC, useState } from 'react';
import { NodeTile } from '../NodeTile';
import { NodeTileListProps } from './types';

import styles from './styles.module.css';

export const NodeTileList: FC<NodeTileListProps> = ({ configs }) => {

    return <>
        <div className={styles.container}>

            {configs.map((config) => <>
                <div key={config.rn}
                     className={styles.nodeContainer}>
                    <NodeTile config={config} />
                </div>
            </>)}
            
        </div>
    </>

}