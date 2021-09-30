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

            <div style={{ margin: '3rem', background: 'darkblue' }}>
                <NodeTileList configs={nodes} >
                </NodeTileList>
            </div>

            <div style={{ margin: '3rem', background: 'darkblue' }}>
                <NodeTileList configs={nodes} separator >
                </NodeTileList>
            </div>

            <div style={{ margin: '3rem', background: 'darkblue' }}>
                <NodeTileList configs={nodes} selectedDn={REPLICA_SET_CONFIG_DN}>
                </NodeTileList>
            </div>

            <div style={{ margin: '3rem', background: 'darkblue' }}>
                <NodeTileList configs={nodes} highlightedDn={REPLICA_SET_CONFIG_DN}>
                </NodeTileList>
            </div>

            <div style={{ margin: '3rem', background: 'darkblue', width: '400px' }}>
                <NodeTileList configs={nodes} selectedDn={REPLICA_SET_CONFIG_DN}>
                </NodeTileList>
            </div>

        </div>
    </>
}


export const LargeList: Story = () => {

    return <>
        <div style={{ background: 'grey' }}>

            <div style={{ margin: '1rem', background: 'darkblue' }}>
                <NodeTileList configs={LARGE_APP_NODE_LIST} >
                </NodeTileList>
            </div>

            <div style={{ margin: '1rem', background: 'darkblue' }}>
                <NodeTileList configs={LARGE_APP_NODE_LIST} selectedDn={LARGE_APP_NODE_LIST[1].dn}>
                </NodeTileList>
            </div>

            <div style={{ margin: '1rem', background: 'darkblue' }}>
                <NodeTileList configs={LARGE_APP_NODE_LIST} highlightedDn={LARGE_APP_NODE_LIST[3].dn}>
                </NodeTileList>
            </div>

        </div>
    </>
}



export const LargeGrid: Story = () => {

    return <>
        <div style={{ background: 'grey' }}>

            <div style={{ margin: '1rem', background: 'darkblue' }}>
                <NodeTileList isGrid configs={LARGE_APP_NODE_LIST} >
                </NodeTileList>
            </div>

            <div style={{ margin: '1rem', background: 'darkblue' }}>
                <NodeTileList isGrid configs={LARGE_APP_NODE_LIST} selectedDn={LARGE_APP_NODE_LIST[1].dn}>
                </NodeTileList>
            </div>

            <div style={{ margin: '1rem', background: 'darkblue' }}>
                <NodeTileList isGrid configs={LARGE_APP_NODE_LIST} highlightedDn={LARGE_APP_NODE_LIST[3].dn}>
                </NodeTileList>
            </div>

        </div>
    </>
}

export const LargeListSelectedScroll: Story = () => {

    return <>
        <div style={{ background: 'grey' }}>

            <div style={{ margin: '1rem', background: 'darkblue', height: '500px', overflowY: 'auto'  }}>
                <NodeTileList configs={LARGE_APP_NODE_LIST} selectedDn={LARGE_APP_NODE_LIST[7].dn}>
                </NodeTileList>
            </div>

        </div>
    </>
}
