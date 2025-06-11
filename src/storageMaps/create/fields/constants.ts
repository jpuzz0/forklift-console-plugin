import { t } from '@utils/i18n';

import type { MappingValue } from './types';

export enum CreateStorageMapFieldId {
  MapName = 'mapName',
  Project = 'project',
  StorageMap = 'storageMap',
  SourceProvider = 'sourceProvider',
  TargetProvider = 'targetProvider',
  SourceStorage = 'sourceStorage',
  TargetStorage = 'targetStorage',
}

export type StorageMapping = {
  [CreateStorageMapFieldId.SourceStorage]: MappingValue;
  [CreateStorageMapFieldId.TargetStorage]: MappingValue;
};

export const defaultStorageMapping: StorageMapping = {
  [CreateStorageMapFieldId.SourceStorage]: { name: '' },
  [CreateStorageMapFieldId.TargetStorage]: { name: '' },
};

export const createStorageMapFieldLabels: Partial<
  Record<CreateStorageMapFieldId, ReturnType<typeof t>>
> = {
  [CreateStorageMapFieldId.MapName]: t('Map name'),
  [CreateStorageMapFieldId.Project]: t('Project'),
  [CreateStorageMapFieldId.SourceProvider]: t('Source provider'),
  [CreateStorageMapFieldId.SourceStorage]: t('Source Storage'),
  [CreateStorageMapFieldId.TargetProvider]: t('Target provider'),
  [CreateStorageMapFieldId.TargetStorage]: t('Target Storage'),
};
