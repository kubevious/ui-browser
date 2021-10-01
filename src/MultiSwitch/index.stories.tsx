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
        element: <img src="/img/browser/power.svg"></img>,
        tooltip: "Options 1"
    },
    {
        element: <SeverityIcon severity="error" />,
        tooltip: "Options 2"
    },
    {
        element: <img src="/img/browser/green-tick.svg"></img>,
        tooltip: "Options 3"
    },
];


const CHOICE_DATA_2 : MultiChoiceOption[] = [
    {
        element: <img src="/img/browser/power.svg"></img>,
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
        element: <img src="/img/browser/green-tick.svg"></img>,
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

export const ChangeHandler: Story = () => {
    const [index, setIndex] = useState<number>(1);

    return <>
        <div style={{ background: '#999999', margin: '50px', padding: '50px' }}>
            
            <div style={{ background: '#1e1e1e', margin: '50px', padding: '50px' }}>
                <MultiSwitch
                    items={CHOICE_DATA_1}
                    initialSelection={index}
                    handler={(index) => { setIndex(index); }}
                    />
            </div>

            <div style={{ background: '#1e1e1e', margin: '50px', padding: '50px', color: 'white' }}>
                {index}
            </div>

        </div>

    </>;
};