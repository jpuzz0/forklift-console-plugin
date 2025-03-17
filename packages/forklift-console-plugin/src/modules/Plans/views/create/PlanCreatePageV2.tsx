import React, { FC } from 'react';

import { PageSection, Title } from '@patternfly/react-core';

import { CreatePlanWizard } from './CreatePlanWizard';

import './PlanCreatePage.style.css';

export const PlanCreatePageV2: FC = () => (
  <>
    <PageSection variant="light">
      <Title headingLevel="h2">{'Create migration plan'}</Title>
    </PageSection>
    <PageSection
      hasOverflowScroll={true}
      variant="light"
      className="forklift--create-plan--wizard-container"
    >
      <CreatePlanWizard />
    </PageSection>
  </>
);

export default PlanCreatePageV2;
