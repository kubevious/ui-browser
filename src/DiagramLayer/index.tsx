import _ from 'the-lodash';
import React, { FC, useEffect, useRef, useState } from 'react';
import { DiagramLayerProps } from './types';

import styles from './styles.module.css';
import { NodeTileList } from '../NodeTileList';
import { NodeVerticalTile } from '../NodeVerticalTile'
import cx from 'classnames';
import scrollIntoView from 'scroll-into-view-if-needed'
import { LayerInfoKind } from '../service/types';
import { NodeConfig } from '@kubevious/ui-middleware/dist/services/diagram-browser';

export const DiagramLayer: FC<DiagramLayerProps> = ({ layer, loader, scrollBoundaryRef, viewOptions }) => {

    const layerRef = useRef<HTMLDivElement>(null);

    const [ nodes, setNodes ] = useState<NodeConfig[]>([]);

    const isChildrenView = (layer.kind == LayerInfoKind.Children);
    const isSingleNodeView = (layer.kind == LayerInfoKind.Node);

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

        if (isChildrenView)
        {
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
        }

    }, [ layer.dataKey, nodes ]);

    
    return <>
        {isChildrenView && 
            <div data-dn={layer.parent}
                className={cx(styles.layer, {[styles.columnLayer]: !layer.isGridView, [styles.gridLayer]: layer.isGridView })}
                ref={layerRef}
                >

                <NodeTileList configs={nodes}   
                    highlightedDn={layer.highlightedDn}
                    selectedDn={layer.selectedDn}
                    scrollBoundaryRef={layerRef}
                    isGrid={layer.isGridView}
                    viewOptions={viewOptions}
                    >
                </NodeTileList>
            </div>
        }

        {isSingleNodeView && 
            <div data-dn={layer.parent}
                 className={cx(styles.layer, styles.singleNodeLayer)}
                 ref={layerRef}>
                
                {nodes.map((node, index) => 
                    <NodeVerticalTile key={index} 
                                      config={node}   
                                      isHighlighted >
                    </NodeVerticalTile>
                )}

            </div>
        }

    </>
}