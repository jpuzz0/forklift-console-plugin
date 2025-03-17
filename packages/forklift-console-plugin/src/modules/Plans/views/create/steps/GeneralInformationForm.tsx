import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { useForkliftTranslation } from 'src/utils';

import {
  Form,
  FormGroup,
  FormSection,
  TextInput,
  Title,
  ValidatedOptions,
} from '@patternfly/react-core';

import { FormErrorHelperText } from '../components/FormErrorHelperText';

import { GeneralFormFieldId, getGeneralFormFieldLabels } from './constants';

export const GeneralInformationForm: React.FC = () => {
  const { t } = useForkliftTranslation();
  const {
    control,
    formState: { errors },
  } = useFormContext();
  const fieldLabels = getGeneralFormFieldLabels(t);

  return (
    <Form className="pf-v5-u-w-66">
      <Title headingLevel="h2">{t('General')}</Title>

      <FormSection title={t('Plan information')} titleElement="h3" className="pf-v5-u-mt-0">
        <p>{t('Name your plan and choose the project you would like it to be created in.')}</p>
        <FormGroup
          isRequired
          fieldId={GeneralFormFieldId.PlanName}
          label={fieldLabels[GeneralFormFieldId.PlanName]}
        >
          <Controller
            name={GeneralFormFieldId.PlanName}
            control={control}
            rules={{
              required: t('Plan name is required.'),
            }}
            render={({ field }) => (
              <TextInput
                {...field}
                validated={
                  errors[GeneralFormFieldId.PlanName]
                    ? ValidatedOptions.error
                    : ValidatedOptions.default
                }
              />
            )}
          />

          <FormErrorHelperText error={errors[GeneralFormFieldId.PlanName]} />
        </FormGroup>
      </FormSection>
    </Form>
  );
};
