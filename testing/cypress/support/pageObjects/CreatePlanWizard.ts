export class CreatePlanWizard {
  get backButton() {
    return cy.get('[data-testid="wizard-back"], .pf-c-wizard__footer button').contains('Back');
  }

  get cancelButton() {
    return cy.get('[data-testid="wizard-cancel"], .pf-c-wizard__footer button').contains('Cancel');
  }

  clickBack() {
    this.backButton.should('be.enabled').click();
    return this;
  }

  clickCancel() {
    this.cancelButton.click();
    return this;
  }

  clickCreate() {
    this.createButton.should('be.enabled').click();
    return this;
  }

  clickNext() {
    this.nextButton.should('be.enabled').click();
    return this;
  }

  get createButton() {
    return cy
      .get('[data-testid="wizard-create"], .pf-c-wizard__footer button')
      .contains('Create plan');
  }

  getCurrentStep() {
    return cy.get('.pf-c-wizard__nav-item.pf-m-current .pf-c-wizard__nav-link');
  }

  getStepByName(stepName) {
    return cy.get('.pf-c-wizard__nav-item .pf-c-wizard__nav-link').contains(stepName);
  }

  navigateToStep(stepName) {
    this.getStepByName(stepName).click();
    return this;
  }

  get nextButton() {
    return cy.get('[data-testid="wizard-next"], .pf-c-wizard__footer button').contains('Next');
  }

  verifyCreateButtonEnabled(enabled = true) {
    if (enabled) {
      this.createButton.should('be.enabled');
    } else {
      this.createButton.should('be.disabled');
    }
    return this;
  }

  verifyCurrentStep(stepName) {
    this.getCurrentStep().should('contain', stepName);
    return this;
  }

  verifyNextButtonEnabled(enabled = true) {
    if (enabled) {
      this.nextButton.should('be.enabled');
    } else {
      this.nextButton.should('be.disabled');
    }
    return this;
  }

  // Actions
  verifyWizardOpened() {
    this.wizardContainer.should('be.visible');
    this.wizardTitle.should('be.visible');
    return this;
  }

  waitForStepToLoad(stepName) {
    this.verifyCurrentStep(stepName);
    // Wait for any loading states to complete
    cy.get('[data-testid="loading"], .pf-c-spinner', { timeout: 1000 }).should('not.exist');
    return this;
  }

  // General selectors
  get wizardContainer() {
    return cy.get('[data-testid="create-plan-wizard"], .pf-c-wizard');
  }

  // Navigation
  get wizardNav() {
    return cy.get('[data-testid="wizard-nav"], .pf-c-wizard__nav');
  }

  get wizardTitle() {
    return cy
      .get('[data-testid="wizard-title"], .pf-c-wizard__title')
      .contains('Create migration plan');
  }
}
