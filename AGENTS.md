# AGENTS.md — Implementation Guide

---

## What is Boerd?

A moodboard app. Paste, drop, or type anything — it becomes a **block**. Blocks live in **boerds** (collections). A block can exist in multiple boerds simultaneously.

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Runtime | Bun (not Node) |
| Framework | Next.js 16 (App Router, Turbopack) |
| Database | `bun:sqlite` + Drizzle ORM |
| UI | Tailwind CSS + shadcn/ui |
| Font | Neue Haas Grotesk Text Pro |

---

## Critical: Read UI_DESIGN_GUIDE.md First

**`docs/UI_DESIGN_GUIDE.md`** contains the complete visual specification based on Are.na screenshots. Read it before writing any UI code.

---

## The Three Things Most Likely to Be Wrong

### 1. Blocks Are NOT Squares

❌ **WRONG:**
```tsx
<div className="aspect-square">
  <img className="object-cover w-full h-full" />
</div>
```

✅ **RIGHT:**
```tsx
<div>
  <img className="w-full h-auto" />  {/* Natural aspect ratio */}
</div>
```

Content keeps its natural proportions. A 4:3 photo stays 4:3. A 16:9 video stays 16:9.

### 2. The Grid is Masonry, Not Uniform

❌ **WRONG:**
```css
.grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
}
```

✅ **RIGHT:**
```css
.grid {
  columns: 4;
  column-gap: 24px;
}
.grid > * {
  break-inside: avoid;
  margin-bottom: 24px;
}
```

Items flow into columns with varying heights.

### 3. Text Blocks NEED Borders

Images have no border. Text blocks MUST have a visible border to distinguish them from the black background.

```tsx
// Image - no border
<img src={...} className="w-full h-auto" />

// Text - has border
<div className="border border-zinc-700 p-4">
  <p>{content}</p>
</div>
```

---

## Color Palette

```css
--bg-primary: #000000;        /* Background */
--text-primary: #FFFFFF;      /* Headings, body */
--text-secondary: #888888;    /* Metadata, timestamps */
--text-accent: #6B8E6B;       /* Links, usernames, channel titles */
--border-subtle: #333333;     /* Card borders */
--border-card: #444444;       /* Text block borders */
```

**Green (`#6B8E6B`) is for interactive elements:** usernames, channel names, any clickable text.

---

## Core Interaction Model

### No Forms, No Type Selection

Users just:
1. **Paste** — images, URLs, text from clipboard
2. **Drop** — files from desktop  
3. **Type** — raw text

The system auto-detects content type. No dropdowns. No "what kind of content is this?" dialogs.

### Auto-Detection Logic

```typescript
function detectContentType(input: string | File): BlockType {
  if (input instanceof File) {
    if (input.type.startsWith('image/')) return 'image';
    if (input.type.startsWith('video/')) return 'video';
    if (input.type.startsWith('audio/')) return 'audio';
    if (input.type === 'application/pdf') return 'pdf';
    return 'file';
  }
  
  if (isUrl(input)) {
    if (isYouTube(input) || isVimeo(input)) return 'embed';
    if (isTwitter(input)) return 'embed';
    if (isImageUrl(input)) return 'image';
    return 'link';
  }
  
  return 'text';
}
```

---

## Project Structure

```
boerd/
├── apps/web/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx                    # Landing
│   │   ├── explore/page.tsx            # Explore grid
│   │   ├── feed/page.tsx               # Activity feed
│   │   └── [username]/
│   │       ├── page.tsx                # Profile
│   │       └── [slug]/page.tsx         # Boerd view
│   ├── components/
│   │   ├── blocks/
│   │   │   ├── Block.tsx               # Universal renderer
│   │   │   ├── ImageBlock.tsx
│   │   │   ├── TextBlock.tsx
│   │   │   ├── LinkBlock.tsx
│   │   │   ├── EmbedBlock.tsx
│   │   │   └── FileBlock.tsx
│   │   ├── boerd/
│   │   │   ├── BoerdGrid.tsx           # Masonry grid
│   │   │   ├── BoerdCard.tsx           # Channel card
│   │   │   └── AddZone.tsx             # Universal input
│   │   ├── feed/
│   │   │   ├── Feed.tsx
│   │   │   └── FeedItem.tsx            # Activity with sentence
│   │   └── layout/
│   │       ├── Header.tsx
│   │       └── Nav.tsx
│   └── lib/
│       ├── detect.ts                   # Content detection
│       └── utils.ts                    # cn() helper
├── packages/database/
│   └── src/
│       ├── schema.ts                   # Drizzle tables
│       ├── client.ts                   # bun:sqlite connection
│       └── index.ts
└── docs/
    └── UI_DESIGN_GUIDE.md              # Visual spec
```

---

## Key Components

### Block.tsx

```tsx
import { Block as BlockType } from '@boerd/database';

export function Block({ block }: { block: BlockType }) {
  return (
    <div className="break-inside-avoid mb-6">
      <BlockContent block={block} />
      <BlockLabel block={block} />
    </div>
  );
}

function BlockContent({ block }: { block: BlockType }) {
  switch (block.type) {
    case 'image':
      return <img src={block.assetPath!} alt="" className="w-full h-auto" />;
    
    case 'text':
      return (
        <div className="border border-zinc-700 p-4">
          <p className="text-white text-sm whitespace-pre-wrap">{block.content}</p>
        </div>
      );
    
    case 'link':
      return (
        <div>
          {block.thumbnailPath && (
            <img src={block.thumbnailPath} alt="" className="w-full h-auto" />
          )}
          {block.metadata?.og?.description && (
            <p className="text-sm text-gray-400 mt-2 line-clamp-2">
              {block.metadata.og.description}
            </p>
          )}
        </div>
      );
    
    case 'embed':
      return (
        <div>
          <img 
            src={block.metadata?.oembed?.thumbnail_url || block.thumbnailPath} 
            alt="" 
            className="w-full h-auto" 
          />
          <div className="mt-2 flex flex-col items-center">
            <span className="text-[10px] text-gray-500 border border-zinc-700 px-2 py-0.5 uppercase">
              {block.metadata?.oembed?.provider_name || 'embed'}
            </span>
          </div>
        </div>
      );
    
    default:
      return (
        <div className="border border-zinc-700 p-4 text-center">
          <p className="text-gray-500">{block.type}</p>
        </div>
      );
  }
}

function BlockLabel({ block }: { block: BlockType }) {
  const label = block.title 
    || block.metadata?.og?.title
    || block.sourceUrl?.split('/').pop()
    || '';
  
  if (!label) return null;
  
  return <p className="text-xs text-gray-500 mt-2 truncate">{label}</p>;
}
```

### BoerdGrid.tsx

```tsx
import { Block as BlockType } from '@boerd/database';
import { Block } from '../blocks/Block';

export function BoerdGrid({ blocks }: { blocks: BlockType[] }) {
  if (blocks.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-500">No blocks yet</p>
      </div>
    );
  }

  return (
    <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6">
      {blocks.map(block => (
        <Block key={block.id} block={block} />
      ))}
    </div>
  );
}
```

### BoerdCard.tsx

```tsx
import Link from 'next/link';
import { Boerd, Block as BlockType } from '@boerd/database';

interface BoerdCardProps {
  boerd: Boerd & { user: { username: string } };
  blocks?: BlockType[];
  variant?: 'compact' | 'wide';
}

export function BoerdCard({ boerd, blocks, variant = 'compact' }: BoerdCardProps) {
  const url = `/${boerd.user.username}/${boerd.slug}`;
  
  if (variant === 'wide' && blocks) {
    // Profile view with block previews
    return (
      <div className="border border-zinc-800 p-4 flex items-center gap-6 mb-4">
        <div className="min-w-[150px]">
          <Link href={url} className="text-[#6B8E6B] hover:underline">
            {boerd.title}
          </Link>
          <p className="text-xs text-gray-500 mt-1">by {boerd.user.username}</p>
          <p className="text-xs text-gray-500">{blocks.length} blocks</p>
          <p className="text-xs text-gray-500">{formatRelativeTime(boerd.updatedAt)}</p>
        </div>
        <div className="flex gap-2 flex-1 justify-end overflow-hidden">
          {blocks.slice(0, 5).map(block => (
            <div key={block.id} className="w-16 h-16 overflow-hidden flex-shrink-0 bg-zinc-900">
              <BlockThumbnail block={block} />
            </div>
          ))}
        </div>
      </div>
    );
  }
  
  // Compact view (centered text)
  return (
    <div className="border border-zinc-800 p-6 flex flex-col items-center justify-center min-h-[200px] break-inside-avoid mb-6">
      <Link href={url} className="text-[#6B8E6B] hover:underline text-base text-center">
        {boerd.title}
      </Link>
      <p className="text-xs text-gray-500 mt-1">by {boerd.user.username}</p>
      <p className="text-xs text-gray-500">{boerd.blockCount || 0} blocks</p>
      <p className="text-xs text-gray-500">{formatRelativeTime(boerd.updatedAt)}</p>
    </div>
  );
}
```

### FeedItem.tsx

```tsx
import Link from 'next/link';
import { Block } from '../blocks/Block';

interface FeedItemProps {
  activity: {
    user: { username: string; displayName: string };
    boerd: { slug: string; title: string; user: { username: string } };
    blocks: BlockType[];
    createdAt: Date;
  };
}

export function FeedItem({ activity }: FeedItemProps) {
  const boerdUrl = `/${activity.boerd.user.username}/${activity.boerd.slug}`;
  
  return (
    <div className="mb-16">
      {/* Activity sentence */}
      <p className="text-center text-sm">
        <Link href={`/${activity.user.username}`} className="text-[#6B8E6B]">
          {activity.user.displayName}
        </Link>
        {' '}connected {formatBlockList(activity.blocks)} to{' '}
        <Link href={boerdUrl} className="text-white font-semibold hover:underline">
          {activity.boerd.title}
        </Link>
      </p>
      <p className="text-center text-xs text-gray-500 mt-1">
        {formatRelativeTime(activity.createdAt)}
      </p>
      
      {/* Blocks */}
      <div className="mt-8 flex flex-wrap justify-center gap-4 max-w-4xl mx-auto">
        {activity.blocks.map(block => (
          <div key={block.id} className="max-w-[250px]">
            <Block block={block} />
          </div>
        ))}
      </div>
    </div>
  );
}

function formatBlockList(blocks: BlockType[]): string {
  const counts: Record<string, number> = {};
  blocks.forEach(b => { counts[b.type] = (counts[b.type] || 0) + 1; });
  
  const parts = Object.entries(counts).map(([type, n]) => `${n} ${type}${n > 1 ? 's' : ''}`);
  
  if (parts.length === 1) return parts[0];
  if (parts.length === 2) return `${parts[0]} and ${parts[1]}`;
  return parts.slice(0, -1).join(', ') + ', and ' + parts.at(-1);
}
```

### AddZone.tsx

```tsx
'use client';

import { useCallback } from 'react';
import { createBlock } from '@/lib/actions/blocks';

export function AddZone({ boerdId }: { boerdId: string }) {
  const handlePaste = useCallback(async (e: React.ClipboardEvent) => {
    e.preventDefault();
    const items = e.clipboardData?.items;
    if (!items) return;
    
    for (const item of Array.from(items)) {
      if (item.type.startsWith('image/')) {
        const file = item.getAsFile();
        if (file) await createBlock(boerdId, file);
      } else if (item.type === 'text/plain') {
        item.getAsString(async (text) => {
          await createBlock(boerdId, text);
        });
      }
    }
  }, [boerdId]);

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer?.files || []);
    for (const file of files) {
      await createBlock(boerdId, file);
    }
  }, [boerdId]);

  return (
    <div
      onPaste={handlePaste}
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      tabIndex={0}
      className="border border-dashed border-zinc-700 p-8 text-center text-gray-500 
                 hover:border-zinc-500 focus:border-zinc-500 focus:outline-none
                 transition-colors cursor-pointer"
    >
      Paste, drop, or type anything...
    </div>
  );
}
```

---

## Database

### bun:sqlite (NOT better-sqlite3)

```typescript
import { Database } from 'bun:sqlite';
import { drizzle } from 'drizzle-orm/bun-sqlite';

const sqlite = new Database('data/boerd.db', { create: true });
sqlite.exec('PRAGMA journal_mode = WAL');
sqlite.exec('PRAGMA foreign_keys = ON');

export const db = drizzle(sqlite, { schema });
```

### Block Types

```typescript
const blockTypes = ['image', 'video', 'audio', 'pdf', 'link', 'embed', 'text', 'file'] as const;
```

---

## What NOT to Build

| Don't | Why |
|-------|-----|
| Content type selector | Auto-detect everything |
| "Add" button with dropdown | Just paste/drop/type |
| Uniform square grid | Use masonry, natural ratios |
| Borders on images | Only text blocks have borders |
| White links | Use green (#6B8E6B) for interactive |
| Just a grid in feed | Show activity sentences |
| Skeleton loaders | Use text "Loading..." |
| Toast notifications | Use inline feedback |

---

## Testing Checklist

Before considering a UI complete:

- [ ] Images display at natural aspect ratio (not cropped to square)
- [ ] Text blocks have visible borders
- [ ] Grid is masonry (varying heights)
- [ ] Usernames and channel titles are green
- [ ] Metadata (dates, counts, filenames) is gray
- [ ] Feed items have activity sentences
- [ ] AddZone accepts paste, drop, and type
- [ ] No content type selection UI exists
