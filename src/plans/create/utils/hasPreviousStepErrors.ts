import { planStepOrder, type PlanWizardStepId } from '../constants';

/**
 * Checks if any previous steps have validation errors.
 */
export const hasPreviousStepErrors = (
  targetStepId: PlanWizardStepId,
  hasStepErrors: (stepId: PlanWizardStepId) => boolean,
): boolean => {
  const targetStepOrder = planStepOrder[targetStepId];
  const previousSteps = Object.keys(planStepOrder).filter((stepId) => {
    const stepOrder = planStepOrder[stepId as PlanWizardStepId];
    return stepOrder < targetStepOrder;
  });

  return previousSteps.some((stepId) => hasStepErrors(stepId as PlanWizardStepId));
};
