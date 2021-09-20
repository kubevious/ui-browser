import { BundledNodeConfig } from '@kubevious/helpers/dist/registry-bundle-state';
export interface NodeConfig extends BundledNodeConfig
{
    dn: string;
}