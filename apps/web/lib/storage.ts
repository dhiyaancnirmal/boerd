import { createStorage } from "@boerd/storage";

// Initialize storage adapter
const storage = createStorage();

export async function processImage(buffer: Buffer, filename: string) {
  return await storage.uploadImage(buffer, filename);
}

export async function processFile(
  buffer: Buffer,
  filename: string,
  mimeType: string,
) {
  return await storage.uploadFile(buffer, filename, mimeType);
}

export async function deleteFile(url: string) {
  return await storage.delete(url);
}

export function getPublicUrl(path: string) {
  return storage.getPublicUrl(path);
}
