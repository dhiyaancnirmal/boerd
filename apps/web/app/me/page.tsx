import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Navigation } from '@/components/layout/Navigation';
import { BoerdCard } from '@/components/boerd/BoerdCard';
import { getUserBoerds } from '@/actions/boerds';
import { db, users, eq } from '@boerd/database';

export const metadata = {
  title: 'My Profile',
};

export default async function ProfilePage() {
  const username = 'me';

  // Get user
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.username, username))
    .limit(1);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-zinc-500">User not found</p>
          <p className="text-zinc-600 text-sm mt-2">Run database seed to create default user</p>
        </div>
      </div>
    );
  }

  const boerds = await getUserBoerds(username);

  return (
    <div className="min-h-screen flex flex-col">
      <Header currentPath="/me" />

      <main className="flex-1 max-w-content mx-auto w-full px-4 sm:px-12 py-8">
        <Navigation breadcrumbs={[{ label: 'Me' }]} />

        <div className="mb-8">
          <h1 className="text-2xl font-medium mb-2">{user.displayName || user.username}</h1>
          <p className="text-sm text-zinc-500">{boerds.length} boerds</p>
        </div>

        <div className="mb-6">
          <Link
            href="/new"
            className="inline-block px-4 py-2 bg-[#6B8E6B] text-white text-sm hover:opacity-80 transition-opacity"
          >
            New boerd +
          </Link>
        </div>

        {boerds.length > 0 ? (
          <div className="space-y-4">
            {boerds.map((boerd) => (
              <BoerdCard key={boerd.id} boerd={boerd} variant="horizontal" />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-zinc-500">No boerds yet</p>
            <p className="text-zinc-600 text-sm mt-2">Create your first boerd to get started</p>
          </div>
        )}
      </main>
    </div>
  );
}
