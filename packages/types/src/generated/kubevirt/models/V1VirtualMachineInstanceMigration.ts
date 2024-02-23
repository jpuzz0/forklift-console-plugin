/* tslint:disable */
/* eslint-disable */
/**
 * KubeVirt API
 * This is KubeVirt API an add-on for Kubernetes.
 *
 * The version of the OpenAPI document: 1.0.0
 * Contact: kubevirt-dev@googlegroups.com
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import { exists, mapValues } from '../../runtime';
import type { K8sIoApimachineryPkgApisMetaV1ObjectMeta } from './K8sIoApimachineryPkgApisMetaV1ObjectMeta';
import {
    K8sIoApimachineryPkgApisMetaV1ObjectMetaFromJSON,
    K8sIoApimachineryPkgApisMetaV1ObjectMetaFromJSONTyped,
    K8sIoApimachineryPkgApisMetaV1ObjectMetaToJSON,
} from './K8sIoApimachineryPkgApisMetaV1ObjectMeta';
import type { V1VirtualMachineInstanceMigrationSpec } from './V1VirtualMachineInstanceMigrationSpec';
import {
    V1VirtualMachineInstanceMigrationSpecFromJSON,
    V1VirtualMachineInstanceMigrationSpecFromJSONTyped,
    V1VirtualMachineInstanceMigrationSpecToJSON,
} from './V1VirtualMachineInstanceMigrationSpec';
import type { V1VirtualMachineInstanceMigrationStatus } from './V1VirtualMachineInstanceMigrationStatus';
import {
    V1VirtualMachineInstanceMigrationStatusFromJSON,
    V1VirtualMachineInstanceMigrationStatusFromJSONTyped,
    V1VirtualMachineInstanceMigrationStatusToJSON,
} from './V1VirtualMachineInstanceMigrationStatus';

/**
 * VirtualMachineInstanceMigration represents the object tracking a VMI's migration to another host in the cluster
 * @export
 * @interface V1VirtualMachineInstanceMigration
 */
export interface V1VirtualMachineInstanceMigration {
    /**
     * APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources
     * @type {string}
     * @memberof V1VirtualMachineInstanceMigration
     */
    apiVersion?: string;
    /**
     * Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds
     * @type {string}
     * @memberof V1VirtualMachineInstanceMigration
     */
    kind?: string;
    /**
     * 
     * @type {K8sIoApimachineryPkgApisMetaV1ObjectMeta}
     * @memberof V1VirtualMachineInstanceMigration
     */
    metadata?: K8sIoApimachineryPkgApisMetaV1ObjectMeta;
    /**
     * 
     * @type {V1VirtualMachineInstanceMigrationSpec}
     * @memberof V1VirtualMachineInstanceMigration
     */
    spec: V1VirtualMachineInstanceMigrationSpec;
    /**
     * 
     * @type {V1VirtualMachineInstanceMigrationStatus}
     * @memberof V1VirtualMachineInstanceMigration
     */
    status?: V1VirtualMachineInstanceMigrationStatus;
}

/**
 * Check if a given object implements the V1VirtualMachineInstanceMigration interface.
 */
export function instanceOfV1VirtualMachineInstanceMigration(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "spec" in value;

    return isInstance;
}

export function V1VirtualMachineInstanceMigrationFromJSON(json: any): V1VirtualMachineInstanceMigration {
    return V1VirtualMachineInstanceMigrationFromJSONTyped(json, false);
}

export function V1VirtualMachineInstanceMigrationFromJSONTyped(json: any, ignoreDiscriminator: boolean): V1VirtualMachineInstanceMigration {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'apiVersion': !exists(json, 'apiVersion') ? undefined : json['apiVersion'],
        'kind': !exists(json, 'kind') ? undefined : json['kind'],
        'metadata': !exists(json, 'metadata') ? undefined : K8sIoApimachineryPkgApisMetaV1ObjectMetaFromJSON(json['metadata']),
        'spec': V1VirtualMachineInstanceMigrationSpecFromJSON(json['spec']),
        'status': !exists(json, 'status') ? undefined : V1VirtualMachineInstanceMigrationStatusFromJSON(json['status']),
    };
}

export function V1VirtualMachineInstanceMigrationToJSON(value?: V1VirtualMachineInstanceMigration | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'apiVersion': value.apiVersion,
        'kind': value.kind,
        'metadata': K8sIoApimachineryPkgApisMetaV1ObjectMetaToJSON(value.metadata),
        'spec': V1VirtualMachineInstanceMigrationSpecToJSON(value.spec),
        'status': V1VirtualMachineInstanceMigrationStatusToJSON(value.status),
    };
}
