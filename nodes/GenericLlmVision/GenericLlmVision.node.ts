import type {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
} from 'n8n-workflow';

export class GenericLlmVision implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Generic LLM Vision',
    name: 'genericLlmVision',
    icon: 'file:vision.svg', // Placeholder, user will provide
    group: ['transform'],
    version: 1,
    subtitle: 'Analyze Image',
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
      // Model Selection
      {
        displayName: 'Model',
        name: 'model',
        type: 'string',
        required: true,
        default: 'gpt-4o',
        placeholder: 'gpt-4o',
        description: 'Enter the model identifier for your selected provider',
      },
      // Image Source
      {
        displayName: 'Image Source',
        name: 'imageSource',
        type: 'options',
        required: true,
        options: [
          { name: 'Binary Data', value: 'binaryData' },
          { name: 'URL', value: 'url' },
          { name: 'Base64 String', value: 'base64' },
        ],
        default: 'binaryData',
      },
      // Binary Property Name
      {
        displayName: 'Binary Property Name',
        name: 'binaryPropertyName',
        type: 'string',
        default: 'data',
        description: 'Binary property name to read the image from',
        displayOptions: {
          show: { imageSource: ['binaryData'] },
        },
      },
      // Image URL
      {
        displayName: 'Image URL',
        name: 'imageUrl',
        type: 'string',
        required: true,
        default: '',
        description: 'Image URL',
        displayOptions: {
          show: { imageSource: ['url'] },
        },
      },
      // Base64 Data
      {
        displayName: 'Base64 Data',
        name: 'base64Data',
        type: 'string',
        required: true,
        default: '',
        description: 'Base64 encoded image data',
        displayOptions: {
          show: { imageSource: ['base64'] },
        },
      },
      // Analysis Prompt
      {
        displayName: 'Prompt',
        name: 'prompt',
        type: 'string',
        typeOptions: {
          rows: 3,
        },
        required: true,
        default: 'Describe what you see in this image',
        description: 'What do you want to know about the image? Be specific.',
        placeholder: 'Describe this image in detail, focusing on colors and composition',
      },
      // Image Detail
      {
        displayName: 'Image Detail',
        name: 'imageDetail',
        type: 'options',
        options: [
          { name: 'Auto', value: 'auto' },
          { name: 'Low', value: 'low' },
          { name: 'High', value: 'high' },
        ],
        default: 'auto',
        description: 'Image resolution for analysis (affects cost and speed)',
      },
      // Model Parameters (Collection)
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
            },
            default: 1,
            description: 'Controls randomness. Lower = more focused, higher = more creative',
          },
          {
            displayName: 'Max Tokens',
            name: 'maxTokens',
            type: 'number',
            default: 1000,
            description: 'Maximum tokens in response',
          },
          {
            displayName: 'Top P',
            name: 'topP',
            type: 'number',
            typeOptions: {
              minValue: 0,
              maxValue: 1,
            },
            default: 1,
            description: 'Controls diversity via nucleus sampling',
          },
        ],
      },
      // Advanced Options
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
            typeOptions: {
              rows: 2,
            },
            default: '',
            description: 'Additional context or instructions for the model',
          },
          {
            displayName: 'Response Format',
            name: 'responseFormat',
            type: 'options',
            options: [
              { name: 'Text', value: 'text' },
              { name: 'JSON Object', value: 'json_object' },
            ],
            default: 'text',
          },
          {
            displayName: 'Custom Headers',
            name: 'customHeaders',
            type: 'fixedCollection',
            typeOptions: {
              multipleValues: true,
            },
            description: 'Add custom headers to the request',
            default: {},
            options: [
              {
                name: 'headers',
                displayName: 'Headers',
                values: [
                  {
                    displayName: 'Name',
                    name: 'name',
                    type: 'string',
                    default: '',
                    description: 'Header name',
                  },
                  {
                    displayName: 'Value',
                    name: 'value',
                    type: 'string',
                    default: '',
                    description: 'Header value',
                  },
                ],
              },
            ],
          },
          {
            displayName: 'Additional Parameters',
            name: 'additionalParameters',
            type: 'json',
            description: 'Advanced: Add custom parameters as JSON',
            default: '{}',
          },
        ],
      },
      // Output Configuration
      {
        displayName: 'Output Property Name',
        name: 'outputPropertyName',
        type: 'string',
        default: 'analysis',
        description: 'Property name for the analysis result',
      },
      {
        displayName: 'Include Metadata',
        name: 'includeMetadata',
        type: 'boolean',
        default: false,
        description: 'Include metadata (usage, model, tokens, etc.)',
      },
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const returnData: INodeExecutionData[] = [];
    const credentials = await this.getCredentials('genericLlmVisionApi');

    for (let i = 0; i < items.length; i++) {
      try {
        const provider = credentials.provider as string;
        const apiKey = credentials.apiKey as string;
        let baseUrl = credentials.baseUrl as string || getDefaultBaseUrl(provider);

        const model = this.getNodeParameter('model', i) as string;
        const imageSource = this.getNodeParameter('imageSource', i) as string;
        const prompt = this.getNodeParameter('prompt', i) as string;
        const imageDetail = this.getNodeParameter('imageDetail', i) as string;
        const modelParameters = this.getNodeParameter('modelParameters', i) as any;
        const advancedOptions = this.getNodeParameter('advancedOptions', i) as any;
        const outputPropertyName = this.getNodeParameter('outputPropertyName', i) as string;
        const includeMetadata = this.getNodeParameter('includeMetadata', i) as boolean;

        // Validate and prepare image
        const imageData = await prepareImage(imageSource, i, items, this.getNodeParameter.bind(this));
        if (!imageData) {
          throw new Error('Failed to prepare image data');
        }

        // Validate image size (max 20MB)
        const maxSize = 20 * 1024 * 1024; // 20MB
        if (imageData.size > maxSize) {
          throw new Error('Image size exceeds maximum allowed size of 20MB');
        }

        // Build request
        const headers = buildHeaders(provider, apiKey, advancedOptions.customHeaders);
        const body = buildBody(provider, model, prompt, imageData.data, imageData.mimeType, imageDetail, modelParameters, advancedOptions);
        const url = provider === 'anthropic' ? `${baseUrl}/messages` : `${baseUrl}/chat/completions`;

        const response = await this.helpers.request({
          method: 'POST',
          url,
          headers,
          body: JSON.stringify(body),
          json: true,
          timeout: 60000, // 60 seconds timeout
        });

        // Process response
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
            json: { error: (error as Error).message },
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

// Helper functions
function getDefaultBaseUrl(provider: string): string {
  const urls: { [key: string]: string } = {
    openrouter: 'https://openrouter.ai/api/v1',
    groq: 'https://api.groq.com/openai/v1',
    grok: 'https://api.x.ai/v1',
    openai: 'https://api.openai.com/v1',
    anthropic: 'https://api.anthropic.com/v1',
  };
  return urls[provider] || '';
}

function buildHeaders(provider: string, apiKey: string, customHeaders?: any[]): any {
  const headers: any = {};

  if (provider === 'anthropic') {
    headers['x-api-key'] = apiKey;
    headers['anthropic-version'] = '2023-06-01';
  } else {
    headers['Authorization'] = `Bearer ${apiKey}`;
  }

  headers['Content-Type'] = 'application/json';

  if (customHeaders) {
    for (const header of customHeaders) {
      headers[header.name] = header.value;
    }
  }

  return headers;
}

function buildBody(provider: string, model: string, prompt: string, imageData: string, mimeType: string, imageDetail: string, modelParameters: any, advancedOptions: any): any {
  const body: any = {
    model,
    ...modelParameters,
  };

  if (advancedOptions.responseFormat) {
    body.response_format = { type: advancedOptions.responseFormat };
  }

  if (provider === 'anthropic') {
    body.messages = [
      {
        role: 'user',
        content: [
          {
            type: 'image',
            source: {
              type: mimeType === 'url' ? 'url' : 'base64',
              media_type: mimeType === 'url' ? undefined : mimeType,
              data: mimeType === 'url' ? imageData : imageData,
            },
          },
          {
            type: 'text',
            text: prompt,
          },
        ],
      },
    ];
    if (advancedOptions.systemPrompt) {
      body.system = advancedOptions.systemPrompt;
    }
  } else {
    body.messages = [];
    if (advancedOptions.systemPrompt) {
      body.messages.push({
        role: 'system',
        content: advancedOptions.systemPrompt,
      });
    }
    body.messages.push({
      role: 'user',
      content: [
        {
          type: 'text',
          text: prompt,
        },
        {
          type: 'image_url',
          image_url: {
            url: mimeType === 'url' ? imageData : `data:${mimeType};base64,${imageData}`,
            detail: imageDetail,
          },
        },
      ],
    });
  }

  if (advancedOptions.additionalParameters) {
    Object.assign(body, JSON.parse(advancedOptions.additionalParameters));
  }

  return body;
}

// Helper functions
function extractAnalysis(provider: string, response: any): string {
  if (provider === 'anthropic') {
    return response.content?.[0]?.text || '';
  } else {
    return response.choices?.[0]?.message?.content || '';
  }
}

function extractMetadata(response: any): any {
  return {
    model: response.model,
    usage: response.usage,
    finish_reason: response.choices?.[0]?.finish_reason,
  };
}

export async function prepareImage(imageSource: string, itemIndex: number, items: any[], getNodeParameter: any): Promise<{ data: string; mimeType: string; size: number } | null> {
  if (imageSource === 'binaryData') {
    const binaryPropertyName = getNodeParameter('binaryPropertyName', itemIndex) as string;
    const binaryData = items[itemIndex].binary[binaryPropertyName];
    if (!binaryData) {
      throw new Error(`No binary data found in property '${binaryPropertyName}'`);
    }
    // Validate MIME type
    const allowedMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedMimes.includes(binaryData.mimeType)) {
      throw new Error(`Unsupported image format: ${binaryData.mimeType}. Supported formats: JPEG, PNG, WebP, GIF`);
    }
    const buffer = Buffer.from(binaryData.data, 'base64');
    return {
      data: buffer.toString('base64'),
      mimeType: binaryData.mimeType,
      size: buffer.length,
    };
  } else if (imageSource === 'url') {
    const imageUrl = getNodeParameter('imageUrl', itemIndex) as string;
    // Basic URL validation
    try {
      new URL(imageUrl);
    } catch {
      throw new Error('Invalid image URL provided');
    }
    // Sanitize URL (basic)
    const sanitizedUrl = imageUrl.trim();
    if (sanitizedUrl.includes('<script') || sanitizedUrl.includes('javascript:')) {
      throw new Error('Potentially unsafe URL detected');
    }
    return {
      data: sanitizedUrl,
      mimeType: 'url',
      size: sanitizedUrl.length, // Approximate
    };
  } else {
    const base64Data = getNodeParameter('base64Data', itemIndex) as string;
    // Basic base64 validation
    if (!/^[A-Za-z0-9+/]*={0,2}$/.test(base64Data)) {
      throw new Error('Invalid base64 data provided');
    }
    const buffer = Buffer.from(base64Data, 'base64');
    return {
      data: base64Data,
      mimeType: 'image/jpeg', // Assume JPEG for base64
      size: buffer.length,
    };
  }
}