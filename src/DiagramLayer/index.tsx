import React, { FC, useEffect, useRef, useState } from 'react';
import { DiagramLayerProps } from './types';

import styles from './styles.module.css';
import { NodeConfig } from '../types';
import { NodeTileList } from '../NodeTileList';
// import cx from 'classnames';
import scrollIntoView from 'scroll-into-view-if-needed'

export const DiagramLayer: FC<DiagramLayerProps> = ({ layer, diagramSource, scrollBoundaryRef }) => {

    const layerRef = useRef<HTMLDivElement>(null);

    const [ nodes, setNodes ] = useState<NodeConfig[]>([]);

    useEffect(() => {

        if (layer.selectedDn) {
            const currentElem = layerRef.current;
            if (currentElem) {
                scrollIntoView(currentElem, {
                    behavior: 'smooth',
                    inline: 'start',
                    boundary: scrollBoundaryRef?.current
                });
            }
        }

        const subscriber = diagramSource.subscribeChildrenNodes(layer.parent, (nodes) => {
            setNodes(nodes);
        });

        return () => {
            subscriber.close();
        };

    }, [layer]);
    
    return <>
        <div data-dn={layer.parent}
             className={styles.layer}
             ref={layerRef}
             >
            
            <NodeTileList configs={nodes}   
                highlightedDn={layer.highlightedDn}
                selectedDn={layer.selectedDn}
                scrollBoundaryRef={layerRef}
                >
            </NodeTileList>
        </div>

    </>
}