import _ from 'the-lodash';
import React, { FC, useEffect, useState } from 'react';
import { LayerFiltersProps } from './types';
import { MultiSwitch, MultiChoiceOption } from '@kubevious/ui-components';

import styles from './styles.module.css';

import { Input } from '@kubevious/ui-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { SeverityIcon } from '@kubevious/ui-components';
import { LayerOrderType, SeverityFilterType } from '../types';

const FILTER_ERROR_MULTI_CHOICE_DATA : MultiChoiceOption[] = [
    {
        imageUrl: "/img/browser/power.svg",
        tooltip: "Turn off error filter."
    },
    {
        element: <SeverityIcon severity="error" size={20} />,
        tooltip: "Filter objects with errors."
    },
    {
        imageUrl: "/img/browser/green-tick.svg",
        tooltip: "Filter objects without errors."
    },
];


const FILTER_WARNING_MULTI_CHOICE_DATA : MultiChoiceOption[] = [
    {
        imageUrl: "/img/browser/power.svg",
        tooltip: "Turn off warning filter."
    },
    {
        element: <SeverityIcon severity="warn" size={20} />,
        tooltip: "Filter objects with warnings."
    },
    {
        imageUrl: "/img/browser/green-tick.svg",
        tooltip: "Filter objects without warnings."
    },
];


const ORDERING_CHOICE_DATA : MultiChoiceOption[] = [
    {
        imageUrl: "/img/browser/ordering/order-alph-asc.svg",
        tooltip: "Order alphabetically. Click to change the order direction.",
        alternatives: [{
            imageUrl: "/img/browser/ordering/order-alph-desc.svg",
        }]
    },
    {
        imageUrl: "/img/browser/ordering/order-err-desc.svg",
        tooltip: "Order by errors. Click to change the order direction.",
        alternatives: [{
            imageUrl: "/img/browser/ordering/order-err-asc.svg",
        }]
    },
    {
        imageUrl: "/img/browser/ordering/order-warn-desc.svg",
        tooltip: "Order by warnings. Click to change the order direction.",
        alternatives: [{
            imageUrl: "/img/browser/ordering/order-warn-asc.svg",
        }]
    },
];



export const LayerFilters: FC<LayerFiltersProps> = ({ config, onConfigChange }) => {

    const myConfig = config ?? {};

    const [criteria, setCriteria] = useState<string>(myConfig.searchCriteria || '');
    const [errorFilter, setErrorFilter] = useState<SeverityFilterType>(myConfig.errorFilter || null);
    const [warningFilter, setWarningFilter] = useState<SeverityFilterType>(myConfig.warningFilter || null);
    const [ordering, setOrdering] = useState<LayerOrderType>(myConfig.ordering || 'alph-asc');

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

    const handleOrderChange = (index: number): void => {
        setOrdering(getOrderingSelectionValue(index));
    };

    useEffect(() => {
        if (!onConfigChange) {
            return;
        }

        onConfigChange({
            searchCriteria: criteria,
            errorFilter: errorFilter,
            warningFilter: warningFilter,
            ordering: ordering
        });
    }, [criteria, errorFilter, warningFilter, ordering]);

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

        <div className={styles.separator} />

        <MultiSwitch
                items={ORDERING_CHOICE_DATA}
                initialSelection={getOrderingSelectionIndex(ordering)}
                onSelectedChanged={handleOrderChange}
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


function getOrderingSelectionIndex(value?: LayerOrderType) : number
{
    switch(value) 
    {
        case 'alph-asc': return 0;
        case 'alph-desc': return 1;
        case 'error-desc': return 2;
        case 'error-asc': return 3;
        case 'warn-desc': return 4;
        case 'warn-asc': return 5;
        default: return 0;
    }
}

function getOrderingSelectionValue(index: number) : LayerOrderType
{
    switch(index) 
    {
        case 0: return 'alph-asc';
        case 1: return 'alph-desc';
        case 2: return 'error-desc';
        case 3: return 'error-asc';
        case 4: return 'warn-desc';
        case 5: return 'warn-asc';
        default: throw new Error("Unknown index: " + index);
    }
}
