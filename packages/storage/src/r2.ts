import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  HeadObjectCommand,
} from "@aws-sdk/client-s3";
import {
  StorageAdapter,
  ImageUploadResult,
  FileUploadResult,
  StorageConfig,
} from "./types";

export class R2StorageAdapter implements StorageAdapter {
  private client: S3Client;
  private bucketName: string;
  private publicUrl: string;

  constructor(config: StorageConfig) {
    if (!config.r2) {
      throw new Error("R2 configuration is required");
    }

    const { accountId, accessKeyId, secretAccessKey, bucketName, publicUrl } =
      config.r2;

    this.client = new S3Client({
      region: "auto",
      endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    });

    this.bucketName = bucketName;
    this.publicUrl =
      publicUrl ||
      `https://r2.${accountId}.r2.cloudflarestorage.com/${bucketName}`;
  }

  async uploadImage(
    buffer: Buffer,
    filename: string,
  ): Promise<ImageUploadResult> {
    // R2/Cloudflare Workers don't support Sharp server-side
    // We'll upload the original image and return it as both URLs
    // The thumbnail will be the same as original (browsers handle resizing)

    const hash = this.generateHash(buffer);
    const ext = this.getExtension(filename);
    const key = `images/${hash}${ext}`;

    const { width, height } = await this.getImageDimensions(buffer);

    await this.client.send(
      new PutObjectCommand({
        Bucket: this.bucketName,
        Key: key,
        Body: buffer,
        ContentType: this.getContentType(filename),
      }),
    );

    const url = `${this.publicUrl}/${key}`;

    return {
      originalUrl: url,
      thumbnailUrl: url, // No server-side thumbnails on R2
      width,
      height,
    };
  }

  async uploadFile(
    buffer: Buffer,
    filename: string,
    mimeType: string,
  ): Promise<FileUploadResult> {
    const hash = this.generateHash(buffer);
    const ext = this.getExtension(filename);
    const key = `files/${hash}${ext}`;

    await this.client.send(
      new PutObjectCommand({
        Bucket: this.bucketName,
        Key: key,
        Body: buffer,
        ContentType: mimeType,
      }),
    );

    return {
      url: `${this.publicUrl}/${key}`,
      size: buffer.length,
    };
  }

  async delete(url: string): Promise<void> {
    const key = this.extractKey(url);
    if (!key) return;

    await this.client.send(
      new DeleteObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      }),
    );
  }

  getPublicUrl(storedPath: string): string {
    return storedPath.startsWith("http")
      ? storedPath
      : `${this.publicUrl}/${storedPath}`;
  }

  private generateHash(buffer: Buffer): string {
    const { createHash } = require("crypto");
    return createHash("sha256").update(buffer).digest("hex").substring(0, 16);
  }

  private getExtension(filename: string): string {
    const lastDot = filename.lastIndexOf(".");
    return lastDot !== -1 ? filename.substring(lastDot) : "";
  }

  private getContentType(filename: string): string {
    const ext = this.getExtension(filename).toLowerCase();
    const contentTypes: Record<string, string> = {
      ".jpg": "image/jpeg",
      ".jpeg": "image/jpeg",
      ".png": "image/png",
      ".gif": "image/gif",
      ".webp": "image/webp",
      ".svg": "image/svg+xml",
    };
    return contentTypes[ext] || "application/octet-stream";
  }

  private extractKey(url: string): string | null {
    try {
      const urlObj = new URL(url);
      const pathParts = urlObj.pathname.split("/");
      const bucketIndex = pathParts.indexOf(this.bucketName);
      if (bucketIndex !== -1) {
        return pathParts.slice(bucketIndex + 1).join("/");
      }
      return pathParts.filter(Boolean).join("/");
    } catch {
      return null;
    }
  }

  private async getImageDimensions(
    buffer: Buffer,
  ): Promise<{ width: number; height: number }> {
    // Simple dimension detection using image signatures
    // This is a minimal implementation for R2
    const uint8 = new Uint8Array(buffer);

    // JPEG
    if (uint8[0] === 0xff && uint8[1] === 0xd8) {
      return this.parseJpegDimensions(uint8);
    }

    // PNG
    if (
      uint8[0] === 0x89 &&
      uint8[1] === 0x50 &&
      uint8[2] === 0x4e &&
      uint8[3] === 0x47
    ) {
      return this.parsePngDimensions(uint8);
    }

    // GIF
    if (uint8[0] === 0x47 && uint8[1] === 0x49 && uint8[2] === 0x46) {
      return this.parseGifDimensions(uint8);
    }

    // WebP
    if (
      uint8[8] === 0x57 &&
      uint8[9] === 0x45 &&
      uint8[10] === 0x42 &&
      uint8[11] === 0x50
    ) {
      return this.parseWebpDimensions(uint8);
    }

    return { width: 0, height: 0 };
  }

  private parseJpegDimensions(data: Uint8Array): {
    width: number;
    height: number;
  } {
    let i = 2;
    while (i < data.length) {
      if (data[i] === 0xff) {
        const marker = data[i + 1];
        if (
          marker >= 0xc0 &&
          marker <= 0xcf &&
          marker !== 0xc4 &&
          marker !== 0xc8 &&
          marker !== 0xcc
        ) {
          const height = (data[i + 5] << 8) | data[i + 6];
          const width = (data[i + 7] << 8) | data[i + 8];
          return { width, height };
        }
        i += 2 + ((data[i + 2] << 8) | data[i + 3]);
      } else {
        i++;
      }
    }
    return { width: 0, height: 0 };
  }

  private parsePngDimensions(data: Uint8Array): {
    width: number;
    height: number;
  } {
    const width =
      (data[16] << 24) | (data[17] << 16) | (data[18] << 8) | data[19];
    const height =
      (data[20] << 24) | (data[21] << 16) | (data[22] << 8) | data[23];
    return { width, height };
  }

  private parseGifDimensions(data: Uint8Array): {
    width: number;
    height: number;
  } {
    const width = (data[6] << 8) | data[7];
    const height = (data[8] << 8) | data[9];
    return { width, height };
  }

  private parseWebpDimensions(data: Uint8Array): {
    width: number;
    height: number;
  } {
    // VP8X
    if (
      data[12] === 0x56 &&
      data[13] === 0x50 &&
      data[14] === 0x38 &&
      data[15] === 0x58
    ) {
      const width =
        (data[24] | (data[25] << 8) | (data[26] << 16) | (data[27] << 24)) + 1;
      const height =
        (data[27] | (data[28] << 8) | (data[29] << 16) | (data[30] << 24)) + 1;
      return { width, height };
    }
    // VP8L
    if (
      data[12] === 0x56 &&
      data[13] === 0x50 &&
      data[14] === 0x38 &&
      data[15] === 0x4c
    ) {
      const bits =
        data[21] | (data[22] << 8) | (data[23] << 16) | (data[24] << 24);
      const width = (bits & 0x3fff) + 1;
      const height = ((bits >> 14) & 0x3fff) + 1;
      return { width, height };
    }
    return { width: 0, height: 0 };
  }
}
