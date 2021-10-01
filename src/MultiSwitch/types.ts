import { ReactNode } from "react";

export type MultiSwitchChangeHandler = (index: number) => void;

export interface MultiChoiceOption
{
    element: ReactNode;
    tooltip?: string;
}

export interface MultiSwitchProps {
    items: MultiChoiceOption[];
    initialSelection?: number;
    handler?: MultiSwitchChangeHandler;
}
