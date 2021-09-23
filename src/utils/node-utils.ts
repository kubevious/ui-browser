import _ from 'the-lodash'
import { NodeConfig } from "@kubevious/ui-middleware/dist/services/diagram-browser";

export function getNodeConfigFlags(config: NodeConfig) : string[]
{
    if (!config.flags) {
        return [];
    }
    if (_.isArray(config.flags)) {
        return config.flags;
    }
    return _.keys(config.flags);
}

export function getNodeConfigMarkers(config: NodeConfig) : string[]
{
    if (!config.markers) {
        return [];
    }
    if (_.isArray(config.markers)) {
        return config.markers;
    }
    return _.keys(config.markers);
}