/**
 * Slug generation utilities
 */

/**
 * Generate a URL-safe slug from a title
 */
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    // Replace spaces and underscores with hyphens
    .replace(/[\s_]+/g, '-')
    // Remove non-alphanumeric characters except hyphens
    .replace(/[^a-z0-9-]/g, '')
    // Replace multiple hyphens with single hyphen
    .replace(/-+/g, '-')
    // Remove leading/trailing hyphens
    .replace(/^-|-$/g, '')
    // Limit length
    .slice(0, 50);
}

/**
 * Generate a unique slug by appending a random suffix if needed
 */
export function generateUniqueSlug(title: string, existingSlugs: string[]): string {
  const baseSlug = generateSlug(title) || 'untitled';

  if (!existingSlugs.includes(baseSlug)) {
    return baseSlug;
  }

  // Try numeric suffixes first
  for (let i = 1; i <= 100; i++) {
    const slug = `${baseSlug}-${i}`;
    if (!existingSlugs.includes(slug)) {
      return slug;
    }
  }

  // Fallback to random suffix
  const randomSuffix = Math.random().toString(36).slice(2, 8);
  return `${baseSlug}-${randomSuffix}`;
}
