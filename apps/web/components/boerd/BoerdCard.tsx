import Link from 'next/link';
import type { Block, Boerd, User } from '@boerd/database';
import { formatRelativeTime } from '@/lib/format';

interface BoerdCardProps {
  boerd: Boerd & {
    user: User;
    blockCount: number;
    previewBlocks?: Block[];
  };
  variant?: 'compact' | 'horizontal';
}

/**
 * BoerdCard - Preview card for a boerd
 * - Compact: centered text, minimal info
 * - Horizontal: info on left, block previews on right
 */
export function BoerdCard({ boerd, variant = 'compact' }: BoerdCardProps) {
  const href = `/${boerd.user.username}/${boerd.slug}`;

  if (variant === 'horizontal') {
    return <HorizontalCard boerd={boerd} href={href} />;
  }

  return <CompactCard boerd={boerd} href={href} />;
}

function CompactCard({ boerd, href }: { boerd: BoerdCardProps['boerd']; href: string }) {
  const relativeTime = formatRelativeTime(boerd.updatedAt);

  return (
    <Link
      href={href}
      className="block border border-zinc-800 p-6 hover:border-zinc-600 transition-colors"
    >
      <div className="flex flex-col items-center justify-center min-h-[160px] text-center">
        <span className="text-[#6B8E6B] hover:underline text-base">
          {boerd.title}
        </span>
        <p className="text-xs text-zinc-500 mt-1">by {boerd.user.displayName || boerd.user.username}</p>
        <p className="text-xs text-zinc-500">{boerd.blockCount} blocks</p>
        <p className="text-xs text-zinc-500">{relativeTime}</p>
      </div>
    </Link>
  );
}

function HorizontalCard({ boerd, href }: { boerd: BoerdCardProps['boerd']; href: string }) {
  const relativeTime = formatRelativeTime(boerd.updatedAt);
  const previewBlocks = boerd.previewBlocks || [];

  return (
    <Link
      href={href}
      className="block border border-zinc-800 p-4 hover:border-zinc-600 transition-colors"
    >
      <div className="flex items-center gap-6">
        <div className="min-w-[150px]">
          <span className="text-[#6B8E6B] hover:underline">
            {boerd.title}
          </span>
          <p className="text-xs text-zinc-500 mt-1">by {boerd.user.displayName || boerd.user.username}</p>
          <p className="text-xs text-zinc-500">{boerd.blockCount} blocks</p>
          <p className="text-xs text-zinc-500">{relativeTime}</p>
        </div>

        {previewBlocks.length > 0 && (
          <div className="flex gap-2 flex-1 justify-end overflow-hidden">
            {previewBlocks.slice(0, 5).map((block) => (
              <BlockThumbnail key={block.id} block={block} />
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}

function BlockThumbnail({ block }: { block: Block }) {
  const thumbnailUrl = block.thumbnailPath || block.assetPath;

  if (block.type === 'text') {
    return (
      <div className="w-12 h-12 border border-zinc-700 bg-black flex-shrink-0 p-1 overflow-hidden">
        <p className="text-[6px] text-white leading-tight line-clamp-4">
          {block.content?.slice(0, 50)}
        </p>
      </div>
    );
  }

  if (thumbnailUrl) {
    return (
      /* eslint-disable-next-line @next/next/no-img-element */
      <img
        src={thumbnailUrl}
        alt=""
        className="w-12 h-12 object-cover flex-shrink-0"
      />
    );
  }

  return (
    <div className="w-12 h-12 bg-zinc-900 flex-shrink-0 flex items-center justify-center">
      <span className="text-[8px] text-zinc-500 uppercase">{block.type}</span>
    </div>
  );
}
