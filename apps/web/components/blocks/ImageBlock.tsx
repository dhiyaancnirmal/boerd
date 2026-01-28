import type { Block } from '@boerd/database';

interface ImageBlockProps {
  block: Block;
  className?: string;
}

/**
 * ImageBlock - Renders image content
 * - No border on the image itself
 * - Image fills width, height is natural
 * - Filename or title below in small gray text
 */
export function ImageBlock({ block, className = '' }: ImageBlockProps) {
  const src = block.assetPath || block.sourceUrl || '';
  const label = block.title || getFilename(src);

  return (
    <div className={className}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={block.title || ''}
        className="w-full h-auto"
        loading="lazy"
      />
      {label && (
        <p className="text-xs text-zinc-500 mt-2 truncate">{label}</p>
      )}
    </div>
  );
}

function getFilename(path: string): string {
  if (!path) return '';
  const parts = path.split('/');
  return parts[parts.length - 1] || '';
}
