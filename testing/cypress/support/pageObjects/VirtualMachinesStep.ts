export class VirtualMachinesStep {
  getVmRowByName(vmName) {
    return cy
      .get(`[data-testid="vm-${vmName}"], .pf-c-table__tbody tr`)
      .contains(vmName)
      .parent('tr');
  }

  get loadingSpinner() {
    return cy.get('[data-testid="loading-vms"], .pf-c-spinner');
  }

  get noVmsMessage() {
    return cy.get('[data-testid="no-vms"], .pf-c-empty-state');
  }

  get searchField() {
    return cy.get(
      '[data-testid="vm-search"], input[placeholder*="Search"], input[placeholder*="Filter"]',
    );
  }

  searchForVm(searchTerm) {
    this.searchField.clear().type(searchTerm);
    return this;
  }

  get selectAllCheckbox() {
    return cy.get('[data-testid="select-all-vms"], .pf-c-table__thead input[type="checkbox"]');
  }

  selectAllVms() {
    this.selectAllCheckbox.check();
    return this;
  }

  get selectedVmCount() {
    return cy.get('[data-testid="selected-vm-count"]');
  }

  selectFirstVm() {
    this.vmRows.first().find('input[type="checkbox"]').check();
    return this;
  }

  selectMultipleVms(vmNames) {
    vmNames.forEach((vmName) => {
      this.selectVmByName(vmName);
    });
    return this;
  }

  selectVmByIndex(index) {
    this.vmRows.eq(index).find('input[type="checkbox"]').check();
    return this;
  }

  selectVmByName(vmName) {
    cy.get(`[data-testid="vm-${vmName}"], .pf-c-table__tbody tr`)
      .contains(vmName)
      .parent('tr')
      .find('input[type="checkbox"]')
      .check();
    return this;
  }

  // Selectors
  get stepContent() {
    return cy.get('[data-testid="vm-step"], .pf-c-wizard__main-body');
  }

  unselectVmByName(vmName) {
    cy.get(`[data-testid="vm-${vmName}"], .pf-c-table__tbody tr`)
      .contains(vmName)
      .parent('tr')
      .find('input[type="checkbox"]')
      .uncheck();
    return this;
  }

  verifyAtLeastOneVmSelected() {
    cy.get('.pf-c-table__tbody input[type="checkbox"]:checked').should('have.length.at.least', 1);
    return this;
  }

  verifyHasVmsToSelect() {
    this.vmRows.should('have.length.at.least', 1);
    return this;
  }

  verifyNoVmsSelected() {
    cy.get('.pf-c-table__tbody input[type="checkbox"]:checked').should('have.length', 0);
    return this;
  }

  verifySelectedCount(expectedCount) {
    // Check if there's a selected count indicator
    cy.get('body').then(($body) => {
      if ($body.find('[data-testid="selected-vm-count"]').length > 0) {
        this.selectedVmCount.should('contain', expectedCount.toString());
      } else {
        // Alternative way to verify - count checked checkboxes
        cy.get('.pf-c-table__tbody input[type="checkbox"]:checked').should(
          'have.length',
          expectedCount,
        );
      }
    });
    return this;
  }

  // Actions
  verifyStepLoaded() {
    this.stepContent.should('be.visible');
    // Wait for VMs to load
    this.loadingSpinner.should('not.exist');
    return this;
  }

  verifyVmDetails(vmName, expectedDetails = {}) {
    const vmRow = this.getVmRowByName(vmName);

    if (expectedDetails.status) {
      vmRow.should('contain', expectedDetails.status);
    }

    if (expectedDetails.cpu) {
      vmRow.should('contain', expectedDetails.cpu);
    }

    if (expectedDetails.memory) {
      vmRow.should('contain', expectedDetails.memory);
    }

    return this;
  }

  verifyVmExists(vmName) {
    cy.get(`[data-testid="vm-${vmName}"], .pf-c-table__tbody tr`)
      .contains(vmName)
      .should('be.visible');
    return this;
  }

  verifyVmSelected(vmName) {
    cy.get(`[data-testid="vm-${vmName}"], .pf-c-table__tbody tr`)
      .contains(vmName)
      .parent('tr')
      .find('input[type="checkbox"]')
      .should('be.checked');
    return this;
  }

  verifyVmTableHeaders() {
    const expectedHeaders = ['Name', 'Status', 'CPU', 'Memory'];
    expectedHeaders.forEach((header) => {
      cy.get('.pf-c-table__thead th').should('contain', header);
    });
    return this;
  }

  verifyVmTableVisible() {
    this.vmTable.should('be.visible');
    return this;
  }

  get vmRows() {
    return cy.get('[data-testid="vm-row"], .pf-c-table__tbody tr');
  }

  get vmTable() {
    return cy.get('[data-testid="vm-table"], .pf-c-table');
  }

  waitForVmsToLoad() {
    // Wait for loading to complete
    this.loadingSpinner.should('not.exist');
    // Ensure we have VMs loaded or see empty state
    cy.get('body').then(($body) => {
      if ($body.find('[data-testid="vm-table"], .pf-c-table').length > 0) {
        this.vmTable.should('be.visible');
      } else {
        this.noVmsMessage.should('be.visible');
      }
    });
    return this;
  }
}
