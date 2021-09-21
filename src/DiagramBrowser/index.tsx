import React, { FC, useEffect, useRef, useState } from 'react';
import { DiagramBrowserProps } from './types';

import styles from './styles.module.css';
// import cx from 'classnames';

import { extractDnLayers } from './utils';
import { DiagramLayer } from '../DiagramLayer';
import { subscribeToSharedState } from '@kubevious/ui-framework/dist';
import { LayerInfo } from '../service/types';

export const DiagramBrowser: FC<DiagramBrowserProps> = ({ diagramSource, rootDn, initialExpandedDn }) => {

    const contentRef = useRef<HTMLDivElement>(null);

    const [layers, setLayers] = useState<LayerInfo[]>([]);
    const [currentExpandedDn, setCurrentExpandedDn] = useState<string>(initialExpandedDn || rootDn);
    const [currentSelectedDn, setCurrentSelectedDn] = useState<string | null>(null);

    // const layers = extractDnLayers(rootDn, expandedDn);
    // if (diagramSource) {
    //     diagramSource.applyLayers(layers);
    // }

    subscribeToSharedState('selected_dn', (selected_dn: string) => {
        if (selected_dn) {
            if (selected_dn.startsWith(rootDn)) {
                setCurrentSelectedDn(selected_dn);
                setCurrentExpandedDn(selected_dn);
            } else {
                setCurrentSelectedDn(null);
            }
        } else {
            setCurrentSelectedDn(null);
        }
    });

    useEffect(() => {

        setLayers(extractDnLayers(rootDn, currentExpandedDn, currentSelectedDn))

    }, [currentExpandedDn, currentSelectedDn]);

    return <>


        <div className={styles.container}>

            <div className={styles.content}
                 ref={contentRef}>

                {layers.map((layer, index) => 

                    <DiagramLayer key={index}
                                  diagramSource={diagramSource}
                                  layer={layer}
                                  scrollBoundaryRef={contentRef}
                                  />
                    
                )}

            </div>

        </div>
       
    </>
}