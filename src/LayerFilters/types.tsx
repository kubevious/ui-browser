import { LayerSearchConfig } from "../types";

export type LayerFiltersConfigChange = (config: LayerSearchConfig) => void;
export interface LayerFiltersProps
{
    config?: LayerSearchConfig;

    onConfigChange?: LayerFiltersConfigChange;
}