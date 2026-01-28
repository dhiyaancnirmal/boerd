import Link from 'next/link';
import { Block } from '@/components/blocks/Block';
import { formatRelativeTime, formatBlockList } from '@/lib/format';
import type { Block as BlockType, Boerd, User } from '@boerd/database';

interface FeedItemProps {
  boerd: Boerd & { user: User };
  blocks: BlockType[];
  connectedAt: Date;
}

/**
 * FeedItem - Activity display for the feed
 * - Activity sentence: "{username} connected {N} {types} to {boerd}"
 * - Blocks displayed below
 */
export function FeedItem({ boerd, blocks, connectedAt }: FeedItemProps) {
  const relativeTime = formatRelativeTime(connectedAt);
  const blockTypes = blocks.map((b) => b.type);
  const blockListText = formatBlockList(blockTypes);

  return (
    <div className="mb-16">
      {/* Activity sentence */}
      <div className="text-center mb-8">
        <p className="text-sm">
          <Link href={`/${boerd.user.username}`} className="text-[#6B8E6B] hover:underline">
            {boerd.user.displayName || boerd.user.username}
          </Link>
          {' '}connected {blockListText} to{' '}
          <Link href={`/${boerd.user.username}/${boerd.slug}`} className="text-white font-semibold hover:underline">
            {boerd.title}
          </Link>
        </p>
        <p className="text-xs text-zinc-500 mt-1">{relativeTime}</p>
      </div>

      {/* Blocks - loosely arranged, centered */}
      <div className="flex flex-wrap justify-center gap-4 max-w-4xl mx-auto">
        {blocks.map((block) => (
          <div key={block.id} className="max-w-[250px]">
            <Block block={block} />
          </div>
        ))}
      </div>
    </div>
  );
}
