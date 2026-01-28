import type { Block } from '@boerd/database';
import { FileText, File as FileIcon } from 'lucide-react';
import { formatFileSize } from '@/lib/format';

interface FileBlockProps {
  block: Block;
  className?: string;
}

/**
 * FileBlock - Renders generic file content
 * - File icon or preview if available
 * - Filename below
 * - File size
 */
export function FileBlock({ block, className = '' }: FileBlockProps) {
  const metadata = block.metadata as {
    mimeType?: string;
    size?: number;
  } | null;

  const filename = block.title || getFilename(block.assetPath || '');
  const size = metadata?.size ? formatFileSize(metadata.size) : '';
  const isPdf = block.type === 'pdf' || metadata?.mimeType === 'application/pdf';

  return (
    <a
      href={block.assetPath || block.sourceUrl || '#'}
      target="_blank"
      rel="noopener noreferrer"
      className={`block border border-zinc-700 p-6 hover:border-zinc-500 transition-colors ${className}`}
    >
      <div className="flex flex-col items-center text-center">
        {isPdf ? (
          <FileText className="w-12 h-12 text-zinc-500 mb-3" />
        ) : (
          <FileIcon className="w-12 h-12 text-zinc-500 mb-3" />
        )}
        <p className="text-sm text-white truncate max-w-full">{filename}</p>
        {size && (
          <p className="text-xs text-zinc-500 mt-1">{size}</p>
        )}
      </div>
    </a>
  );
}

function getFilename(path: string): string {
  if (!path) return 'file';
  const parts = path.split('/');
  return parts[parts.length - 1] || 'file';
}
