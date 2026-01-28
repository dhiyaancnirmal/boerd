#!/usr/bin/env bun

import { db, users } from './index';
import { eq } from 'drizzle-orm';

console.log('\n🌱 Seeding database...\n');

// Create default user for MVP
const defaultUserId = 'default-user';

const existingUser = await db
  .select()
  .from(users)
  .where(eq(users.id, defaultUserId))
  .limit(1);

if (existingUser.length === 0) {
  await db.insert(users).values({
    id: defaultUserId,
    username: 'me',
    displayName: 'Me',
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  console.log('✓ Created default user (username: me)');
} else {
  console.log('✓ Default user already exists');
}

console.log('\n✅ Seeding complete!\n');
