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
import { parseDn, DIAGRAM_LABELS } from '@kubevious/entity-meta';

export const NodeTile: FC<NodeTileProps> = ({ config, isSelected, isHighlighted, scrollBoundaryRef, compact, viewOptions }) => {

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

    const dnParts = parseDn(config.dn);

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

    const nodeConfigMarkers = getNodeConfigMarkers(config);
    const nodeConfigFlags = getNodeConfigFlags(config);


    return <>
        <div data-dn={config.dn} data-rn={config.rn}
             ref={tileRef}
             className={cx(styles.outside, { [styles.outsideSelected] : isSelected, [styles.outsideHighlighted] : isHighlighted })}
             onClick={onClick}
             >

            <div className={styles.iconContainer}>

                <div className={cx(styles.iconBox, {[styles.iconBoxCompact] : compact})}>
                    <DnIconComponent dnParts={dnParts} size='custom' extraClassNames={styles.icon}   />
                </div>

            </div>


            {hasChildren && <>
                <IconBox tooltipContentsFetcher={returnChildrenTooltipContent}
                         extraClassNames={styles.childrenCountBox}
                        >
                    {childrenCount}
                </IconBox>
            </>}

            <div className={styles.mainContainer}>

                <div className={cx(styles.nameContainer, { [styles.nameContainerCompact] : compact })}>
                    <div className={styles.kindText}>
                        {DIAGRAM_LABELS.get((config.kind as any))}
                    </div>
                    {config.name && 
                        <div className={styles.nameText}>
                            {config.name}
                        </div>
                    }
                </div>

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

                    </>}

                    {nodeConfigFlags.map((flag) => 
                        <FlagIcon key={flag} flag={flag} />
                    )}

                    {nodeConfigMarkers.map((marker) => 
                        <MarkerIcon key={marker} marker={marker} />
                    )}


                </div>

{/* 
                {(nodeConfigMarkers.length + nodeConfigFlags.length > 0) &&
                    <div className={styles.flagsContainer}>
                        {nodeConfigMarkers.map((marker) => 
                            <MarkerIcon key={marker} marker={marker} />
                        )}

                        {nodeConfigFlags.map((flag) => 
                            <FlagIcon key={flag} flag={flag} />
                        )}
                    </div>
                } */}

            </div>


        </div>
    </>
}