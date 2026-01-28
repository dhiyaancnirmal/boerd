import type { Block } from '@boerd/database';
import { getHostname } from '@/lib/format';

interface LinkBlockProps {
  block: Block;
  className?: string;
}

/**
 * LinkBlock - Renders URL content with og:image preview
 * - Shows og:image fetched from the URL
 * - May include preview text from og:description
 * - Site name or page title below in gray
 */
export function LinkBlock({ block, className = '' }: LinkBlockProps) {
  const metadata = block.metadata as {
    og?: {
      title?: string;
      description?: string;
      image?: string;
      siteName?: string;
    };
  } | null;

  const og = metadata?.og;
  const imageUrl = block.thumbnailPath || og?.image;
  const title = block.title || og?.title;
  const description = block.description || og?.description;
  const siteName = og?.siteName || (block.sourceUrl ? getHostname(block.sourceUrl) : '');

  return (
    <a
      href={block.sourceUrl || '#'}
      target="_blank"
      rel="noopener noreferrer"
      className={`block hover:opacity-80 transition-opacity ${className}`}
    >
      {imageUrl && (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          src={imageUrl}
          alt={title || ''}
          className="w-full h-auto"
          loading="lazy"
        />
      )}
      {description && (
        <p className="text-sm text-zinc-400 mt-2 line-clamp-2">{description}</p>
      )}
      {siteName && (
        <p className="text-xs text-zinc-500 mt-2">{siteName}</p>
      )}
    </a>
  );
}
