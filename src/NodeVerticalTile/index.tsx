import React, { FC } from 'react';
import { NodeVerticalTileProps } from './types';

import styles from './styles.module.css';
import { DnIconComponent } from '@kubevious/ui-components';

import { Label, FlagIcon, MarkerIcon } from '@kubevious/ui-components';
import { SeverityIcon } from '@kubevious/ui-alerts';
import cx from 'classnames';


import { app } from '@kubevious/ui-framework'

export const NodeVerticalTile: FC<NodeVerticalTileProps> = ({ config, isSelected, isHighlighted }) => {

    const hasErrors = (config.alertCount?.error ?? 0) > 0;
    const hasWarnings = (config.alertCount?.warn ?? 0) > 0;

    const onClick = () => {
        app.sharedState.set('selected_dn', config.dn);
    };

    return <>
        <div data-dn={config.dn} data-rn={config.rn}
             className={cx(styles.outside, { [styles.outsideSelected] : isSelected, [styles.outsideHighlighted] : isHighlighted })}
             onClick={onClick}
             >

            <div className={styles.iconContainer}>

                <div className={styles.iconBox}>
                    <DnIconComponent kind={config.kind} size='lg'   />
                </div>

            </div>

            <div className={styles.mainContainer}>

                <div className={styles.textContainer}>
                    <div className={cx(styles.kindText, styles.rotateText)}>
                        {config.kind}
                    </div>
                    <div className={cx(styles.nameText, styles.rotateText)}>
                        {config.name}
                    </div>
                </div>

                <div className={styles.detailsContainer}>

                    <div className={styles.alertsContainer}>

                        {hasErrors && <div className={styles.severityWrapper}>
                            <SeverityIcon severity="error"
                                extraStyles={styles.severity} />
                            <Label text={`${config.alertCount.error}`} ></Label>
                        </div>}

                        {hasWarnings && <div className={styles.severityWrapper}>
                            <SeverityIcon severity="warn"
                                extraStyles={styles.severity} />
                            <Label text={`${config.alertCount.warn}`} ></Label>
                        </div>}

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