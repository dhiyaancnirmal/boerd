export { db, rawDb } from './client';
export * from './schema';

// Re-export drizzle-orm utilities for convenience
export { eq, and, or, not, desc, asc, gt, lt, gte, lte, sql, inArray } from 'drizzle-orm';
