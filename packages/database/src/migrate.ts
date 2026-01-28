#!/usr/bin/env bun

import { rawDb } from './client';

console.log('\n📦 Running migrations...\n');

const isBun = typeof Bun !== 'undefined';

const sql = `
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    username TEXT NOT NULL UNIQUE,
    display_name TEXT,
    created_at INTEGER NOT NULL DEFAULT (unixepoch()),
    updated_at INTEGER NOT NULL DEFAULT (unixepoch())
  );

  CREATE TABLE IF NOT EXISTS blocks (
    id TEXT PRIMARY KEY,
    type TEXT NOT NULL CHECK (type IN ('image', 'video', 'audio', 'pdf', 'link', 'embed', 'text', 'file')),
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
    status TEXT NOT NULL DEFAULT 'private' CHECK (status IN ('public', 'private')),
    user_id TEXT NOT NULL REFERENCES users(id),
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
    UNIQUE(block_id, boerd_id)
  );

  CREATE INDEX IF NOT EXISTS blocks_type_idx ON blocks(type);
  CREATE INDEX IF NOT EXISTS blocks_user_idx ON blocks(user_id);
  CREATE INDEX IF NOT EXISTS boerds_user_idx ON boerds(user_id);
  CREATE INDEX IF NOT EXISTS conn_block_idx ON connections(block_id);
  CREATE INDEX IF NOT EXISTS conn_boerd_idx ON connections(boerd_id);
`;

// Execute with appropriate API for runtime
if (isBun) {
  (rawDb as any).exec(sql);
} else {
  (rawDb as any).prepare(sql).run();
}

console.log('✅ Migrations complete!\n');
