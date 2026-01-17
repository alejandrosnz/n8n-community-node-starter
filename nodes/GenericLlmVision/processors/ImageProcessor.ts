import type { IExecuteFunctions } from 'n8n-workflow';
import { prepareImage, PreparedImage } from '../utils/providers';

/**
 * ImageProcessor class handles image data extraction and preparation from different sources
 * Supports binary data from previous nodes, base64 strings, and public URLs
 */
export class ImageProcessor {
  private executeFunctions: IExecuteFunctions;

  constructor(executeFunctions: IExecuteFunctions) {
    this.executeFunctions = executeFunctions;
  }

  /**
   * Get and prepare image data from node parameters
   * @param itemIndex - The index of the item being processed
   * @returns Promise<PreparedImage> - The prepared image with validated data, MIME type, and size
   * @throws Error if image data is invalid, unsupported format, or exceeds size limits
   */
  async getPreparedImage(itemIndex: number): Promise<PreparedImage> {
    // Get image source type (binary, base64, or url)
    const imageSource = this.executeFunctions.getNodeParameter('imageSource', itemIndex) as 'binary' | 'base64' | 'url';

    let imageData: any;
    let filename: string | undefined;

    if (imageSource === 'binary') {
      // Handle binary data from previous node
      const binaryPropertyName = this.executeFunctions.getNodeParameter('binaryPropertyName', itemIndex) as string;
      filename = (this.executeFunctions.getNodeParameter('filename', itemIndex) as string) || undefined;

      // Get binary metadata from the item
      const binaryMeta = this.executeFunctions.getInputData()[itemIndex].binary?.[binaryPropertyName];

      if (!binaryMeta) {
        // Provide helpful error message with available binary properties
        const binaryProps = this.executeFunctions.getInputData()[itemIndex].binary;
        const availableBinaryProps = binaryProps ? Object.keys(binaryProps).join(', ') : 'none';

        throw new Error(
          `No binary data found in property '${binaryPropertyName}'. ` +
          `Available binary properties: [${availableBinaryProps}]. ` +
          `\n\nMake sure:` +
          `\n1. Previous node outputs binary data` +
          `\n2. Binary property name is correct (default: 'data')`
        );
      }

      // Safely get the binary data buffer using n8n helper
      let binaryDataBuffer: Buffer;
      try {
        binaryDataBuffer = await this.executeFunctions.helpers.getBinaryDataBuffer(itemIndex, binaryPropertyName);
      } catch (error) {
        throw new Error(
          `Failed to read binary data: ${(error as Error).message}. ` +
          `The binary data may be corrupted or inaccessible.`
        );
      }

      // Validate buffer is not empty
      if (!binaryDataBuffer || binaryDataBuffer.length === 0) {
        throw new Error('Binary data buffer is empty. The image file appears to be empty.');
      }

      // Convert buffer to base64 and create structured image data object
      const base64Data = binaryDataBuffer.toString('base64');
      imageData = {
        data: base64Data,
        mimeType: binaryMeta.mimeType || 'image/jpeg',
        fileName: binaryMeta.fileName || filename,
      };

    } else if (imageSource === 'url') {
      // Handle public URL input
      imageData = this.executeFunctions.getNodeParameter('imageUrl', itemIndex) as string;
    } else {
      // Handle base64 string input
      imageData = this.executeFunctions.getNodeParameter('base64Data', itemIndex) as string;
    }

    // Prepare image with MIME type detection and validation
    try {
      return await prepareImage(imageSource, imageData, filename);
    } catch (error) {
      throw new Error(
        `Failed to prepare image: ${(error as Error).message}\n\n` +
        `Image source: ${imageSource}`
      );
    }
  }
}