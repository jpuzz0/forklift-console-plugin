import React, { FC } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useForkliftTranslation } from 'src/utils';

import { Form, Title, Wizard, WizardStep, WizardStepType } from '@patternfly/react-core';

import { CreatePlanWizardFooter } from './components/CreatePlanWizardFooter';
import { GeneralInformationForm } from './steps/GeneralInformationForm';
import {
  defaultCurrentStep,
  getPlanWizardStepNames,
  planStepIndexes,
  PlanWizardStepId,
} from './constants';

export const CreatePlanWizard: FC = () => {
  const { t } = useForkliftTranslation();
  const form = useForm({ mode: 'onChange' });
  const [currentStep, setCurrentStep] = React.useState<WizardStepType>(defaultCurrentStep);
  const { formState, getValues } = form;
  const formValues = getValues();
  const stepNames = getPlanWizardStepNames(t);

  const onSubmit = () => console.log('SUBMITTED: ', formValues);

  const isStepDisabled = (stepId: PlanWizardStepId) =>
    currentStep?.index < planStepIndexes[stepId] && Object.keys(formState?.errors).length > 0;

  return (
    <FormProvider {...form}>
      <Wizard
        isVisitRequired
        title={t('Create migration plan')}
        footer={({ id: stepId }) => (
          <CreatePlanWizardFooter canSkipToReview={stepId === PlanWizardStepId.MigrationType} />
        )}
        onStepChange={(_event, currentStep) => setCurrentStep(currentStep)}
      >
        <WizardStep
          name={t(stepNames[PlanWizardStepId.BasicSetUp])}
          id={PlanWizardStepId.BasicSetUp}
          steps={[
            <WizardStep
              key={PlanWizardStepId.General}
              id={PlanWizardStepId.General}
              name={stepNames[PlanWizardStepId.General]}
              isDisabled={isStepDisabled(PlanWizardStepId.General)}
            >
              <GeneralInformationForm />
            </WizardStep>,
            <WizardStep
              key={PlanWizardStepId.VirtualMachines}
              id={PlanWizardStepId.VirtualMachines}
              name={stepNames[PlanWizardStepId.VirtualMachines]}
              isDisabled={isStepDisabled(PlanWizardStepId.VirtualMachines)}
            >
              <Form>
                <Title headingLevel="h2">{t('Virtual machines')}</Title>
              </Form>
            </WizardStep>,
            <WizardStep
              key={PlanWizardStepId.NetworkMapping}
              id={PlanWizardStepId.NetworkMapping}
              name={stepNames[PlanWizardStepId.NetworkMapping]}
              isDisabled={isStepDisabled(PlanWizardStepId.NetworkMapping)}
            >
              <Form>
                <Title headingLevel="h2">{t('Network mappings')}</Title>
              </Form>
            </WizardStep>,
            <WizardStep
              key={PlanWizardStepId.StorageMapping}
              id={PlanWizardStepId.StorageMapping}
              name={stepNames[PlanWizardStepId.StorageMapping]}
              isDisabled={isStepDisabled(PlanWizardStepId.StorageMapping)}
            >
              <Form>
                <Title headingLevel="h2">{t('Storage mappings')}</Title>
              </Form>
            </WizardStep>,
            <WizardStep
              key={PlanWizardStepId.MigrationType}
              id={PlanWizardStepId.MigrationType}
              name={stepNames[PlanWizardStepId.MigrationType]}
              isDisabled={isStepDisabled(PlanWizardStepId.MigrationType)}
            >
              <Form>
                <Title headingLevel="h2">{t('Migration type')}</Title>
              </Form>
            </WizardStep>,
          ]}
        />

        <WizardStep
          name={stepNames[PlanWizardStepId.AdditionalSetUp]}
          id={PlanWizardStepId.AdditionalSetUp}
          steps={[
            <WizardStep
              key={PlanWizardStepId.OtherSettings}
              id={PlanWizardStepId.OtherSettings}
              name={stepNames[PlanWizardStepId.OtherSettings]}
              isDisabled={isStepDisabled(PlanWizardStepId.OtherSettings)}
            >
              <Form>
                <Title headingLevel="h2">{t('Other settings')}</Title>
              </Form>
            </WizardStep>,
            <WizardStep
              key={PlanWizardStepId.Hooks}
              id={PlanWizardStepId.Hooks}
              name={stepNames[PlanWizardStepId.Hooks]}
              isDisabled={isStepDisabled(PlanWizardStepId.Hooks)}
            >
              <Form>
                <Title headingLevel="h2">{t('Hooks')}</Title>
              </Form>
            </WizardStep>,
          ]}
        />

        <WizardStep
          name={stepNames[PlanWizardStepId.ReviewAndCreate]}
          id={PlanWizardStepId.ReviewAndCreate}
          footer={{ nextButtonText: t('Create migration plan'), onNext: onSubmit }}
          isDisabled={isStepDisabled(PlanWizardStepId.ReviewAndCreate)}
        >
          <pre>{JSON.stringify(formValues, null, 2)}</pre>
        </WizardStep>
      </Wizard>
    </FormProvider>
  );
};
