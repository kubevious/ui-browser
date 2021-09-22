import _ from 'the-lodash';
import * as DnUtils from '@kubevious/helpers/dist/dn-utils';
import { LayerInfo, LayerInfoKind } from '../service/types';

export function extractDnLayers(rootDn: string, dn: string, selectedDn: string | null) : LayerInfo[]
{
    const dnParts = DnUtils.parseDn(dn);
    let parentDn : string | null = null;
    let currentDn : string | null = null;

    const layers : LayerInfo[] = [ ];

    let isMyHierarchy = false;
    for(const part of dnParts)
    {
        parentDn = currentDn;

        if (!currentDn) {
            currentDn = part.rn;
        } else {
            currentDn = DnUtils.makeDn(currentDn, part.rn);
        }

        if (isMyHierarchy) {
            layers.push({
                kind: LayerInfoKind.Children,
                parent: parentDn!,
                selectedDn: (selectedDn && (selectedDn === currentDn)) ? currentDn : undefined,
            });
        }

        if (currentDn == rootDn) {
            isMyHierarchy = true;
        }
    }

    for(const layer of _.dropRight(layers, 2))
    {
        layer.kind = LayerInfoKind.Node;
    }

    if (currentDn) {
        layers.push({
            kind: LayerInfoKind.Children,
            parent: currentDn,
            // dn: currentDn
            isGridView: true
        });
    }

    for(let i = 0; i < layers.length - 1; i++)
    {
        const item = layers[i];
        const next = layers[i+1];
        if (!item.selectedDn) {
            item.highlightedDn = next.parent;
        }
    }

    return layers;
}