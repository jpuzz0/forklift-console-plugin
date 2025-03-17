import { TFunction } from 'react-i18next';

export enum PlanWizardStepId {
  BasicSetUp = 'basic-set-up',
  General = 'general',
  VirtualMachines = 'virtual-machines',
  NetworkMapping = 'network-mapping',
  StorageMapping = 'storage-mapping',
  MigrationType = 'migration-type',
  AdditionalSetUp = 'additional-set-up',
  OtherSettings = 'other-settings',
  Hooks = 'hooks',
  ReviewAndCreate = 'review-and-create',
}

export const getPlanWizardStepNames = (t: TFunction): Record<PlanWizardStepId, string> => ({
  [PlanWizardStepId.BasicSetUp]: t('Basic set up'),
  [PlanWizardStepId.General]: t('General'),
  [PlanWizardStepId.VirtualMachines]: t('Virtual machines'),
  [PlanWizardStepId.NetworkMapping]: t('Network mapping'),
  [PlanWizardStepId.StorageMapping]: t('Storage mapping'),
  [PlanWizardStepId.MigrationType]: t('Migration type'),
  [PlanWizardStepId.AdditionalSetUp]: t('Additional set up'),
  [PlanWizardStepId.OtherSettings]: t('Other settings (optional)'),
  [PlanWizardStepId.Hooks]: t('Hooks (optional)'),
  [PlanWizardStepId.ReviewAndCreate]: t('Review and create'),
});

export const planStepIndexes = Object.values(PlanWizardStepId).reduce(
  (acc, stepId, index) => ({ ...acc, [stepId]: index + 1 }),
  {},
);

export const defaultCurrentStep = {
  id: PlanWizardStepId.General,
  parentId: PlanWizardStepId.BasicSetUp,
  name: PlanWizardStepId.General,
  index: planStepIndexes[PlanWizardStepId.General],
};

export const warmMigrationLearnMoreLink =
  'https://docs.redhat.com/en/documentation/migration_toolkit_for_virtualization/2.7/html-single/installing_and_using_the_migration_toolkit_for_virtualization/index#warm-migration_mtv';
