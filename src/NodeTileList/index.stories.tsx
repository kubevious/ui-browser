import { Story } from '@storybook/react';
import React from 'react';
import { APP_CONFIG, IMAGE_CONFIG, LARGE_APP_NODE_LIST, REPLICA_SET_CONFIG } from '../mock/nodes';
import { REPLICA_SET_CONFIG_DN } from '../mock/nodes';
import { NodeTileList } from './';

export default {
    title: 'NodeTileList',
    component: NodeTileList
};

export const Default: Story = () => {

    const nodes = [
        APP_CONFIG,
        REPLICA_SET_CONFIG,
        IMAGE_CONFIG
    ]

    return <>
        <div style={{ background: 'grey' }}>

            <div style={{ padding: '1rem' }}>
                <NodeTileList configs={nodes} >
                </NodeTileList>
            </div>

            <div style={{ padding: '1rem' }}>
                <NodeTileList configs={nodes} selectedDn={REPLICA_SET_CONFIG_DN}>
                </NodeTileList>
            </div>

            <div style={{ padding: '1rem' }}>
                <NodeTileList configs={nodes} highlightedDn={REPLICA_SET_CONFIG_DN}>
                </NodeTileList>
            </div>

            <div style={{ padding: '1rem', width: '400px' }}>
                <NodeTileList configs={nodes} selectedDn={REPLICA_SET_CONFIG_DN}>
                </NodeTileList>
            </div>

        </div>
    </>
}


export const LargeList: Story = () => {

    return <>
        <div style={{ background: 'grey' }}>

            <div style={{ padding: '1rem' }}>
                <NodeTileList configs={LARGE_APP_NODE_LIST} >
                </NodeTileList>
            </div>

            <div style={{ padding: '1rem' }}>
                <NodeTileList configs={LARGE_APP_NODE_LIST} selectedDn={LARGE_APP_NODE_LIST[1].dn}>
                </NodeTileList>
            </div>

            <div style={{ padding: '1rem' }}>
                <NodeTileList configs={LARGE_APP_NODE_LIST} highlightedDn={LARGE_APP_NODE_LIST[3].dn}>
                </NodeTileList>
            </div>

        </div>
    </>
}



export const LargeGrid: Story = () => {

    return <>
        <div style={{ background: 'grey' }}>

            <div style={{ padding: '1rem' }}>
                <NodeTileList isGrid configs={LARGE_APP_NODE_LIST} >
                </NodeTileList>
            </div>

            <div style={{ padding: '1rem' }}>
                <NodeTileList isGrid configs={LARGE_APP_NODE_LIST} selectedDn={LARGE_APP_NODE_LIST[1].dn}>
                </NodeTileList>
            </div>

            <div style={{ padding: '1rem' }}>
                <NodeTileList isGrid configs={LARGE_APP_NODE_LIST} highlightedDn={LARGE_APP_NODE_LIST[3].dn}>
                </NodeTileList>
            </div>

        </div>
    </>
}
