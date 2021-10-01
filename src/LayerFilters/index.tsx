import _ from 'the-lodash';
import React, { FC, useEffect, useRef, useState } from 'react';
import { LayerFiltersProps } from './types';
import { MultiSwitch } from '../MultiSwitch';
import { MultiChoiceOption } from '../MultiSwitch/types';

import styles from './styles.module.css';
import cx from 'classnames';

import { Input } from '@kubevious/ui-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { SeverityIcon } from '@kubevious/ui-components';

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


export const LayerFilters: FC<LayerFiltersProps> = ({}) => {

    const [criteria, setCriteria] = useState<string>('');
   
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const input = e.target.value;
        setCriteria(input);
    };

    return <div className={styles.container}>
        <div className={styles.searchInput}>
            <Input
                type="text"
                placeholder="Search"
                value={criteria}
                autoFocus
                onChange={handleChange}
                rightIcon={<FontAwesomeIcon icon={faSearch} size="lg" style={{ top: '15px' }} />}
            />
        </div>

        <MultiSwitch
                items={FILTER_ERROR_MULTI_CHOICE_DATA}
                />

        <MultiSwitch
                items={FILTER_WARNING_MULTI_CHOICE_DATA}
                />
    </div>
}