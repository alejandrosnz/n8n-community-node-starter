import { GenericLlmVision } from '../../../nodes/GenericLlmVision/GenericLlmVision.node';
import {
  detectMimeTypeFromExtension,
  detectMimeTypeFromBase64,
  isSupportedMimeType,
  isValidBase64,
  getSupportedMimeTypes,
  getProvider,
  getHeaders,
  prepareImage,
} from '../../../nodes/GenericLlmVision/providers';
import { buildRequest, extractAnalysis, extractMetadata } from '../../../nodes/GenericLlmVision/GenericFunctions';

describe('GenericLlmVision Node', () => {
  let node: GenericLlmVision;

  beforeEach(() => {
    node = new GenericLlmVision();
  });

  it('should be defined with correct metadata', () => {
    expect(node).toBeDefined();
    expect(node.description.displayName).toBe('Generic LLM Vision');
    expect(node.description.name).toBe('genericLlmVision');
    expect(node.description.version).toBe(1);
  });

  it('should have image source parameter with binary, url, and base64 options', () => {
    const imageSourceParam = node.description.properties.find(p => p.name === 'imageSource');
    expect(imageSourceParam).toBeDefined();
    expect(imageSourceParam?.type).toBe('options');
    const options = (imageSourceParam as any).options;
    expect(options.map((o: any) => o.value)).toContain('binary');
    expect(options.map((o: any) => o.value)).toContain('url');
    expect(options.map((o: any) => o.value)).toContain('base64');
  });
});

describe('MIME Type Detection', () => {
  describe('detectMimeTypeFromExtension', () => {
    it('should detect JPEG from .jpg extension', () => {
      expect(detectMimeTypeFromExtension('image.jpg')).toBe('image/jpeg');
      expect(detectMimeTypeFromExtension('image.jpeg')).toBe('image/jpeg');
      expect(detectMimeTypeFromExtension('PHOTO.JPG')).toBe('image/jpeg');
    });

    it('should detect PNG from .png extension', () => {
      expect(detectMimeTypeFromExtension('image.png')).toBe('image/png');
      expect(detectMimeTypeFromExtension('SCREENSHOT.PNG')).toBe('image/png');
    });

    it('should detect WebP from .webp extension', () => {
      expect(detectMimeTypeFromExtension('image.webp')).toBe('image/webp');
    });

    it('should detect GIF from .gif extension', () => {
      expect(detectMimeTypeFromExtension('animation.gif')).toBe('image/gif');
    });

    it('should return null for unknown extension', () => {
      expect(detectMimeTypeFromExtension('image.bmp')).toBeNull();
      expect(detectMimeTypeFromExtension('document.pdf')).toBeNull();
    });

    it('should handle filenames without extension', () => {
      expect(detectMimeTypeFromExtension('image')).toBeNull();
    });
  });

  describe('detectMimeTypeFromBase64', () => {
    it('should detect JPEG from magic bytes', () => {
      // JPEG magic bytes: FF D8 FF
      const jpegBase64 = Buffer.from([0xff, 0xd8, 0xff, 0xe0]).toString('base64');
      expect(detectMimeTypeFromBase64(jpegBase64)).toBe('image/jpeg');
    });

    it('should detect PNG from magic bytes', () => {
      // PNG magic bytes: 89 50 4E 47
      const pngBase64 = Buffer.from([0x89, 0x50, 0x4e, 0x47]).toString('base64');
      expect(detectMimeTypeFromBase64(pngBase64)).toBe('image/png');
    });

    it('should detect GIF from magic bytes', () => {
      // GIF magic bytes: 47 49 46
      const gifBase64 = Buffer.from([0x47, 0x49, 0x46]).toString('base64');
      expect(detectMimeTypeFromBase64(gifBase64)).toBe('image/gif');
    });

    it('should return null for invalid base64', () => {
      expect(detectMimeTypeFromBase64('not-valid-base64!!!')).toBeNull();
    });

    it('should return null for unrecognized magic bytes', () => {
      const unknownBase64 = Buffer.from([0x00, 0x00, 0x00, 0x00]).toString('base64');
      expect(detectMimeTypeFromBase64(unknownBase64)).toBeNull();
    });
  });

  describe('isSupportedMimeType', () => {
    it('should return true for supported MIME types', () => {
      expect(isSupportedMimeType('image/jpeg')).toBe(true);
      expect(isSupportedMimeType('image/png')).toBe(true);
      expect(isSupportedMimeType('image/webp')).toBe(true);
      expect(isSupportedMimeType('image/gif')).toBe(true);
    });

    it('should return false for unsupported MIME types', () => {
      expect(isSupportedMimeType('image/bmp')).toBe(false);
      expect(isSupportedMimeType('image/tiff')).toBe(false);
      expect(isSupportedMimeType('video/mp4')).toBe(false);
    });
  });

  describe('isValidBase64', () => {
    it('should validate correct base64 strings', () => {
      expect(isValidBase64('aGVsbG8gd29ybGQ=')).toBe(true);
      expect(isValidBase64('SGVsbG8gV29ybGQ=')).toBe(true);
      expect(isValidBase64('YQ==')).toBe(true);
    });

    it('should reject invalid base64 strings', () => {
      expect(isValidBase64('invalid!!!base64')).toBe(false);
      expect(isValidBase64('not-base64')).toBe(false);
    });
  });

  describe('getSupportedMimeTypes', () => {
    it('should return all supported MIME types', () => {
      const types = getSupportedMimeTypes();
      expect(types).toContain('image/jpeg');
      expect(types).toContain('image/png');
      expect(types).toContain('image/webp');
      expect(types).toContain('image/gif');
      expect(types.length).toBe(4);
    });
  });
});

describe('Provider Configuration', () => {
  describe('getProvider', () => {
    it('should return OpenAI provider by default', () => {
      const provider = getProvider('openai');
      expect(provider.displayName).toBe('OpenAI');
      expect(provider.baseUrl).toBe('https://api.openai.com/v1');
      expect(provider.apiEndpoint).toBe('/chat/completions');
      expect(provider.requestFormat).toBe('openai');
    });

    it('should return Anthropic provider', () => {
      const provider = getProvider('anthropic');
      expect(provider.displayName).toBe('Anthropic');
      expect(provider.baseUrl).toBe('https://api.anthropic.com/v1');
      expect(provider.apiEndpoint).toBe('/messages');
      expect(provider.requestFormat).toBe('anthropic');
    });

    it('should handle provider normalization', () => {
      const provider = getProvider('OPENAI');
      expect(provider.displayName).toBe('OpenAI');
    });

    it('should support custom provider', () => {
      const provider = getProvider('custom');
      expect(provider.displayName).toBe('Custom Provider');
    });
  });

  describe('getHeaders', () => {
    it('should return Bearer token for OpenAI', () => {
      const headers = getHeaders('openai', 'test-key');
      expect(headers['Authorization']).toBe('Bearer test-key');
      expect(headers['Content-Type']).toBe('application/json');
    });

    it('should return x-api-key for Anthropic', () => {
      const headers = getHeaders('anthropic', 'test-key');
      expect(headers['x-api-key']).toBe('test-key');
      expect(headers['anthropic-version']).toBe('2023-06-01');
    });

    it('should include custom headers', () => {
      const customHeaders = { 'X-Custom': 'value' };
      const headers = getHeaders('openai', 'test-key', customHeaders);
      expect(headers['X-Custom']).toBe('value');
    });
  });
});

describe('Image Preparation', () => {
  describe('prepareImage with binary source', () => {
    it('should prepare binary image successfully', async () => {
      const binaryData = {
        data: Buffer.from('test image').toString('base64'),
        mimeType: 'image/jpeg',
        fileType: 'jpg',
      };

      const result = await prepareImage('binary', binaryData, 'photo.jpg');

      expect(result.source).toBe('binary');
      expect(result.mimeType).toBe('image/jpeg');
      expect(result.data).toBeDefined();
      expect(result.size).toBeGreaterThan(0);
    });

    it('should detect MIME type from filename for binary', async () => {
      const binaryData = {
        data: Buffer.from('test image').toString('base64'),
        mimeType: 'application/octet-stream', // Wrong MIME type
      };

      const result = await prepareImage('binary', binaryData, 'photo.png');

      expect(result.mimeType).toBe('image/png'); // Should be corrected from filename
    });

    it('should throw error for unsupported MIME type', async () => {
      const binaryData = {
        data: 'test',
        mimeType: 'image/bmp',
      };

      await expect(prepareImage('binary', binaryData)).rejects.toThrow('Unsupported image format');
    });

    it('should throw error for oversized image', async () => {
      const largeBuffer = Buffer.alloc(21 * 1024 * 1024); // 21MB
      const binaryData = {
        data: largeBuffer.toString('base64'),
        mimeType: 'image/jpeg',
      };

      await expect(prepareImage('binary', binaryData)).rejects.toThrow('Image size exceeds maximum');
    });
  });

  describe('prepareImage with base64 source', () => {
    it('should prepare base64 image with auto-detection', async () => {
      const jpegBase64 = Buffer.from([0xff, 0xd8, 0xff, 0xe0, 0x00, 0x01]).toString('base64');
      const result = await prepareImage('base64', jpegBase64);

      expect(result.source).toBe('base64');
      expect(result.mimeType).toBe('image/jpeg');
      expect(result.data).toBe(jpegBase64);
    });

    it('should detect MIME type from filename if magic bytes fail', async () => {
      const unknownBase64 = 'SGVsbG8gd29ybGQ='; // "Hello world" - no magic bytes
      const result = await prepareImage('base64', unknownBase64, 'image.png');

      expect(result.mimeType).toBe('image/png');
    });

    it('should throw error if MIME type cannot be detected', async () => {
      const unknownBase64 = 'SGVsbG8gd29ybGQ='; // "Hello world" - no magic bytes

      await expect(prepareImage('base64', unknownBase64)).rejects.toThrow(
        'Could not detect image format',
      );
    });

    it('should validate base64 format', async () => {
      await expect(prepareImage('base64', 'not-valid-base64!!!')).rejects.toThrow(
        'Invalid base64 format',
      );
    });
  });

  describe('prepareImage with url source', () => {
    it('should prepare URL image', async () => {
      const url = 'https://example.com/image.jpg';
      const result = await prepareImage('url', url);

      expect(result.source).toBe('url');
      expect(result.mimeType).toBe('url');
      expect(result.data).toBe(url);
    });

    it('should validate URL format', async () => {
      await expect(prepareImage('url', 'not a valid url')).rejects.toThrow('Invalid image URL');
    });

    it('should reject potentially unsafe URLs', async () => {
      await expect(prepareImage('url', 'javascript:alert(1)')).rejects.toThrow(
        'Potentially unsafe URL detected',
      );
    });

    it('should handle URLs with various protocols', async () => {
      const result = await prepareImage('url', 'https://secure-cdn.example.com/images/photo.png');
      expect(result.data).toBe('https://secure-cdn.example.com/images/photo.png');
    });
  });
});

describe('Request Building', () => {
  describe('buildRequest for OpenAI', () => {
    it('should build OpenAI format request', () => {
      const options = {
        provider: 'openai',
        model: 'gpt-4-vision',
        prompt: 'Describe this image',
        image: {
          data: Buffer.from('test').toString('base64'),
          mimeType: 'image/jpeg',
          size: 100,
          source: 'binary' as const,
        },
        imageDetail: 'high',
        temperature: 0.7,
        maxTokens: 512,
      };

      const request = buildRequest(options);

      expect(request.url).toContain('/chat/completions');
      expect(request.headers['Authorization']).toBe('Bearer ');
      expect(request.body.model).toBe('gpt-4-vision');
      expect(request.body.temperature).toBe(0.7);
      expect(request.body.max_tokens).toBe(512);
      expect(Array.isArray(request.body.messages)).toBe(true);
    });
  });

  describe('buildRequest for Anthropic', () => {
    it('should build Anthropic format request', () => {
      const options = {
        provider: 'anthropic',
        model: 'claude-3-sonnet',
        prompt: 'Describe this image',
        image: {
          data: Buffer.from('test').toString('base64'),
          mimeType: 'image/jpeg',
          size: 100,
          source: 'binary' as const,
        },
      };

      const request = buildRequest(options);

      expect(request.url).toContain('/messages');
      expect(request.headers['x-api-key']).toBe('');
      expect(request.body.model).toBe('claude-3-sonnet');
      expect(Array.isArray(request.body.messages)).toBe(true);
      expect(request.body.messages[0].content).toBeDefined();
    });
  });
});

describe('Response Extraction', () => {
  describe('extractAnalysis', () => {
    it('should extract OpenAI format response', () => {
      const response = {
        choices: [{ message: { content: 'Analysis result' } }],
      };

      const analysis = extractAnalysis('openai', response);
      expect(analysis).toBe('Analysis result');
    });

    it('should extract Anthropic format response', () => {
      const response = {
        content: [{ text: 'Analysis result' }],
      };

      const analysis = extractAnalysis('anthropic', response);
      expect(analysis).toBe('Analysis result');
    });

    it('should handle missing content gracefully', () => {
      const openaiResponse = { choices: [{}] };
      expect(extractAnalysis('openai', openaiResponse)).toBe('');

      const anthropicResponse = { content: [] };
      expect(extractAnalysis('anthropic', anthropicResponse)).toBe('');
    });
  });

  describe('extractMetadata', () => {
    it('should extract metadata from response', () => {
      const response = {
        model: 'gpt-4-vision',
        usage: {
          prompt_tokens: 100,
          completion_tokens: 50,
        },
        choices: [{ finish_reason: 'stop' }],
      };

      const metadata = extractMetadata(response);

      expect(metadata.model).toBe('gpt-4-vision');
      expect(metadata.usage).toBeDefined();
      expect(metadata.finish_reason).toBe('stop');
    });
  });
});
