import { useCallback } from 'react';
import { useFormContext } from 'react-hook-form';

import { type PlanWizardStepId, stepFieldMap } from '../constants';
import type { CreatePlanFormData } from '../types';

type ValidationFunction = () => Promise<boolean>;
type ValidationRegistry = Map<PlanWizardStepId, ValidationFunction>;

// Global registry that tracks validation functions for each step
const validationRegistry: ValidationRegistry = new Map();

/**
 * Manages step validation with isolated step forms and fallback to wizard form validation.
 */
export const useStepValidation = () => {
  const {
    formState: { errors },
  } = useFormContext<CreatePlanFormData>();

  /**
   * Registers a step's validation function in the central registry.
   */
  const registerStepValidation = useCallback(
    (stepId: PlanWizardStepId, validateFn: ValidationFunction) => {
      validationRegistry.set(stepId, validateFn);
      return () => {
        validationRegistry.delete(stepId);
      };
    },
    [],
  );

  /**
   * Validates a specific step using its registered function or fallback to wizard form.
   */
  const validateStep = useCallback(
    async (stepId: PlanWizardStepId): Promise<boolean> => {
      const validateFn = validationRegistry.get(stepId);

      if (validateFn) {
        return validateFn();
      }

      const fieldIds = stepFieldMap[stepId] ?? [];
      if (fieldIds.length === 0) {
        return true;
      }

      return !fieldIds.some((fieldId) => Boolean(errors[fieldId]));
    },
    [errors],
  );

  /**
   * Checks if a step currently has validation errors.
   */
  const hasStepErrors = useCallback(
    (stepId: PlanWizardStepId): boolean => {
      const fieldIds = stepFieldMap[stepId] ?? [];
      return fieldIds.some((fieldId) => Boolean(errors[fieldId]));
    },
    [errors],
  );

  return {
    hasStepErrors,
    registerStepValidation,
    validateStep,
  };
};
