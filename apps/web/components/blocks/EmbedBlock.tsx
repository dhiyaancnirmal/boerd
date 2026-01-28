import type { Block } from '@boerd/database';
import { getPlatformName } from '@/lib/format';

interface EmbedBlockProps {
  block: Block;
  className?: string;
}

/**
 * EmbedBlock - Renders embeddable content (YouTube, Twitter, etc.)
 * - Thumbnail at embed's natural aspect ratio (16:9 for video)
 * - Platform badge below: small bordered label
 * - Title/description below the badge
 */
export function EmbedBlock({ block, className = '' }: EmbedBlockProps) {
  const metadata = block.metadata as {
    oembed?: {
      type?: string;
      html?: string;
      thumbnail_url?: string;
      provider_name?: string;
      title?: string;
    };
    og?: {
      image?: string;
    };
  } | null;

  const oembed = metadata?.oembed;
  const thumbnailUrl = block.thumbnailPath || oembed?.thumbnail_url || metadata?.og?.image;
  const title = block.title || oembed?.title;
  const platform = oembed?.provider_name || (block.sourceUrl ? getPlatformName(block.sourceUrl) : 'EMBED');

  return (
    <a
      href={block.sourceUrl || '#'}
      target="_blank"
      rel="noopener noreferrer"
      className={`block hover:opacity-80 transition-opacity ${className}`}
    >
      {thumbnailUrl && (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          src={thumbnailUrl}
          alt={title || ''}
          className="w-full h-auto"
          loading="lazy"
        />
      )}
      <div className="mt-2 flex flex-col items-center">
        <span className="text-[10px] text-zinc-500 border border-zinc-700 px-2 py-0.5 uppercase tracking-wide">
          {platform}
        </span>
        {title && (
          <p className="text-xs text-zinc-500 mt-1 text-center line-clamp-2">{title}</p>
        )}
      </div>
    </a>
  );
}
