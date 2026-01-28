import type { BlockType } from '@boerd/database';

/**
 * Auto-detect content type from input
 * No user selection needed - we figure it out
 */
export function detectContentType(input: string | File): BlockType {
  // Handle File inputs
  if (input instanceof File) {
    const mime = input.type;
    
    if (mime.startsWith('image/')) return 'image';
    if (mime.startsWith('video/')) return 'video';
    if (mime.startsWith('audio/')) return 'audio';
    if (mime === 'application/pdf') return 'pdf';
    
    // Fallback for unknown file types
    return 'file';
  }
  
  // Handle string inputs (pasted text or URLs)
  const trimmed = input.trim();
  
  // Check if it's a URL
  if (isUrl(trimmed)) {
    // Check for embeddable services first
    if (isYouTubeUrl(trimmed)) return 'embed';
    if (isVimeoUrl(trimmed)) return 'embed';
    if (isTwitterUrl(trimmed)) return 'embed';
    if (isInstagramUrl(trimmed)) return 'embed';
    if (isSoundCloudUrl(trimmed)) return 'embed';
    if (isSpotifyUrl(trimmed)) return 'embed';
    if (isTikTokUrl(trimmed)) return 'embed';
    
    // Check if URL points directly to media
    if (isImageUrl(trimmed)) return 'image';
    if (isVideoUrl(trimmed)) return 'video';
    if (isAudioUrl(trimmed)) return 'audio';
    if (isPdfUrl(trimmed)) return 'pdf';
    
    // Regular link - will fetch og:image
    return 'link';
  }
  
  // Plain text
  return 'text';
}

// ============================================================================
// URL Detection Helpers
// ============================================================================

function isUrl(str: string): boolean {
  try {
    new URL(str);
    return true;
  } catch {
    return false;
  }
}

function isYouTubeUrl(url: string): boolean {
  return /^https?:\/\/(www\.)?(youtube\.com|youtu\.be)\//.test(url);
}

function isVimeoUrl(url: string): boolean {
  return /^https?:\/\/(www\.)?vimeo\.com\//.test(url);
}

function isTwitterUrl(url: string): boolean {
  return /^https?:\/\/(www\.)?(twitter\.com|x\.com)\//.test(url);
}

function isInstagramUrl(url: string): boolean {
  return /^https?:\/\/(www\.)?instagram\.com\//.test(url);
}

function isSoundCloudUrl(url: string): boolean {
  return /^https?:\/\/(www\.)?soundcloud\.com\//.test(url);
}

function isSpotifyUrl(url: string): boolean {
  return /^https?:\/\/(open\.)?spotify\.com\//.test(url);
}

function isTikTokUrl(url: string): boolean {
  return /^https?:\/\/(www\.)?tiktok\.com\//.test(url);
}

// Direct media URLs (ending in file extension)
function isImageUrl(url: string): boolean {
  return /\.(jpg|jpeg|png|gif|webp|svg|bmp|ico)(\?.*)?$/i.test(url);
}

function isVideoUrl(url: string): boolean {
  return /\.(mp4|webm|mov|avi|mkv)(\?.*)?$/i.test(url);
}

function isAudioUrl(url: string): boolean {
  return /\.(mp3|wav|ogg|flac|m4a|aac)(\?.*)?$/i.test(url);
}

function isPdfUrl(url: string): boolean {
  return /\.pdf(\?.*)?$/i.test(url);
}
