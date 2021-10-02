
export type SeverityFilterType = null | 'present' | 'not-present';
export type LayerOrderType = 'alph-asc' | 'error-asc' | 'warn-asc';

export interface LayerSearchConfig
{
    searchCriteria?: string;
    errorFilter?: SeverityFilterType;
    warningFilter?: SeverityFilterType;
    
    ordering?: LayerOrderType;
}
