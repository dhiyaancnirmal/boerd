'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Navigation } from '@/components/layout/Navigation';
import { createBoerd } from '@/actions/boerds';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function NewBoerdPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<'public' | 'private'>('private');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsSubmitting(true);

    try {
      const boerd = await createBoerd(title, description || undefined, status);
      router.push(`/me/${boerd.slug}`);
    } catch (error) {
      console.error('Failed to create boerd:', error);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header currentPath="/new" />

      <main className="flex-1 max-w-content mx-auto w-full px-4 sm:px-12 py-8">
        <Navigation breadcrumbs={[{ label: 'me', href: '/me' }, { label: 'New boerd' }]} />

        <div className="mb-8">
          <h1 className="text-2xl font-medium mb-6">Create a new boerd</h1>
        </div>

        <form onSubmit={handleSubmit} className="max-w-lg">
          <div className="mb-6">
            <label htmlFor="title" className="block text-sm text-zinc-400 mb-2">
              Title *
            </label>
            <Input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="My collection"
              required
              disabled={isSubmitting}
            />
          </div>

          <div className="mb-6">
            <label htmlFor="description" className="block text-sm text-zinc-400 mb-2">
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What is this boerd about?"
              rows={3}
              disabled={isSubmitting}
              className="w-full px-3 py-2 bg-black border border-zinc-700 text-white placeholder-zinc-500 focus:border-[#6B8E6B] focus:outline-none transition-colors"
            />
          </div>

          <div className="mb-8">
            <label className="block text-sm text-zinc-400 mb-2">Visibility</label>
            <div className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="status"
                  value="private"
                  checked={status === 'private'}
                  onChange={() => setStatus('private')}
                  disabled={isSubmitting}
                  className="text-[#6B8E6B]"
                />
                <span className="text-sm">Private — Only you can see this</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="status"
                  value="public"
                  checked={status === 'public'}
                  onChange={() => setStatus('public')}
                  disabled={isSubmitting}
                  className="text-[#6B8E6B]"
                />
                <span className="text-sm">Public — Anyone can see this</span>
              </label>
            </div>
          </div>

          <div className="flex gap-4">
            <Button type="submit" disabled={!title.trim() || isSubmitting}>
              {isSubmitting ? 'Creating...' : 'Create boerd'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
}
