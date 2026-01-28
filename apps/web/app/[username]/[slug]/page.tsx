import { notFound } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Navigation } from '@/components/layout/Navigation';
import { BoerdGrid } from '@/components/boerd/BoerdGrid';
import { AddZone } from '@/components/boerd/AddZone';
import { getBoerd } from '@/actions/boerds';

interface BoerdPageProps {
  params: Promise<{ username: string; slug: string }>;
}

export async function generateMetadata({ params }: BoerdPageProps) {
  const { username, slug } = await params;
  const boerd = await getBoerd(username, slug);

  return {
    title: boerd?.title || slug,
  };
}

export default async function BoerdPage({ params }: BoerdPageProps) {
  const { username, slug } = await params;
  const boerd = await getBoerd(username, slug);

  if (!boerd) {
    notFound();
  }

  const isOwner = username === 'me';

  return (
    <div className="min-h-screen flex flex-col">
      <Header currentPath={`/${username}/${slug}`} />

      <main className="flex-1 max-w-content mx-auto w-full px-4 sm:px-12 py-8">
        <Navigation
          breadcrumbs={[
            { label: username, href: `/${username}` },
            { label: boerd.title },
          ]}
        />

        <div className="mb-8">
          <h1 className="text-2xl font-medium mb-2">{boerd.title}</h1>
          {boerd.description && (
            <p className="text-sm text-zinc-400">{boerd.description}</p>
          )}
          <p className="text-sm text-zinc-500 mt-2">
            {boerd.blocks.length} blocks · {boerd.status === 'public' ? 'Public' : 'Private'}
          </p>
        </div>

        {isOwner && (
          <div className="mb-8">
            <AddZone boerdId={boerd.id} />
          </div>
        )}

        <BoerdGrid blocks={boerd.blocks} />
      </main>
    </div>
  );
}
