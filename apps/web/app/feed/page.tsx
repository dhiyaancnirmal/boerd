import { Header } from '@/components/layout/Header';
import { Navigation } from '@/components/layout/Navigation';
import { FeedItem } from '@/components/feed/FeedItem';
import { getRecentActivity } from '@/actions/connections';

export const metadata = {
  title: 'Feed',
};

export default async function FeedPage() {
  const activity = await getRecentActivity(50);

  return (
    <div className="min-h-screen flex flex-col">
      <Header currentPath="/feed" />

      <main className="flex-1 max-w-content mx-auto w-full px-4 sm:px-12 py-8">
        <Navigation />

        <div className="mb-8">
          <h1 className="text-2xl font-medium mb-6">Feed</h1>
        </div>

        {activity.length > 0 ? (
          <div>
            {activity.map((item, index) => (
              <FeedItem
                key={`${item.boerd.id}-${index}`}
                boerd={item.boerd}
                blocks={item.blocks}
                connectedAt={item.connectedAt}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-zinc-500">No activity yet</p>
            <p className="text-zinc-600 text-sm mt-2">Start adding blocks to your boerds to see activity here</p>
          </div>
        )}
      </main>
    </div>
  );
}
