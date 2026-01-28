import { Header } from '@/components/layout/Header';
import { Navigation } from '@/components/layout/Navigation';
import { BoerdCard } from '@/components/boerd/BoerdCard';
import { Block } from '@/components/blocks/Block';
import { getPublicBoerds } from '@/actions/boerds';
import { getRecentBlocks } from '@/actions/blocks';

export const metadata = {
  title: 'Explore',
};

export default async function ExplorePage() {
  const [boerds, blocks] = await Promise.all([
    getPublicBoerds(20),
    getRecentBlocks(20),
  ]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header currentPath="/explore" />

      <main className="flex-1 max-w-content mx-auto w-full px-4 sm:px-12 py-8">
        <Navigation />

        <div className="mb-8">
          <h1 className="text-2xl font-medium mb-6">Explore</h1>
        </div>

        {/* Public Boerds */}
        {boerds.length > 0 && (
          <section className="mb-12">
            <h2 className="text-lg font-medium mb-4">Public Boerds</h2>
            <div className="masonry">
              {boerds.map((boerd) => (
                <div key={boerd.id} className="break-inside-avoid mb-6">
                  <BoerdCard boerd={boerd} />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Recent Blocks */}
        {blocks.length > 0 && (
          <section>
            <h2 className="text-lg font-medium mb-4">Recent Blocks</h2>
            <div className="masonry">
              {blocks.map((block) => (
                <div key={block.id} className="break-inside-avoid mb-6">
                  <Block block={block} />
                </div>
              ))}
            </div>
          </section>
        )}

        {boerds.length === 0 && blocks.length === 0 && (
          <div className="text-center py-16">
            <p className="text-zinc-500">No public content yet</p>
            <p className="text-zinc-600 text-sm mt-2">Be the first to create something!</p>
          </div>
        )}
      </main>
    </div>
  );
}
