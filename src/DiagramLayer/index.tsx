import _ from 'the-lodash';
import React, { FC, useEffect, useRef, useState } from 'react';
import { DiagramLayerProps } from './types';

import styles from './styles.module.css';
import { NodeTileList } from '../NodeTileList';
import cx from 'classnames';
import scrollIntoView from 'scroll-into-view-if-needed'
import { LayerInfoKind } from '../service/types';
import { NodeConfig } from '@kubevious/ui-middleware/dist/services/diagram-browser';

import { getLayerColor } from '../utils/diagram-utils';
import { ScrollbarComponent } from '../ScrollbarComponent';


export const DiagramLayer: FC<DiagramLayerProps> = ({ layer, loader, scrollBoundaryRef, viewOptions }) => {

    const layerRef = useRef<HTMLDivElement>(null);

    const [ nodes, setNodes ] = useState<NodeConfig[]>([]);

    const isChildrenView = (layer.kind == LayerInfoKind.Children);
    const isNodeListView = (layer.kind == LayerInfoKind.NodeList);

    useEffect(() => {

        const subscription = loader.onLayerNodesChange(layer, (newNodes) => {
            setNodes(newNodes ?? []);
        })

        return () => {
            subscription.close();
        }

    }, [layer.dataKey]);


    useEffect(() => {

        if (!_.isUndefined(viewOptions?.autoScrollHorizontally)) {
            if (!viewOptions?.autoScrollHorizontally) {
                return;
            }
        }

        if (layer.selectedDn) {
            const currentElem = layerRef.current;
            if (currentElem) {
                scrollIntoView(currentElem, {
                    behavior: 'smooth',
                    inline: 'end',
                    block: 'end',
                    boundary: scrollBoundaryRef?.current
                });
            }
        }

    }, [ layer.dataKey, nodes ]);
    
    return <>
        <ScrollbarComponent
            className={cx(styles.outerLayer, {[styles.outerLayerColumn]: isNodeListView, [styles.outerLayerGrid]: isChildrenView })} 
            >
            <div data-dn={layer.parent}
                className={styles.layer}
                style={{ backgroundColor: getLayerColor(layer.depth) }}
                ref={layerRef}
                >

                <NodeTileList configs={nodes}   
                    highlightedDn={layer.highlightedDn}
                    selectedDn={layer.selectedDn}
                    scrollBoundaryRef={layerRef}
                    isGrid={isChildrenView}
                    viewOptions={viewOptions}
                    depth={layer.depth}
                    separator={isNodeListView}
                    compact={isNodeListView}
                    >
                </NodeTileList>
            </div>
        </ScrollbarComponent>
    </>
}