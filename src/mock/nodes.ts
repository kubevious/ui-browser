import { NodeConfig } from '../types';

import { MARKER_FOO, MARKER_BAR } from './markers';

export const APP_CONFIG : NodeConfig = makeAppConfigNode('l7-default-backend');
export const APP_CONFIG_DN = APP_CONFIG.dn;

export const REPLICA_SET_CONFIG_DN = "root/ns-[hipster]/app-[loadgenerator]/launcher-[Deployment]/replicaset-[547598db87]";
export const REPLICA_SET_CONFIG : NodeConfig = {
	"rn": "replicaset-[547598db87]",
	"dn": REPLICA_SET_CONFIG_DN,
	"kind": "replicaset",
	"name": "547598db87",
	// "flags": {},
	// "order": 100,
	"markers": [],
	"alertCount": {
		"warn": 55,
		"error": 0
	},
	"childrenCount": 0,
	"selfAlertCount": {
		"warn": 0,
		"error": 0
	}
}

export const CONT_CONFIG_DN = "root/ns-[hipster]/app-[productcatalogservice]/cont-[server]";

export const IMAGE_CONFIG_DN = `${CONT_CONFIG_DN}/image-[gcr.io/google-samples/microservices-demo/productcatalogservice]`;
export const IMAGE_CONFIG : NodeConfig = {
    "rn": "image-[gcr.io/google-samples/microservices-demo/productcatalogservice]",
	"dn": IMAGE_CONFIG_DN,
	"kind": "image",
	"name": "gcr.io/google-samples/microservices-demo/productcatalogservice",
	// "flags": {},
	// "order": 100,
	"markers": [],
	"alertCount": {
		"warn": 0,
		"error": 0
	},
	"childrenCount": 0,
	"selfAlertCount": {
		"warn": 0,
		"error": 0
	}
}

export function makeAppConfigNode(name: string) : NodeConfig {

	const rn = `app-[${name}]`;
	const dn = `root/ns-[kube-system]/${rn}`;

	const config : NodeConfig = {
		"rn": rn,
		"dn": dn,
		"kind": "app",
		"name": name,
		// "flags": {},
		// "order": 100,
		"markers": [ MARKER_FOO, MARKER_BAR ],
		"alertCount": {
			"warn": 10,
			"error": 3
		},
		"childrenCount": 2,
		"selfAlertCount": {
			"warn": 0,
			"error": 0
		}
	}

	return config;
}

export const APP_NAMES = [ 
	'equator-variety',
	'salt-usually',
	'importance-becoming',
	'stream-several',
	'goes-fight',
	'salt-practical',
	'also-brief',
	'country-muscle',
	'neighborhood-beyond',
	'grew-pig'
]
export const LARGE_APP_NODE_LIST = APP_NAMES.map(x => makeAppConfigNode(x));
