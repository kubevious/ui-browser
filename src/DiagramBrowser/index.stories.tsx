import _ from 'the-lodash'
import { Story } from '@storybook/react';
import React, { useState } from 'react';
import { DiagramBrowser } from './';

import { MyDiagramSource } from '../mock/diagram-source';
import { app } from '@kubevious/ui-framework';

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

export const BasicView: Story = () => (

    <div style={{ background: 'grey' }}>
        <div style={{ margin: '1rem' }}>
            <h2>Unrestricted Size</h2>
        </div>

        <div>
            <div style={{ margin: '1rem', height: '600px' }}>
                <DiagramBrowser diagramSource={MyDiagramSource}
                                rootDn="root/logic"
                                initialExpandedDn="root/logic/ns-[sprt]/app-[gprod-sprt-main-grfna]/cont-[gprod-sprt-main-grfna]/port-[default (TCP-3000)]/service-[gprod-sprt-main-grfna-default]" 
                                viewOptions={{ useVerticalNodeView: false, useGridView: false, autoScrollHorizontally: false, autoScrollVertically: false }}
                                >

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

    function caseOne() {
        app.sharedState.set('selected_dn', 'root/logic/ns-[sprt]/app-[gprod-sprt-main-grfna]/cont-[gprod-sprt-main-grfna]/port-[default (TCP-3000)]/service-[gprod-sprt-main-grfna-default]');
    }
    function caseTwo() {
        app.sharedState.set('selected_dn', null);
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
                                    rootDn="root/logic">
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
                                initialExpandedDn="root/logic/ns-[sprt]/app-[gprod-sprt-main-grfna]/cont-[gprod-sprt-main-grfna]/port-[default (TCP-3000)]/service-[gprod-sprt-main-grfna-default]" >
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
                                initialExpandedDn="root/images/repo-[dockerhub]/image-[jaegertracing/all-in-one]/tag-[latest]/ns-[sprt]" >
                </DiagramBrowser>
            </div>
        </div>

        <div style={{ margin: '1rem' }}>
            <h2>K8s</h2>
        </div>
        <div>
            <div style={{ margin: '1rem', height: '400px' }}>
                <DiagramBrowser diagramSource={MyDiagramSource}
                                rootDn="root/k8s">
                </DiagramBrowser>
            </div>
        </div>

        <div style={{ margin: '1rem' }}>
            <h2>Infra</h2>
        </div>
        <div>
            <div style={{ margin: '1rem', height: '400px' }}>
                <DiagramBrowser diagramSource={MyDiagramSource}
                                rootDn="root/infra">
                </DiagramBrowser>
            </div>
        </div>
    </div>
);
