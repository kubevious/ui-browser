import React, { FC, useState } from 'react';
import { DiagramBrowserProps } from './types';

import styles from './styles.module.css';
import cx from 'classnames';

import { extractDnLayers } from './utils';
import { DiagramLayer } from '../DiagramLayer';

export const DiagramBrowser: FC<DiagramBrowserProps> = ({ rootDn, expandedDn }) => {

    let layers = extractDnLayers(rootDn, expandedDn);

    return <>

        <div className={styles.container}>

            <div className={styles.content}>

                {layers.map((layer, index) => 

                    <DiagramLayer key={index} layer={layer} />
                    
                )}

            </div>

        </div>
       
    </>
}