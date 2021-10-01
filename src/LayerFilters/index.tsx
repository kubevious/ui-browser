import _ from 'the-lodash';
import React, { FC, useEffect, useState } from 'react';
import { LayerFiltersProps } from './types';
import { MultiSwitch } from '../MultiSwitch';
import { MultiChoiceOption } from '../MultiSwitch/types';

import styles from './styles.module.css';

import { Input } from '@kubevious/ui-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { SeverityIcon } from '@kubevious/ui-components';
import { SeverityFilterType } from '../types';

const FILTER_ERROR_MULTI_CHOICE_DATA : MultiChoiceOption[] = [
    {
        element: <img src="/img/browser/power.svg"></img>,
        tooltip: "Turn off error filter."
    },
    {
        element: <SeverityIcon severity="error" />,
        tooltip: "Filter objects with errors."
    },
    {
        element: <img src="/img/browser/green-tick.svg"></img>,
        tooltip: "Filter objects without errors."
    },
];


const FILTER_WARNING_MULTI_CHOICE_DATA : MultiChoiceOption[] = [
    {
        element: <img src="/img/browser/power.svg"></img>,
        tooltip: "Turn off warning filter."
    },
    {
        element: <SeverityIcon severity="warn" />,
        tooltip: "Filter objects with warnings."
    },
    {
        element: <img src="/img/browser/green-tick.svg"></img>,
        tooltip: "Filter objects without warnings."
    },
];


export const LayerFilters: FC<LayerFiltersProps> = ({ config, onConfigChange }) => {

    const myConfig = config ?? {};

    const [criteria, setCriteria] = useState<string>(myConfig.searchCriteria || '');
    const [errorFilter, setErrorFilter] = useState<SeverityFilterType>(myConfig.errorFilter || null);
    const [warningFilter, setWarningFilter] = useState<SeverityFilterType>(myConfig.warningFilter || null);

    const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const input = e.target.value;
        setCriteria(input);
    };

    const handleErrorFilterChange = (index: number): void => {
        setErrorFilter(getSeveritySelectionValue(index));
    };

    const handleWarningFilterChange = (index: number): void => {
        setWarningFilter(getSeveritySelectionValue(index));
    };

    useEffect(() => {
        if (!onConfigChange) {
            return;
        }

        onConfigChange({
            searchCriteria: criteria,
            errorFilter: errorFilter,
            warningFilter: warningFilter,
        });
    }, [criteria, errorFilter, warningFilter]);

    return <div className={styles.container}>
        <div className={styles.searchInput}>
            <Input
                type="text"
                placeholder="Search"
                value={criteria}
                autoFocus
                onChange={handleSearchInputChange}
                rightIcon={<FontAwesomeIcon icon={faSearch} size="lg" style={{ top: '15px' }} />}
            />
        </div>

        <MultiSwitch
                items={FILTER_ERROR_MULTI_CHOICE_DATA}
                initialSelection={getSeveritySelectionIndex(errorFilter)}
                onSelectedChanged={handleErrorFilterChange}
                />

        <MultiSwitch
                items={FILTER_WARNING_MULTI_CHOICE_DATA}
                initialSelection={getSeveritySelectionIndex(warningFilter)}
                onSelectedChanged={handleWarningFilterChange}
                />
    </div>
}

function getSeveritySelectionIndex(value?: SeverityFilterType) : number
{
    switch(value) 
    {
        case 'present': return 1;
        case 'not-present': return 2;
        default: return 0;
    }
}

function getSeveritySelectionValue(index: number) : SeverityFilterType
{
    switch(index) 
    {
        case 1: return 'present';
        case 2: return 'not-present';
        default: return null;
    }
}