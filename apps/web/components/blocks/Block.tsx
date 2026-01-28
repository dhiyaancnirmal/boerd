import type { Block as BlockType } from '@boerd/database';
import { ImageBlock } from './ImageBlock';
import { TextBlock } from './TextBlock';
import { LinkBlock } from './LinkBlock';
import { EmbedBlock } from './EmbedBlock';
import { FileBlock } from './FileBlock';
import { VideoBlock } from './VideoBlock';
import { AudioBlock } from './AudioBlock';

interface BlockProps {
  block: BlockType;
  className?: string;
}

/**
 * Block - Master component that renders the appropriate block type
 */
export function Block({ block, className = '' }: BlockProps) {
  switch (block.type) {
    case 'image':
      return <ImageBlock block={block} className={className} />;
    case 'text':
      return <TextBlock block={block} className={className} />;
    case 'link':
      return <LinkBlock block={block} className={className} />;
    case 'embed':
      return <EmbedBlock block={block} className={className} />;
    case 'video':
      return <VideoBlock block={block} className={className} />;
    case 'audio':
      return <AudioBlock block={block} className={className} />;
    case 'pdf':
    case 'file':
      return <FileBlock block={block} className={className} />;
    default:
      return (
        <div className={`border border-zinc-700 p-4 ${className}`}>
          <p className="text-xs text-zinc-500">Unknown block type</p>
        </div>
      );
  }
}

// Re-export individual components
export { ImageBlock } from './ImageBlock';
export { TextBlock } from './TextBlock';
export { LinkBlock } from './LinkBlock';
export { EmbedBlock } from './EmbedBlock';
export { FileBlock } from './FileBlock';
export { VideoBlock } from './VideoBlock';
export { AudioBlock } from './AudioBlock';
