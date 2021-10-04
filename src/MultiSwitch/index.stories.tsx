import { SeverityIcon } from '@kubevious/ui-components';
import { Story } from '@storybook/react';
import React, { useState } from 'react';
import { MultiSwitch } from './';
import { MultiChoiceOption } from './types';

export default {
    title: 'MultiSwitch',
    component: MultiSwitch
};

const CHOICE_DATA_1 : MultiChoiceOption[] = [
    {
        imageUrl: '/img/browser/power.svg',
        tooltip: "Options 1"
    },
    {
        element: <SeverityIcon severity="error" />,
        tooltip: "Options 2"
    },
    {
        imageUrl: '/img/browser/green-tick.svg',
        tooltip: "Options 3"
    },
];


const CHOICE_DATA_2 : MultiChoiceOption[] = [
    {
        imageUrl: '/img/browser/power.svg',
        tooltip: "Options 1"
    },
    {
        element: <SeverityIcon severity="error" />,
        tooltip: "Options 2"
    },
    {
        element: <SeverityIcon severity="warn" />,
        tooltip: "Options 3"
    },
    {
        imageUrl: '/img/browser/green-tick.svg',
        tooltip: "Options 4"
    },
];

export const Default: Story = () => {
    return <>
        <div style={{ background: '#999999', margin: '50px', padding: '50px' }}>
            
            <div style={{ background: '#1e1e1e', margin: '50px', padding: '50px' }}>
                <MultiSwitch
                    items={CHOICE_DATA_1}
                    />
            </div>

            <div style={{ background: '#1e1e1e', margin: '50px', padding: '50px' }}>
                <MultiSwitch
                    items={CHOICE_DATA_2}
                    />
            </div>


            <div style={{ background: '#1e1e1e', margin: '50px', padding: '50px' }}>
                <MultiSwitch
                    items={CHOICE_DATA_1}
                    initialSelection={1}
                    />
            </div>
            
        </div>

    </>;
};


const CHOICE_MULTI_STATE_DATA : MultiChoiceOption[] = [
    {
        imageUrl: '/img/browser/power.svg',
        tooltip: "Options 1"
    },
    {
        element: <SeverityIcon severity="error" />,
        tooltip: "Options 2",
        alternatives: [
            {
                element: <SeverityIcon severity="warn" />,
                tooltip: "This is the second option"
            }
        ]
    },
    {
        imageUrl: '/img/browser/green-tick.svg',
        tooltip: "Options 3"
    },
];


export const ChangeHandler: Story = () => {
    const [index, setIndex] = useState<number>(1);

    return <>
        <div style={{ background: '#999999', margin: '50px', padding: '50px' }}>
            
            <div style={{ background: '#1e1e1e', margin: '50px', padding: '50px' }}>
                <MultiSwitch
                    items={CHOICE_DATA_1}
                    initialSelection={index}
                    onSelectedChanged={(index) => { setIndex(index); }}
                    />
            </div>

            <div style={{ background: '#1e1e1e', margin: '50px', padding: '50px', color: 'white' }}>
                {index}
            </div>

        </div>

    </>;
};


export const MultiStage: Story = () => {
    const [index, setIndex] = useState<number>(1);
    const [layerIndex, setLayerIndex] = useState<number>(1);
    const [subIndex, setSubIndex] = useState<number>(1);

    return <>
        <div style={{ background: '#999999', margin: '50px', padding: '50px' }}>
            
            <div style={{ background: '#1e1e1e', margin: '50px', padding: '50px' }}>
                <MultiSwitch
                    items={CHOICE_MULTI_STATE_DATA}
                    initialSelection={index}
                    onSelectedChanged={(a, b, c) => { setIndex(a); setLayerIndex(b); setSubIndex(c) }}
                    />
            </div>

            <div style={{ background: '#1e1e1e', margin: '50px', padding: '50px', color: 'white' }}>
                {index} / {layerIndex} / {subIndex}
            </div>

        </div>

    </>;
};
