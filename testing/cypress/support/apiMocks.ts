// API mocking helpers for Forklift Console Plugin

export class ApiMocks {
  static mockNamespacesApi() {
    cy.intercept('GET', '**/namespaces', {
      body: {
        items: [
          {
            metadata: { name: 'forklift' },
            status: { phase: 'Active' },
          },
          {
            metadata: { name: 'default' },
            status: { phase: 'Active' },
          },
        ],
      },
      statusCode: 200,
    }).as('getNamespaces');
  }

  static mockNetworkMapsApi() {
    cy.intercept('GET', '**/networkmaps', {
      body: {
        items: [
          {
            metadata: { name: 'test-network-map', namespace: 'forklift' },
            spec: {
              map: [{ destination: { name: 'default' }, source: { name: 'VM Network' } }],
              provider: {
                destination: { name: 'kubevirt-provider' },
                source: { name: 'vmware-provider' },
              },
            },
            status: { phase: 'Ready' },
          },
        ],
      },
      statusCode: 200,
    }).as('getNetworkMaps');
  }

  static mockPlansApi() {
    // Mock GET plans list
    cy.intercept('GET', '**/plans', {
      body: {
        items: [
          {
            metadata: { name: 'existing-plan-1', namespace: 'forklift' },
            spec: { description: 'Existing migration plan' },
            status: { phase: 'Ready' },
          },
        ],
      },
      statusCode: 200,
    }).as('getPlans');

    // Mock POST create plan
    cy.intercept('POST', '**/plans', {
      body: {
        metadata: {
          name: 'test-migration-plan',
          namespace: 'forklift',
          uid: 'test-plan-uid-123',
        },
        spec: {
          description: 'Test migration plan',
          provider: {
            destination: { name: 'kubevirt-provider' },
            source: { name: 'vmware-provider' },
          },
        },
        status: { phase: 'Ready' },
      },
      statusCode: 201,
    }).as('createPlan');

    // Mock GET single plan
    cy.intercept('GET', '**/plans/test-migration-plan', {
      body: {
        metadata: {
          name: 'test-migration-plan',
          namespace: 'forklift',
          uid: 'test-plan-uid-123',
        },
        spec: {
          description: 'Test migration plan',
          provider: {
            destination: { name: 'kubevirt-provider' },
            source: { name: 'vmware-provider' },
          },
        },
        status: { phase: 'Ready' },
      },
      statusCode: 200,
    }).as('getPlan');
  }

  static mockProvidersApi() {
    cy.intercept('GET', '**/providers', {
      body: {
        items: [
          {
            metadata: { name: 'vmware-provider', namespace: 'forklift' },
            spec: { type: 'vsphere', url: 'https://vcenter.example.com' },
            status: { phase: 'Ready' },
          },
          {
            metadata: { name: 'kubevirt-provider', namespace: 'forklift' },
            spec: { type: 'kubevirt' },
            status: { phase: 'Ready' },
          },
        ],
      },
      statusCode: 200,
    }).as('getProviders');
  }

  static mockStorageMapsApi() {
    cy.intercept('GET', '**/storagemaps', {
      body: {
        items: [
          {
            metadata: { name: 'test-storage-map', namespace: 'forklift' },
            spec: {
              map: [{ destination: { name: 'local-storage' }, source: { name: 'datastore1' } }],
              provider: {
                destination: { name: 'kubevirt-provider' },
                source: { name: 'vmware-provider' },
              },
            },
            status: { phase: 'Ready' },
          },
        ],
      },
      statusCode: 200,
    }).as('getStorageMaps');
  }

  static mockVirtualMachinesApi() {
    cy.intercept('GET', '**/vms**', {
      body: {
        items: [
          {
            metadata: { name: 'test-vm-1', namespace: 'default' },
            spec: {
              template: {
                spec: {
                  domain: {
                    cpu: { cores: 2 },
                    memory: { guest: '4Gi' },
                  },
                },
              },
            },
            status: { phase: 'Running' },
          },
          {
            metadata: { name: 'test-vm-2', namespace: 'default' },
            spec: {
              template: {
                spec: {
                  domain: {
                    cpu: { cores: 1 },
                    memory: { guest: '2Gi' },
                  },
                },
              },
            },
            status: { phase: 'Stopped' },
          },
        ],
      },
      statusCode: 200,
    }).as('getVMs');
  }

  static setupAllMocks() {
    this.mockPlansApi();
    this.mockProvidersApi();
    this.mockNetworkMapsApi();
    this.mockStorageMapsApi();
    this.mockVirtualMachinesApi();
    this.mockNamespacesApi();
  }

  static verifyApiCalls() {
    cy.wait('@getPlans');
    cy.wait('@getProviders');
    cy.wait('@getNetworkMaps');
    cy.wait('@getStorageMaps');
    cy.wait('@getVMs');
    cy.wait('@getNamespaces');
  }
}
