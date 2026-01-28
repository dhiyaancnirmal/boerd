export interface StorageAdapter {
  /**
   * Upload an image with thumbnail generation
   * @param buffer - Image file buffer
   * @param filename - Original filename
   * @returns URLs for original and thumbnail, plus dimensions
   */
  uploadImage(buffer: Buffer, filename: string): Promise<ImageUploadResult>;

  /**
   * Upload any file type
   * @param buffer - File buffer
   * @param filename - Original filename
   * @param mimeType - MIME type of the file
   * @returns URL and file size
   */
  uploadFile(
    buffer: Buffer,
    filename: string,
    mimeType: string,
  ): Promise<FileUploadResult>;

  /**
   * Delete a file by its stored URL
   * @param url - The URL/path of the file to delete
   */
  delete(url: string): Promise<void>;

  /**
   * Get the public URL for a stored path
   * @param storedPath - The internal path/key
   * @returns Public-facing URL
   */
  getPublicUrl(storedPath: string): string;
}

export interface ImageUploadResult {
  originalUrl: string;
  thumbnailUrl: string;
  width: number;
  height: number;
}

export interface FileUploadResult {
  url: string;
  size: number;
}

export interface StorageConfig {
  dataDir?: string;
  uploadsPath?: string;
  r2?: {
    accountId: string;
    accessKeyId: string;
    secretAccessKey: string;
    bucketName: string;
    publicUrl?: string;
  };
  s3?: {
    region: string;
    accessKeyId: string;
    secretAccessKey: string;
    bucketName: string;
    endpoint?: string;
  };
}
