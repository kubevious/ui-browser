import { ReactNode } from "react";

export type MultiSwitchChangeHandler = (index: number, layerIndex: number, subIndex: number) => void;

export interface OptionItem
{
    element?: ReactNode;
    imageUrl?: string;
    tooltip?: string;
}

export interface MultiChoiceOption extends OptionItem
{
    alternatives?: OptionItem[];
}

export interface MultiSwitchProps {
    items: MultiChoiceOption[];
    initialSelection?: number;
    onSelectedChanged?: MultiSwitchChangeHandler;
}
