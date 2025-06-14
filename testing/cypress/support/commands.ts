import '@testing-library/cypress/add-commands';

// Command to wait for API requests to complete
Cypress.Commands.add('waitForApiRequests', () => {
  cy.intercept('GET', '**/api/**').as('apiRequests');
  cy.wait('@apiRequests', { timeout: 10000 });
});

// Command to mock authentication state
Cypress.Commands.add('mockAuth', () => {
  cy.window().then((win) => {
    // Mock OpenShift console authentication
    win.SERVER_FLAGS = {
      authDisabled: false,
      basePath: '/',
      kubeAPIServerURL: 'https://api.test.com:6443',
      logoutURL: '/logout',
      requestTokenURL: '/oauth/token/request',
    };

    // Mock user authentication state
    win.loadUser = async () =>
      Promise.resolve({
        kind: 'User',
        metadata: { name: 'test-user' },
      });
  });
});

// Command to select from PatternFly dropdown
Cypress.Commands.add('selectFromDropdown', (selector, optionText) => {
  cy.get(selector).click();
  cy.get('.pf-c-dropdown__menu').should('be.visible');
  cy.get('.pf-c-dropdown__menu-item').contains(optionText).click();
});

// Command to fill PatternFly form field
Cypress.Commands.add('fillFormField', (fieldName, value) => {
  cy.get(`[data-testid="${fieldName}"], input[name="${fieldName}"], #${fieldName}`)
    .clear()
    .type(value);
});

// Command to click PatternFly button
Cypress.Commands.add('clickButton', (buttonText) => {
  cy.get('button').contains(buttonText).click();
});

// Command to verify form validation error
Cypress.Commands.add('verifyValidationError', (fieldName, errorMessage) => {
  cy.get(`[data-testid="${fieldName}-error"], .pf-c-form__helper-text--error`).should(
    'contain',
    errorMessage,
  );
});

// Command to verify step is active in wizard
Cypress.Commands.add('verifyWizardStep', (stepName) => {
  cy.get('.pf-c-wizard__nav-item.pf-m-current').should('contain', stepName);
});
