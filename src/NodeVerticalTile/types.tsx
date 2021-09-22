import { NodeConfig } from "@kubevious/ui-middleware/dist/services/diagram-browser";

export interface NodeVerticalTileProps
{
    config: NodeConfig;
    isSelected?: boolean;
    isHighlighted?: boolean;
}