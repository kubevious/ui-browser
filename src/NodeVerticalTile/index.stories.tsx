import { Story } from '@storybook/react';
import React from 'react';
import { APP_CONFIG, IMAGE_CONFIG, REPLICA_SET_CONFIG } from '../mock/nodes';
import { NodeVerticalTile } from './';

export default {
    title: 'NodeVerticalTile',
    component: NodeVerticalTile
};

export const Default: Story = () => (

    <div style={{ background: 'grey' }}>

        <div style={{ margin: '1rem' }}>
            <h1>Height 400px</h1>
        </div>

        <div>
            <div style={{ margin: '1rem', height: "400px" }}>
                <NodeVerticalTile config={APP_CONFIG}>
                </NodeVerticalTile>
            </div>

            <div style={{ margin: '1rem', height: "400px" }}>
                <NodeVerticalTile config={REPLICA_SET_CONFIG} isSelected={true}>
                </NodeVerticalTile>
            </div>

            <div style={{ margin: '1rem', height: "400px" }}>
                <NodeVerticalTile config={REPLICA_SET_CONFIG} isHighlighted={true}>
                </NodeVerticalTile>
            </div>

            <div style={{ margin: '1rem', height: "400px" }}>
                <NodeVerticalTile config={IMAGE_CONFIG}>
                </NodeVerticalTile>
            </div>
        </div>

    </div>
);
