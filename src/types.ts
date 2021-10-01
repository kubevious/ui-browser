
export type SeverityFilterType = null | 'present' | 'not-present';

export interface LayerSearchConfig
{
    searchCriteria?: string;
    errorFilter?: SeverityFilterType;
    warningFilter?: SeverityFilterType;
}
