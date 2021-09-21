import _ from 'the-lodash'
import { Story } from '@storybook/react';
import React, { useState } from 'react';
import { DiagramBrowser } from './';

import { MyDiagramSource } from '../mock/diagram-source';

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
            <div style={{ margin: '1rem', height: '600px' }}>
                <DiagramBrowser diagramSource={MyDiagramSource}
                                rootDn="root/logic"
                                initialExpandedDn="root/logic/ns-[sprt]/app-[gprod-sprt-main-grfna]/cont-[gprod-sprt-main-grfna]/port-[default (TCP-3000)]/service-[gprod-sprt-main-grfna-default]" >
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
                <DiagramBrowser diagramSource={MyDiagramSource}
                                rootDn="root/logic"
                                initialExpandedDn="root/logic" >
                </DiagramBrowser>
            </div>

        </div>

    </div>
);


export const Interactive: Story = () => {

    const [expandedDn, setExpandedDn] = useState<string>('root/logic');

    function caseOne() {
        setExpandedDn('root/logic/ns-[sprt]/app-[gprod-sprt-main-grfna]/cont-[gprod-sprt-main-grfna]/port-[default (TCP-3000)]/service-[gprod-sprt-main-grfna-default]')
    }
    function caseTwo() {
        setExpandedDn('root/logic')
    }

    return <>
        <div style={{ background: 'grey' }}>

            <div style={{ margin: '1rem' }}>
                <h2>Unrestricted Size</h2>
            </div>

            <div>
                <div style={{ margin: '1rem' }}>
                    <button onClick={caseOne}>Case One</button>;
                    <button onClick={caseTwo}>Case Two</button>;
                </div>

                <div style={{ margin: '1rem', height: "500px" }}>
                    <DiagramBrowser diagramSource={MyDiagramSource}
                                    rootDn="root/logic"
                                    initialExpandedDn={expandedDn} >
                    </DiagramBrowser>
                </div>

            </div>

        </div>
    </>

}

export const MultiScreen: Story = () => (

    <div style={{ background: 'grey' }}>
        <div style={{ margin: '1rem' }}>
            <h2>Logic</h2>
        </div>

        <div>
            <div style={{ margin: '1rem', height: '400px' }}>
                <DiagramBrowser diagramSource={MyDiagramSource}
                                rootDn="root/logic"
                                expandedDn="root/logic/ns-[sprt]/app-[gprod-sprt-main-grfna]/cont-[gprod-sprt-main-grfna]/port-[default (TCP-3000)]/service-[gprod-sprt-main-grfna-default]" >
                </DiagramBrowser>
            </div>

        </div>

        <div style={{ margin: '1rem' }}>
            <h2>Image</h2>
        </div>

        <div>
            <div style={{ margin: '1rem', height: '400px' }}>
                <DiagramBrowser diagramSource={MyDiagramSource}
                                rootDn="root/images"
                                expandedDn="root/images/repo-[dockerhub]/image-[jaegertracing/all-in-one]/tag-[latest]/ns-[sprt]" >
                </DiagramBrowser>
            </div>

        </div>

    </div>
);
