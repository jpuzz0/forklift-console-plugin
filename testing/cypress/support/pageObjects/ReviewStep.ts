export class ReviewStep {
  // General Information Section
  get generalSection() {
    return cy.get('[data-testid="general-review-section"]');
  }

  get networkMapReview() {
    return cy.get('[data-testid="network-map-review"]');
  }

  // Network Mapping Section
  get networkSection() {
    return cy.get('[data-testid="network-review-section"]');
  }

  get planDescriptionReview() {
    return cy.get('[data-testid="plan-description-review"]');
  }

  get planNameReview() {
    return cy.get('[data-testid="plan-name-review"]');
  }

  get reviewSections() {
    return cy.get('[data-testid="review-section"], .pf-c-description-list');
  }

  get selectedVmsReview() {
    return cy.get('[data-testid="selected-vms-review"]');
  }

  get sourceProviderReview() {
    return cy.get('[data-testid="source-provider-review"]');
  }

  // Selectors
  get stepContent() {
    return cy.get('[data-testid="review-step"], .pf-c-wizard__main-body');
  }

  get storageMapReview() {
    return cy.get('[data-testid="storage-map-review"]');
  }

  // Storage Mapping Section
  get storageSection() {
    return cy.get('[data-testid="storage-review-section"]');
  }

  get targetNamespaceReview() {
    return cy.get('[data-testid="target-namespace-review"]');
  }

  get targetProviderReview() {
    return cy.get('[data-testid="target-provider-review"]');
  }

  verifyAllReviewData(planData) {
    const {
      description,
      name,
      networkMap,
      selectedVmCount,
      sourceProvider,
      storageMap,
      targetNamespace,
      targetProvider,
    } = planData;

    if (name) this.verifyPlanName(name);
    if (description) this.verifyPlanDescription(description);
    if (sourceProvider) this.verifySourceProvider(sourceProvider);
    if (targetProvider) this.verifyTargetProvider(targetProvider);
    if (targetNamespace) this.verifyTargetNamespace(targetNamespace);
    if (selectedVmCount !== undefined) this.verifyVmCount(selectedVmCount);
    if (networkMap) this.verifyNetworkMap(networkMap);
    if (storageMap) this.verifyStorageMap(storageMap);

    return this;
  }

  verifyNetworkMap(expectedMapName) {
    cy.get('body').then(($body) => {
      if ($body.find('[data-testid="network-map-review"]').length > 0) {
        this.networkMapReview.should('contain', expectedMapName);
      } else {
        cy.get('.pf-c-description-list__term, .review-field')
          .contains('Network mapping')
          .siblings()
          .should('contain', expectedMapName);
      }
    });
    return this;
  }

  verifyPlanDescription(expectedDescription) {
    cy.get('body').then(($body) => {
      if ($body.find('[data-testid="plan-description-review"]').length > 0) {
        this.planDescriptionReview.should('contain', expectedDescription);
      } else {
        cy.get('.pf-c-description-list__term, .review-field')
          .contains('Description')
          .siblings()
          .should('contain', expectedDescription);
      }
    });
    return this;
  }

  verifyPlanName(expectedName) {
    // Look for plan name in various possible locations
    cy.get('body').then(($body) => {
      if ($body.find('[data-testid="plan-name-review"]').length > 0) {
        this.planNameReview.should('contain', expectedName);
      } else {
        // Fallback: look for plan name in description list or other review format
        cy.get('.pf-c-description-list__term, .pf-c-form-control, .review-field')
          .contains('Name')
          .siblings()
          .should('contain', expectedName);
      }
    });
    return this;
  }

  verifyReviewSectionsVisible() {
    // Verify that the review page has the main sections
    const expectedSections = ['General', 'Virtual machines', 'Network mapping', 'Storage mapping'];
    expectedSections.forEach((section) => {
      cy.get('body').should('contain', section);
    });
    return this;
  }

  verifySelectedVms(expectedVms) {
    if (Array.isArray(expectedVms)) {
      expectedVms.forEach((vmName) => {
        cy.get('[data-testid="selected-vms-review"], .pf-c-description-list__description').should(
          'contain',
          vmName,
        );
      });
    } else {
      // If it's a count or single VM
      cy.get('[data-testid="selected-vms-review"], .pf-c-description-list__description').should(
        'contain',
        expectedVms,
      );
    }
    return this;
  }

  verifySourceProvider(expectedProvider) {
    cy.get('body').then(($body) => {
      if ($body.find('[data-testid="source-provider-review"]').length > 0) {
        this.sourceProviderReview.should('contain', expectedProvider);
      } else {
        cy.get('.pf-c-description-list__term, .review-field')
          .contains('Source provider')
          .siblings()
          .should('contain', expectedProvider);
      }
    });
    return this;
  }

  // Actions
  verifyStepLoaded() {
    this.stepContent.should('be.visible');
    return this;
  }

  verifyStorageMap(expectedMapName) {
    cy.get('body').then(($body) => {
      if ($body.find('[data-testid="storage-map-review"]').length > 0) {
        this.storageMapReview.should('contain', expectedMapName);
      } else {
        cy.get('.pf-c-description-list__term, .review-field')
          .contains('Storage mapping')
          .siblings()
          .should('contain', expectedMapName);
      }
    });
    return this;
  }

  verifyTargetNamespace(expectedNamespace) {
    cy.get('body').then(($body) => {
      if ($body.find('[data-testid="target-namespace-review"]').length > 0) {
        this.targetNamespaceReview.should('contain', expectedNamespace);
      } else {
        cy.get('.pf-c-description-list__term, .review-field')
          .contains('Target namespace')
          .siblings()
          .should('contain', expectedNamespace);
      }
    });
    return this;
  }

  verifyTargetProvider(expectedProvider) {
    cy.get('body').then(($body) => {
      if ($body.find('[data-testid="target-provider-review"]').length > 0) {
        this.targetProviderReview.should('contain', expectedProvider);
      } else {
        cy.get('.pf-c-description-list__term, .review-field')
          .contains('Target provider')
          .siblings()
          .should('contain', expectedProvider);
      }
    });
    return this;
  }

  verifyVmCount(expectedCount) {
    cy.get('body').then(($body) => {
      if ($body.find('[data-testid="vm-count-review"]').length > 0) {
        this.vmCountReview.should('contain', expectedCount.toString());
      } else {
        // Look for VM count in various formats
        cy.get('.pf-c-description-list__term, .review-field')
          .contains('Virtual machines')
          .siblings()
          .should('contain', expectedCount.toString());
      }
    });
    return this;
  }

  get vmCountReview() {
    return cy.get('[data-testid="vm-count-review"]');
  }

  // Virtual Machines Section
  get vmSection() {
    return cy.get('[data-testid="vm-review-section"]');
  }
}
