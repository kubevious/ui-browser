import _ from 'the-lodash';
import React, { FC, useEffect, useRef } from 'react';
import { NodeTileProps } from './types';

import styles from './styles.module.css';
import { DnIconComponent, FlagIcon, IconBox } from '@kubevious/ui-components';

import { Label, MarkerIcon } from '@kubevious/ui-components';
import { SeverityIcon } from '@kubevious/ui-alerts';
import cx from 'classnames';
import scrollIntoView from 'scroll-into-view-if-needed'

import { getNodeConfigFlags, getNodeConfigMarkers } from '../utils/node-utils';

import { app } from '@kubevious/ui-framework'

export const NodeTile: FC<NodeTileProps> = ({ config, isSelected, isHighlighted, scrollBoundaryRef, viewOptions }) => {

    const tileRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!scrollBoundaryRef) {
            return;
        }

        if (!_.isUndefined(viewOptions?.autoScrollVertically)) {
            if (!(viewOptions?.autoScrollVertically)) {
                return;
            }
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

    const childrenCount = config.childrenCount ?? 0;
    const hasChildren = childrenCount > 0;
    const hasErrors = (config.alertCount?.error ?? 0) > 0;
    const hasWarnings = (config.alertCount?.warn ?? 0) > 0;

    const onClick = () => {
        console.error("[NodeTile] OnClick", )
        console.error("[NodeTile] OnClick. config:", config)
        const currentSelection = app.sharedState.get('selected_dn');
        console.error("[NodeTile] currentSelection:", currentSelection)
        if (currentSelection && currentSelection === config.dn) {
            app.sharedState.set('selected_dn', null);
        } else {
            app.sharedState.set('selected_dn', config.dn);
        }
    };

    const returnAlertTooltipContent = () => {
        return <div className={styles.tooltipAlertContainer}>
            <div className={styles.tooltipAlertSeverity}>
                Total number of alerts<br/>within the hierarchy.
            </div>

            {hasErrors && <div className={styles.tooltipAlertSeverity}>
                <SeverityIcon severity="error"/>
                Errors:
                <Label text={`${config.alertCount.error}`} ></Label>
            </div>}

            {hasWarnings && <div className={styles.tooltipAlertSeverity}>
                <SeverityIcon severity="warn" />
                Warnings:
                <Label text={`${config.alertCount.warn}`} ></Label>
            </div>}
        </div>
    };

    const returnChildrenTooltipContent = () => {
        return <>
            Children: {childrenCount}
        </>
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
                            <IconBox height={16}
                                     tooltipContentsFetcher={returnAlertTooltipContent}
                                     innerExtraStyle={{ gap: '10px' }}
                                     >
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
                            </IconBox>



                            {/* <span className={styles.alertsWrapper}>
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
                            </span> */}
                        </>}


                        {hasChildren && <>
                            <IconBox width={16} height={16}
                                     tooltipContentsFetcher={returnChildrenTooltipContent}
                                     innerExtraStyle={{ color: 'white' }}
                                      >
                                <i className="fas fa-sign-in-alt"></i>
                            </IconBox>
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