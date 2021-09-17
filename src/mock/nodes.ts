import { NodeConfig } from '../types';

import { MARKER_FOO, MARKER_BAR } from './markers';

export const APP_CONFIG : NodeConfig = {
	"rn": "app-[l7-default-backend]",
	"kind": "app",
	"name": "l7-default-backend",
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

export const REPLICA_SET_CONFIG : NodeConfig = {
	"rn": "replicaset-[547598db87]",
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

export const IMAGE_CONFIG : NodeConfig = {
    "rn": "image-[gcr.io/google-samples/microservices-demo/productcatalogservice]",
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