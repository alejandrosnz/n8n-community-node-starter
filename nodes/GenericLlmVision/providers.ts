/**
 * Provider Configuration Module
 * Centralized management of all LLM vision providers, their APIs, authentication, and request/response formats
 */

export type ProviderType = 'openrouter' | 'groq' | 'grok' | 'openai' | 'anthropic' | 'custom';

export interface ProviderConfig {
  name: string;
  displayName: string;
  baseUrl: string;
  apiEndpoint: string;
  headers: (apiKey: string) => Record<string, string>;
  requestFormat: 'openai' | 'anthropic';
  responseFormat: 'openai' | 'anthropic';
  supportsImageDetail: boolean;
  supportsJsonResponse: boolean;
  documentationUrl?: string;
}

export interface MimeTypeConfig {
  extension: string;
  mimeType: string;
  magicBytes: number[];
}

export interface PreparedImage {
  data: string; // Base64 encoded or URL
  mimeType: string;
  size: number;
  source: 'binary' | 'base64' | 'url';
}

// MIME type definitions with magic bytes for detection
export const SUPPORTED_MIME_TYPES: Record<string, MimeTypeConfig> = {
  jpeg: {
    extension: 'jpg|jpeg',
    mimeType: 'image/jpeg',
    magicBytes: [0xff, 0xd8, 0xff], // JPEG magic bytes
  },
  png: {
    extension: 'png',
    mimeType: 'image/png',
    magicBytes: [0x89, 0x50, 0x4e, 0x47], // PNG magic bytes
  },
  webp: {
    extension: 'webp',
    mimeType: 'image/webp',
    magicBytes: [0x52, 0x49, 0x46, 0x46], // WEBP magic bytes (simplified)
  },
  gif: {
    extension: 'gif',
    mimeType: 'image/gif',
    magicBytes: [0x47, 0x49, 0x46], // GIF magic bytes
  },
};

// Provider configurations
export const PROVIDERS: Record<ProviderType, ProviderConfig> = {
  openrouter: {
    name: 'openrouter',
    displayName: 'OpenRouter',
    baseUrl: 'https://openrouter.ai/api/v1',
    apiEndpoint: '/chat/completions',
    headers: (apiKey: string) => ({
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://n8n.io',
      'X-Title': 'n8n-generic-llm-vision',
    }),
    requestFormat: 'openai',
    responseFormat: 'openai',
    supportsImageDetail: true,
    supportsJsonResponse: true,
    documentationUrl: 'https://openrouter.ai/docs',
  },
  groq: {
    name: 'groq',
    displayName: 'Groq',
    baseUrl: 'https://api.groq.com/openai/v1',
    apiEndpoint: '/chat/completions',
    headers: (apiKey: string) => ({
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    }),
    requestFormat: 'openai',
    responseFormat: 'openai',
    supportsImageDetail: true,
    supportsJsonResponse: true,
    documentationUrl: 'https://console.groq.com/docs',
  },
  grok: {
    name: 'grok',
    displayName: 'Grok (X.AI)',
    baseUrl: 'https://api.x.ai/v1',
    apiEndpoint: '/chat/completions',
    headers: (apiKey: string) => ({
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    }),
    requestFormat: 'openai',
    responseFormat: 'openai',
    supportsImageDetail: true,
    supportsJsonResponse: true,
    documentationUrl: 'https://docs.x.ai',
  },
  openai: {
    name: 'openai',
    displayName: 'OpenAI',
    baseUrl: 'https://api.openai.com/v1',
    apiEndpoint: '/chat/completions',
    headers: (apiKey: string) => ({
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    }),
    requestFormat: 'openai',
    responseFormat: 'openai',
    supportsImageDetail: true,
    supportsJsonResponse: true,
    documentationUrl: 'https://platform.openai.com/docs',
  },
  anthropic: {
    name: 'anthropic',
    displayName: 'Anthropic',
    baseUrl: 'https://api.anthropic.com/v1',
    apiEndpoint: '/messages',
    headers: (apiKey: string) => ({
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'Content-Type': 'application/json',
    }),
    requestFormat: 'anthropic',
    responseFormat: 'anthropic',
    supportsImageDetail: false,
    supportsJsonResponse: false,
    documentationUrl: 'https://docs.anthropic.com',
  },
  custom: {
    name: 'custom',
    displayName: 'Custom Provider',
    baseUrl: '', // Will be provided by user
    apiEndpoint: '/chat/completions', // Default, can be overridden
    headers: (apiKey: string) => ({
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    }),
    requestFormat: 'openai',
    responseFormat: 'openai',
    supportsImageDetail: true,
    supportsJsonResponse: true,
  },
};

/**
 * Get provider configuration
 */
export function getProvider(provider: ProviderType | string): ProviderConfig {
  const normalizedProvider = (provider || 'openai').toLowerCase() as ProviderType;
  return PROVIDERS[normalizedProvider] || PROVIDERS.custom;
}

/**
 * Get complete API endpoint URL
 */
export function getApiUrl(provider: ProviderType | string, baseUrl?: string): string {
  const config = getProvider(provider);
  const base = baseUrl || config.baseUrl;
  return base.replace(/\/$/, '') + config.apiEndpoint;
}

/**
 * Get headers for provider
 */
export function getHeaders(provider: ProviderType | string, apiKey: string, customHeaders?: Record<string, string>): Record<string, string> {
  const config = getProvider(provider);
  const headers = config.headers(apiKey);

  // Add custom headers
  if (customHeaders) {
    Object.assign(headers, customHeaders);
  }

  return headers;
}

/**
 * Detect MIME type from file extension
 */
export function detectMimeTypeFromExtension(filename: string): string | null {
  if (!filename) return null;

  const ext = filename.toLowerCase().split('.').pop();
  if (!ext) return null;

  for (const [_, mimeConfig] of Object.entries(SUPPORTED_MIME_TYPES)) {
    const extensions = mimeConfig.extension.split('|');
    if (extensions.includes(ext)) {
      return mimeConfig.mimeType;
    }
  }

  return null;
}

/**
 * Detect MIME type from base64 magic bytes
 */
export function detectMimeTypeFromBase64(base64Data: string): string | null {
  try {
    // Convert base64 to buffer
    const buffer = Buffer.from(base64Data, 'base64');

    // Check magic bytes for each MIME type
    for (const [_, mimeConfig] of Object.entries(SUPPORTED_MIME_TYPES)) {
      const magicBytes = mimeConfig.magicBytes;
      let match = true;

      for (let i = 0; i < magicBytes.length; i++) {
        if (buffer[i] !== magicBytes[i]) {
          match = false;
          break;
        }
      }

      if (match) {
        return mimeConfig.mimeType;
      }
    }
  } catch (error) {
    // Invalid base64 data
    return null;
  }

  return null;
}

/**
 * Validate if MIME type is supported
 */
export function isSupportedMimeType(mimeType: string): boolean {
  return Object.values(SUPPORTED_MIME_TYPES).some(config => config.mimeType === mimeType);
}

/**
 * Get all supported MIME types
 */
export function getSupportedMimeTypes(): string[] {
  return Object.values(SUPPORTED_MIME_TYPES).map(config => config.mimeType);
}

/**
 * Validate base64 format
 */
export function isValidBase64(data: string): boolean {
  try {
    return Buffer.from(data, 'base64').toString('base64') === data;
  } catch {
    return false;
  }
}

/**
 * Get provider list for options
 */
export function getProviderOptions() {
  return Object.values(PROVIDERS)
    .filter(p => p.name !== 'custom')
    .map(provider => ({
      name: provider.displayName,
      value: provider.name,
      description: provider.documentationUrl ? `Docs: ${provider.documentationUrl}` : undefined,
    }))
    .concat([
      {
        name: 'Custom Provider',
        value: 'custom',
        description: 'Configure a custom endpoint',
      },
    ]);
}

/**
 * Image handling utilities
 */

/**
 * Prepare image from different sources (binary, base64, URL)
 * Handles MIME type detection from filenames or magic bytes
 */
export async function prepareImage(
  source: 'binary' | 'base64' | 'url',
  imageData: any,
  filename?: string,
): Promise<PreparedImage> {
  const maxSize = 20 * 1024 * 1024; // 20MB

  if (source === 'binary') {
    if (!imageData?.data || !imageData?.mimeType) {
      throw new Error('Invalid binary data: missing data or mimeType');
    }

    // Detect MIME type from filename first, then validate
    const detectedFromFilename = filename ? detectMimeTypeFromExtension(filename) : null;
    const detectedMimeType = detectedFromFilename || imageData.mimeType;

    if (!isSupportedMimeType(detectedMimeType)) {
      throw new Error(
        `Unsupported image format: ${detectedMimeType}. Supported: ${getSupportedMimeTypes().join(', ')}`,
      );
    }

    const buffer = Buffer.from(imageData.data, 'base64');
    if (buffer.length > maxSize) {
      throw new Error(`Image size exceeds maximum of 20MB (got ${(buffer.length / 1024 / 1024).toFixed(2)}MB)`);
    }

    return {
      data: imageData.data,
      mimeType: detectedMimeType,
      size: buffer.length,
      source: 'binary',
    };
  }

  if (source === 'base64') {
    if (typeof imageData !== 'string') {
      throw new Error('Base64 data must be a string');
    }

    if (!isValidBase64(imageData)) {
      throw new Error('Invalid base64 format');
    }

    const buffer = Buffer.from(imageData, 'base64');
    if (buffer.length > maxSize) {
      throw new Error(`Image size exceeds maximum of 20MB (got ${(buffer.length / 1024 / 1024).toFixed(2)}MB)`);
    }

    // Auto-detect MIME type from magic bytes
    let mimeType = detectMimeTypeFromBase64(imageData);

    if (!mimeType && filename) {
      // Try to detect from filename if magic bytes fail
      mimeType = detectMimeTypeFromExtension(filename);
    }

    if (!mimeType) {
      throw new Error(
        'Could not detect image format. Please provide filename or ensure valid image data. ' +
        `Supported: ${getSupportedMimeTypes().join(', ')}`,
      );
    }

    if (!isSupportedMimeType(mimeType)) {
      throw new Error(
        `Unsupported image format: ${mimeType}. Supported: ${getSupportedMimeTypes().join(', ')}`,
      );
    }

    return {
      data: imageData,
      mimeType,
      size: buffer.length,
      source: 'base64',
    };
  }

  if (source === 'url') {
    if (typeof imageData !== 'string') {
      throw new Error('URL data must be a string');
    }

    // Validate URL
    try {
      new URL(imageData);
    } catch {
      throw new Error('Invalid image URL provided');
    }

    // Basic security checks
    const sanitizedUrl = imageData.trim();
    if (sanitizedUrl.toLowerCase().includes('<script') || sanitizedUrl.toLowerCase().includes('javascript:')) {
      throw new Error('Potentially unsafe URL detected');
    }

    return {
      data: sanitizedUrl,
      mimeType: 'url',
      size: sanitizedUrl.length,
      source: 'url',
    };
  }

  throw new Error('Unknown image source type');
}

/**
 * Get MIME type options for user selection (when auto-detection fails)
 */
export function getMimeTypeOptions() {
  return Object.values(SUPPORTED_MIME_TYPES).map(config => ({
    name: config.mimeType,
    value: config.mimeType,
  }));
}
