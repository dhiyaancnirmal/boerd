/**
 * Metadata fetching utilities for URLs
 */

import ogs from 'open-graph-scraper';
import { extract } from '@extractus/oembed-extractor';

export interface OGMetadata {
  title?: string;
  description?: string;
  image?: string;
  siteName?: string;
}

export interface OEmbedMetadata {
  type?: string;
  html?: string;
  thumbnail_url?: string;
  provider_name?: string;
  title?: string;
  width?: number;
  height?: number;
}

/**
 * Fetch Open Graph metadata from a URL
 */
export async function fetchOGMetadata(url: string): Promise<OGMetadata | null> {
  try {
    const { result } = await ogs({ url, timeout: 10000 });

    return {
      title: result.ogTitle || result.twitterTitle,
      description: result.ogDescription || result.twitterDescription,
      image: result.ogImage?.[0]?.url || result.twitterImage?.[0]?.url,
      siteName: result.ogSiteName,
    };
  } catch (error) {
    console.error('Failed to fetch OG metadata:', error);
    return null;
  }
}

/**
 * Fetch oEmbed data from a URL (for embeddable content like YouTube, Twitter)
 */
export async function fetchOEmbedData(url: string): Promise<OEmbedMetadata | null> {
  try {
    const data = await extract(url);

    if (!data) return null;

    // Cast to access optional properties that may exist
    const oembedData = data as unknown as Record<string, unknown>;

    return {
      type: data.type,
      html: typeof oembedData.html === 'string' ? oembedData.html : undefined,
      thumbnail_url: data.thumbnail_url,
      provider_name: data.provider_name,
      title: data.title,
      width: typeof oembedData.width === 'number' ? oembedData.width : undefined,
      height: typeof oembedData.height === 'number' ? oembedData.height : undefined,
    };
  } catch (error) {
    // oEmbed not supported for this URL - not an error
    return null;
  }
}

/**
 * Fetch all available metadata for a URL
 */
export async function fetchUrlMetadata(url: string): Promise<{
  og: OGMetadata | null;
  oembed: OEmbedMetadata | null;
}> {
  const [og, oembed] = await Promise.all([
    fetchOGMetadata(url),
    fetchOEmbedData(url),
  ]);

  return { og, oembed };
}

/**
 * Extract thumbnail URL from various sources
 */
export function extractThumbnailUrl(
  og: OGMetadata | null,
  oembed: OEmbedMetadata | null
): string | null {
  // Prefer oEmbed thumbnail (usually higher quality for embeds)
  if (oembed?.thumbnail_url) {
    return oembed.thumbnail_url;
  }

  // Fall back to OG image
  if (og?.image) {
    return og.image;
  }

  return null;
}

/**
 * Get title from metadata sources
 */
export function extractTitle(
  og: OGMetadata | null,
  oembed: OEmbedMetadata | null
): string | null {
  return oembed?.title || og?.title || null;
}
