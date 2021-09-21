import React, { FC, useEffect, useState } from 'react';
import { DiagramBrowserProps } from './types';

import styles from './styles.module.css';
import cx from 'classnames';

import { extractDnLayers } from './utils';
import { DiagramLayer } from '../DiagramLayer';
import { DiagramSource } from '../service/diagram-source';

export const DiagramBrowser: FC<DiagramBrowserProps> = ({ rootDn, expandedDn }) => {

    const [diagramSource, setDiagramSource] = useState<DiagramSource | null>();

    useEffect(() => {

        const source = new DiagramSource();
        setDiagramSource(source);

        return () => {
            source.close();
            setDiagramSource(null);
        }
    }, [])

    let layers = extractDnLayers(rootDn, expandedDn);
    if (diagramSource) {
        diagramSource.applyLayers(layers);
    }

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