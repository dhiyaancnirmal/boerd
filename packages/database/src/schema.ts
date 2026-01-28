import { sqliteTable, text, integer, unique, index } from 'drizzle-orm/sqlite-core';
import { sql, relations } from 'drizzle-orm';

// ============================================================================
// USERS
// ============================================================================

export const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  username: text('username').notNull().unique(),
  displayName: text('display_name'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
});

// ============================================================================
// BLOCKS
// ============================================================================

// All the content types a block can be
export const blockTypes = [
  'image',      // jpg, png, gif, webp, etc.
  'video',      // mp4, webm, etc.
  'audio',      // mp3, wav, etc.
  'pdf',        // PDF documents
  'link',       // Regular URLs with og:image
  'embed',      // YouTube, Vimeo, Twitter, etc.
  'text',       // Markdown/plain text
  'file',       // Any other file type
] as const;

export type BlockType = (typeof blockTypes)[number];

export const blocks = sqliteTable('blocks', {
  id: text('id').primaryKey(),
  
  // Content type - auto-detected, not user-selected
  type: text('type', { enum: blockTypes }).notNull(),
  
  // Display info
  title: text('title'),
  description: text('description'),
  
  // Content storage
  content: text('content'),           // For text blocks: the actual text/markdown
  sourceUrl: text('source_url'),      // For links/embeds: the original URL
  assetPath: text('asset_path'),      // For uploaded files: path to the file
  thumbnailPath: text('thumbnail_path'), // Generated preview image
  
  // Flexible metadata (dimensions, og data, oembed data, duration, etc.)
  metadata: text('metadata', { mode: 'json' }).$type<{
    // For images/video
    width?: number;
    height?: number;
    duration?: number;
    
    // For links
    og?: {
      title?: string;
      description?: string;
      image?: string;
      siteName?: string;
    };
    
    // For embeds
    oembed?: {
      type?: string;
      html?: string;
      thumbnail_url?: string;
      provider_name?: string;
    };
    
    // For files
    mimeType?: string;
    size?: number;
    
    // Anything else
    [key: string]: unknown;
  }>(),
  
  // Ownership
  userId: text('user_id').notNull().references(() => users.id),
  
  // Timestamps
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
}, (table) => ({
  typeIdx: index('blocks_type_idx').on(table.type),
  userIdx: index('blocks_user_idx').on(table.userId),
}));

// ============================================================================
// BOERDS
// ============================================================================

export const boerds = sqliteTable('boerds', {
  id: text('id').primaryKey(),
  slug: text('slug').notNull(),
  title: text('title').notNull(),
  description: text('description'),
  status: text('status', { enum: ['public', 'private'] }).notNull().default('private'),
  userId: text('user_id').notNull().references(() => users.id),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
}, (table) => ({
  userSlugUnique: unique().on(table.userId, table.slug),
  userIdx: index('boerds_user_idx').on(table.userId),
}));

// ============================================================================
// CONNECTIONS (block <-> boerd, many-to-many)
// ============================================================================

export const connections = sqliteTable('connections', {
  id: text('id').primaryKey(),
  blockId: text('block_id').notNull().references(() => blocks.id, { onDelete: 'cascade' }),
  boerdId: text('boerd_id').notNull().references(() => boerds.id, { onDelete: 'cascade' }),
  position: integer('position').notNull().default(0),
  connectedAt: integer('connected_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
}, (table) => ({
  uniqueConnection: unique().on(table.blockId, table.boerdId),
  blockIdx: index('conn_block_idx').on(table.blockId),
  boerdIdx: index('conn_boerd_idx').on(table.boerdId),
}));

// ============================================================================
// RELATIONS
// ============================================================================

export const usersRelations = relations(users, ({ many }) => ({
  blocks: many(blocks),
  boerds: many(boerds),
}));

export const blocksRelations = relations(blocks, ({ one, many }) => ({
  user: one(users, { fields: [blocks.userId], references: [users.id] }),
  connections: many(connections),
}));

export const boerdsRelations = relations(boerds, ({ one, many }) => ({
  user: one(users, { fields: [boerds.userId], references: [users.id] }),
  connections: many(connections),
}));

export const connectionsRelations = relations(connections, ({ one }) => ({
  block: one(blocks, { fields: [connections.blockId], references: [blocks.id] }),
  boerd: one(boerds, { fields: [connections.boerdId], references: [boerds.id] }),
}));

// ============================================================================
// TYPE EXPORTS
// ============================================================================

export type User = typeof users.$inferSelect;
export type Block = typeof blocks.$inferSelect;
export type Boerd = typeof boerds.$inferSelect;
export type Connection = typeof connections.$inferSelect;
