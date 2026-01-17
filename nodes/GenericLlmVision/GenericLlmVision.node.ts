import type {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
} from 'n8n-workflow';
import { prepareImage, getMimeTypeOptions, PreparedImage } from './providers';
import { buildRequest, extractAnalysis, extractMetadata, getHeadersWithAuth } from './GenericFunctions';

export class GenericLlmVision implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Generic LLM Vision',
    name: 'genericLlmVision',
    icon: 'file:vision.svg',
    group: ['transform'],
    version: 1,
    subtitle: '={{$parameter["model"] + " - " + $parameter["imageSource"]}}',
    description: 'Analyze images using multiple LLM vision providers (OpenRouter, Groq, Grok, OpenAI, Anthropic)',
    defaults: {
      name: 'Generic LLM Vision',
    },
    inputs: ['main'],
    outputs: ['main'],
    credentials: [
      {
        name: 'genericLlmVisionApi',
        required: true,
      },
    ],
    properties: [
      {
        displayName: 'Model',
        name: 'model',
        type: 'string',
        required: true,
        default: 'gpt-4-vision',
        placeholder: 'gpt-4-vision',
        description: 'Model identifier for the selected provider (e.g., gpt-4-vision, claude-3-sonnet)',
      },

      // Image Input Configuration
      {
        displayName: 'Image Source',
        name: 'imageSource',
        type: 'options',
        required: true,
        options: [
          {
            name: 'Binary Data (Uploaded File)',
            value: 'binary',
            description: 'Use file from previous node output',
          },
          {
            name: 'Public URL',
            value: 'url',
            description: 'Provide image URL directly',
          },
          {
            name: 'Base64 String',
            value: 'base64',
            description: 'Provide base64-encoded image data',
          },
        ],
        default: 'binary',
      },

      // Binary data options
      {
        displayName: 'Binary Property Name',
        name: 'binaryPropertyName',
        type: 'string',
        default: 'data',
        description: 'The name of the binary property containing the image',
        displayOptions: {
          show: { imageSource: ['binary'] },
        },
      },
      {
        displayName: 'Filename (Optional)',
        name: 'filename',
        type: 'string',
        default: '',
        description: 'Image filename (used for MIME type detection). If provided, overrides binary metadata',
        displayOptions: {
          show: { imageSource: ['binary'] },
        },
      },

      // URL options
      {
        displayName: 'Image URL',
        name: 'imageUrl',
        type: 'string',
        default: '',
        required: true,
        placeholder: 'https://example.com/image.jpg',
        description: 'HTTP(S) URL pointing to the image',
        displayOptions: {
          show: { imageSource: ['url'] },
        },
      },

      // Base64 options
      {
        displayName: 'Base64 Data',
        name: 'base64Data',
        type: 'string',
        default: '',
        required: true,
        description: 'Base64-encoded image data (without data: URI prefix)',
        displayOptions: {
          show: { imageSource: ['base64'] },
        },
      },
      {
        displayName: 'Image Format (for Base64)',
        name: 'base64MimeType',
        type: 'options',
        noDataExpression: true,
        options: getMimeTypeOptions(),
        default: 'image/jpeg',
        description: 'MIME type of the base64-encoded image. Auto-detected if possible',
        displayOptions: {
          show: { imageSource: ['base64'] },
        },
      },

      // Analysis prompt
      {
        displayName: 'Prompt',
        name: 'prompt',
        type: 'string',
        typeOptions: { rows: 4 },
        required: true,
        default: 'Describe what you see in this image in detail',
        description: 'Question or instruction for analyzing the image',
        placeholder: 'Describe the main objects, colors, composition, and any text visible in this image',
      },

      // Model configuration
      {
        displayName: 'Model Parameters',
        name: 'modelParameters',
        type: 'collection',
        placeholder: 'Add Parameter',
        default: {},
        options: [
          {
            displayName: 'Temperature',
            name: 'temperature',
            type: 'number',
            typeOptions: {
              minValue: 0,
              maxValue: 2,
              numberPrecision: 2,
            },
            default: 1,
            description: 'Controls randomness (0=deterministic, 2=most random)',
          },
          {
            displayName: 'Max Tokens',
            name: 'maxTokens',
            type: 'number',
            default: 1024,
            description: 'Maximum length of the response in tokens',
          },
          {
            displayName: 'Top P',
            name: 'topP',
            type: 'number',
            typeOptions: {
              minValue: 0,
              maxValue: 1,
              numberPrecision: 2,
            },
            default: 1,
            description: 'Controls diversity via nucleus sampling (0-1)',
          },
          {
            displayName: 'Image Detail',
            name: 'imageDetail',
            type: 'options',
            options: [
              { name: 'Auto', value: 'auto' },
              { name: 'Low (Fast)', value: 'low' },
              { name: 'High (Detailed)', value: 'high' },
            ],
            default: 'auto',
            description: 'Image resolution detail level (affects speed and cost). Not supported by all providers',
          },
        ],
      },

      // Advanced options
      {
        displayName: 'Advanced Options',
        name: 'advancedOptions',
        type: 'collection',
        placeholder: 'Add Option',
        default: {},
        options: [
          {
            displayName: 'System Prompt',
            name: 'systemPrompt',
            type: 'string',
            typeOptions: { rows: 2 },
            default: '',
            description: 'System instructions for the model (overrides defaults)',
          },
          {
            displayName: 'Response Format',
            name: 'responseFormat',
            type: 'options',
            options: [
              { name: 'Text', value: 'text' },
              { name: 'JSON', value: 'json_object' },
            ],
            default: 'text',
            description: 'Response format. Note: not all providers support JSON mode',
          },
          {
            displayName: 'Custom Headers',
            name: 'customHeaders',
            type: 'fixedCollection',
            typeOptions: { multipleValues: true },
            description: 'Additional headers to include in API request',
            default: {},
            options: [
              {
                name: 'headers',
                displayName: 'Headers',
                values: [
                  {
                    displayName: 'Header Name',
                    name: 'name',
                    type: 'string',
                    default: '',
                    placeholder: 'X-Custom-Header',
                  },
                  {
                    displayName: 'Header Value',
                    name: 'value',
                    type: 'string',
                    default: '',
                    placeholder: 'custom-value',
                  },
                ],
              },
            ],
          },
          {
            displayName: 'Additional Parameters',
            name: 'additionalParameters',
            type: 'json',
            default: '{}',
            description: 'Extra API parameters as JSON (for advanced users)',
          },
        ],
      },

      // Output configuration
      {
        displayName: 'Output Property Name',
        name: 'outputPropertyName',
        type: 'string',
        default: 'analysis',
        description: 'Property name for storing the analysis result',
      },
      {
        displayName: 'Include Metadata',
        name: 'includeMetadata',
        type: 'boolean',
        default: false,
        description: 'Include usage statistics and model information in output',
      },
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const returnData: INodeExecutionData[] = [];

    // Detect which credential is being used and get the appropriate one
    let credentials: any;
    let credentialName: string;
    let apiKey: string;
    let customBaseUrl: string | undefined;
    let provider: string;

    try {
      credentials = await this.getCredentials('openRouterApi');
      credentialName = 'openRouterApi';
      provider = 'openrouter';
      apiKey = credentials.apiKey as string;
    } catch {
      // openRouterApi not configured, try generic credential
      credentials = await this.getCredentials('genericLlmVisionApi');
      credentialName = 'genericLlmVisionApi';
      provider = (credentials.provider as string) || 'openai';
      apiKey = credentials.apiKey as string;
      customBaseUrl = (credentials.baseUrl as string) || undefined;
    }

    for (let i = 0; i < items.length; i++) {
      try {
        // Get node parameters
        const model = this.getNodeParameter('model', i) as string;
        const imageSource = this.getNodeParameter('imageSource', i) as 'binary' | 'base64' | 'url';
        const prompt = this.getNodeParameter('prompt', i) as string;
        const modelParameters = this.getNodeParameter('modelParameters', i) as any;
        const advancedOptions = this.getNodeParameter('advancedOptions', i) as any;
        const outputPropertyName = this.getNodeParameter('outputPropertyName', i) as string;
        const includeMetadata = this.getNodeParameter('includeMetadata', i) as boolean;

        // Get image data
        let imageData: any;
        let filename: string | undefined;

        if (imageSource === 'binary') {
          const binaryPropertyName = this.getNodeParameter('binaryPropertyName', i) as string;
          filename = (this.getNodeParameter('filename', i) as string) || undefined;
          const binaryMeta = items[i].binary?.[binaryPropertyName];

          if (!binaryMeta) {
            const binaryProps = items[i].binary;
            const availableBinaryProps = binaryProps ? Object.keys(binaryProps).join(', ') : 'none';
            
            throw new Error(
              `No binary data found in property '${binaryPropertyName}'. ` +
              `Available binary properties: [${availableBinaryProps}]. ` +
              `\n\nMake sure:` +
              `\n1. Previous node outputs binary data` +
              `\n2. Binary property name is correct (default: 'data')`
            );
          }

          // Get the binary data buffer safely using n8n helper
          let binaryDataBuffer: Buffer;
          
          try {
            binaryDataBuffer = await this.helpers.getBinaryDataBuffer(i, binaryPropertyName);
          } catch (error) {
            throw new Error(
              `Failed to read binary data: ${(error as Error).message}. ` +
              `The binary data may be corrupted or inaccessible.`
            );
          }

          if (!binaryDataBuffer || binaryDataBuffer.length === 0) {
            throw new Error('Binary data buffer is empty. The image file appears to be empty.');
          }

          // Convertir buffer a base64
          const base64Data = binaryDataBuffer.toString('base64');

          // Crear objeto con estructura esperada por prepareImage
          imageData = {
            data: base64Data,
            mimeType: binaryMeta.mimeType || 'image/jpeg',
            fileName: binaryMeta.fileName || filename,
          };

        } else if (imageSource === 'url') {
          imageData = this.getNodeParameter('imageUrl', i) as string;
        } else {
          // base64
          imageData = this.getNodeParameter('base64Data', i) as string;
        }

        // Prepare image with smart MIME detection
        let preparedImage: PreparedImage;
        
        try {
          preparedImage = await prepareImage(imageSource, imageData, filename);
        } catch (error) {
          throw new Error(
            `Failed to prepare image: ${(error as Error).message}\n\n` +
            `Image source: ${imageSource}`
          );
        }

        // Build request
        const customHeadersRecord: Record<string, string> = {};

        if (advancedOptions?.customHeaders?.headers) {
          for (const header of advancedOptions.customHeaders.headers) {
            customHeadersRecord[header.name] = header.value;
          }
        }

        // Add provider-specific headers if using OpenRouter credential
        if (credentialName === 'openRouterApi') {
          if (credentials.httpReferer) {
            customHeadersRecord['HTTP-Referer'] = credentials.httpReferer as string;
          }
          if (credentials.appTitle) {
            customHeadersRecord['X-Title'] = credentials.appTitle as string;
          }
        }

        const requestOptions = {
          provider,
          model,
          prompt,
          image: preparedImage,
          imageDetail: modelParameters?.imageDetail,
          temperature: modelParameters?.temperature,
          maxTokens: modelParameters?.maxTokens,
          topP: modelParameters?.topP,
          systemPrompt: advancedOptions?.systemPrompt,
          responseFormat: advancedOptions?.responseFormat,
          additionalParameters: advancedOptions?.additionalParameters
            ? JSON.parse(advancedOptions.additionalParameters)
            : undefined,
        };

        const { url, body } = buildRequest(requestOptions, customBaseUrl, customHeadersRecord);

        // Inject API key into headers
        const headers = getHeadersWithAuth(provider, apiKey, customHeadersRecord);

        // Make request
        const response = await this.helpers.request({
          method: 'POST',
          url,
          headers,
          body: JSON.stringify(body),
          json: true,
          timeout: 60000,
        });

        // Extract and format response
        const analysis = extractAnalysis(provider, response);
        const result: any = {};

        if (includeMetadata) {
          result[outputPropertyName] = {
            analysis,
            metadata: extractMetadata(response),
          };
        } else {
          result[outputPropertyName] = analysis;
        }

        returnData.push({
          json: { ...items[i].json, ...result },
          binary: items[i].binary,
        });
      } catch (error) {
        if (this.continueOnFail()) {
          returnData.push({
            json: {
              error: (error as Error).message,
              details: (error as Error).stack,
            },
            binary: items[i].binary,
          });
          continue;
        }
        throw error;
      }
    }

    return [returnData];
  }
}