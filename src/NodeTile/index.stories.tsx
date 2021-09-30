import { Story } from '@storybook/react';
import React from 'react';
import { APP_CONFIG, IMAGE_CONFIG, REPLICA_SET_CONFIG } from '../mock/nodes';
import { NodeTile } from './';

export default {
    title: 'NodeTile',
    component: NodeTile
};

export const Default: Story = () => (

    <div style={{ background: 'grey' }}>

        <div style={{ margin: '1rem' }}>
            <h1>Normal</h1>
        </div>

        <div>
            <div style={{ margin: '1rem' }}>
                <NodeTile config={APP_CONFIG}>
                </NodeTile>
            </div>

            <div style={{ margin: '1rem' }}>
                <NodeTile config={REPLICA_SET_CONFIG} isSelected={true}>
                </NodeTile>
            </div>

            <div style={{ margin: '1rem' }}>
                <NodeTile config={REPLICA_SET_CONFIG} isHighlighted={true}>
                </NodeTile>
            </div>

            <div style={{ margin: '1rem' }}>
                <NodeTile config={IMAGE_CONFIG}>
                </NodeTile>
            </div>
        </div>

        <div style={{ margin: '1rem' }}>
            <h1>Compact</h1>
        </div>

        <div>
            <div style={{ margin: '1rem' }}>
                <NodeTile config={APP_CONFIG} compact>
                </NodeTile>
            </div>

            <div style={{ margin: '1rem' }}>
                <NodeTile config={REPLICA_SET_CONFIG} isSelected={true} compact>
                </NodeTile>
            </div>

            <div style={{ margin: '1rem' }}>
                <NodeTile config={REPLICA_SET_CONFIG} isHighlighted={true} compact>
                </NodeTile>
            </div>

            <div style={{ margin: '1rem' }}>
                <NodeTile config={IMAGE_CONFIG} compact>
                </NodeTile>
            </div>
        </div>


        <div style={{ margin: '1rem' }}>
            <h1>Width 350px</h1>
        </div>

        <div style={{ width: "350px" }}>
            <div style={{ margin: '1rem' }}>
                <NodeTile config={APP_CONFIG}>
                </NodeTile>
            </div>

            <div style={{ margin: '1rem' }}>
                <NodeTile config={REPLICA_SET_CONFIG}>
                </NodeTile>
            </div>

            <div style={{ margin: '1rem' }}>
                <NodeTile config={IMAGE_CONFIG}>
                </NodeTile>
            </div>
        </div>

        <div style={{ margin: '1rem' }}>
            <h1>Compact Width 350px</h1>
        </div>

        <div style={{ width: "350px" }}>
            <div style={{ margin: '1rem' }}>
                <NodeTile config={APP_CONFIG} compact>
                </NodeTile>
            </div>

            <div style={{ margin: '1rem' }}>
                <NodeTile config={REPLICA_SET_CONFIG} compact>
                </NodeTile>
            </div>

            <div style={{ margin: '1rem' }}>
                <NodeTile config={IMAGE_CONFIG} compact>
                </NodeTile>
            </div>
        </div>

    </div>
);
