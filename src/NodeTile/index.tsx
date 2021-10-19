import _ from 'the-lodash';
import React, { FC, useEffect, useRef } from 'react';
import { NodeTileProps } from './types';

import styles from './styles.module.css';
import { DnIconComponent, FlagIcon, IconBox } from '@kubevious/ui-components';

import { SeverityBlock, MarkerIcon } from '@kubevious/ui-components';
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

    const dnParts = parseDn(config.dn);

    const onClick = () => {
        const currentSelection = app.sharedState.get('selected_dn');
        console.log("[NodeTile] Click: ", currentSelection)
        if (currentSelection && currentSelection === config.dn) {
            app.sharedState.set('selected_dn', null);
        } else {
            app.sharedState.set('selected_dn', config.dn);
        }
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

                    <SeverityBlock errors={config?.alertCount?.error}
                                   warnings={config?.alertCount?.warn} />

                    {nodeConfigFlags.map((flag) => 
                        <FlagIcon key={flag} flag={flag} />
                    )}

                    {nodeConfigMarkers.map((marker) => 
                        <MarkerIcon key={marker} marker={marker} />
                    )}

                </div>

            </div>


        </div>
    </>
}