/* tslint:disable */
/* eslint-disable */
/**
 * Kubernetes
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * The version of the OpenAPI document: unversioned
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import { exists, mapValues } from '../../runtime';
import type { IoK8sApiAutoscalingV2CrossVersionObjectReference } from './IoK8sApiAutoscalingV2CrossVersionObjectReference';
import {
    IoK8sApiAutoscalingV2CrossVersionObjectReferenceFromJSON,
    IoK8sApiAutoscalingV2CrossVersionObjectReferenceFromJSONTyped,
    IoK8sApiAutoscalingV2CrossVersionObjectReferenceToJSON,
} from './IoK8sApiAutoscalingV2CrossVersionObjectReference';
import type { IoK8sApiAutoscalingV2MetricIdentifier } from './IoK8sApiAutoscalingV2MetricIdentifier';
import {
    IoK8sApiAutoscalingV2MetricIdentifierFromJSON,
    IoK8sApiAutoscalingV2MetricIdentifierFromJSONTyped,
    IoK8sApiAutoscalingV2MetricIdentifierToJSON,
} from './IoK8sApiAutoscalingV2MetricIdentifier';
import type { IoK8sApiAutoscalingV2MetricTarget } from './IoK8sApiAutoscalingV2MetricTarget';
import {
    IoK8sApiAutoscalingV2MetricTargetFromJSON,
    IoK8sApiAutoscalingV2MetricTargetFromJSONTyped,
    IoK8sApiAutoscalingV2MetricTargetToJSON,
} from './IoK8sApiAutoscalingV2MetricTarget';

/**
 * ObjectMetricSource indicates how to scale on a metric describing a kubernetes object (for example, hits-per-second on an Ingress object).
 * @export
 * @interface IoK8sApiAutoscalingV2ObjectMetricSource
 */
export interface IoK8sApiAutoscalingV2ObjectMetricSource {
    /**
     * 
     * @type {IoK8sApiAutoscalingV2CrossVersionObjectReference}
     * @memberof IoK8sApiAutoscalingV2ObjectMetricSource
     */
    describedObject: IoK8sApiAutoscalingV2CrossVersionObjectReference;
    /**
     * 
     * @type {IoK8sApiAutoscalingV2MetricIdentifier}
     * @memberof IoK8sApiAutoscalingV2ObjectMetricSource
     */
    metric: IoK8sApiAutoscalingV2MetricIdentifier;
    /**
     * 
     * @type {IoK8sApiAutoscalingV2MetricTarget}
     * @memberof IoK8sApiAutoscalingV2ObjectMetricSource
     */
    target: IoK8sApiAutoscalingV2MetricTarget;
}

/**
 * Check if a given object implements the IoK8sApiAutoscalingV2ObjectMetricSource interface.
 */
export function instanceOfIoK8sApiAutoscalingV2ObjectMetricSource(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "describedObject" in value;
    isInstance = isInstance && "metric" in value;
    isInstance = isInstance && "target" in value;

    return isInstance;
}

export function IoK8sApiAutoscalingV2ObjectMetricSourceFromJSON(json: any): IoK8sApiAutoscalingV2ObjectMetricSource {
    return IoK8sApiAutoscalingV2ObjectMetricSourceFromJSONTyped(json, false);
}

export function IoK8sApiAutoscalingV2ObjectMetricSourceFromJSONTyped(json: any, ignoreDiscriminator: boolean): IoK8sApiAutoscalingV2ObjectMetricSource {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'describedObject': IoK8sApiAutoscalingV2CrossVersionObjectReferenceFromJSON(json['describedObject']),
        'metric': IoK8sApiAutoscalingV2MetricIdentifierFromJSON(json['metric']),
        'target': IoK8sApiAutoscalingV2MetricTargetFromJSON(json['target']),
    };
}

export function IoK8sApiAutoscalingV2ObjectMetricSourceToJSON(value?: IoK8sApiAutoscalingV2ObjectMetricSource | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'describedObject': IoK8sApiAutoscalingV2CrossVersionObjectReferenceToJSON(value.describedObject),
        'metric': IoK8sApiAutoscalingV2MetricIdentifierToJSON(value.metric),
        'target': IoK8sApiAutoscalingV2MetricTargetToJSON(value.target),
    };
}
