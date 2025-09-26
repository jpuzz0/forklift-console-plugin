import type { V1beta1StorageMap, V1beta1StorageMapSpecMap } from '@kubev2v/types';

/**
 * Extended storage map spec with a more flexible offload plugin configuration
 * that allows string values for storageVendorProduct instead of restrictive enum
 */
export type CustomV1beta1StorageMapSpecMap = Omit<V1beta1StorageMapSpecMap, 'offloadPlugin'> & {
  offloadPlugin?: {
    vsphereXcopyConfig?: {
      secretRef?: string;
      storageVendorProduct?: string;
    };
  };
};

/**
 * Extended storage map with custom spec map type that allows flexible storage vendor products
 */
export type CustomV1beta1StorageMap = Omit<V1beta1StorageMap, 'spec'> & {
  spec?: Omit<V1beta1StorageMap['spec'], 'map'> & {
    map?: CustomV1beta1StorageMapSpecMap[];
  };
};
