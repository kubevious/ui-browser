import React, { FC, useState } from 'react';
import { DiagramLayerProps } from './types';

import styles from './styles.module.css';
import cx from 'classnames';

export const DiagramLayer: FC<DiagramLayerProps> = ({ layer }) => {

    return <>

        <div data-dn={layer.parent}
             className={styles.layer} >
            <pre>
                {JSON.stringify(layer, null, 4)}
            </pre>
        </div>

    </>
}