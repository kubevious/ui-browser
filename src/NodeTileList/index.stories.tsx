import { Story } from '@storybook/react';
import React from 'react';
import { APP_CONFIG, IMAGE_CONFIG, REPLICA_SET_CONFIG } from '../mock/nodes';
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
                <NodeTileList configs={nodes}>
                </NodeTileList>
            </div>

        </div>
    </>
}
