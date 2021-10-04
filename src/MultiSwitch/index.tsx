import React, { FC, useState } from 'react';
import cx from 'classnames';
import { MultiSwitchProps, OptionItem } from './types';
import { TooltipContainer } from '@kubevious/ui-components';

import styles from './styles.module.css';

export const MultiSwitch: FC<MultiSwitchProps> = ({ items, initialSelection, onSelectedChanged }) => {

    const [selectedIndex, setSelectedIndex] = useState<number>(initialSelection ?? 0);

    const layers: ItemLayer[] = [];
    {
        let itemIndex = 0;
        for(let i = 0; i < items.length; i++) 
        {
            const item = items[i];
            const layer : ItemLayer = {
                layerIndex: i,
                items: [ { ...item, layerIndex: i, subIndex: 0, index: itemIndex }]
            }
            itemIndex++;

            if (item.alternatives) {
                for(let j = 0; j < item.alternatives.length; j++)
                {
                    const altItem = item.alternatives[j];
                    layer.items.push({
                        ...altItem,
                        index: itemIndex,
                        layerIndex: i,
                        subIndex: (j + 1)
                    })
                    itemIndex++;
                }
            }
            layers.push(layer);
        }
    }

    const itemSize = 40;
    const height = itemSize + 2;
    const width = itemSize * layers.length + 2;

    const determineNextSelection = (layer: ItemLayer) => {

        for(let i = 0; i < layer.items.length; i++)
        {
            const item = layer.items[i];
            if (item.index === selectedIndex) {
                const newSubIndex = (item.subIndex + 1) % layer.items.length;
                const newItem = layer.items[newSubIndex];
                return newItem;
            }
        }

        return layer.items[0];
    }

    const onClick = (layer: ItemLayer) => {
        const item = determineNextSelection(layer);
        const newSelection = item.index;

        if (newSelection === selectedIndex) {
            return;
        }

        setSelectedIndex(newSelection);
        if (onSelectedChanged) {
            onSelectedChanged(item.index, item.layerIndex, item.subIndex);
        }
    }

    const renderItem = (layer: ItemLayer) => {
        
        let myItem = layer.items[0];
        let isSelected = false;
        for(const item of layer.items) {
            if (item.index === selectedIndex) {
                myItem = item;
                isSelected = true;
            }
        }

        return <div key={layer.layerIndex}
                    className={cx(styles.itemContainer, {[styles.selectedItemContainer] : isSelected})}
                    style={{ width: `${itemSize}px`, height: `${itemSize}px` }}
                    onClick={() => onClick(layer)} >
            <div className={styles.iconContainer}>
                {myItem.element && myItem.element!}
                {myItem.imageUrl && <div className={styles.itemImage} style={{ backgroundImage: `url(${myItem.imageUrl})` }}></div>}
            </div>
        </div>
    }

    const renderTooltipContents = (layer: ItemLayer) => {
        for(const item of layer.items)
        {
            if (item.index === selectedIndex) {
                if (item.tooltip) {
                    return item.tooltip;
                }
            }
        }
        return layer.items[0].tooltip ?? "";
    }
   
    return <>
        <div className={styles.container} style={{ width: `${width}px`, height: `${height}px` }} >
            {layers.map((layer, index) => {
                return <TooltipContainer key={index}
                    tooltipContentsFetcher={() => renderTooltipContents(layer)}
                    contents={renderItem(layer)}
                    >
                    </TooltipContainer>
            })}
        </div>
    </>
};

interface InternalItem extends OptionItem
{
    index: number;
    layerIndex: number;
    subIndex: number;
}

interface ItemLayer
{
    layerIndex: number;
    items: InternalItem[];
}



