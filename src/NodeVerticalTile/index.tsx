import React, { FC } from 'react';
import { NodeVerticalTileProps } from './types';

import styles from './styles.module.css';
import { DnIconComponent, FlagIcon } from '@kubevious/ui-components';

import { Label, MarkerIcon } from '@kubevious/ui-components';
import { SeverityIcon } from '@kubevious/ui-alerts';
import cx from 'classnames';

import { getNodeConfigFlags, getNodeConfigMarkers } from '../utils/node-utils';

import { app } from '@kubevious/ui-framework'
import { DIAGRAM_LABELS, parseDn } from '@kubevious/entity-meta';

export const NodeVerticalTile: FC<NodeVerticalTileProps> = ({ config, isSelected, isHighlighted }) => {

    const hasErrors = (config.alertCount?.error ?? 0) > 0;
    const hasWarnings = (config.alertCount?.warn ?? 0) > 0;

    const onClick = () => {
        app.sharedState.set('selected_dn', config.dn);
    };

    const dnParts = parseDn(config.dn);

    return <>
        <div data-dn={config.dn} data-rn={config.rn}
             className={cx(styles.outside, { [styles.outsideSelected] : isSelected, [styles.outsideHighlighted] : isHighlighted })}
             onClick={onClick}
             >

            <div className={styles.iconContainer}>

                <div className={styles.iconBox}>
                    <DnIconComponent dnParts={dnParts} size='lg'   />
                </div>

            </div>

            <div className={styles.mainContainer}>

                <div className={styles.textContainer}>
                    <div className={cx(styles.kindText, styles.rotateText)}>
                        {DIAGRAM_LABELS.get((config.kind as any))}
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
                        {getNodeConfigMarkers(config).map((marker) => 
                            <MarkerIcon key={marker} marker={marker} />
                        ) }

                        {getNodeConfigFlags(config).map((flag) => 
                            <FlagIcon key={flag} flag={flag} />
                        )}
                    </div>

                </div>

            </div>


        </div>
    </>
}