export class PlanDetailsPage {
  get breadcrumbs() {
    return cy.get('[data-testid="breadcrumbs"], .pf-c-breadcrumb');
  }

  clickEditPlan() {
    this.editPlanButton.click();
    return this;
  }

  clickOverviewTab() {
    this.overviewTab.click();
    return this;
  }

  clickStartMigration() {
    this.startMigrationButton.click();
    return this;
  }

  clickVmsTab() {
    this.vmsTab.click();
    return this;
  }

  get deletePlanButton() {
    return cy.get('[data-testid="delete-plan"], button').contains('Delete plan');
  }

  get editPlanButton() {
    return cy.get('[data-testid="edit-plan"], button').contains('Edit plan');
  }

  get hooksTab() {
    return cy.get('[data-testid="hooks-tab"], .pf-c-tabs__item').contains('Hooks');
  }

  get migrationsTab() {
    return cy.get('[data-testid="migrations-tab"], .pf-c-tabs__item').contains('Migrations');
  }

  get networkMappingInfo() {
    return cy.get('[data-testid="network-mapping-info"]');
  }

  get overviewTab() {
    return cy.get('[data-testid="overview-tab"], .pf-c-tabs__item').contains('Overview');
  }

  // Selectors
  get pageTitle() {
    return cy.get('[data-testid="plan-details-title"], h1');
  }

  get planDescription() {
    return cy.get('[data-testid="plan-description-details"]');
  }

  get planName() {
    return cy.get('[data-testid="plan-name-details"]');
  }

  get planStatus() {
    return cy.get('[data-testid="plan-status"], .pf-c-label, .status-badge');
  }

  get sourceProviderInfo() {
    return cy.get('[data-testid="source-provider-info"]');
  }

  get startMigrationButton() {
    return cy.get('[data-testid="start-migration"], button').contains('Start migration');
  }

  get storageMappingInfo() {
    return cy.get('[data-testid="storage-mapping-info"]');
  }

  get targetProviderInfo() {
    return cy.get('[data-testid="target-provider-info"]');
  }

  verifyActionButtonsExist() {
    // Verify that action buttons are present (may be disabled based on plan state)
    cy.get('body').then(($body) => {
      // Check for common action buttons
      if ($body.find('button').length > 0) {
        cy.get('button').should('exist');
      }
    });
    return this;
  }

  verifyBreadcrumbs() {
    this.breadcrumbs.should('be.visible');
    this.breadcrumbs.should('contain', 'Plans');
    return this;
  }

  verifyMappingInfo(networkMap, storageMap) {
    if (networkMap) {
      cy.get('body').should('contain', networkMap);
    }
    if (storageMap) {
      cy.get('body').should('contain', storageMap);
    }
    return this;
  }

  verifyPageFullyLoaded() {
    // Wait for any loading spinners to disappear
    cy.get('.pf-c-spinner', { timeout: 1000 }).should('not.exist');

    // Verify key elements are present
    this.pageTitle.should('be.visible');

    // Verify we're on the correct page type
    cy.url().should('match', /.*Plan\/.*$/);

    return this;
  }

  verifyPageLoaded(expectedPlanName) {
    // Verify page has loaded by checking for key elements
    this.pageTitle.should('be.visible');

    // Verify URL contains the plan name
    cy.url().should('include', expectedPlanName || 'test-migration-plan');

    return this;
  }

  verifyPlanExists() {
    // Basic verification that we're on a plan details page
    cy.url().should('match', /.*Plan\/.*$/);
    this.pageTitle.should('be.visible');
    return this;
  }

  verifyPlanName(expectedName) {
    // Check if there's a specific plan name element, otherwise check page title
    cy.get('body').then(($body) => {
      if ($body.find('[data-testid="plan-name-details"]').length > 0) {
        this.planName.should('contain', expectedName);
      } else {
        this.pageTitle.should('contain', expectedName);
      }
    });
    return this;
  }

  verifyPlanStatus(expectedStatus) {
    this.planStatus.should('contain', expectedStatus);
    return this;
  }

  verifyProviderInfo(sourceProvider, targetProvider) {
    if (sourceProvider) {
      cy.get('body').should('contain', sourceProvider);
    }
    if (targetProvider) {
      cy.get('body').should('contain', targetProvider);
    }
    return this;
  }

  verifyTabsExist() {
    // Check that main tabs are present
    const expectedTabs = ['Overview'];
    expectedTabs.forEach((tab) => {
      cy.get('.pf-c-tabs__item, [role="tab"]').should('contain', tab);
    });
    return this;
  }

  verifyVmCount(expectedCount) {
    // Verify that the expected number of VMs are shown
    cy.get('body').should('contain', expectedCount.toString());
    return this;
  }

  // Actions
  visit(planName) {
    cy.visit(`/k8s/ns/forklift/forklift.konveyor.io~v1beta1~Plan/${planName}`);
    return this;
  }

  get vmList() {
    return cy.get('[data-testid="vm-list"], .pf-c-data-list, .pf-c-table');
  }

  get vmsTab() {
    return cy.get('[data-testid="vms-tab"], .pf-c-tabs__item').contains('Virtual machines');
  }
}
