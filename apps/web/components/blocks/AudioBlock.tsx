import type { Block } from '@boerd/database';
import { Music2 } from 'lucide-react';
import { formatFileSize } from '@/lib/format';

interface AudioBlockProps {
  block: Block;
  className?: string;
}

/**
 * AudioBlock - Renders audio file content
 * - Waveform/music icon
 * - Filename and size
 */
export function AudioBlock({ block, className = '' }: AudioBlockProps) {
  const metadata = block.metadata as {
    mimeType?: string;
    size?: number;
    duration?: number;
  } | null;

  const filename = block.title || getFilename(block.assetPath || block.sourceUrl || '');
  const size = metadata?.size ? formatFileSize(metadata.size) : '';
  const audioUrl = block.assetPath || block.sourceUrl || '';

  return (
    <div className={`border border-zinc-700 p-4 ${className}`}>
      <a
        href={audioUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-3 hover:opacity-80 transition-opacity"
      >
        <div className="w-10 h-10 bg-zinc-800 rounded flex items-center justify-center flex-shrink-0">
          <Music2 className="w-5 h-5 text-zinc-400" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm text-white truncate">{filename}</p>
          {size && (
            <p className="text-xs text-zinc-500">{size}</p>
          )}
        </div>
      </a>
    </div>
  );
}

function getFilename(path: string): string {
  if (!path) return 'audio';
  const parts = path.split('/');
  return parts[parts.length - 1] || 'audio';
}
