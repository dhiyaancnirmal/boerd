"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { useSearchParams, useRouter } from "next/navigation";

type ViewOption = "all" | "channels" | "blocks";
type SortOption = "recent" | "random";

interface FilterBarProps {
  currentView?: ViewOption;
  currentSort?: SortOption;
}

export function FilterBar({
  currentView = "all",
  currentSort = "recent",
}: FilterBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function setView(view: ViewOption) {
    const params = new URLSearchParams(searchParams);
    params.set("view", view);
    router.push(`/?${params.toString()}`);
  }

  function setSort(sort: SortOption) {
    const params = new URLSearchParams(searchParams);
    params.set("sort", sort);
    router.push(`/?${params.toString()}`);
  }

  return (
    <div className="border-b border-zinc-800 bg-black pb-4">
      <div className="max-w-content mx-auto px-4 sm:px-12 py-3">
        <div className="flex items-center gap-6">
          {/* View Options */}
          <div className="flex items-center gap-4">
            <span className="text-sm text-zinc-600">View:</span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setView("all")}
                className={cn(
                  "text-sm px-3 py-1.5 rounded-md transition-colors",
                  currentView === "all"
                    ? "bg-black text-white border-zinc-700"
                    : "bg-transparent text-zinc-500 hover:text-zinc-300",
                )}
              >
                All
                {currentView === "all" && (
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-zinc-600 ml-2" />
                )}
              </button>
              <button
                onClick={() => setView("channels")}
                className={cn(
                  "text-sm px-3 py-1.5 rounded-md transition-colors",
                  currentView === "channels"
                    ? "bg-black text-white border-zinc-700"
                    : "bg-transparent text-zinc-500 hover:text-zinc-300",
                )}
              >
                Channels
                {currentView === "channels" && (
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-zinc-600 ml-2" />
                )}
              </button>
              <button
                onClick={() => setView("blocks")}
                className={cn(
                  "text-sm px-3 py-1.5 rounded-md transition-colors",
                  currentView === "blocks"
                    ? "bg-black text-white border-zinc-700"
                    : "bg-transparent text-zinc-500 hover:text-zinc-300",
                )}
              >
                Blocks
                {currentView === "blocks" && (
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-zinc-600 ml-2" />
                )}
              </button>
            </div>
          </div>

          {/* Sort Options */}
          <div className="flex items-center gap-4">
            <span className="text-sm text-zinc-600">Sort:</span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSort("recent")}
                className={cn(
                  "text-sm px-3 py-1.5 rounded-md transition-colors",
                  currentSort === "recent"
                    ? "bg-black text-white border-zinc-700"
                    : "bg-transparent text-zinc-500 hover:text-zinc-300",
                )}
              >
                Recently updated
                {currentSort === "recent" && (
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-zinc-600 ml-2" />
                )}
              </button>
              <button
                onClick={() => setSort("random")}
                className={cn(
                  "text-sm px-3 py-1.5 rounded-md transition-colors",
                  currentSort === "random"
                    ? "bg-black text-white border-zinc-700"
                    : "bg-transparent text-zinc-500 hover:text-zinc-300",
                )}
              >
                Random
                {currentSort === "random" && (
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-zinc-600 ml-2" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FilterBar;
