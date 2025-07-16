import { type FC, type ReactNode, useEffect } from 'react';
import { FormProvider } from 'react-hook-form';

import { type PlanWizardStepId, stepFieldMap } from '../constants';
import { useStepForm } from '../hooks/useStepForm';
import { useStepValidation } from '../hooks/useStepValidation';

type StepFormWrapperProps = {
  stepId: PlanWizardStepId;
  children: ReactNode;
};

/**
 * Internal wrapper that provides the actual form context for steps with field mappings.
 */
const StepFormWrapperWithFields: FC<StepFormWrapperWithFieldsProps> = ({
  children,
  stepFieldIds,
  stepId,
}) => {
  const { stepForm, validateAndSync } = useStepForm({
    stepFieldIds,
  });
  const { registerStepValidation } = useStepValidation();

  useEffect(() => {
    const cleanup = registerStepValidation(stepId, validateAndSync);
    return cleanup;
  }, [stepId, validateAndSync, registerStepValidation]);

  return <FormProvider {...stepForm}>{children}</FormProvider>;
};

/**
 * Provides isolated form context for wizard steps with automatic validation registration.
 * Only wraps steps that have field mappings; renders children directly for steps without forms.
 */
export const StepFormWrapper: FC<StepFormWrapperProps> = ({ children, stepId }) => {
  const stepFieldIds = stepFieldMap[stepId];

  // If no field mapping exists, render children directly without form wrapper
  if (!stepFieldIds || stepFieldIds.length === 0) {
    return <>{children}</>;
  }

  return (
    <StepFormWrapperWithFields stepFieldIds={stepFieldIds} stepId={stepId}>
      {children}
    </StepFormWrapperWithFields>
  );
};

type StepFormWrapperWithFieldsProps = {
  stepId: PlanWizardStepId;
  stepFieldIds: string[];
  children: ReactNode;
};
