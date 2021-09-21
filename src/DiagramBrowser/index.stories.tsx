import { Story } from '@storybook/react';
import React from 'react';
import { DiagramBrowser } from './';
import { CONT_CONFIG_DN } from '../mock/nodes';

export default {
    title: 'DiagramBrowser',
    component: DiagramBrowser
};

export const Default: Story = () => (

    <div style={{ background: 'grey' }}>

        <div style={{ margin: '1rem' }}>
            <h2>Unrestricted Size</h2>
        </div>

        <div>

            <div style={{ margin: '1rem', height: "500px" }}>
                <DiagramBrowser rootDn="root/logic"
                                expandedDn="root/logic/ns-[kubevious]/app-[kubevious-mysql]/launcher-[StatefulSet]/pod-[0]/pvc-[data-kubevious-mysql-0]/pv-[pvc-8e3448af-a0f6-4f5c-ac55-ca92f18e4cc8]" >
                </DiagramBrowser>
            </div>

        </div>

    </div>
);


export const Empty: Story = () => (

    <div style={{ background: 'grey' }}>

        <div style={{ margin: '1rem' }}>
            <h2>Unrestricted Size</h2>
        </div>

        <div>

            <div style={{ margin: '1rem', height: "500px" }}>
                <DiagramBrowser rootDn="root/logic"
                                expandedDn="root/logic" >
                </DiagramBrowser>
            </div>

        </div>

    </div>
);
