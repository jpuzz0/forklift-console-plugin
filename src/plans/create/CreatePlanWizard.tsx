import { type FC, useState } from 'react';
import { FormProvider, useWatch } from 'react-hook-form';
import { type Location, useLocation, useNavigate } from 'react-router-dom-v5-compat';

import type { V1beta1Provider } from '@kubev2v/types';
import { Wizard, type WizardProps, WizardStep, type WizardStepType } from '@patternfly/react-core';
import { FEATURE_NAMES } from '@utils/constants';
import { useFeatureFlags } from '@utils/hooks/useFeatureFlags';
import { useForkliftTranslation } from '@utils/i18n';

import { StepFormWrapper } from './components/StepFormWrapper';
import { useCreatePlanForm } from './hooks/useCreatePlanForm';
import { useStepValidation } from './hooks/useStepValidation';
import { GeneralFormFieldId } from './steps/general-information/constants';
import GeneralInformationStep from './steps/general-information/GeneralInformationStep';
import HooksStep from './steps/migration-hooks/HooksStep';
import MigrationTypeStep from './steps/migration-type/MigrationTypeStep';
import NetworkMapStep from './steps/network-map/NetworkMapStep';
import OtherSettingsStep from './steps/other-settings/OtherSettingsStep';
import ReviewStep from './steps/review/ReviewStep';
import StorageMapStep from './steps/storage-map/StorageMapStep';
import VirtualMachinesStep from './steps/virtual-machines/VirtualMachinesStep';
import VirtualMachinesStepFooter from './steps/virtual-machines/VirtualMachinesStepFooter';
import { getCreatedPlanPath } from './utils/getCreatedPlanPath';
import { getDefaultFormValues } from './utils/getDefaultFormValues';
import { hasLiveMigrationProviderType } from './utils/hasLiveMigrationProviderType';
import { hasPreviousStepErrors } from './utils/hasPreviousStepErrors';
import { hasWarmMigrationProviderType } from './utils/hasWarmMigrationProviderType';
import { submitMigrationPlan } from './utils/submitMigrationPlan';
import { firstStep, planStepNames, planStepOrder, PlanWizardStepId } from './constants';
import CreatePlanWizardContextProvider from './CreatePlanWizardContextProvider';
import CreatePlanWizardFooter from './CreatePlanWizardFooter';
import type { CreatePlanFormData } from './types';

import './CreatePlanWizard.style.scss';

type CreatePlanWizardInnerProps = {
  onSubmit: () => Promise<void>;
  isLiveMigrationEnabled: boolean;
  sourceProvider: V1beta1Provider | undefined;
  isSubmitting: boolean;
};

/**
 * Wizard steps component that handles step navigation and validation orchestration.
 * Allows backward navigation freely but requires validation for forward navigation.
 */
const CreatePlanWizardInner: FC<CreatePlanWizardInnerProps> = ({
  isLiveMigrationEnabled,
  isSubmitting,
  onSubmit,
  sourceProvider,
}) => {
  const { t } = useForkliftTranslation();
  const [currentStep, setCurrentStep] = useState<WizardStepType>(firstStep);
  const [createPlanError, setCreatePlanError] = useState<Error | undefined>();
  const { hasStepErrors, validateStep } = useStepValidation();

  const hasCreatePlanError = Boolean(createPlanError?.message);

  const handleStepChange: WizardProps['onStepChange'] = async (_event, newStep) => {
    const currentStepId = currentStep.id as PlanWizardStepId;
    const newStepId = newStep.id as PlanWizardStepId;
    const newStepOrder = planStepOrder[newStepId];
    const currentStepOrder = planStepOrder[currentStepId];

    if (newStepOrder <= currentStepOrder) {
      setCurrentStep(newStep);
      return;
    }

    try {
      const isCurrentStepValid = await validateStep(currentStepId);
      if (isCurrentStepValid) {
        setCurrentStep(newStep);
      }
    } catch {
      // Stay on current step if validation throws an error
    }
  };

  const handleSubmit = async () => {
    setCreatePlanError(undefined);
    try {
      await onSubmit();
    } catch (error) {
      setCreatePlanError(error as Error);
    }
  };

  const getStepProps = (id: PlanWizardStepId) => ({
    id,
    isDisabled:
      isSubmitting ||
      hasCreatePlanError ||
      (planStepOrder[id] > planStepOrder[currentStep.id as PlanWizardStepId] &&
        hasPreviousStepErrors(id, hasStepErrors)),
    name: planStepNames[id],
    ...((isSubmitting || hasCreatePlanError) && { body: null }),
  });

  return (
    <Wizard
      data-testid="create-plan-wizard"
      isVisitRequired
      footer={<CreatePlanWizardFooter />}
      onStepChange={handleStepChange}
      className="create-plan-wizard"
    >
      <WizardStep
        {...getStepProps(PlanWizardStepId.BasicSetup)}
        steps={[
          <WizardStep key={PlanWizardStepId.General} {...getStepProps(PlanWizardStepId.General)}>
            <StepFormWrapper stepId={PlanWizardStepId.General}>
              <GeneralInformationStep />
            </StepFormWrapper>
          </WizardStep>,
          <WizardStep
            key={PlanWizardStepId.VirtualMachines}
            footer={<VirtualMachinesStepFooter />}
            {...getStepProps(PlanWizardStepId.VirtualMachines)}
          >
            <StepFormWrapper stepId={PlanWizardStepId.VirtualMachines}>
              <VirtualMachinesStep />
            </StepFormWrapper>
          </WizardStep>,
          <WizardStep
            key={PlanWizardStepId.NetworkMap}
            {...getStepProps(PlanWizardStepId.NetworkMap)}
          >
            <StepFormWrapper stepId={PlanWizardStepId.NetworkMap}>
              <NetworkMapStep />
            </StepFormWrapper>
          </WizardStep>,
          <WizardStep
            key={PlanWizardStepId.StorageMap}
            {...getStepProps(PlanWizardStepId.StorageMap)}
          >
            <StepFormWrapper stepId={PlanWizardStepId.StorageMap}>
              <StorageMapStep />
            </StepFormWrapper>
          </WizardStep>,
          <WizardStep
            key={PlanWizardStepId.MigrationType}
            {...getStepProps(PlanWizardStepId.MigrationType)}
            isHidden={
              !hasWarmMigrationProviderType(sourceProvider) &&
              (!hasLiveMigrationProviderType(sourceProvider) || !isLiveMigrationEnabled)
            }
          >
            <StepFormWrapper stepId={PlanWizardStepId.MigrationType}>
              <MigrationTypeStep />
            </StepFormWrapper>
          </WizardStep>,
        ]}
      />

      <WizardStep
        {...getStepProps(PlanWizardStepId.AdditionalSetup)}
        steps={[
          <WizardStep
            key={PlanWizardStepId.OtherSettings}
            {...getStepProps(PlanWizardStepId.OtherSettings)}
          >
            <StepFormWrapper stepId={PlanWizardStepId.OtherSettings}>
              <OtherSettingsStep />
            </StepFormWrapper>
          </WizardStep>,
          <WizardStep key={PlanWizardStepId.Hooks} {...getStepProps(PlanWizardStepId.Hooks)}>
            <StepFormWrapper stepId={PlanWizardStepId.Hooks}>
              <HooksStep />
            </StepFormWrapper>
          </WizardStep>,
        ]}
      />

      <WizardStep
        footer={
          <CreatePlanWizardFooter
            nextButtonText={t('Create plan')}
            onNext={handleSubmit}
            hasError={hasCreatePlanError}
          />
        }
        {...getStepProps(PlanWizardStepId.ReviewAndCreate)}
      >
        <ReviewStep
          error={createPlanError}
          onBackToReviewClick={() => {
            setCreatePlanError(undefined);
          }}
        />
      </WizardStep>
    </Wizard>
  );
};

/**
 * Main wizard component that sets up the wizard form and provides context.
 * Uses isolated step forms that sync to the wizard form for data consistency.
 */
const CreatePlanWizard: FC = () => {
  const navigate = useNavigate();
  const location: Location<CreatePlanFormData> = useLocation();
  const { isFeatureEnabled } = useFeatureFlags();

  const isLiveMigrationEnabled = isFeatureEnabled(FEATURE_NAMES.OCP_LIVE_MIGRATION);
  const defaultValues = getDefaultFormValues(location.state);

  const form = useCreatePlanForm({
    defaultValues,
    mode: 'onChange',
  });

  const {
    control,
    formState: { isSubmitting },
    getValues,
    handleSubmit,
  } = form;

  const [planName, planProject, sourceProvider] = useWatch({
    control,
    name: [
      GeneralFormFieldId.PlanName,
      GeneralFormFieldId.PlanProject,
      GeneralFormFieldId.SourceProvider,
    ],
  });

  const onSubmit = async () => {
    const formData = getValues();
    await submitMigrationPlan(formData);
    navigate(getCreatedPlanPath(planName, planProject));
  };

  return (
    <FormProvider {...form}>
      <CreatePlanWizardContextProvider>
        <CreatePlanWizardInner
          onSubmit={handleSubmit(onSubmit)}
          isLiveMigrationEnabled={isLiveMigrationEnabled}
          sourceProvider={sourceProvider}
          isSubmitting={isSubmitting}
        />
      </CreatePlanWizardContextProvider>
    </FormProvider>
  );
};

export default CreatePlanWizard;
