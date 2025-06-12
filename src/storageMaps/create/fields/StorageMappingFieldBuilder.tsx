import type { FC } from 'react';
import { type FieldPath, useFieldArray, useFormContext, useWatch } from 'react-hook-form';
import { useSourceStorages } from 'src/modules/Providers/hooks/useStorages';
import { PROVIDER_TYPES } from 'src/providers/utils/constants';

import FieldBuilderTable from '@components/FieldBuilderTable/FieldBuilderTable';
import { isEmpty } from '@utils/helpers';
import useTargetStorages from '@utils/hooks/useTargetStorages';
import { useForkliftTranslation } from '@utils/i18n';

import OffloadStorageIndexedForm from '../OffloadStorageIndexedForm';
import type { CreateStorageMapFormData } from '../types';

import {
  CreateStorageMapFieldId,
  createStorageMapFieldLabels,
  defaultStorageMapping,
} from './constants';
import SourceStorageField from './SourceStorageField';
import TargetStorageField from './TargetStorageField';
import { getCreateStorageMapFieldId, validateStorageMaps } from './utils';

const StorageMappingFieldBuilder: FC = () => {
  const { t } = useForkliftTranslation();
  const {
    control,
    formState: { isSubmitting },
    setValue,
  } = useFormContext<CreateStorageMapFormData>();
  const [project, sourceProvider, targetProvider] = useWatch({
    control,
    name: [
      CreateStorageMapFieldId.Project,
      CreateStorageMapFieldId.SourceProvider,
      CreateStorageMapFieldId.TargetProvider,
    ],
  });

  const {
    append,
    fields: storageMappingFields,
    remove,
  } = useFieldArray({
    control,
    name: CreateStorageMapFieldId.StorageMap,
    rules: {
      validate: (values) => validateStorageMaps(values),
    },
  });

  const [sourceStorages, sourceStoragesLoading, sourceStoragesError] =
    useSourceStorages(sourceProvider);
  const [targetStorages, _targetStoragesLoading, targetStoragesError] = useTargetStorages(
    targetProvider,
    project,
  );
  const loadError = sourceStoragesError ?? targetStoragesError;

  return (
    <FieldBuilderTable
      headers={[
        { label: createStorageMapFieldLabels[CreateStorageMapFieldId.SourceStorage], width: 45 },
        { label: createStorageMapFieldLabels[CreateStorageMapFieldId.TargetStorage], width: 45 },
      ]}
      fieldRows={storageMappingFields.map((field, index) => ({
        ...field,
        ...(sourceProvider?.spec?.type === PROVIDER_TYPES.vsphere && {
          additionalOptions: <OffloadStorageIndexedForm index={index} />,
        }),
        inputs: [
          <SourceStorageField
            fieldId={getCreateStorageMapFieldId(CreateStorageMapFieldId.SourceStorage, index)}
            sourceStorages={sourceStorages}
          />,
          <TargetStorageField
            fieldId={getCreateStorageMapFieldId(CreateStorageMapFieldId.TargetStorage, index)}
            targetStorages={targetStorages}
          />,
        ],
      }))}
      addButton={{
        isDisabled:
          isEmpty([...sourceStorages, ...targetStorages]) ||
          sourceStorages.length === storageMappingFields.length ||
          sourceStoragesLoading ||
          isSubmitting ||
          Boolean(loadError),
        label: t('Add mapping'),
        onClick: () => {
          append(defaultStorageMapping);
        },
      }}
      removeButton={{
        isDisabled: isSubmitting,
        onClick: (index) => {
          if (storageMappingFields.length > 1) {
            remove(index);
            return;
          }

          setValue<FieldPath<CreateStorageMapFormData>>(
            getCreateStorageMapFieldId(CreateStorageMapFieldId.SourceStorage, index),
            defaultStorageMapping[CreateStorageMapFieldId.SourceStorage],
            { shouldValidate: true },
          );

          setValue<FieldPath<CreateStorageMapFormData>>(
            getCreateStorageMapFieldId(CreateStorageMapFieldId.TargetStorage, index),
            {
              name: defaultStorageMapping[CreateStorageMapFieldId.TargetStorage].name,
            },
            { shouldValidate: true },
          );
        },
      }}
    />
  );
};

export default StorageMappingFieldBuilder;
