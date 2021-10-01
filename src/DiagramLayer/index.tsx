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
import { LayerFilters } from '../LayerFilters';
import { Label } from '@kubevious/ui-components';
import { LayerSearchConfig } from '../types';


export const DiagramLayer: FC<DiagramLayerProps> = ({ layer, loader, scrollBoundaryRef, viewOptions }) => {

    const layerRef = useRef<HTMLDivElement>(null);

    const [ isLoading, setIsLoading ] = useState<boolean>(false);
    const [ nodes, setNodes ] = useState<NodeConfig[]>([]);

    const isChildrenView = (layer.kind == LayerInfoKind.Children);
    const isNodeListView = (layer.kind == LayerInfoKind.NodeList);

    useEffect(() => {

        const subscription = loader.onLayerNodesChange(layer, (newNodes, newIsLoading) => {
            setNodes(newNodes ?? []);
            setIsLoading(newIsLoading);
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

    const renderItemsList = () => {
        return <ScrollbarComponent
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
    };

    const renderItems = () => {
        if (nodes.length == 0) {
            return <div className={cx(styles.layer, styles.centerLayer)}>

                {(!isLoading) && 
                    <Label text="No children under this layer."
                           color="faded"
                           extraStyles={styles.centerContent}
                           />
                }
            </div>

        }

        return renderItemsList();
    };
    
    const handleFilterConfigChange = (config: LayerSearchConfig) => {
        loader.setLayerSearchConfig(layer, config);
    }
    
    return <div 
        className={cx(styles.outerLayer, {[styles.outerLayerColumn]: isNodeListView })} 
        >

        {isChildrenView &&
            <div className={styles.layerFilterWrapper}>
                <LayerFilters config={loader.getLayerSearchConfig(layer)}
                              onConfigChange={handleFilterConfigChange}
                              >
                </LayerFilters>
            </div>}

        

        <div style={{ height: '100%'}}
             className={styles.itemsContent}   >
            {renderItems()}
        </div>

    </div>
}