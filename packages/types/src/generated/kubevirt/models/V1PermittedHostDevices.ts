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
import type { V1MediatedHostDevice } from './V1MediatedHostDevice';
import {
    V1MediatedHostDeviceFromJSON,
    V1MediatedHostDeviceFromJSONTyped,
    V1MediatedHostDeviceToJSON,
} from './V1MediatedHostDevice';
import type { V1PciHostDevice } from './V1PciHostDevice';
import {
    V1PciHostDeviceFromJSON,
    V1PciHostDeviceFromJSONTyped,
    V1PciHostDeviceToJSON,
} from './V1PciHostDevice';
import type { V1USBHostDevice } from './V1USBHostDevice';
import {
    V1USBHostDeviceFromJSON,
    V1USBHostDeviceFromJSONTyped,
    V1USBHostDeviceToJSON,
} from './V1USBHostDevice';

/**
 * PermittedHostDevices holds information about devices allowed for passthrough
 * @export
 * @interface V1PermittedHostDevices
 */
export interface V1PermittedHostDevices {
    /**
     * 
     * @type {Array<V1MediatedHostDevice>}
     * @memberof V1PermittedHostDevices
     */
    mediatedDevices?: Array<V1MediatedHostDevice>;
    /**
     * 
     * @type {Array<V1PciHostDevice>}
     * @memberof V1PermittedHostDevices
     */
    pciHostDevices?: Array<V1PciHostDevice>;
    /**
     * 
     * @type {Array<V1USBHostDevice>}
     * @memberof V1PermittedHostDevices
     */
    usb?: Array<V1USBHostDevice>;
}

/**
 * Check if a given object implements the V1PermittedHostDevices interface.
 */
export function instanceOfV1PermittedHostDevices(value: object): boolean {
    let isInstance = true;

    return isInstance;
}

export function V1PermittedHostDevicesFromJSON(json: any): V1PermittedHostDevices {
    return V1PermittedHostDevicesFromJSONTyped(json, false);
}

export function V1PermittedHostDevicesFromJSONTyped(json: any, ignoreDiscriminator: boolean): V1PermittedHostDevices {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'mediatedDevices': !exists(json, 'mediatedDevices') ? undefined : ((json['mediatedDevices'] as Array<any>).map(V1MediatedHostDeviceFromJSON)),
        'pciHostDevices': !exists(json, 'pciHostDevices') ? undefined : ((json['pciHostDevices'] as Array<any>).map(V1PciHostDeviceFromJSON)),
        'usb': !exists(json, 'usb') ? undefined : ((json['usb'] as Array<any>).map(V1USBHostDeviceFromJSON)),
    };
}

export function V1PermittedHostDevicesToJSON(value?: V1PermittedHostDevices | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'mediatedDevices': value.mediatedDevices === undefined ? undefined : ((value.mediatedDevices as Array<any>).map(V1MediatedHostDeviceToJSON)),
        'pciHostDevices': value.pciHostDevices === undefined ? undefined : ((value.pciHostDevices as Array<any>).map(V1PciHostDeviceToJSON)),
        'usb': value.usb === undefined ? undefined : ((value.usb as Array<any>).map(V1USBHostDeviceToJSON)),
    };
}
