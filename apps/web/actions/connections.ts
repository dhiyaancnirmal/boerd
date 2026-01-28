'use server';

import { db, connections, boerds, eq, and, desc, asc, gt, lt, sql } from '@boerd/database';
import { createId } from '@paralleldrive/cuid2';
import { revalidatePath } from 'next/cache';

/**
 * Connect a block to a boerd
 */
export async function connectBlock(
  blockId: string,
  boerdId: string
): Promise<boolean> {
  // Check if already connected
  const existing = await db
    .select()
    .from(connections)
    .where(and(eq(connections.blockId, blockId), eq(connections.boerdId, boerdId)))
    .limit(1);

  if (existing.length > 0) {
    return false; // Already connected
  }

  // Get the next position
  const maxPos = await db
    .select({ position: connections.position })
    .from(connections)
    .where(eq(connections.boerdId, boerdId))
    .orderBy(desc(connections.position))
    .limit(1);

  const nextPosition = maxPos.length > 0 ? maxPos[0].position + 1 : 0;

  await db.insert(connections).values({
    id: createId(),
    blockId,
    boerdId,
    position: nextPosition,
    connectedAt: new Date(),
  });

  // Update boerd's updatedAt
  await db
    .update(boerds)
    .set({ updatedAt: new Date() })
    .where(eq(boerds.id, boerdId));

  revalidatePath('/');
  return true;
}

/**
 * Disconnect a block from a boerd
 */
export async function disconnectBlock(
  blockId: string,
  boerdId: string
): Promise<boolean> {
  await db
    .delete(connections)
    .where(and(eq(connections.blockId, blockId), eq(connections.boerdId, boerdId)));

  // Update boerd's updatedAt
  await db
    .update(boerds)
    .set({ updatedAt: new Date() })
    .where(eq(boerds.id, boerdId));

  revalidatePath('/');
  return true;
}

/**
 * Reorder blocks within a boerd
 * Takes an array of block IDs in their new order
 */
export async function reorderBlocks(
  boerdId: string,
  blockIds: string[]
): Promise<boolean> {
  // Use a transaction to update all positions
  // In Drizzle with SQLite, we can use db.batch for multiple statements

  const updates = blockIds.map((blockId, index) =>
    db
      .update(connections)
      .set({ position: index })
      .where(and(eq(connections.blockId, blockId), eq(connections.boerdId, boerdId)))
  );

  // Execute all updates
  await Promise.all(updates);

  // Update boerd's updatedAt
  await db
    .update(boerds)
    .set({ updatedAt: new Date() })
    .where(eq(boerds.id, boerdId));

  revalidatePath('/');
  return true;
}

/**
 * Move a block to a specific position
 */
export async function moveBlock(
  blockId: string,
  boerdId: string,
  newPosition: number
): Promise<boolean> {
  // Get current connection
  const [current] = await db
    .select()
    .from(connections)
    .where(and(eq(connections.blockId, blockId), eq(connections.boerdId, boerdId)))
    .limit(1);

  if (!current) return false;

  const oldPosition = current.position;

  if (oldPosition === newPosition) return true;

  if (oldPosition < newPosition) {
    // Moving down - shift items between old and new position up
    await db
      .update(connections)
      .set({ position: sql`${connections.position} - 1` })
      .where(
        and(
          eq(connections.boerdId, boerdId),
          gt(connections.position, oldPosition),
          lt(connections.position, newPosition + 1)
        )
      );
  } else {
    // Moving up - shift items between new and old position down
    await db
      .update(connections)
      .set({ position: sql`${connections.position} + 1` })
      .where(
        and(
          eq(connections.boerdId, boerdId),
          gt(connections.position, newPosition - 1),
          lt(connections.position, oldPosition)
        )
      );
  }

  // Update the moved block's position
  await db
    .update(connections)
    .set({ position: newPosition })
    .where(and(eq(connections.blockId, blockId), eq(connections.boerdId, boerdId)));

  revalidatePath('/');
  return true;
}

/**
 * Get recent activity (connections) for the feed
 */
export async function getRecentActivity(limit = 50) {
  const activity = await db.query.connections.findMany({
    orderBy: [desc(connections.connectedAt)],
    limit,
    with: {
      block: {
        with: {
          user: true,
        },
      },
      boerd: {
        with: {
          user: true,
        },
      },
    },
  });

  // Group by boerd and time window (within 5 minutes)
  const grouped: Map<
    string,
    {
      boerd: typeof activity[0]['boerd'];
      blocks: typeof activity[0]['block'][];
      connectedAt: Date;
    }
  > = new Map();

  activity.forEach((conn) => {
    // Create a key based on boerd and rough time window
    const timeKey = Math.floor(conn.connectedAt.getTime() / (5 * 60 * 1000)); // 5 minute windows
    const key = `${conn.boerd.id}-${timeKey}`;

    if (grouped.has(key)) {
      grouped.get(key)!.blocks.push(conn.block);
    } else {
      grouped.set(key, {
        boerd: conn.boerd,
        blocks: [conn.block],
        connectedAt: conn.connectedAt,
      });
    }
  });

  return Array.from(grouped.values()).slice(0, limit);
}
