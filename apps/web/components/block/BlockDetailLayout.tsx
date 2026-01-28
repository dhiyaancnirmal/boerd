import { Block as BlockType } from "@boerd/database";
import { Block } from "./Block";

interface BlockDetailLayoutProps {
  block: BlockType;
  connections?: Array<{
    user: { username: string };
    connectedAt: Date;
    blockId?: string;
  }>;
}

export function BlockDetailLayout({
  block,
  connections = [],
}: BlockDetailLayoutProps) {
  const { theme } =
    typeof window !== "undefined" && (window as any).useTheme
      ? (window as any).useTheme()
      : null;

  return (
    <div className="min-h-screen flex bg-black text-white">
      {/* Left side: Large content preview (60%) */}
      <div className="w-full md:w-3/5 pr-4 md:pr-0">
        <Block block={block} large />
      </div>

      {/* Right side: Sidebar (40%) */}
      <div className="w-full md:w-2/5 pr-4 md:pl-0 border-l border-zinc-800">
        {/* Title */}
        <h1
          className={cn(
            "text-2xl md:text-3xl font-bold mb-4",
            theme === "dark" ? "text-white" : "text-black",
          )}
        >
          {block.title || block.type}
        </h1>

        {/* Metadata */}
        <div className="space-y-3 mb-6">
          {block.sourceUrl && (
            <div>
              <span
                className={cn(
                  "text-xs text-zinc-600",
                  theme === "dark" ? "text-zinc-400" : "text-zinc-500",
                )}
              >
                Source
              </span>
              <a
                href={block.sourceUrl}
                className={cn(
                  "text-sm truncate block",
                  theme === "dark"
                    ? "text-zinc-400 hover:text-zinc-200"
                    : "text-zinc-600 hover:text-zinc-500",
                )}
                target="_blank"
                rel="noopener noreferrer"
              >
                {block.sourceUrl}
              </a>
            </div>
          )}

          <div className="flex items-center gap-2">
            <span
              className={cn(
                "text-xs text-zinc-600",
                theme === "dark" ? "text-zinc-400" : "text-zinc-500",
              )}
            >
              Added
            </span>
            {block.createdAt && (
              <span
                className={cn(
                  "text-xs text-zinc-600",
                  theme === "dark" ? "text-zinc-400" : "text-zinc-500",
                )}
              >
                {new Date(block.createdAt).toLocaleDateString()}
              </span>
            )}
            {block.updatedAt && block.updatedAt !== block.createdAt && (
              <span
                className={cn(
                  "text-xs text-zinc-600 ml-2",
                  theme === "dark" ? "text-zinc-400" : "text-zinc-500",
                )}
              >
                · Modified {new Date(block.updatedAt).toLocaleDateString()}
              </span>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6 border-b border-zinc-800 pb-2">
          <button className="text-sm text-zinc-600 hover:text-zinc-500 font-medium">
            Connect
          </button>
          <button className="text-sm text-zinc-400 hover:text-zinc-500 font-medium">
            Actions
          </button>
        </div>

        {/* Connection count */}
        {connections && connections.length > 0 && (
          <div className="mb-4">
            <span
              className={cn(
                "text-sm text-zinc-600",
                theme === "dark" ? "text-zinc-400" : "text-zinc-500",
              )}
            >
              Connections ({connections.length})
            </span>
          </div>
        )}

        {/* Connection list */}
        <div className="space-y-3">
          {connections.slice(0, 8).map((conn, index) => (
            <div
              key={conn.blockId}
              className="flex items-start gap-3 pb-3 border-b border-zinc-800 last:border-0"
            >
              {/* Date (right-aligned) */}
              <div className="flex-1 text-right">
                <span
                  className={cn(
                    "text-xs text-zinc-600",
                    theme === "dark" ? "text-zinc-400" : "text-zinc-500",
                  )}
                >
                  {new Date(conn.connectedAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </div>

              {/* Username and stats */}
              <div className="flex-1 items-center gap-2">
                {conn.user && (
                  <a
                    href={`/${conn.user.username}`}
                    className={cn(
                      "text-sm font-medium hover:underline",
                      theme === "dark"
                        ? "text-zinc-200 hover:text-white"
                        : "text-zinc-600 hover:text-black",
                    )}
                  >
                    {conn.user.displayName || conn.user.username}
                  </a>
                )}

                {conn.blockId && (
                  <span
                    className={cn(
                      "text-xs text-zinc-500",
                      theme === "dark" ? "text-zinc-400" : "text-zinc-600",
                    )}
                  >
                    {conn.blockId}
                  </span>
                )}
              </div>
            </div>
          ))}
          {connections.length > 8 && (
            <div className="pt-4 text-center">
              <a
                href="#"
                className={cn(
                  "text-sm text-zinc-600 hover:text-zinc-500",
                  theme === "dark"
                    ? "text-zinc-200 hover:text-white"
                    : "text-zinc-400 hover:text-black",
                )}
              >
                View all connections
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
