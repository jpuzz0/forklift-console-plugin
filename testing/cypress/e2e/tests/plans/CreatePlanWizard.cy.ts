import { PlansListPage } from '../support/page-objects/PlansListPage';
import { CreatePlanWizard } from '../support/page-objects/CreatePlanWizard';
import { GeneralStep } from '../support/page-objects/GeneralStep';
import { VirtualMachinesStep } from '../support/page-objects/VirtualMachinesStep';
import { NetworkMappingStep } from '../support/page-objects/NetworkMappingStep';
import { StorageMappingStep } from '../support/page-objects/StorageMappingStep';
import { ReviewStep } from '../support/page-objects/ReviewStep';
import { PlanDetailsPage } from '../support/page-objects/PlanDetailsPage';
import { ApiMocks } from '../support/api-mocks';

describe('Create Plan Wizard - Happy Path', () => {
  const plansListPage = new PlansListPage();
  const createPlanWizard = new CreatePlanWizard();
  const generalStep = new GeneralStep();
  const vmStep = new VirtualMachinesStep();
  const networkStep = new NetworkMappingStep();
  const storageStep = new StorageMappingStep();
  const reviewStep = new ReviewStep();
  const planDetailsPage = new PlanDetailsPage();

  const testPlanData = {
    name: 'test-migration-plan',
    description: 'Test migration plan created by Cypress',
    sourceProvider: 'vmware-provider',
    targetProvider: 'kubevirt-provider',
    targetNamespace: 'default',
    selectedVmCount: 1,
    networkMap: 'test-network-map',
    storageMap: 'test-storage-map'
  };

  beforeEach(() => {
    // Setup API mocks
    ApiMocks.setupAllMocks();
    
    // Mock authentication
    cy.mockAuth();
  });

  it('should successfully create a migration plan through the wizard', () => {
    // Step 1: Navigate to Plans list page
    cy.log('**Step 1: Navigate to Plans List Page**');
    plansListPage
      .visit()
      .verifyPageLoaded()
      .verifyCreateButtonExists();

    // Wait for initial API calls to complete
    cy.wait('@getPlans');

    // Step 2: Click Create Plan button to open wizard
    cy.log('**Step 2: Open Create Plan Wizard**');
    plansListPage.clickCreatePlan();

    // Step 3: Verify wizard opened on General step
    cy.log('**Step 3: Verify Wizard General Step**');
    createPlanWizard
      .verifyWizardOpened()
      .verifyCurrentStep('General');

    generalStep.verifyStepLoaded();

    // Wait for providers to load
    cy.wait('@getProviders');

    // Step 4: Fill out required fields in General step
    cy.log('**Step 4: Fill General Step Fields**');
    generalStep.fillRequiredFields(testPlanData);

    // Verify fields are filled correctly
    generalStep
      .verifyPlanName(testPlanData.name)
      .verifyPlanDescription(testPlanData.description)
      .verifySourceProvider(testPlanData.sourceProvider)
      .verifyTargetProvider(testPlanData.targetProvider)
      .verifyTargetNamespace(testPlanData.targetNamespace);

    // Step 5: Proceed to Virtual Machines step
    cy.log('**Step 5: Navigate to Virtual Machines Step**');
    createPlanWizard
      .verifyNextButtonEnabled(true)
      .clickNext()
      .waitForStepToLoad('Virtual machines');

    vmStep.verifyStepLoaded();

    // Wait for VMs to load
    cy.wait('@getVMs');

    // Step 6: Select one VM
    cy.log('**Step 6: Select Virtual Machine**');
    vmStep
      .waitForVmsToLoad()
      .verifyHasVmsToSelect()
      .selectFirstVm()
      .verifyAtLeastOneVmSelected()
      .verifySelectedCount(1);

    // Step 7: Proceed to Network Mapping step
    cy.log('**Step 7: Navigate to Network Mapping Step**');
    createPlanWizard
      .verifyNextButtonEnabled(true)
      .clickNext()
      .waitForStepToLoad('Network mapping');

    networkStep.verifyStepLoaded();

    // Wait for network maps to load
    cy.wait('@getNetworkMaps');

    // Step 8: Select existing network map
    cy.log('**Step 8: Select Network Map**');
    networkStep
      .verifyHasNetworkMapsAvailable()
      .selectFirstAvailableNetworkMap()
      .verifyNetworkMapSelected(testPlanData.networkMap);

    // Step 9: Proceed to Storage Mapping step
    cy.log('**Step 9: Navigate to Storage Mapping Step**');
    createPlanWizard
      .verifyNextButtonEnabled(true)
      .clickNext()
      .waitForStepToLoad('Storage mapping');

  