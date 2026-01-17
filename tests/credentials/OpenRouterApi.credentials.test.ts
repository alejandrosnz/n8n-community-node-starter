import { OpenRouterApi } from '../../credentials/OpenRouterApi.credentials';

describe('OpenRouterApi Credentials', () => {
  let credentials: OpenRouterApi;

  beforeEach(() => {
    credentials = new OpenRouterApi();
  });

  it('should be defined', () => {
    expect(credentials).toBeDefined();
    expect(credentials.name).toBe('openRouterApi');
    expect(credentials.displayName).toBe('OpenRouter API');
  });

  it('should have correct properties', () => {
    expect(credentials.properties).toHaveLength(3);
    expect(credentials.properties[0].name).toBe('apiKey');
    expect(credentials.properties[1].name).toBe('httpReferer');
    expect(credentials.properties[2].name).toBe('appTitle');
  });

  it('should have authenticate configuration', () => {
    expect(credentials.authenticate.type).toBe('generic');
    expect((credentials.authenticate as any).properties.headers.Authorization).toBe('=Bearer {{$credentials.apiKey}}');
  });

  it('should have test request', () => {
    expect(credentials.test.request.baseURL).toBe('https://openrouter.ai/api/v1');
    expect(credentials.test.request.url).toBe('/models');
  });
});