export class GeneralStep {
  fillPlanDescription(description) {
    this.planDescriptionField.clear().type(description);
    return this;
  }

  fillPlanName(name) {
    this.planNameField.clear().type(name);
    return this;
  }

  fillRequiredFields(planData = {}) {
    const {
      description = 'Test migration plan created by Cypress',
      name = 'test-migration-plan',
      sourceProvider = 'vmware-provider',
      targetNamespace = 'default',
      targetProvider = 'kubevirt-provider',
    } = planData;

    this.fillPlanName(name);
    this.fillPlanDescription(description);
    this.selectSourceProvider(sourceProvider);
    this.selectTargetProvider(targetProvider);
    this.fillTargetNamespace(targetNamespace);

    return this;
  }

  fillTargetNamespace(namespace) {
    this.targetNamespaceField.clear().type(namespace);
    return this;
  }

  get planDescriptionField() {
    return cy.get(
      '[data-testid="plan-description"], textarea[name="planDescription"], #planDescription',
    );
  }

  // Validation selectors
  get planNameError() {
    return cy.get('[data-testid="plan-name-error"], .pf-c-form__helper-text--error');
  }

  // Selectors
  get planNameField() {
    return cy.get('[data-testid="plan-name"], input[name="planName"], #planName');
  }

  selectSourceProvider(providerName) {
    this.sourceProviderDropdown.click();
    cy.get('.pf-c-dropdown__menu-item, .pf-c-select__menu-item').contains(providerName).click();
    return this;
  }

  selectTargetProvider(providerName) {
    this.targetProviderDropdown.click();
    cy.get('.pf-c-dropdown__menu-item, .pf-c-select__menu-item').contains(providerName).click();
    return this;
  }

  get sourceProviderDropdown() {
    return cy.get('[data-testid="source-provider"], [data-testid="source-provider-dropdown"]');
  }

  get sourceProviderError() {
    return cy.get('[data-testid="source-provider-error"], .pf-c-form__helper-text--error');
  }

  get stepContent() {
    return cy.get('[data-testid="general-step"], .pf-c-wizard__main-body');
  }

  get targetNamespaceField() {
    return cy.get(
      '[data-testid="target-namespace"], input[name="targetNamespace"], #targetNamespace',
    );
  }

  get targetProviderDropdown() {
    return cy.get('[data-testid="target-provider"], [data-testid="target-provider-dropdown"]');
  }

  get targetProviderError() {
    return cy.get('[data-testid="target-provider-error"], .pf-c-form__helper-text--error');
  }

  verifyPlanDescription(expectedDescription) {
    this.planDescriptionField.should('have.value', expectedDescription);
    return this;
  }

  verifyPlanName(expectedName) {
    this.planNameField.should('have.value', expectedName);
    return this;
  }

  verifyRequiredFieldsCompleted() {
    this.planNameField.should('not.have.value', '');
    // Verify dropdowns have selections
    cy.get(
      '[data-testid="source-provider"] .pf-c-dropdown__toggle-text, [data-testid="source-provider"] .pf-c-select__toggle-text',
    ).should('not.be.empty');
    cy.get(
      '[data-testid="target-provider"] .pf-c-dropdown__toggle-text, [data-testid="target-provider"] .pf-c-select__toggle-text',
    ).should('not.be.empty');
    return this;
  }

  verifySourceProvider(expectedProvider) {
    // Verify selected provider is displayed
    cy.get(
      '[data-testid="source-provider"] .pf-c-dropdown__toggle-text, [data-testid="source-provider"] .pf-c-select__toggle-text',
    ).should('contain', expectedProvider);
    return this;
  }

  // Actions
  verifyStepLoaded() {
    this.stepContent.should('be.visible');
    this.planNameField.should('be.visible');
    return this;
  }

  verifyTargetNamespace(expectedNamespace) {
    this.targetNamespaceField.should('have.value', expectedNamespace);
    return this;
  }

  verifyTargetProvider(expectedProvider) {
    // Verify selected provider is displayed
    cy.get(
      '[data-testid="target-provider"] .pf-c-dropdown__toggle-text, [data-testid="target-provider"] .pf-c-select__toggle-text',
    ).should('contain', expectedProvider);
    return this;
  }

  verifyValidationError(fieldName, shouldExist = true) {
    const errorSelector = `[data-testid="${fieldName}-error"], .pf-c-form__helper-text--error`;
    if (shouldExist) {
      cy.get(errorSelector).should('be.visible');
    } else {
      cy.get(errorSelector).should('not.exist');
    }
    return this;
  }
}
