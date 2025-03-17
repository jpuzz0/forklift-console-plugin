import React from 'react';
import { useFormContext } from 'react-hook-form';
import { useHistory } from 'react-router';
import { getResourceUrl } from 'src/modules';
import { useForkliftTranslation } from 'src/utils';

import { PlanModelRef } from '@kubev2v/types';
import { useActiveNamespace } from '@openshift-console/dynamic-plugin-sdk';
import { Button, useWizardContext, WizardFooterWrapper } from '@patternfly/react-core';

import { PlanWizardStepId } from '../constants';

type CreatePlanWizardFooterProps = {
  canSkipToReview?: boolean;
};

export const CreatePlanWizardFooter: React.FC<CreatePlanWizardFooterProps> = ({
  canSkipToReview,
}) => {
  const { t } = useForkliftTranslation();
  const history = useHistory();
  const { trigger } = useFormContext();
  const { activeStep, goToNextStep, goToPrevStep, goToStepById } = useWizardContext();
  const [activeNamespace] = useActiveNamespace();

  const onStepSubmit = async (goToStep: () => void | Promise<void>) => {
    const isValid = await trigger(null, { shouldFocus: true });

    if (isValid) {
      goToStep();
    }
  };

  const onCancel = () => {
    const plansListURL = getResourceUrl({
      reference: PlanModelRef,
      namespace: activeNamespace,
    });

    history.push(plansListURL);
  };

  return (
    <WizardFooterWrapper>
      <Button
        variant="secondary"
        onClick={goToPrevStep}
        isDisabled={activeStep.id === PlanWizardStepId.General}
      >
        {t('Back')}
      </Button>
      <Button variant="primary" onClick={() => onStepSubmit(goToNextStep)}>
        {t('Next')}
      </Button>
      {canSkipToReview && (
        <Button
          variant="tertiary"
          onClick={() => onStepSubmit(() => goToStepById(PlanWizardStepId.ReviewAndCreate))}
        >
          {t('Skip to review')}
        </Button>
      )}
      <Button variant="link" onClick={onCancel}>
        {t('Cancel')}
      </Button>
    </WizardFooterWrapper>
  );
};
