import Link from "next/link";
import { cn } from "@/lib/utils";

interface ProfileSidebarProps {
  username: string;
  joinedDate: string;
  followersCount?: number;
  followingCount?: number;
  channelsCount?: number;
  blocksCount?: number;
}

export function ProfileSidebar({
  username,
  joinedDate,
  followersCount = 0,
  followingCount = 0,
  channelsCount = 0,
  blocksCount = 0,
}: ProfileSidebarProps) {
  return (
    <div className="w-64 flex-shrink-0 border-l border-zinc-800 bg-black p-4">
      <h2 className="text-xl font-bold mb-4">{username}</h2>

      {/* Metadata */}
      <div className="space-y-3 mb-6">
        <div className="flex items-center gap-2 text-sm">
          <span className="text-zinc-600">Joined</span>
          <span className="font-medium">
            {new Date(joinedDate).toLocaleDateString("en-US", {
              month: "long",
              year: "numeric",
            })}
          </span>
        </div>

        <div className="flex flex-wrap gap-4 text-sm">
          <Link
            href="/groups"
            className="text-zinc-600 hover:text-zinc-400 transition-colors"
          >
            <span>Groups</span>
            {followersCount > 0 && (
              <span className="ml-1 text-zinc-500">({followersCount})</span>
            )}
          </Link>

          <Link
            href="/followers"
            className="text-zinc-600 hover:text-zinc-400 transition-colors"
          >
            <span>Followers</span>
            {followingCount > 0 && (
              <span className="ml-1 text-zinc-500">({followingCount})</span>
            )}
          </Link>

          <Link
            href="/following"
            className="text-zinc-600 hover:text-zinc-400 transition-colors"
          >
            <span>Following</span>
            {followingCount > 0 && (
              <span className="ml-1 text-zinc-500">({followingCount})</span>
            )}
          </Link>
        </div>
      </div>

      {/* View filters */}
      <div className="mb-4">
        <h3 className="text-sm font-medium mb-3 text-zinc-600">View</h3>
        <div className="space-y-2">
          <Link
            href={`/${username}/channels`}
            className="flex items-center gap-2 text-sm hover:text-zinc-400 transition-colors"
          >
            <span>Channels</span>
            {channelsCount > 0 && (
              <span className="ml-1 text-zinc-500">({channelsCount})</span>
            )}
          </Link>

          <Link
            href={`/${username}/blocks`}
            className="flex items-center gap-2 text-sm hover:text-zinc-400 transition-colors"
          >
            <span>Blocks</span>
            {blocksCount > 0 && (
              <span className="ml-1 text-zinc-500">({blocksCount})</span>
            )}
          </Link>

          <Link
            href={`/${username}/tables`}
            className="flex items-center gap-2 text-sm hover:text-zinc-400 transition-colors"
          >
            <span>Tables</span>
          </Link>

          <Link
            href={`/${username}/links`}
            className="flex items-center gap-2 text-sm hover:text-zinc-400 transition-colors"
          >
            <span>Links</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
