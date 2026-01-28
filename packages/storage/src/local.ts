import { mkdir, writeFile, unlink, stat } from "fs/promises";
import { join, dirname } from "path";
import { existsSync } from "fs";
import { createHash } from "crypto";
import sharp from "sharp";
import {
  StorageAdapter,
  ImageUploadResult,
  FileUploadResult,
  StorageConfig,
} from "./types";

export class LocalStorageAdapter implements StorageAdapter {
  private dataDir: string;
  private uploadsPath: string;

  constructor(config: StorageConfig = {}) {
    this.dataDir = config.dataDir || process.env.DATA_DIR || "./data";
    this.uploadsPath =
      config.uploadsPath || process.env.UPLOADS_PATH || "uploads";
  }

  async uploadImage(
    buffer: Buffer,
    filename: string,
  ): Promise<ImageUploadResult> {
    const hash = this.generateHash(buffer);
    const ext = this.getExtension(filename);
    const baseName = `${hash}${ext}`;

    // Ensure directories exist
    const originalDir = join(
      this.dataDir,
      this.uploadsPath,
      "images",
      "original",
    );
    const thumbnailDir = join(
      this.dataDir,
      this.uploadsPath,
      "images",
      "thumbnails",
    );
    await mkdir(originalDir, { recursive: true });
    await mkdir(thumbnailDir, { recursive: true });

    // Save original
    const originalPath = join(originalDir, baseName);
    await writeFile(originalPath, buffer);

    // Get dimensions from original
    const metadata = await sharp(buffer).metadata();
    const width = metadata.width || 0;
    const height = metadata.height || 0;

    // Generate thumbnail (400x400, fit, WebP)
    const thumbnailName = `${hash}_thumb.webp`;
    const thumbnailPath = join(thumbnailDir, thumbnailName);
    await sharp(buffer)
      .resize(400, 400, { fit: "cover" })
      .webp({ quality: 80 })
      .toFile(thumbnailPath);

    return {
      originalUrl: `/${this.uploadsPath}/images/original/${baseName}`,
      thumbnailUrl: `/${this.uploadsPath}/images/thumbnails/${thumbnailName}`,
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
    const baseName = `${hash}${ext}`;

    const filesDir = join(this.dataDir, this.uploadsPath, "files");
    await mkdir(filesDir, { recursive: true });

    const filePath = join(filesDir, baseName);
    await writeFile(filePath, buffer);

    return {
      url: `/${this.uploadsPath}/files/${baseName}`,
      size: buffer.length,
    };
  }

  async delete(url: string): Promise<void> {
    const fullPath = join(this.dataDir, url);
    if (existsSync(fullPath)) {
      await unlink(fullPath);
    }
  }

  getPublicUrl(storedPath: string): string {
    return storedPath.startsWith("/") ? storedPath : `/${storedPath}`;
  }

  private generateHash(buffer: Buffer): string {
    return createHash("sha256").update(buffer).digest("hex").substring(0, 16);
  }

  private getExtension(filename: string): string {
    const lastDot = filename.lastIndexOf(".");
    return lastDot !== -1 ? filename.substring(lastDot) : "";
  }
}
