'use client';

import { Block } from '@/components/blocks/Block';
import type { Block as BlockType } from '@boerd/database';

interface BoerdGridProps {
  blocks: BlockType[];
  className?: string;
}

/**
 * BoerdGrid - Masonry layout for blocks
 * - CSS columns (NOT Grid) for masonry effect
 * - Responsive: 1/2/3/4 columns
 * - Natural aspect ratios preserved
 */
export function BoerdGrid({ blocks, className = '' }: BoerdGridProps) {
  if (blocks.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-zinc-500 text-sm">No blocks yet</p>
        <p className="text-zinc-600 text-xs mt-1">Paste, drop, or type to add content</p>
      </div>
    );
  }

  return (
    <div className={`masonry ${className}`}>
      {blocks.map((block) => (
        <div key={block.id} className="break-inside-avoid mb-6">
          <Block block={block} />
        </div>
      ))}
    </div>
  );
}

// Also export a simple grid version for contexts where masonry isn't needed
export function BlockGrid({ blocks, className = '' }: BoerdGridProps) {
  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 ${className}`}>
      {blocks.map((block) => (
        <div key={block.id}>
          <Block block={block} />
        </div>
      ))}
    </div>
  );
}
