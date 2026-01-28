'use server';

import { db, boerds, connections, blocks, users, type Boerd, eq, desc, and, asc } from '@boerd/database';
import { createId } from '@paralleldrive/cuid2';
import { generateUniqueSlug } from '@/lib/slug';
import { revalidatePath } from 'next/cache';

// Default user for MVP (no auth yet)
const DEFAULT_USER_ID = 'default-user';

/**
 * Create a new boerd
 */
export async function createBoerd(
  title: string,
  description?: string,
  status: 'public' | 'private' = 'private'
): Promise<Boerd> {
  // Get existing slugs for this user
  const existing = await db
    .select({ slug: boerds.slug })
    .from(boerds)
    .where(eq(boerds.userId, DEFAULT_USER_ID));

  const existingSlugs = existing.map((b) => b.slug);
  const slug = generateUniqueSlug(title, existingSlugs);

  const now = new Date();

  const [boerd] = await db
    .insert(boerds)
    .values({
      id: createId(),
      slug,
      title,
      description,
      status,
      userId: DEFAULT_USER_ID,
      createdAt: now,
      updatedAt: now,
    })
    .returning();

  revalidatePath('/');
  return boerd;
}

/**
 * Update a boerd
 */
export async function updateBoerd(
  id: string,
  data: { title?: string; description?: string; status?: 'public' | 'private' }
): Promise<Boerd | null> {
  // If title is being updated, we might need to update slug
  let updateData: Partial<Boerd> = {
    ...data,
    updatedAt: new Date(),
  };

  if (data.title) {
    const [existing] = await db
      .select({ userId: boerds.userId })
      .from(boerds)
      .where(eq(boerds.id, id));

    if (existing) {
      const others = await db
        .select({ slug: boerds.slug })
        .from(boerds)
        .where(and(eq(boerds.userId, existing.userId), eq(boerds.id, id)));

      const existingSlugs = others.map((b) => b.slug);
      updateData.slug = generateUniqueSlug(data.title, existingSlugs);
    }
  }

  const [boerd] = await db
    .update(boerds)
    .set(updateData)
    .where(eq(boerds.id, id))
    .returning();

  revalidatePath('/');
  return boerd || null;
}

/**
 * Delete a boerd
 */
export async function deleteBoerd(id: string): Promise<boolean> {
  await db.delete(boerds).where(eq(boerds.id, id));
  revalidatePath('/');
  return true;
}

/**
 * Get a boerd by username and slug with ordered blocks
 */
export async function getBoerd(username: string, slug: string) {
  // First find the user
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.username, username))
    .limit(1);

  if (!user) return null;

  // Find the boerd
  const [boerd] = await db
    .select()
    .from(boerds)
    .where(and(eq(boerds.userId, user.id), eq(boerds.slug, slug)))
    .limit(1);

  if (!boerd) return null;

  // Get connected blocks ordered by position
  const connectedBlocks = await db
    .select({
      block: blocks,
      position: connections.position,
      connectedAt: connections.connectedAt,
    })
    .from(connections)
    .innerJoin(blocks, eq(connections.blockId, blocks.id))
    .where(eq(connections.boerdId, boerd.id))
    .orderBy(asc(connections.position));

  return {
    ...boerd,
    user,
    blocks: connectedBlocks.map((c) => ({
      ...c.block,
      position: c.position,
      connectedAt: c.connectedAt,
    })),
  };
}

/**
 * Get a boerd by ID
 */
export async function getBoerdById(id: string) {
  const boerd = await db.query.boerds.findFirst({
    where: eq(boerds.id, id),
    with: {
      user: true,
      connections: {
        with: {
          block: true,
        },
        orderBy: [asc(connections.position)],
      },
    },
  });

  if (!boerd) return null;

  return {
    ...boerd,
    blocks: boerd.connections.map((c) => ({
      ...c.block,
      position: c.position,
      connectedAt: c.connectedAt,
    })),
  };
}

/**
 * Get all boerds for a user with preview blocks
 */
export async function getUserBoerds(username: string) {
  // Find the user
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.username, username))
    .limit(1);

  if (!user) return [];

  // Get boerds
  const userBoerds = await db
    .select()
    .from(boerds)
    .where(eq(boerds.userId, user.id))
    .orderBy(desc(boerds.updatedAt));

  // For each boerd, get first 5 blocks as previews
  const boerdsWithPreviews = await Promise.all(
    userBoerds.map(async (boerd) => {
      const previewBlocks = await db
        .select({ block: blocks })
        .from(connections)
        .innerJoin(blocks, eq(connections.blockId, blocks.id))
        .where(eq(connections.boerdId, boerd.id))
        .orderBy(asc(connections.position))
        .limit(5);

      // Get total block count
      const countResult = await db
        .select({ blockId: connections.blockId })
        .from(connections)
        .where(eq(connections.boerdId, boerd.id));

      return {
        ...boerd,
        user,
        blockCount: countResult.length,
        previewBlocks: previewBlocks.map((p) => p.block),
      };
    })
  );

  return boerdsWithPreviews;
}

/**
 * Get public boerds for explore page
 */
export async function getPublicBoerds(limit = 50) {
  const publicBoerds = await db.query.boerds.findMany({
    where: eq(boerds.status, 'public'),
    orderBy: [desc(boerds.updatedAt)],
    limit,
    with: {
      user: true,
    },
  });

  // Add preview blocks and counts
  const boerdsWithPreviews = await Promise.all(
    publicBoerds.map(async (boerd) => {
      const previewBlocks = await db
        .select({ block: blocks })
        .from(connections)
        .innerJoin(blocks, eq(connections.blockId, blocks.id))
        .where(eq(connections.boerdId, boerd.id))
        .orderBy(asc(connections.position))
        .limit(5);

      const countResult = await db
        .select({ blockId: connections.blockId })
        .from(connections)
        .where(eq(connections.boerdId, boerd.id));

      return {
        ...boerd,
        blockCount: countResult.length,
        previewBlocks: previewBlocks.map((p) => p.block),
      };
    })
  );

  return boerdsWithPreviews;
}
