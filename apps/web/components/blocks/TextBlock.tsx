import type { Block } from '@boerd/database';

interface TextBlockProps {
  block: Block;
  className?: string;
}

/**
 * TextBlock - Renders plain text content
 * - HAS a visible border (subtle dark gray, 1px)
 * - White text on black background
 * - Padding inside
 * - Sized to content height
 */
export function TextBlock({ block, className = '' }: TextBlockProps) {
  return (
    <div className={`border border-zinc-700 p-4 ${className}`}>
      <p className="text-white text-sm whitespace-pre-wrap">
        {block.content}
      </p>
    </div>
  );
}
