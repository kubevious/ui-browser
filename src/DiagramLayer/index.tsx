import React, { FC, useEffect, useRef, useState } from 'react';
import { DiagramLayerProps } from './types';

import styles from './styles.module.css';
import { NodeConfig } from '../types';
import { NodeTileList } from '../NodeTileList';
import { NodeVerticalTile } from '../NodeVerticalTile'
import cx from 'classnames';
import scrollIntoView from 'scroll-into-view-if-needed'
import { IService } from '@kubevious/ui-framework';
import { LayerInfoKind } from '../service/types';

export const DiagramLayer: FC<DiagramLayerProps> = ({ layer, diagramSource, scrollBoundaryRef }) => {

    const layerRef = useRef<HTMLDivElement>(null);

    const [ selfNode, setSelfNode ] = useState<NodeConfig | null>(null);
    const [ nodes, setNodes ] = useState<NodeConfig[]>([]);

    const isChildrenView = (layer.kind == LayerInfoKind.Children);
    const isSingleNodeView = (layer.kind == LayerInfoKind.Node);

    useEffect(() => {

        const subscribers : IService[] = [];

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
    
            const subscriber = diagramSource.subscribeChildrenNodes(layer.parent, (nodes) => {
                setNodes(nodes);
            });
            subscribers.push(subscriber);
        }

        if (isSingleNodeView)
        {
            const subscriber = diagramSource.subscribeNode(layer.highlightedDn!, (config) => {
                setSelfNode(config);
                if (config) {
                    setNodes([config]);
                } else {
                    setNodes([]);
                }
            });
            subscribers.push(subscriber);
        }


        return () => {
            for(const subscriber of subscribers) {
                subscriber.close();
            }
        };

    }, [layer]);
    
    return <>
        {isChildrenView && 
            <div data-dn={layer.parent}
                className={cx(styles.layer, {[styles.columnLayer]: !layer.isGridView, [styles.gridLayer]: layer.isGridView })}
                ref={layerRef}
                >

                {/* <div>
                    <pre style={{background: 'white'}}>
                        {JSON.stringify(layer, null, 4)}
                    </pre>
                </div>
                 */}

                <NodeTileList configs={nodes}   
                    highlightedDn={layer.highlightedDn}
                    selectedDn={layer.selectedDn}
                    scrollBoundaryRef={layerRef}
                    isGrid={layer.isGridView}
                    >
                </NodeTileList>
            </div>
        }

        {isSingleNodeView && 
            <div data-dn={layer.parent}
                 className={cx(styles.layer, styles.singleNodeLayer)}
                 ref={layerRef}>

                {/* <div>
                    <pre style={{background: 'white'}}>
                        {JSON.stringify(layer, null, 4)}
                    </pre>
                </div> */}

                {selfNode && 
                    <NodeVerticalTile config={selfNode}   
                                      isHighlighted >
                    </NodeVerticalTile>
                }
            </div>
        }

    </>
}