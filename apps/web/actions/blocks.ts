"use server";

import {
  db,
  blocks,
  connections,
  users,
  type Block,
  eq,
  desc,
  and,
} from "@boerd/database";
import { createId } from "@paralleldrive/cuid2";
import { detectContentType } from "@/lib/detect";
import {
  fetchUrlMetadata,
  extractThumbnailUrl,
  extractTitle,
} from "@/lib/metadata";
import { downloadAndProcessImage } from "@/lib/thumbnails";
import { processImage, processFile } from "@/lib/storage";
import { revalidatePath } from "next/cache";

// Default user for MVP (no auth yet)
const DEFAULT_USER_ID = "default-user";

/**
 * Create a new block from text input (paste or type)
 */
export async function createBlockFromText(
  input: string,
  boerdId?: string,
): Promise<Block> {
  const type = detectContentType(input);
  const id = createId();
  const now = new Date();

  let blockData: Partial<Block> = {
    id,
    type,
    userId: DEFAULT_USER_ID,
    createdAt: now,
    updatedAt: now,
  };

  if (type === "text") {
    // Plain text block
    blockData.content = input;
  } else if (type === "link" || type === "embed") {
    // URL - fetch metadata
    blockData.sourceUrl = input;

    const { og, oembed } = await fetchUrlMetadata(input);

    blockData.title = extractTitle(og, oembed);
    blockData.description = og?.description;

    const thumbnailUrl = extractThumbnailUrl(og, oembed);
    if (thumbnailUrl) {
      const processed = await downloadAndProcessImage(thumbnailUrl);
      if (processed) {
        blockData.thumbnailPath = processed.thumbnailPath;
      }
    }

    blockData.metadata = {
      og: og || undefined,
      oembed: oembed || undefined,
    };
  } else if (type === "image") {
    // Direct image URL
    blockData.sourceUrl = input;
    const processed = await downloadAndProcessImage(input);
    if (processed) {
      blockData.assetPath = processed.originalPath;
      blockData.thumbnailPath = processed.thumbnailPath;
      blockData.metadata = {
        width: processed.width,
        height: processed.height,
      };
    }
  } else if (type === "video" || type === "audio" || type === "pdf") {
    // Direct media URL
    blockData.sourceUrl = input;
  }

  const [block] = await db
    .insert(blocks)
    .values(blockData as Block)
    .returning();

  // Auto-connect to boerd if specified
  if (boerdId) {
    const maxPosition = await getMaxPosition(boerdId);
    await db.insert(connections).values({
      id: createId(),
      blockId: id,
      boerdId,
      position: maxPosition + 1,
      connectedAt: now,
    });
  }

  revalidatePath("/");
  return block;
}

/**
 * Create a new block from file upload
 */
export async function createBlockFromFile(
  file: File,
  boerdId?: string,
): Promise<Block> {
  const type = detectContentType(file);
  const id = createId();
  const now = new Date();
  const buffer = Buffer.from(await file.arrayBuffer());

  let blockData: Partial<Block> = {
    id,
    type,
    title: file.name,
    userId: DEFAULT_USER_ID,
    createdAt: now,
    updatedAt: now,
  };

  if (type === "image") {
    const processed = await processImage(buffer, file.name);
    blockData.assetPath = processed.originalUrl;
    blockData.thumbnailPath = processed.thumbnailUrl;
    blockData.metadata = {
      width: processed.width,
      height: processed.height,
      mimeType: file.type,
      size: buffer.length,
    };
  } else {
    const processed = await processFile(buffer, file.name, file.type);
    blockData.assetPath = processed.url;
    blockData.metadata = {
      mimeType: file.type,
      size: processed.size,
    };
  }

  const [block] = await db
    .insert(blocks)
    .values(blockData as Block)
    .returning();

  // Auto-connect to boerd if specified
  if (boerdId) {
    const maxPosition = await getMaxPosition(boerdId);
    await db.insert(connections).values({
      id: createId(),
      blockId: id,
      boerdId,
      position: maxPosition + 1,
      connectedAt: now,
    });
  }

  revalidatePath("/");
  return block;
}

/**
 * Update a block's metadata
 */
export async function updateBlock(
  id: string,
  data: { title?: string; description?: string },
): Promise<Block | null> {
  const [block] = await db
    .update(blocks)
    .set({
      ...data,
      updatedAt: new Date(),
    })
    .where(eq(blocks.id, id))
    .returning();

  revalidatePath("/");
  return block || null;
}

/**
 * Delete a block
 */
export async function deleteBlock(id: string): Promise<boolean> {
  const result = await db.delete(blocks).where(eq(blocks.id, id));
  revalidatePath("/");
  return true;
}

/**
 * Get a single block with user info
 */
export async function getBlock(
  id: string,
): Promise<
  (Block & { user: { username: string; displayName: string | null } }) | null
> {
  const result = await db
    .select({
      block: blocks,
      user: {
        username: users.username,
        displayName: users.displayName,
      },
    })
    .from(blocks)
    .innerJoin(users, eq(blocks.userId, users.id))
    .where(eq(blocks.id, id))
    .limit(1);

  if (result.length === 0) return null;

  return {
    ...result[0].block,
    user: result[0].user,
  };
}

/**
 * Get all boerds a block belongs to
 */
export async function getBlockBoerds(blockId: string) {
  const result = await db.query.connections.findMany({
    where: eq(connections.blockId, blockId),
    with: {
      boerd: {
        with: {
          user: true,
        },
      },
    },
  });

  return result.map((c) => c.boerd);
}

/**
 * Get recent blocks
 */
export async function getRecentBlocks(limit = 50) {
  return db.query.blocks.findMany({
    orderBy: [desc(blocks.createdAt)],
    limit,
    with: {
      user: true,
    },
  });
}

/**
 * Get blocks by user
 */
export async function getUserBlocks(userId: string, limit = 50) {
  return db.query.blocks.findMany({
    where: eq(blocks.userId, userId),
    orderBy: [desc(blocks.createdAt)],
    limit,
    with: {
      user: true,
    },
  });
}

// Helper to get max position in a boerd
async function getMaxPosition(boerdId: string): Promise<number> {
  const result = await db
    .select({ position: connections.position })
    .from(connections)
    .where(eq(connections.boerdId, boerdId))
    .orderBy(desc(connections.position))
    .limit(1);

  return result.length > 0 ? result[0].position : -1;
}
