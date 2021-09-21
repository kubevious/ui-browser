import * as DnUtils from '@kubevious/helpers/dist/dn-utils';
import { LayerInfo } from '../DiagramLayer/types';

export function extractDnLayers(rootDn: string, dn: string) : LayerInfo[]
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
                kind: 'children',
                parent: parentDn,
                selectedDn: (currentDn === dn) ? dn : undefined,
            });
        }

        if (currentDn == rootDn) {
            isMyHierarchy = true;
        }
    }

    if (currentDn) {
        layers.push({
            kind: 'children',
            parent: currentDn,
            // dn: currentDn
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