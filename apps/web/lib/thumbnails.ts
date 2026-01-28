/**
 * Image processing and thumbnail generation utilities
 */

import sharp from 'sharp';
import { join } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { createId } from '@paralleldrive/cuid2';

// Thumbnail dimensions
const THUMBNAIL_WIDTH = 400;
const THUMBNAIL_HEIGHT = 400;

// Paths
const DATA_DIR = process.env.DATA_DIR || join(process.cwd(), '..', '..', 'data');
const UPLOADS_DIR = join(DATA_DIR, 'uploads');
const IMAGES_DIR = join(UPLOADS_DIR, 'images');
const ORIGINALS_DIR = join(IMAGES_DIR, 'original');
const THUMBNAILS_DIR = join(IMAGES_DIR, 'thumbnails');
const FILES_DIR = join(UPLOADS_DIR, 'files');

/**
 * Ensure upload directories exist
 */
function ensureDirectories() {
  [ORIGINALS_DIR, THUMBNAILS_DIR, FILES_DIR].forEach((dir) => {
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
    }
  });
}

export interface ProcessedImage {
  originalPath: string;
  thumbnailPath: string;
  width: number;
  height: number;
  format: string;
  size: number;
}

/**
 * Process an uploaded image file
 * - Saves original
 * - Generates thumbnail
 * - Returns paths and metadata
 */
export async function processImage(
  buffer: Buffer,
  originalName: string
): Promise<ProcessedImage> {
  ensureDirectories();

  const id = createId();
  const ext = originalName.split('.').pop()?.toLowerCase() || 'jpg';
  const filename = `${id}.${ext}`;
  const thumbnailFilename = `${id}_thumb.webp`;

  const originalPath = join(ORIGINALS_DIR, filename);
  const thumbnailPath = join(THUMBNAILS_DIR, thumbnailFilename);

  // Get image metadata
  const image = sharp(buffer);
  const metadata = await image.metadata();

  // Save original (with optional optimization)
  await image
    .rotate() // Auto-rotate based on EXIF
    .toFile(originalPath);

  // Generate thumbnail
  await sharp(buffer)
    .rotate()
    .resize(THUMBNAIL_WIDTH, THUMBNAIL_HEIGHT, {
      fit: 'inside',
      withoutEnlargement: true,
    })
    .webp({ quality: 80 })
    .toFile(thumbnailPath);

  return {
    originalPath: `/uploads/images/original/${filename}`,
    thumbnailPath: `/uploads/images/thumbnails/${thumbnailFilename}`,
    width: metadata.width || 0,
    height: metadata.height || 0,
    format: metadata.format || ext,
    size: buffer.length,
  };
}

/**
 * Process a non-image file
 * - Saves to files directory
 * - Returns path and metadata
 */
export async function processFile(
  buffer: Buffer,
  originalName: string,
  mimeType: string
): Promise<{
  assetPath: string;
  mimeType: string;
  size: number;
}> {
  ensureDirectories();

  const id = createId();
  const ext = originalName.split('.').pop() || 'bin';
  const filename = `${id}.${ext}`;
  const filePath = join(FILES_DIR, filename);

  await Bun.write(filePath, buffer);

  return {
    assetPath: `/uploads/files/${filename}`,
    mimeType,
    size: buffer.length,
  };
}

/**
 * Download and process an image from URL
 */
export async function downloadAndProcessImage(
  url: string
): Promise<ProcessedImage | null> {
  try {
    const response = await fetch(url);
    if (!response.ok) return null;

    const buffer = Buffer.from(await response.arrayBuffer());
    const urlPath = new URL(url).pathname;
    const filename = urlPath.split('/').pop() || 'image.jpg';

    return await processImage(buffer, filename);
  } catch (error) {
    console.error('Failed to download and process image:', error);
    return null;
  }
}

/**
 * Generate a video thumbnail (placeholder - needs ffmpeg)
 */
export async function generateVideoThumbnail(
  _videoPath: string
): Promise<string | null> {
  // TODO: Implement with ffmpeg
  // For now, return null (no thumbnail)
  return null;
}

/**
 * Generate a PDF thumbnail (first page)
 */
export async function generatePdfThumbnail(
  _pdfPath: string
): Promise<string | null> {
  // TODO: Implement with pdf-lib or similar
  // For now, return null (no thumbnail)
  return null;
}
