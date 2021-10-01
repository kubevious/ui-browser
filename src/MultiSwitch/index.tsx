import React, { FC, useState } from 'react';
import cx from 'classnames';
import { MultiChoiceOption, MultiSwitchProps } from './types';
import { TooltipContainer } from '@kubevious/ui-components';

import styles from './styles.module.css';

export const MultiSwitch: FC<MultiSwitchProps> = ({ items, initialSelection, handler }) => {

    const [selected, setSelected] = useState<number>(initialSelection ?? 0);

    const itemSize = 42;
    const height = itemSize + 2;
    const width = itemSize * items.length + 2;

    const onClick = (index: number) => {
        setSelected(index);
        if (handler) {
            handler(index);
        }
    }

    const renderItem = (item: MultiChoiceOption, index: number) => {
        return <div key={index}
                    className={cx(styles.itemContainer, {[styles.selectedItemContainer] : (index == selected)})}
                    style={{ width: `${itemSize}px`, height: `${itemSize}px` }}
                    onClick={() => onClick(index)} >
            <div className={styles.iconContainer}>
                {item.element}
            </div>
        </div>
    }

    const renderTooltipContents = (item: MultiChoiceOption, index: number) => {
        return item.tooltip ?? "";
    }

   
    return <>
        <div className={styles.container} style={{ width: `${width}px`, height: `${height}px` }} >
            {items && items.map((item, index) => {
                return <TooltipContainer
                    tooltipContentsFetcher={() => renderTooltipContents(item, index)}
                    contents={renderItem(item, index)}
                    >
                    </TooltipContainer>
            })}
        </div>
    </>
};





