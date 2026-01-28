export {
  StorageAdapter,
  StorageConfig,
  ImageUploadResult,
  FileUploadResult,
} from "./types";
export { LocalStorageAdapter } from "./local";
export { R2StorageAdapter } from "./r2";

import { StorageAdapter, StorageConfig } from "./types";
import { LocalStorageAdapter } from "./local";
import { R2StorageAdapter } from "./r2";

export function createStorage(config?: StorageConfig): StorageAdapter {
  const storageType = process.env.STORAGE_TYPE || "local";

  switch (storageType) {
    case "r2":
      return new R2StorageAdapter(config || {});
    case "local":
    default:
      return new LocalStorageAdapter(config || {});
  }
}
