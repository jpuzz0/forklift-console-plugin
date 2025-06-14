export class NetworkMapStep {
  clickCreateNewMap() {
    this.createNewMapButton.click();
    return this;
  }

  get createNewMapButton() {
    return cy.get('[data-testid="create-network-map"], button').contains('Create new');
  }

  get networkMapDropdown() {
    return cy.get('[data-testid="network-map-dropdown"], [data-testid="network-map-select"]');
  }

  get networkMapError() {
    return cy.get('[data-testid="network-map-error"], .pf-c-form__helper-text--error');
  }

  get networkMappingTable() {
    return cy.get('[data-testid="network-mapping-table"], .pf-c-table');
  }

  get noNetworkMapMessage() {
    return cy.get('[data-testid="no-network-map"], .pf-c-empty-state');
  }

  get selectedNetworkMapName() {
    return cy.get('[data-testid="selected-network-map-name"]');
  }

  selectFirstAvailableNetworkMap() {
    this.networkMapDropdown.click();
    cy.get('.pf-c-dropdown__menu-item, .pf-c-select__menu-item').first().click();
    return this;
  }

  selectNetworkMap(mapName) {
    this.networkMapDropdown.click();
    cy.get('.pf-c-dropdown__menu-item, .pf-c-select__menu-item').contains(mapName).click();
    return this;
  }

  // Selectors
  get stepContent() {
    return cy.get('[data-testid="network-step"], .pf-c-wizard__main-body');
  }

  verifyHasNetworkMapsAvailable() {
    this.networkMapDropdown.click();
    cy.get('.pf-c-dropdown__menu-item, .pf-c-select__menu-item').should('have.length.at.least', 1);
    // Close dropdown
    this.networkMapDropdown.click();
    return this;
  }

  verifyNetworkMapOptions(expectedMaps) {
    this.networkMapDropdown.click();
    expectedMaps.forEach((mapName) => {
      cy.get('.pf-c-dropdown__menu-item, .pf-c-select__menu-item').should('contain', mapName);
    });
    // Close dropdown
    this.networkMapDropdown.click();
    return this;
  }

  verifyNetworkMapping(sourceNetwork, targetNetwork) {
    this.networkMappingTable.within(() => {
      cy.get('tbody tr').should('contain', sourceNetwork).and('contain', targetNetwork);
    });
    return this;
  }

  verifyNetworkMappingTableVisible() {
    this.networkMappingTable.should('be.visible');
    return this;
  }

  verifyNetworkMapRequired() {
    // Verify that a network map selection is required
    cy.get(
      '[data-testid="network-map-dropdown"] .pf-c-dropdown__toggle-text, [data-testid="network-map-select"] .pf-c-select__toggle-text',
    ).should('not.be.empty');
    return this;
  }

  verifyNetworkMapSelected(mapName) {
    cy.get(
      '[data-testid="network-map-dropdown"] .pf-c-dropdown__toggle-text, [data-testid="network-map-select"] .pf-c-select__toggle-text',
    ).should('contain', mapName);
    return this;
  }

  // Actions
  verifyStepLoaded() {
    this.stepContent.should('be.visible');
    this.networkMapDropdown.should('be.visible');
    return this;
  }

  verifyValidationError(shouldExist = true) {
    if (shouldExist) {
      this.networkMapError.should('be.visible');
    } else {
      this.networkMapError.should('not.exist');
    }
    return this;
  }
}
