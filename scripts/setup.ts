#!/usr/bin/env bun

import { Database } from 'bun:sqlite';
import { drizzle } from 'drizzle-orm/bun-sqlite';
import { createId } from '@paralleldrive/cuid2';
import { mkdirSync, existsSync, writeFileSync } from 'fs';
import { join } from 'path';

const DATA_DIR = join(process.cwd(), 'data');
const DB_PATH = join(DATA_DIR, 'boerd.db');

console.log('\n🎨 Boerd Setup\n');

// Create directories
if (!existsSync(DATA_DIR)) {
  mkdirSync(DATA_DIR, { recursive: true });
  mkdirSync(join(DATA_DIR, 'uploads', 'images', 'original'), { recursive: true });
  mkdirSync(join(DATA_DIR, 'uploads', 'images', 'thumbnails'), { recursive: true });
  mkdirSync(join(DATA_DIR, 'uploads', 'files'), { recursive: true });
  console.log('✓ Created data directories');
}

// Initialize database
const sqlite = new Database(DB_PATH, { create: true });

sqlite.exec('PRAGMA journal_mode = WAL');
sqlite.exec('PRAGMA foreign_keys = ON');

// Create tables
sqlite.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    username TEXT NOT NULL UNIQUE,
    display_name TEXT,
    bio TEXT,
    avatar_path TEXT,
    created_at INTEGER NOT NULL DEFAULT (unixepoch()),
    updated_at INTEGER NOT NULL DEFAULT (unixepoch())
  );

  CREATE TABLE IF NOT EXISTS blocks (
    id TEXT PRIMARY KEY,
    type TEXT NOT NULL CHECK (type IN ('text', 'image', 'link', 'embed', 'attachment')),
    title TEXT,
    description TEXT,
    content TEXT,
    source_url TEXT,
    asset_path TEXT,
    thumbnail_path TEXT,
    metadata TEXT,
    user_id TEXT NOT NULL REFERENCES users(id),
    created_at INTEGER NOT NULL DEFAULT (unixepoch()),
    updated_at INTEGER NOT NULL DEFAULT (unixepoch())
  );

  CREATE TABLE IF NOT EXISTS boerds (
    id TEXT PRIMARY KEY,
    slug TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    status TEXT NOT NULL DEFAULT 'private' CHECK (status IN ('public', 'closed', 'private')),
    user_id TEXT NOT NULL REFERENCES users(id),
    cover_block_id TEXT REFERENCES blocks(id) ON DELETE SET NULL,
    created_at INTEGER NOT NULL DEFAULT (unixepoch()),
    updated_at INTEGER NOT NULL DEFAULT (unixepoch()),
    UNIQUE(user_id, slug)
  );

  CREATE TABLE IF NOT EXISTS connections (
    id TEXT PRIMARY KEY,
    block_id TEXT NOT NULL REFERENCES blocks(id) ON DELETE CASCADE,
    boerd_id TEXT NOT NULL REFERENCES boerds(id) ON DELETE CASCADE,
    position INTEGER NOT NULL DEFAULT 0,
    connected_at INTEGER NOT NULL DEFAULT (unixepoch()),
    connected_by_id TEXT NOT NULL REFERENCES users(id),
    UNIQUE(block_id, boerd_id)
  );

  CREATE INDEX IF NOT EXISTS blocks_type_idx ON blocks(type);
  CREATE INDEX IF NOT EXISTS blocks_user_idx ON blocks(user_id);
  CREATE INDEX IF NOT EXISTS boerds_user_idx ON boerds(user_id);
  CREATE INDEX IF NOT EXISTS boerds_status_idx ON boerds(status);
  CREATE INDEX IF NOT EXISTS conn_block_idx ON connections(block_id);
  CREATE INDEX IF NOT EXISTS conn_boerd_idx ON connections(boerd_id);
`);

console.log('✓ Database initialized');

// Create default user
const userId = createId();
sqlite.exec(`
  INSERT OR IGNORE INTO users (id, username, display_name)
  VALUES ('${userId}', 'admin', 'Admin')
`);

console.log('✓ Default user created');

// Save config
writeFileSync(
  join(DATA_DIR, 'config.json'),
  JSON.stringify({ defaultUserId: userId, version: '0.1.0' }, null, 2)
);

console.log('✓ Config saved');
console.log('\n🎉 Setup complete!\n');
console.log('Run: bun run dev\n');
