import { ExampleService } from 'nodes/ExampleService/ExampleService.node';
import { ItemCrudResource } from 'nodes/ExampleService/resources';

describe('ExampleService', () => {
  let exampleService: ExampleService;

  beforeEach(() => {
    exampleService = new ExampleService();
  });

  describe('description', () => {
    it('should have correct basic properties', () => {
      expect(exampleService.description.displayName).toBe('Example Service');
      expect(exampleService.description.name).toBe('exampleService');
      expect(exampleService.description.icon).toBe('file:example.svg');
      expect(exampleService.description.group).toEqual(['transform']);
      expect(exampleService.description.version).toBe(1);
      expect(exampleService.description.subtitle).toBe('={{ $parameter["operation"] + ": " + $parameter["resource"] }}');
      expect(exampleService.description.description).toBe('Interact with Example Service API (JSONPlaceholder)');
      expect(exampleService.description.defaults).toEqual({ name: 'Example Service' });
      expect(exampleService.description.inputs).toEqual(['main']);
      expect(exampleService.description.outputs).toEqual(['main']);
      expect(exampleService.description.usableAsTool).toBe(true);
    });

    it('should have correct credentials', () => {
      expect(exampleService.description.credentials).toEqual([
        {
          name: 'exampleServiceApi',
          required: true,
        },
      ]);
    });

    it('should have correct requestDefaults', () => {
      expect(exampleService.description.requestDefaults).toEqual({
        baseURL: '={{$credentials.baseUrl}}',
        url: '',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });
    });

    it('should have properties with resource and operations', () => {
      expect(exampleService.description.properties.length).toBeGreaterThan(1);

      // Resource property
      expect(exampleService.description.properties[0]).toEqual({
        displayName: 'Resource',
        name: 'resource',
        type: 'options',
        noDataExpression: true,
        options: [
          ItemCrudResource.Resource,
        ],
        default: '',
        required: true,
      });

      // The rest are the Operations from ItemCrudResource
      const operationsFromProperties = exampleService.description.properties.slice(1);
      expect(operationsFromProperties).toEqual(ItemCrudResource.Operations);
    });
  });
});