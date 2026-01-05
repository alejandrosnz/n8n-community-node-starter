import {
  IAuthenticateGeneric,
  Icon,
  ICredentialTestRequest,
  ICredentialType,
  INodeProperties,
} from 'n8n-workflow';

export class ExampleServiceApi implements ICredentialType {
  name = 'exampleServiceApi';
  displayName = 'Example Service API';
  icon: Icon = 'file:example.svg';
  documentationUrl = 'https://jsonplaceholder.typicode.com/';
  properties: INodeProperties[] = [
    {
      displayName: 'Base URL',
      name: 'baseUrl',
      type: 'string',
      default: 'https://jsonplaceholder.typicode.com',
      placeholder: 'https://api.example.com',
      description: 'The base URL of the Example Service API',
      required: true,
    },
  ];

  // This allows the credential to be used by other parts of n8n
  // stating how this credential is injected as part of the request
  authenticate: IAuthenticateGeneric = {
    type: 'generic',
    properties: {
      // No authentication headers needed for JSONPlaceholder
    },
  };

  // The block below tells how this credential can be tested
  test: ICredentialTestRequest = {
    request: {
      baseURL: '={{$credentials?.baseUrl}}',
      url: '/posts/1',
    },
  };
}