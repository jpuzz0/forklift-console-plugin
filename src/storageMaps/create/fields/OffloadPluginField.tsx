import type { FC } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import MtvSelect from '@components/common/MtvSelect';
import { FormGroup } from '@patternfly/react-core';
import { useForkliftTranslation } from '@utils/i18n';

import type { CreateStorageMapFormData } from '../types';

import {
  CreateStorageMapFieldId,
  createStorageMapFieldLabels,
  offloadPluginLabels,
  offloadPlugins,
} from './constants';

type OffloadPluginFieldProps = { fieldId: string };

const OffloadPluginField: FC<OffloadPluginFieldProps> = ({ fieldId }) => {
  const { t } = useForkliftTranslation();
  const {
    control,
    formState: { isSubmitting },
  } = useFormContext<CreateStorageMapFormData>();

  const options = offloadPlugins.map((plugin) => ({
    label: offloadPluginLabels[plugin],
    value: plugin,
  }));

  return (
    <FormGroup
      fieldId={fieldId}
      label={createStorageMapFieldLabels[CreateStorageMapFieldId.OffloadPlugin]}
    >
      <Controller
        name={fieldId}
        control={control}
        render={({ field }) => (
          <MtvSelect
            id={fieldId}
            isDisabled={isSubmitting}
            value={field.value}
            options={options}
            onSelect={(_event, value) => {
              field.onChange(value);
            }}
            placeholder={t('Select offload plugin')}
          />
        )}
      />
    </FormGroup>
  );
};

export default OffloadPluginField;
