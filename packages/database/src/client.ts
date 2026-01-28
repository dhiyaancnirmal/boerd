/**
 * Database Client - Hybrid support for both Bun and Node runtimes
 */

import { join } from 'path';
import { existsSync, mkdirSync } from 'fs';
import * as schema from './schema';

// Determine paths
const DATA_DIR = process.env.DATA_DIR || join(process.cwd(), '..', '..', 'data');
const DB_PATH = process.env.DATABASE_URL || join(DATA_DIR, 'boerd.db');

// Ensure data directory exists
if (!existsSync(DATA_DIR)) {
  mkdirSync(DATA_DIR, { recursive: true });
}

// Detect runtime and use appropriate SQLite library
const isBun = typeof Bun !== 'undefined';

let sqlite: any;
let db: any;

if (isBun) {
  // Use Bun's native SQLite (faster, no dependencies)
  const { Database } = await import('bun:sqlite');
  const { drizzle } = await import('drizzle-orm/bun-sqlite');

  sqlite = new Database(DB_PATH, { create: true });
  sqlite.exec('PRAGMA journal_mode = WAL');
  sqlite.exec('PRAGMA busy_timeout = 5000');
  sqlite.exec('PRAGMA synchronous = NORMAL');
  sqlite.exec('PRAGMA cache_size = 20000');
  sqlite.exec('PRAGMA foreign_keys = ON');
  sqlite.exec('PRAGMA temp_store = MEMORY');

  db = drizzle(sqlite, { schema });
} else {
  // Use better-sqlite3 for Node compatibility
  const Database = (await import('better-sqlite3')).default;
  const { drizzle } = await import('drizzle-orm/better-sqlite3');

  sqlite = new Database(DB_PATH);
  sqlite.pragma('journal_mode = WAL');
  sqlite.pragma('busy_timeout = 5000');
  sqlite.pragma('synchronous = NORMAL');
  sqlite.pragma('cache_size = 20000');
  sqlite.pragma('foreign_keys = ON');
  sqlite.pragma('temp_store = MEMORY');

  db = drizzle(sqlite, { schema });
}

export { db, sqlite as rawDb };
export * from './schema';

// Re-export schema
export * from './schema';
