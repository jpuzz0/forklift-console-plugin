import { getObjectRef } from 'src/modules/Providers/views/migrate/reducer/helpers';
import { PROVIDER_TYPES } from 'src/providers/utils/constants';

import {
  StorageMapModel,
  type V1beta1Provider,
  type V1beta1StorageMap,
  type V1beta1StorageMapSpecMap,
} from '@kubev2v/types';
import { k8sCreate } from '@openshift-console/dynamic-plugin-sdk';

import type { StorageMapping } from '../fields/constants';

type CreateStorageMapParams = {
  mappings: StorageMapping[];
  project: string;
  sourceProvider: V1beta1Provider | undefined;
  targetProvider: V1beta1Provider | undefined;
  name?: string;
};

/**
 * Creates a storage map resource
 * Maps source storage to destination storage classes based on provider type
 */
export const createStorageMap = async ({
  mappings,
  name,
  project,
  sourceProvider,
  targetProvider,
}: CreateStorageMapParams) => {
  const sourceProviderName = sourceProvider?.metadata?.name;

  const storageMap: V1beta1StorageMap = {
    apiVersion: 'forklift.konveyor.io/v1beta1',
    kind: 'StorageMap',
    metadata: {
      name,
      ...(!name && sourceProviderName && { generateName: `${sourceProvider?.metadata?.name}-` }),
      namespace: project,
    },
    spec: {
      map: mappings?.reduce((acc: V1beta1StorageMapSpecMap[], { sourceStorage, targetStorage }) => {
        if (sourceStorage.name && targetStorage.name) {
          if (sourceProvider?.spec?.type === PROVIDER_TYPES.openshift) {
            // Special handling for OpenShift source providers
            acc.push({
              destination: { storageClass: targetStorage.name },
              source: {
                id: sourceStorage.id,
                name: targetStorage.name.replace(/^\//gu, ''),
              },
            });
          }

          // Special handling for Glance storage
          if (sourceStorage.name === 'glance') {
            acc.push({
              destination: { storageClass: targetStorage.name },
              source: {
                name: 'glance',
              },
            });
          }

          // Default storage mapping
          acc.push({
            destination: { storageClass: targetStorage.name },
            source: {
              id: sourceStorage.id,
            },
          });
        }

        return acc;
      }, []),
      provider: {
        destination: getObjectRef(targetProvider),
        source: getObjectRef(sourceProvider),
      },
    },
  };

  return k8sCreate({
    data: storageMap,
    model: StorageMapModel,
  });
};
