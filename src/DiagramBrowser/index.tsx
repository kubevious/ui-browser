import React, { FC } from 'react';
import { DiagramBrowserProps } from './types';

import styles from './styles.module.css';
// import cx from 'classnames';

import { extractDnLayers } from './utils';
import { DiagramLayer } from '../DiagramLayer';

export const DiagramBrowser: FC<DiagramBrowserProps> = ({ diagramSource, rootDn, expandedDn }) => {

    const layers = extractDnLayers(rootDn, expandedDn);
    // if (diagramSource) {
    //     diagramSource.applyLayers(layers);
    // }

    return <>


        <div className={styles.container}>

            <div className={styles.content}>

                {layers.map((layer, index) => 

                    <DiagramLayer key={index} diagramSource={diagramSource} layer={layer} />
                    
                )}

            </div>

        </div>
       
    </>
}