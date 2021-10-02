import { ReactNode } from "react";

export type MultiSwitchChangeHandler = (index: number) => void;

export interface MultiChoiceOption
{
    element?: ReactNode;
    imageUrl?: string;
    tooltip?: string;
}

export interface MultiSwitchProps {
    items: MultiChoiceOption[];
    initialSelection?: number;
    onSelectedChanged?: MultiSwitchChangeHandler;
}
