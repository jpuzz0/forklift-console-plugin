import { useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';

import type { CreatePlanFormData } from '../types';

import { useCreatePlanFormContext } from './useCreatePlanFormContext';

type UseStepFormProps = {
  stepFieldIds: string[];
};

/**
 * Creates an isolated step form that automatically syncs with the wizard form.
 * Provides step-level validation while maintaining data consistency across the wizard.
 */
export const useStepForm = ({ stepFieldIds }: UseStepFormProps) => {
  const wizardForm = useCreatePlanFormContext();
  const { getValues: getWizardValues, setValue: setWizardValue } = wizardForm;

  const initialValues = stepFieldIds.reduce<Partial<CreatePlanFormData>>((acc, fieldId) => {
    const value = getWizardValues(fieldId);
    if (value !== undefined) {
      acc[fieldId] = value;
    }
    return acc;
  }, {});

  const stepForm = useForm<CreatePlanFormData>({
    defaultValues: initialValues,
    mode: 'onChange',
  });

  const { getValues: getStepValues, watch } = stepForm;

  /**
   * Syncs step form values back to the wizard form.
   */
  const syncToWizard = useCallback(() => {
    const stepValues = getStepValues();
    stepFieldIds.forEach((fieldId) => {
      const stepValue = stepValues[fieldId];
      if (stepValue !== undefined) {
        setWizardValue(fieldId, stepValue, { shouldValidate: false });
      }
    });
  }, [getStepValues, setWizardValue, stepFieldIds]);

  /**
   * Validates the step form and syncs valid data to wizard form.
   */
  const validateAndSync = useCallback(async (): Promise<boolean> => {
    const isValid = await stepForm.trigger();
    if (isValid) {
      syncToWizard();
    }
    return isValid;
  }, [stepForm, syncToWizard]);

  useEffect(() => {
    const subscription = watch(() => {
      syncToWizard();
    });
    return () => {
      subscription.unsubscribe();
    };
  }, [watch, syncToWizard]);

  return {
    stepForm,
    syncToWizard,
    validateAndSync,
    wizardForm,
  };
};
