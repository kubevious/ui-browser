import _ from 'the-lodash'
import { Story } from '@storybook/react';
import React, { useState } from 'react';
import { LayerFilters } from './';


export default {
    title: 'LayerFilters',
    component: LayerFilters
};

export const Default: Story = () => (

    <div style={{ background: 'grey', padding: '1rem' }}>
        <div style={{ margin: '1rem' }}>
            <h2>Unrestricted Size</h2>
        </div>

        <div style={{ margin: '1rem', padding: '1rem', background: '#1E1E1E' }}>
            <LayerFilters>

            </LayerFilters>
        </div>

    </div>
);