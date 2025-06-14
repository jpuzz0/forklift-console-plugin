export class StorageMapStep {
  clickCreateNewMap() {
    this.createNewMapButton.click();
    return this;
  }

  get createNewMapButton() {
    return cy.get('[data-testid="create-storage-map"], button').contains('Create new');
  }

  get noStorageMapMessage() {
    return cy.get('[data-testid="no-storage-map"], .pf-c-empty-state');
  }

  get selectedStorageMapName() {
    return cy.get('[data-testid="selected-storage-map-name"]');
  }

  selectFirstAvailableStorageMap() {
    this.storageMapDropdown.click();
    cy.get('.pf-c-dropdown__menu-item, .pf-c-select__menu-item').first().click();
    return this;
  }

  selectStorageMap(mapName) {
    this.storageMapDropdown.click();
    cy.get('.pf-c-dropdown__menu-item, .pf-c-select__menu-item').contains(mapName).click();
    return this;
  }

  // Selectors
  get stepContent() {
    return cy.get('[data-testid="storage-step"], .pf-c-wizard__main-body');
  }

  get storageMapDropdown() {
    return cy.get('[data-testid="storage-map-dropdown"], [data-testid="storage-map-select"]');
  }

  get storageMapError() {
    return cy.get('[data-testid="storage-map-error"], .pf-c-form__helper-text--error');
  }

  get storageMappingTable() {
    return cy.get('[data-testid="storage-mapping-table"], .pf-c-table');
  }

  verifyHasStorageMapsAvailable() {
    this.storageMapDropdown.click();
    cy.get('.pf-c-dropdown__menu-item, .pf-c-select__menu-item').should('have.length.at.least', 1);
    // Close dropdown
    this.storageMapDropdown.click();
    return this;
  }

  // Actions
  verifyStepLoaded() {
    this.stepContent.should('be.visible');
    this.storageMapDropdown.should('be.visible');
    return this;
  }

  verifyStorageMapOptions(expectedMaps) {
    this.storageMapDropdown.click();
    expectedMaps.forEach((mapName) => {
      cy.get('.pf-c-dropdown__menu-item, .pf-c-select__menu-item').should('contain', mapName);
    });
    // Close dropdown
    this.storageMapDropdown.click();
    return this;
  }

  verifyStorageMapping(sourceStorage, targetStorage) {
    this.storageMappingTable.within(() => {
      cy.get('tbody tr').should('contain', sourceStorage).and('contain', targetStorage);
    });
    return this;
  }

  verifyStorageMappingTableVisible() {
    this.storageMappingTable.should('be.visible');
    return this;
  }

  verifyStorageMapRequired() {
    // Verify that a storage map selection is required
    cy.get(
      '[data-testid="storage-map-dropdown"] .pf-c-dropdown__toggle-text, [data-testid="storage-map-select"] .pf-c-select__toggle-text',
    ).should('not.be.empty');
    return this;
  }

  verifyStorageMapSelected(mapName) {
    cy.get(
      '[data-testid="storage-map-dropdown"] .pf-c-dropdown__toggle-text, [data-testid="storage-map-select"] .pf-c-select__toggle-text',
    ).should('contain', mapName);
    return this;
  }

  verifyValidationError(shouldExist = true) {
    if (shouldExist) {
      this.storageMapError.should('be.visible');
    } else {
      this.storageMapError.should('not.exist');
    }
    return this;
  }
}
