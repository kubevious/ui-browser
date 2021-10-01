import _ from 'the-lodash'
import { Story } from '@storybook/react';
import React, { useState } from 'react';
import { LayerFilters } from './';
import { LayerSearchConfig } from '../types';


export default {
    title: 'LayerFilters',
    component: LayerFilters
};

export const Default: Story = () => {

    const [currentConfig, setCurrentConfig] = useState<LayerSearchConfig>({});

    return (
        <div style={{ background: 'grey', padding: '1rem' }}>
            <div style={{ margin: '1rem' }}>
                <h2>Unrestricted Size</h2>
            </div>

            <div style={{ margin: '1rem', padding: '1rem', background: '#1E1E1E' }}>
                <LayerFilters>

                </LayerFilters>
            </div>

            <div style={{ margin: '1rem', padding: '1rem', background: '#1E1E1E' }}>
                <LayerFilters config={{ searchCriteria: 'test-1234', errorFilter: 'present', warningFilter: 'not-present'}}
                              onConfigChange={(config) => setCurrentConfig(config)}  >
                </LayerFilters>

                <div style={{ margin: '1rem', padding: '1rem', background: '#AAAAAA' }}>
                    <pre>
                        {JSON.stringify(currentConfig, null, 4)}
                    </pre>
                </div>
            </div>
        </div>
    );
}