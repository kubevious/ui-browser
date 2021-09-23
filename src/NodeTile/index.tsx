import React, { FC, useEffect, useRef } from 'react';
import { NodeTileProps } from './types';

import styles from './styles.module.css';
import { DnIconComponent, FlagIcon } from '@kubevious/ui-components';

import { Label, MarkerIcon } from '@kubevious/ui-components';
import { SeverityIcon } from '@kubevious/ui-alerts';
import cx from 'classnames';
import scrollIntoView from 'scroll-into-view-if-needed'

import { getNodeConfigFlags, getNodeConfigMarkers } from '../utils/node-utils';

import { app } from '@kubevious/ui-framework'

export const NodeTile: FC<NodeTileProps> = ({ config, isSelected, isHighlighted, scrollBoundaryRef }) => {

    const tileRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!scrollBoundaryRef) {
            return;
        }

        if (isSelected || isHighlighted ) {
            const currentElem = tileRef.current;
            if (currentElem) {
                scrollIntoView(currentElem, {
                    behavior: 'smooth',
                    block: 'center',
                    inline: 'center',
                    boundary: scrollBoundaryRef?.current
                });
            }
        }

    }, [ isSelected, isHighlighted ]);

    const hasErrors = (config.alertCount?.error ?? 0) > 0;
    const hasWarnings = (config.alertCount?.warn ?? 0) > 0;

    const onClick = () => {
        app.sharedState.set('selected_dn', config.dn);
    };

    return <>
        <div data-dn={config.dn} data-rn={config.rn}
             ref={tileRef}
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
                                    <span className={styles.severity}>
                                        <SeverityIcon severity="error"/>
                                    </span>
                                    <Label text={`${config.alertCount.error}`} ></Label>
                                </span>}
                                {hasWarnings && <span className={styles.severityWrapper}>
                                    <span className={styles.severity}>
                                        <SeverityIcon severity="warn" />
                                    </span>
                                    <Label text={`${config.alertCount.warn}`} ></Label>
                                </span>}
                            </span>
                        </>}

                    </div>

                    <div className={styles.flagsContainer}>
                        {getNodeConfigMarkers(config).map((marker) => 
                            <MarkerIcon key={marker} marker={marker} />
                        )}

                        {getNodeConfigFlags(config).map((flag) => 
                            <FlagIcon key={flag} flag={flag} />
                        )}
                    </div>

                </div>

            </div>


        </div>
    </>
}