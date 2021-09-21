import React, { FC, useState } from 'react';
import { NodeTileProps } from './types';

import styles from './styles.module.css';
import { DnIconComponent } from '@kubevious/ui-components';

import { Label, FlagIcon, MarkerIcon } from '@kubevious/ui-components';
import { SeverityIcon } from '@kubevious/ui-alerts';
import cx from 'classnames';

export const NodeTile: FC<NodeTileProps> = ({ config, isSelected, isHighlighted }) => {

    const hasErrors = (config.alertCount?.error ?? 0) > 0;
    const hasWarnings = (config.alertCount?.warn ?? 0) > 0;

    return <>
        <div data-dn={config.dn} data-rn={config.rn}
            className={cx(styles.outside, { [styles.outsideSelected] : isSelected, [styles.outsideHighlighted] : isHighlighted })}>

            <div className={styles.iconContainer}>

                <div className={styles.iconBox}>
                    <DnIconComponent kind={config.kind} size='lg'   />
                </div>

            </div>

            <div className={styles.mainContainer}>

                <div className={styles.textContainer}>
                    <div className={styles.kindText}>
                        {config.kind}
                    </div>
                    <div className={styles.nameText}>
                        {config.name}
                    </div>
                </div>

                <div className={styles.detailsContainer}>

                    <div className={styles.alertsContainer}>

                        {(hasErrors || hasWarnings) && <>
                            <span className={styles.alertsWrapper}>
                                {hasErrors && <span className={styles.severityWrapper}>
                                    <SeverityIcon severity="error"
                                        extraStyles={styles.severity} />
                                    <Label text={`${config.alertCount.error}`} ></Label>
                                </span>}
                                {hasWarnings && <span className={styles.severityWrapper}>
                                    <SeverityIcon severity="warn"
                                        extraStyles={styles.severity} />
                                    <Label text={`${config.alertCount.warn}`} ></Label>
                                </span>}
                            </span>
                        </>}

                    </div>

                    <div className={styles.flagsContainer}>
                        {config.markers && config.markers.map((marker) => 
                            <MarkerIcon key={marker} marker={marker} />
                        ) }

                        {/* <FlagIcon /> */}
                    </div>

                </div>

            </div>


        </div>
    </>
}