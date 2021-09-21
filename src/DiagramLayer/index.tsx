import React, { FC, useEffect, useState } from 'react';
import { DiagramLayerProps } from './types';

import styles from './styles.module.css';
import { NodeConfig } from '../types';
import { NodeTileList } from '../NodeTileList';
// import cx from 'classnames';

export const DiagramLayer: FC<DiagramLayerProps> = ({ layer, diagramSource }) => {

    const [ nodes, setNodes ] = useState<NodeConfig[]>([]);

    useEffect(() => {

        const subscriber = diagramSource.subscribeChildrenNodes(layer.parent, (nodes) => {
            console.log("CHILD NODES: ", nodes);
            setNodes(nodes);
        });

        return () => {
            subscriber.close();
        };

    }, [layer]);
    
    return <>
        <div data-dn={layer.parent}
             className={styles.layer} >
             {/* <pre>
                {JSON.stringify(layer, null, 4)}
            </pre> */}
            
            <NodeTileList configs={nodes}   
                highlightedDn={layer.highlightedDn}
                selectedDn={layer.selectedDn}
                >
            </NodeTileList>
        </div>

    </>
}