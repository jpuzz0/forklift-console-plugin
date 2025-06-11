import type { FieldValues } from 'react-hook-form';

import type { V1beta1Provider } from '@kubev2v/types';

import type { CreateStorageMapFieldId, StorageMapping } from './fields/constants';

export type CreateStorageMapFormData = FieldValues & {
  [CreateStorageMapFieldId.MapName]: string;
  [CreateStorageMapFieldId.Project]: string;
  [CreateStorageMapFieldId.SourceProvider]: V1beta1Provider | undefined;
  [CreateStorageMapFieldId.TargetProvider]: V1beta1Provider | undefined;
  [CreateStorageMapFieldId.StorageMap]: StorageMapping[];
};
