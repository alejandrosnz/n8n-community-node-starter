import { mock } from 'jest-mock-extended';
import type { IExecuteFunctions } from 'n8n-workflow';
import * as nodeModule from '../../../nodes/GenericLlmVision/GenericLlmVision.node';

describe('GenericLlmVision Node', () => {
  let mockExecuteFunctions: IExecuteFunctions;
  let node: nodeModule.GenericLlmVision;

  beforeEach(() => {
    mockExecuteFunctions = mock<IExecuteFunctions>();
    node = new nodeModule.GenericLlmVision();
    (mockExecuteFunctions as any).getInputData = jest.fn().mockReturnValue([{
      json: {},
      binary: {
        data: {
          data: 'base64imagedata',
          mimeType: 'image/jpeg',
        }
      }
    }]);
  });

  it('should be defined', () => {
    expect(node).toBeDefined();
    expect(node.description.displayName).toBe('Generic LLM Vision');
    expect(node.description.name).toBe('genericLlmVision');
  });

  it('should have correct properties', () => {
    expect(node.description.properties).toBeDefined();
    expect(node.description.properties.length).toBeGreaterThan(0);
  });

  describe('execute', () => {
    beforeEach(() => {
      (mockExecuteFunctions.getInputData as jest.Mock).mockReturnValue([
        {
          json: {},
          binary: {
            data: {
              data: 'base64imagedata',
              mimeType: 'image/jpeg',
            },
          },
        },
      ]);
      (mockExecuteFunctions.getNodeParameter as jest.Mock).mockImplementation((name: string) => {
        const params: { [key: string]: any } = {
          model: 'gpt-4o',
          imageSource: 'binaryData',
          binaryPropertyName: 'data',
          prompt: 'Describe this image',
          imageDetail: 'auto',
          modelParameters: { temperature: 1, maxTokens: 1000 },
          advancedOptions: {},
          outputPropertyName: 'analysis',
          includeMetadata: false,
        };
        return params[name];
      });
      (mockExecuteFunctions.getCredentials as jest.Mock).mockResolvedValue({
        provider: 'openai',
        apiKey: 'test-key',
        baseUrl: 'https://api.openai.com/v1',
      });
      (mockExecuteFunctions.helpers as any) = {
        request: jest.fn(),
        getBinaryData: jest.fn().mockReturnValue({
          data: 'base64imagedata',
          mimeType: 'image/jpeg',
        }),
      };
      (mockExecuteFunctions as any).getDefaultBaseUrl = jest.fn().mockReturnValue('https://api.openai.com/v1');
      (mockExecuteFunctions as any).buildHeaders = jest.fn().mockReturnValue({
        'Authorization': 'Bearer test-key',
        'Content-Type': 'application/json',
      });
      (mockExecuteFunctions as any).buildBody = jest.fn().mockReturnValue({
        model: 'gpt-4o',
        messages: [
          {
            role: 'user',
            content: [
              { type: 'text', text: 'Describe this image' },
              { type: 'image_url', image_url: { url: 'data:image/jpeg;base64,base64imagedata', detail: 'auto' } },
            ],
          },
        ],
        temperature: 1,
        max_tokens: 1000,
      });
      (mockExecuteFunctions as any).extractMetadata = jest.fn();
    });

    it('should execute successfully with OpenAI', async () => {
      (mockExecuteFunctions as any).extractAnalysis = () => 'A beautiful image';
      const mockResponse = {
        choices: [{ message: { content: 'A beautiful image' } }],
      };
      (mockExecuteFunctions.helpers.request as jest.Mock).mockResolvedValue(mockResponse);

      const result = await node.execute.call(mockExecuteFunctions);

      expect(result).toHaveLength(1);
      expect(result[0]).toHaveLength(1);
      expect(result[0][0].json.analysis).toBe('A beautiful image');
    });

    it('should handle Anthropic provider', async () => {
      (mockExecuteFunctions.getCredentials as jest.Mock).mockResolvedValue({
        provider: 'anthropic',
        apiKey: 'test-key',
        baseUrl: 'https://api.anthropic.com/v1',
      });
      (mockExecuteFunctions as any).getDefaultBaseUrl = jest.fn().mockReturnValue('https://api.anthropic.com/v1');
      (mockExecuteFunctions as any).buildHeaders = jest.fn().mockReturnValue({
        'x-api-key': 'test-key',
        'anthropic-version': '2023-06-01',
        'Content-Type': 'application/json',
      });
      (mockExecuteFunctions as any).buildBody = jest.fn().mockReturnValue({
        model: 'claude-3-5-sonnet-20241022',
        messages: [
          {
            role: 'user',
            content: [
              { type: 'image', source: { type: 'base64', media_type: 'image/jpeg', data: 'base64imagedata' } },
              { type: 'text', text: 'Describe this image' },
            ],
          },
        ],
        temperature: 1,
        max_tokens: 1000,
      });
      (mockExecuteFunctions as any).extractAnalysis = () => 'Anthropic analysis';
      const mockResponse = {
        content: [{ text: 'Anthropic analysis' }],
      };
      (mockExecuteFunctions.helpers.request as jest.Mock).mockResolvedValue(mockResponse);

      const result = await node.execute.call(mockExecuteFunctions);

      expect(result[0][0].json.analysis).toBe('Anthropic analysis');
    });

    it('should include metadata when requested', async () => {
      (mockExecuteFunctions.getNodeParameter as jest.Mock).mockImplementation((name: string) => {
        const params: { [key: string]: any } = {
          model: 'gpt-4o',
          imageSource: 'binaryData',
          binaryPropertyName: 'data',
          prompt: 'Describe this image',
          imageDetail: 'auto',
          modelParameters: { temperature: 1, maxTokens: 1000 },
          advancedOptions: {},
          outputPropertyName: 'analysis',
          includeMetadata: true,
        };
        return params[name];
      });
      (mockExecuteFunctions as any).extractAnalysis = () => 'Analysis';
      (mockExecuteFunctions as any).extractMetadata = () => ({
        model: 'gpt-4o',
        usage: { prompt_tokens: 10, completion_tokens: 20 },
        finish_reason: 'stop',
      });
      const mockResponse = {
        choices: [{ message: { content: 'Analysis' }, finish_reason: 'stop' }],
        usage: { prompt_tokens: 10, completion_tokens: 20 },
        model: 'gpt-4o',
      };
      (mockExecuteFunctions.helpers.request as jest.Mock).mockResolvedValue(mockResponse);

      const result = await node.execute.call(mockExecuteFunctions);

      expect((result[0][0].json as any).analysis.analysis).toBe('Analysis');
      expect((result[0][0].json as any).analysis.metadata).toBeDefined();
    });

    it('should handle image size exceeding limit', async () => {
      (mockExecuteFunctions as any).getInputData = jest.fn().mockReturnValue([{
        json: {},
        binary: {
          data: {
            data: 'a'.repeat(25 * 1024 * 1024 * 4 / 3),
            mimeType: 'image/jpeg',
          }
        }
      }]);
      (mockExecuteFunctions.helpers.request as jest.Mock).mockResolvedValue({});

      await expect(node.execute.call(mockExecuteFunctions)).rejects.toThrow('Image size exceeds maximum allowed size of 20MB');
    });

    it('should handle continue on fail', async () => {
      (mockExecuteFunctions.continueOnFail as jest.Mock).mockReturnValue(true);
      (mockExecuteFunctions as any).getInputData = jest.fn().mockReturnValue([{
        json: {},
        binary: {}
      }]);

      const result = await node.execute.call(mockExecuteFunctions);

      expect(result[0][0].json.error).toBe('No binary data found in property \'data\'');
    });
  });
});
