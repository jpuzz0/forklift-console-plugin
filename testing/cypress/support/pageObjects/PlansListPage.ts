export class PlansListPage {
  clickCreatePlan() {
    this.createPlanButton.click();
    return this;
  }

  // Selectors
  get createPlanButton() {
    return cy.get('[data-testid="create-plan-button"], button').contains('Create plan');
  }

  get emptyState() {
    return cy.get('[data-testid="empty-state"], .pf-c-empty-state');
  }

  getPlanByName(planName) {
    return cy.get(`[data-testid="plan-${planName}"], .pf-c-table__tbody tr`).contains(planName);
  }

  get pageTitle() {
    return cy.get('[data-testid="page-title"], h1').contains('Plans');
  }

  get planRows() {
    return cy.get('[data-testid="plan-row"], .pf-c-table__tbody tr');
  }

  get plansTable() {
    return cy.get('[data-testid="plans-table"], .pf-c-table');
  }

  verifyCreateButtonExists() {
    this.createPlanButton.should('be.visible');
    return this;
  }

  verifyPageLoaded() {
    this.pageTitle.should('be.visible');
    return this;
  }

  verifyPlanExists(planName) {
    this.getPlanByName(planName).should('be.visible');
    return this;
  }

  verifyPlansTableExists() {
    // Either table exists or empty state is shown
    cy.get('body').then(($body) => {
      if ($body.find('[data-testid="plans-table"], .pf-c-table').length > 0) {
        this.plansTable.should('be.visible');
      } else {
        this.emptyState.should('be.visible');
      }
    });
    return this;
  }

  // Actions
  visit() {
    cy.visit('/k8s/ns/forklift/forklift.konveyor.io~v1beta1~Plan');
    return this;
  }
}
