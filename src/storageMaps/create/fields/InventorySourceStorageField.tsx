import type { FC } from 'react';
import { Controller, useFormContext, useWatch } from 'react-hook-form';
import type { InventoryStorage } from 'src/modules/Providers/hooks/useStorages';
import { getMapResourceLabel } from 'src/plans/create/steps/utils';
import type { StorageMappingValue } from 'src/storageMaps/types';

import FormGroupWithErrorText from '@components/common/FormGroupWithErrorText';
import Select from '@components/common/Select';
import { SelectList, SelectOption } from '@patternfly/react-core';
import { isEmpty } from '@utils/helpers';
import { useForkliftTranslation } from '@utils/i18n';

import { StorageMapFieldId, type StorageMapping } from '../../constants';
import type { CreateStorageMapFormData } from '../types';

type InventorySourceStorageFieldProps = {
  fieldId: string;
  sourceStorages: InventoryStorage[];
};

const InventorySourceStorageField: FC<InventorySourceStorageFieldProps> = ({
  fieldId,
  sourceStorages,
}) => {
  const {
    control,
    formState: { isSubmitting },
    trigger,
  } = useFormContext<CreateStorageMapFormData>();
  const { t } = useForkliftTranslation();
  const storageMappings = useWatch({ control, name: StorageMapFieldId.StorageMap });

  const storageOptions = sourceStorages.map((storage) => {
    const storageLabel = getMapResourceLabel(storage);
    return {
      id: storage.id,
      name: storageLabel,
    };
  });

  return (
    <FormGroupWithErrorText isRequired fieldId={fieldId}>
      <Controller
        name={fieldId}
        control={control}
        render={({ field }) => {
          const currentValue = field.value as StorageMappingValue;
          const selectedOptionName = currentValue?.name ?? '';

          return (
            <Select
              ref={field.ref}
              id={fieldId}
              isDisabled={isSubmitting}
              value={selectedOptionName}
              onSelect={async (_event, selectedName) => {
                const selectedOption = storageOptions.find(
                  (option) => option.name === selectedName,
                );

                if (selectedOption) {
                  field.onChange(selectedOption);
                  await trigger(StorageMapFieldId.StorageMap);
                }
              }}
              placeholder={t('Select source storage')}
            >
              <SelectList>
                {isEmpty(sourceStorages) ? (
                  <SelectOption key="empty" isDisabled>
                    {t('Select a source provider to list available source storages')}
                  </SelectOption>
                ) : (
                  storageOptions.map((storageOption) => (
                    <SelectOption
                      key={storageOption.id}
                      value={storageOption.name}
                      isDisabled={storageMappings?.some(
                        (mapping: StorageMapping) =>
                          mapping[StorageMapFieldId.SourceStorage].name === storageOption.name,
                      )}
                    >
                      {storageOption.name}
                    </SelectOption>
                  ))
                )}
              </SelectList>
            </Select>
          );
        }}
      />
    </FormGroupWithErrorText>
  );
};

export default InventorySourceStorageField;
