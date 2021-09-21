import { LayerInfo } from "../service/types"

export interface IDiagramSource
{
    close();

    applyLayers(layers: LayerInfo[])
}