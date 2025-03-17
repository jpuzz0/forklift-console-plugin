import { TFunction } from 'react-i18next';

export enum GeneralFormFieldId {
  PlanName = 'plan-name',
}

export const getGeneralFormFieldLabels = (t: TFunction): Record<GeneralFormFieldId, string> => ({
  [GeneralFormFieldId.PlanName]: t('Plan name'),
});
