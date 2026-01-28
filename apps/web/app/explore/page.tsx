import { Header } from "@/components/layout/Header";
import { BoerdCard } from "@/components/boerd/BoerdCard";
import { Block } from "@/components/blocks/Block";
import { getPublicBoerds } from "@/actions/boerds";
import { getRecentBlocks } from "@/actions/blocks";
import FilterBar from "@/components/explore/FilterBar";

export const metadata = {
  title: "Explore",
};

export default async function ExplorePage({
  searchParams,
}: {
  searchParams: {
    view?: "all" | "channels" | "blocks";
    sort?: "recent" | "random";
  };
}) {
  const view = searchParams.view || "all";
  const sort = searchParams.sort || "recent";

  const [boerds, blocks] = await Promise.all([
    getPublicBoerds(20),
    getRecentBlocks(20),
  ]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header currentPath="/explore" />

      <main className="flex-1 max-w-content mx-auto w-full px-4 sm:px-12 py-8">
        <FilterBar currentView={view} currentSort={sort} />

        <div className="mb-8">
          <h1 className="text-2xl font-medium">Explore</h1>
        </div>

        {/* Public Boerds */}
        {view === "all" ||
          (view === "channels" && (
            <section className="mb-12">
              <h2 className="text-lg font-medium mb-6">Public Boerds</h2>
              {boerds.length > 0 ? (
                <div className="masonry">
                  {boerds.map((boerd) => (
                    <div key={boerd.id} className="break-inside-avoid mb-6">
                      <BoerdCard boerd={boerd} />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <p className="text-zinc-500">No public boerds yet</p>
                </div>
              )}
            </section>
          ))}

        {/* Recent Blocks */}
        {view === "all" ||
          (view === "blocks" && (
            <section>
              <h2 className="text-lg font-medium mb-6">Recent Blocks</h2>
              {blocks.length > 0 ? (
                <div className="masonry">
                  {blocks.map((block) => (
                    <div key={block.id} className="break-inside-avoid mb-6">
                      <Block block={block} />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <p className="text-zinc-500">No blocks yet</p>
                </div>
              )}
            </section>
          ))}

        {boerds.length === 0 && blocks.length === 0 && (
          <div className="text-center py-16">
            <p className="text-zinc-500">No content yet</p>
            <p className="text-zinc-600 text-sm mt-2">
              Be the first to create something!
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
