import { fetchUrlMetadata, extractThumbnailUrl } from "./metadata";
import { processImage } from "./storage";

/**
 * Download and process an image from URL
 */
export async function downloadAndProcessImage(url: string): Promise<{
  originalPath: string;
  thumbnailPath: string;
  width: number;
  height: number;
  format: string;
  size: number;
} | null> {
  try {
    const response = await fetch(url);
    if (!response.ok) return null;

    const buffer = Buffer.from(await response.arrayBuffer());
    const urlPath = new URL(url).pathname;
    const filename = urlPath.split("/").pop() || "image.jpg";

    const result = await processImage(buffer, filename);

    return {
      originalPath: result.originalUrl,
      thumbnailPath: result.thumbnailUrl,
      width: result.width,
      height: result.height,
      format: filename.split(".").pop()?.toLowerCase() || "jpg",
      size: buffer.length,
    };
  } catch (error) {
    console.error("Failed to download and process image:", error);
    return null;
  }
}

/**
 * Generate a video thumbnail (placeholder - needs ffmpeg)
 */
export async function generateVideoThumbnail(
  _videoPath: string,
): Promise<string | null> {
  // TODO: Implement with ffmpeg
  // For now, return null (no thumbnail)
  return null;
}

/**
 * Generate a PDF thumbnail (first page)
 */
export async function generatePdfThumbnail(
  _pdfPath: string,
): Promise<string | null> {
  // TODO: Implement with pdf-lib or similar
  // For now, return null (no thumbnail)
  return null;
}
