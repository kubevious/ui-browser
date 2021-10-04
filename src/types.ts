
export type SeverityFilterType = null | 'present' | 'not-present';
export type LayerOrderType = 'alph-asc' | 'alph-desc' | 'error-desc' | 'error-asc' | 'warn-desc' | 'warn-asc';

export interface LayerSearchConfig
{
    searchCriteria?: string;
    errorFilter?: SeverityFilterType;
    warningFilter?: SeverityFilterType;
    
    ordering?: LayerOrderType;
}
