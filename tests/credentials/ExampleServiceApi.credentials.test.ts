import { ExampleServiceApi } from 'credentials/ExampleServiceApi.credentials';

describe('ExampleServiceApi', () => {
  let credentials: ExampleServiceApi;

  beforeEach(() => {
    credentials = new ExampleServiceApi();
  });

  describe('basic properties', () => {
    it('should have correct name and displayName', () => {
      expect(credentials.name).toBe('exampleServiceApi');
      expect(credentials.displayName).toBe('Example Service API');
    });

    it('should have correct icon', () => {
      expect(credentials.icon).toBe('file:example.svg');
    });

    it('should have correct documentationUrl', () => {
      expect(credentials.documentationUrl).toBe('https://jsonplaceholder.typicode.com/');
    });
  });

  describe('properties', () => {
    it('should have baseUrl property', () => {
      expect(credentials.properties).toHaveLength(1);
      expect(credentials.properties[0]).toEqual({
        displayName: 'Base URL',
        name: 'baseUrl',
        type: 'string',
        default: 'https://jsonplaceholder.typicode.com',
        placeholder: 'https://api.example.com',
        description: 'The base URL of the Example Service API',
        required: true,
      });
    });
  });

  describe('authenticate', () => {
    it('should have generic authentication with no headers', () => {
      expect(credentials.authenticate).toEqual({
        type: 'generic',
        properties: {
          // No authentication headers needed for JSONPlaceholder
        },
      });
    });
  });

  describe('test', () => {
    it('should have test request to /posts/1', () => {
      expect(credentials.test).toEqual({
        request: {
          baseURL: '={{$credentials?.baseUrl}}',
          url: '/posts/1',
        },
      });
    });
  });
});