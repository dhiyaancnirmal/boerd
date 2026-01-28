import type { Block } from '@boerd/database';
import { Play } from 'lucide-react';

interface VideoBlockProps {
  block: Block;
  className?: string;
}

/**
 * VideoBlock - Renders video file content
 * - Thumbnail with play icon overlay
 * - Filename below
 */
export function VideoBlock({ block, className = '' }: VideoBlockProps) {
  const thumbnailUrl = block.thumbnailPath;
  const filename = block.title || getFilename(block.assetPath || block.sourceUrl || '');
  const videoUrl = block.assetPath || block.sourceUrl || '';

  return (
    <a
      href={videoUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`block hover:opacity-80 transition-opacity ${className}`}
    >
      <div className="relative">
        {thumbnailUrl ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={thumbnailUrl}
            alt={filename}
            className="w-full h-auto"
            loading="lazy"
          />
        ) : (
          <div className="aspect-video bg-zinc-900 flex items-center justify-center">
            <Play className="w-12 h-12 text-zinc-500" />
          </div>
        )}
        {thumbnailUrl && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-black/60 flex items-center justify-center">
              <Play className="w-6 h-6 text-white ml-0.5" />
            </div>
          </div>
        )}
      </div>
      {filename && (
        <p className="text-xs text-zinc-500 mt-2 truncate">{filename}</p>
      )}
    </a>
  );
}

function getFilename(path: string): string {
  if (!path) return '';
  const parts = path.split('/');
  return parts[parts.length - 1] || '';
}
