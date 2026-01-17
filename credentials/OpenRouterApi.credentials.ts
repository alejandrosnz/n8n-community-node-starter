import type {
  IAuthenticateGeneric,
  ICredentialTestRequest,
  ICredentialType,
  INodeProperties,
} from 'n8n-workflow';

export class OpenRouterApi implements ICredentialType {
  name = 'openRouterApi';
  displayName = 'OpenRouter API';
  documentationUrl = 'https://openrouter.ai/docs';

  properties: INodeProperties[] = [
    {
      displayName: 'API Key',
      name: 'apiKey',
      type: 'string',
      typeOptions: { password: true },
      default: '',
      required: true,
    },
    {
      displayName: 'HTTP Referer (Optional)',
      name: 'httpReferer',
      type: 'string',
      default: '',
      description: 'Site URL for OpenRouter rankings',
    },
    {
      displayName: 'App Title (Optional)',
      name: 'appTitle',
      type: 'string',
      default: '',
      description: 'App title for OpenRouter rankings',
    },
  ];

  authenticate: IAuthenticateGeneric = {
    type: 'generic',
    properties: {
      headers: {
        'Authorization': '=Bearer {{$credentials.apiKey}}',
        'HTTP-Referer': '={{$credentials.httpReferer || ""}}',
        'X-Title': '={{$credentials.appTitle || "n8n"}}',
      },
    },
  };

  test: ICredentialTestRequest = {
    request: {
      baseURL: 'https://openrouter.ai/api/v1',
      url: '/models',
    },
  };
}