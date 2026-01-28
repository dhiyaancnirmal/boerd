# Boerd — UI Design Guide

Based on direct observation of Are.na's interface (January 2025).

---

## Table of Contents

1. [Color Palette](#color-palette)
2. [Typography](#typography)
3. [Layout Structure](#layout-structure)
4. [The Grid](#the-grid)
5. [Block Types](#block-types)
6. [Channel Cards](#channel-cards)
7. [Feed](#feed)
8. [Navigation](#navigation)
9. [Profile Page](#profile-page)
10. [Interaction States](#interaction-states)
11. [Spacing](#spacing)
12. [Key Principles](#key-principles)

---

## Color Palette

The interface is **dark mode by default** with a light mode option.

### Dark Mode (Default)

```css
:root {
  /* Backgrounds */
  --bg-primary: #000000;           /* Pure black - page background */
  --bg-card: #000000;              /* Cards are same as background */
  
  /* Text */
  --text-primary: #FFFFFF;         /* White - headings, body */
  --text-secondary: #888888;       /* Gray - metadata, timestamps */
  --text-accent: #6B8E6B;          /* Muted green - links, usernames, channel titles */
  
  /* Borders */
  --border-subtle: #333333;        /* Very subtle, barely visible */
  --border-card: #444444;          /* Slightly more visible, for text blocks and cards */
}
```

### Light Mode

```css
[data-theme="light"] {
  --bg-primary: #FFFFFF;
  --bg-card: #FFFFFF;
  --text-primary: #000000;
  --text-secondary: #666666;
  --text-accent: #4A6B4A;
  --border-subtle: #E0E0E0;
  --border-card: #CCCCCC;
}
```

### When to Use Each Color

| Color | Usage |
|-------|-------|
| `--text-primary` (white) | Page titles, body text, navigation (current), block content |
| `--text-secondary` (gray) | Timestamps, block counts, filenames, metadata |
| `--text-accent` (green) | Usernames, channel/boerd titles, "New channel +" button, any clickable text |
| `--border-subtle` | Card borders, dividers |
| `--border-card` | Text block borders (slightly more prominent) |

---

## Typography

### Font Family

**Neue Haas Grotesk Text Pro** — the original Helvetica before it was genericized. Clean, neutral, professional.

```css
@import url('https://db.onlinewebfonts.com/c/3c76d979e72206bc554a1863d96ac5d4?family=Neue+Haas+Grotesk+Text+Pro');

body {
  font-family: 'Neue Haas Grotesk Text Pro', Arial, sans-serif;
}
```

**Fallback:** Arial. Never use Inter, San Francisco, system-ui, or any other "modern" sans-serif.

### Type Scale

The interface is **dense but readable**. Sizes are small; generous spacing compensates.

| Element | Size | Weight | Color | Example |
|---------|------|--------|-------|---------|
| Page title | 18px | 400 | white | "Are.na / Dhiyaan Nirmal" |
| Section title | 16px | 600 | white | "Essays", "Annual" |
| Channel title | 16px | 400 | green | "camp I", "textured websites" |
| Body text | 14px | 400 | white | Block content, descriptions |
| Username | 14px | 400 | green | "by anit a" |
| Metadata | 12px | 400 | gray | "9 blocks", "2 minutes ago" |
| Filename/label | 12px | 400 | gray | "749.png", "thebigfavorite_7.gif" |
| Navigation (current) | 16px | 600 | white | "Feed" (when active) |
| Navigation (inactive) | 16px | 400 | gray | "Explore", "Profile" |
| Platform badge | 10px | 500 | gray | "YOUTUBE" |

### Line Heights

- Body text: 1.5
- Headings: 1.3
- Metadata: 1.4

---

## Layout Structure

### Global Page Structure

```
┌──────────────────────────────────────────────────────────────────────────────┐
│ HEADER                                                                       │
│ [✳✳ logo]  Search Are.na                     [New channel +]  [0]  [avatar] │
├──────────────────────────────────────────────────────────────────────────────┤
│ BREADCRUMB / NAV                                                             │
│ Are.na / Feed · Explore · Profile                                            │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│ FILTERS (left)                    VIEW OPTIONS (right, optional)            │
│ View: ● All / Channels / Blocks   Sort: ● Recently updated / Random          │
│                                                                              │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│                                                                              │
│                             MAIN CONTENT                                     │
│                        (masonry grid or feed)                                │
│                                                                              │
│                                                                              │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
```

### Dimensions

| Element | Value |
|---------|-------|
| Header height | ~48px |
| Max content width | ~1200-1400px |
| Page side padding | 48px (desktop), 16px (mobile) |
| Content top padding | 24px |

---

## The Grid

### Critical: NOT Uniform Squares

**Content maintains its natural aspect ratio.** A tall image is tall. A wide image is wide. A text block is sized to its content. The grid is **masonry-style**, not a uniform CSS Grid.

### Wrong vs Right

```css
/* ❌ WRONG - forces uniform sizing */
.grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
}
.block {
  aspect-ratio: 1;
}

/* ✅ RIGHT - masonry with natural sizing */
.grid {
  columns: 4;
  column-gap: 24px;
}
.block {
  break-inside: avoid;
  margin-bottom: 24px;
}
```

### Visual Example

```
┌───────────────┐ ┌─────────────────────┐ ┌───────────────┐ ┌───────────────┐
│               │ │                     │ │               │ │               │
│   tall        │ │   wide landscape    │ │   square      │ │               │
│   portrait    │ │   image             │ │   image       │ │   text        │
│   image       │ │                     │ │               │ │   block       │
│               │ └─────────────────────┘ │               │ │               │
│               │ ┌─────────────────────┐ └───────────────┘ │               │
│               │ │                     │ ┌───────────────┐ └───────────────┘
└───────────────┘ │   channel card      │ │               │ ┌───────────────┐
┌───────────────┐ │   (taller)          │ │   embed       │ │               │
│               │ │                     │ │   16:9        │ │   small       │
│   another     │ │                     │ │               │ │   image       │
│               │ └─────────────────────┘ └───────────────┘ └───────────────┘
└───────────────┘
```

### Responsive Columns

| Viewport | Columns |
|----------|---------|
| < 640px | 1 |
| 640-1023px | 2 |
| 1024-1279px | 3 |
| ≥ 1280px | 4-5 |

### Gap

- Column gap: 24px
- Row gap: 24px (but staggered due to masonry)

---

## Block Types

A block is a piece of content. Each type renders differently but shares a common structure:

```
┌─────────────────────────────┐
│                             │
│     [content preview]       │
│     at NATURAL aspect ratio │
│                             │
└─────────────────────────────┘
label below (filename, title, source)
```

### Image Block

```
┌────────────────────────────────────┐
│                                    │
│                                    │
│         [photograph or             │
│          image at natural          │
│          aspect ratio]             │
│                                    │
│                                    │
└────────────────────────────────────┘
749.png
```

- **No border** on the image itself
- Image fills width, height is natural
- Filename or title below in small gray text (12px)
- No overlay, no badges, no hover effects on the image

```tsx
<div>
  <img src={assetPath} alt="" className="w-full h-auto" />
  <p className="text-xs text-gray-500 mt-2">{filename}</p>
</div>
```

### Text Block

```
┌────────────────────────────────────┐
│                                    │
│  People would rather talk about    │
│  you than talk to you.             │
│                                    │
│                                    │
│                                    │
└────────────────────────────────────┘
```

- **HAS a visible border** (subtle dark gray, 1px) — this distinguishes it from images
- White text on black background
- Padding: 16-24px inside
- Sized to content height (not forced to any ratio)
- No label below — the text IS the content

```tsx
<div className="border border-zinc-700 p-4">
  <p className="text-white text-sm whitespace-pre-wrap">{content}</p>
</div>
```

### Link Block

```
┌────────────────────────────────────┐
│                                    │
│   [og:image from the link]         │
│                                    │
│   Optional preview text from       │
│   the page description...          │
│                                    │
└────────────────────────────────────┘
Bakken & Bæck
```

- Shows og:image fetched from the URL
- May include preview text from og:description
- Site name or page title below in gray
- Clicking opens the link detail or goes to URL

```tsx
<div>
  <img src={ogImage} alt="" className="w-full h-auto" />
  {description && (
    <p className="text-sm text-gray-400 mt-2 line-clamp-2">{description}</p>
  )}
  <p className="text-xs text-gray-500 mt-2">{siteName || hostname}</p>
</div>
```

### Embed Block (YouTube, Twitter, etc.)

```
┌────────────────────────────────────┐
│                                    │
│                                    │
│      [video thumbnail at           │
│       16:9 aspect ratio]           │
│                                    │
│                                    │
└────────────────────────────────────┘
         YOUTUBE
THE HELLP | Chris Heyn Show
```

- Thumbnail at embed's natural aspect ratio (16:9 for video)
- **Platform badge** below: small bordered label saying "YOUTUBE", "TWITTER", etc.
- Title/description below the badge
- For tweets: shows a screenshot of the tweet with engagement metrics visible

```tsx
<div>
  <img src={thumbnailUrl} alt="" className="w-full h-auto" />
  <div className="mt-2 flex flex-col items-center">
    <span className="text-[10px] text-gray-500 border border-zinc-700 px-2 py-0.5">
      {platform.toUpperCase()}
    </span>
    <p className="text-xs text-gray-500 mt-1 text-center">{title}</p>
  </div>
</div>
```

### File Block (PDF, Audio, etc.)

```
┌────────────────────────────────────┐
│                                    │
│         [file icon or              │
│          preview if available]     │
│                                    │
└────────────────────────────────────┘
document.pdf
```

- Simple file representation
- For PDFs: first page preview if possible
- For audio: waveform or generic audio icon
- Filename below

---

## Channel Cards

Channels (what we call "boerds") have a **different visual treatment** than blocks. They're containers, not content.

### Channel Card — No Cover Image

When a channel has no cover, it shows centered text:

```
┌──────────────────────────────────────────┐
│                                          │
│                                          │
│              camp I                      │  ← GREEN, centered
│              by anit a                   │  ← gray, centered
│              9 blocks                    │  ← gray, centered
│              2 minutes ago               │  ← gray, centered
│                                          │
│                                          │
└──────────────────────────────────────────┘
```

- Subtle border (dark gray, `#333` or similar)
- ALL text centered vertically and horizontally
- Channel title in **green** (`#6B8E6B`)
- Author prefixed with "by", in gray
- Block count in gray
- Relative timestamp in gray
- Card is taller than wide (portrait-ish aspect)

```tsx
<div className="border border-zinc-800 p-6 flex flex-col items-center justify-center min-h-[200px]">
  <Link href={channelUrl} className="text-[#6B8E6B] hover:underline text-base">
    {title}
  </Link>
  <p className="text-xs text-gray-500 mt-1">by {username}</p>
  <p className="text-xs text-gray-500">{blockCount} blocks</p>
  <p className="text-xs text-gray-500">{relativeTime}</p>
</div>
```

### Channel Card — With Cover Image

```
┌──────────────────────────────────────────┐
│                                          │
│         [cover image fills               │
│          most of the card]               │
│                                          │
└──────────────────────────────────────────┘
our legacy 2x
```

- Cover image at top, fills the card
- Title below (not overlaid), in gray
- No metadata visible in this compact view

### Channel Card — Profile View with Block Previews

On profile pages, channels show a **horizontal card** with mini previews:

```
┌────────────────────────────────────────────────────────────────────────────┐
│                                                                            │
│   world                   ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐        │
│   by Dhiyaan Nirmal       │img1 │ │img2 │ │text │ │img3 │ │img4 │        │
│   5 blocks                └─────┘ └─────┘ └─────┘ └─────┘ └─────┘        │
│   4 days ago                                                               │
│                                                                            │
└────────────────────────────────────────────────────────────────────────────┘
```

- Wide horizontal card with subtle border
- Channel info on the LEFT:
  - Title in green
  - "by {username}" in gray
  - "{n} blocks" in gray
  - Relative timestamp in gray
- Miniature block previews on the RIGHT
  - Small thumbnails (maybe 48-64px) showing actual content
  - Arranged in a row
  - Shows first 4-5 blocks

```tsx
<div className="border border-zinc-800 p-4 flex items-center gap-6">
  <div className="min-w-[150px]">
    <Link href={channelUrl} className="text-[#6B8E6B] hover:underline">
      {title}
    </Link>
    <p className="text-xs text-gray-500 mt-1">by {username}</p>
    <p className="text-xs text-gray-500">{blockCount} blocks</p>
    <p className="text-xs text-gray-500">{relativeTime}</p>
  </div>
  <div className="flex gap-2 flex-1 justify-end">
    {blocks.slice(0, 5).map(block => (
      <div key={block.id} className="w-16 h-16 overflow-hidden flex-shrink-0">
        <BlockThumbnail block={block} />
      </div>
    ))}
  </div>
</div>
```

---

## Feed

The feed shows **activity**, not just a grid. Each item is an action someone took.

### Feed Item Structure

```
      Dhiyaan Nirmal connected 3 images, 1 text, and 1 embed to world
                              about 1 month ago

         ┌─────────┐  ┌─────────┐  ┌─────────────┐  ┌─────────┐
         │         │  │         │  │ text block  │  │         │
         │  image  │  │  image  │  │ with border │  │  image  │
         │         │  │         │  │             │  │         │
         └─────────┘  └─────────┘  └─────────────┘  └─────────┘

                           ┌───────────────────┐
                           │                   │
                           │   youtube embed   │
                           │                   │
                           └───────────────────┘
                                  YOUTUBE
                         THE HELLP | Chris Heyn Show
```

### Activity Sentence

The activity is described as a **human-readable sentence**:

```
{username} connected {N} {type(s)} to {channel}
```

- Username in **green**
- "connected" (or "added") in white
- Count and types in white: "3 images, 1 text, and 1 embed"
- "to" in white
- Channel name in **bold white**
- Timestamp centered below, in gray

```tsx
<p className="text-center text-sm">
  <Link href={userUrl} className="text-[#6B8E6B]">{displayName}</Link>
  {' '}connected {formatBlockList(blocks)} to{' '}
  <Link href={channelUrl} className="text-white font-semibold">{channelTitle}</Link>
</p>
<p className="text-center text-xs text-gray-500 mt-1">{relativeTime}</p>
```

### formatBlockList Function

```typescript
function formatBlockList(blocks: Block[]): string {
  const counts: Record<string, number> = {};
  blocks.forEach(b => {
    counts[b.type] = (counts[b.type] || 0) + 1;
  });
  
  const parts = Object.entries(counts).map(([type, count]) => {
    const plural = count > 1 ? 's' : '';
    return `${count} ${type}${plural}`;
  });
  
  if (parts.length === 1) return parts[0];
  if (parts.length === 2) return `${parts[0]} and ${parts[1]}`;
  return parts.slice(0, -1).join(', ') + ', and ' + parts[parts.length - 1];
}
// "3 images, 1 text, and 1 embed"
```

### Block Arrangement in Feed

Blocks in a feed item are **not in a strict grid**. They're arranged loosely:

- Centered horizontally
- Natural sizes (not uniform)
- Flex wrap with gaps
- More generous spacing between feed items (64px+)

```tsx
<div className="mt-8 flex flex-wrap justify-center gap-4 max-w-4xl mx-auto">
  {blocks.map(block => (
    <div key={block.id} className="max-w-[250px]">
      <Block block={block} />
    </div>
  ))}
</div>
```

---

## Navigation

### Header Bar

```
[✳✳]  Search Are.na                              [New channel +]  [0]  [D]
```

| Element | Description |
|---------|-------------|
| Logo | Two asterisks/stars, white, links to home |
| Search | Plain text "Search Are.na", no visible input until focused |
| New channel | Green text with + icon, bordered button |
| Notifications | Number in a subtle circle |
| Avatar | User's initial in a circle |

### Breadcrumb Navigation

```
Are.na / Feed · Explore · Profile
```

- "Are.na" links to home
- `/` separator after site name
- Current section in **bold white**
- Other sections in gray
- `·` (middle dot) separators between nav items
- On hover: gray items become white

```tsx
<nav className="flex items-center gap-2 text-base">
  <Link href="/" className="text-white">Are.na</Link>
  <span className="text-gray-500">/</span>
  <Link href="/feed" className={current === 'feed' ? 'font-semibold text-white' : 'text-gray-500 hover:text-white'}>
    Feed
  </Link>
  <span className="text-gray-500">·</span>
  <Link href="/explore" className={current === 'explore' ? 'font-semibold text-white' : 'text-gray-500 hover:text-white'}>
    Explore
  </Link>
  <span className="text-gray-500">·</span>
  <Link href="/profile" className={current === 'profile' ? 'font-semibold text-white' : 'text-gray-500 hover:text-white'}>
    Profile
  </Link>
</nav>
```

### View/Sort Options

Simple radio-style lists with no dropdown chrome:

```
View                    Sort
● All                   ● Recently updated
  Channels                Random
  Blocks
```

- Filled circle `●` indicates selected
- Plain text for unselected (or empty circle)
- No borders, no backgrounds, no dropdown menus
- Just a simple vertical list

```tsx
<div className="flex gap-8">
  <div>
    <p className="text-xs text-gray-500 mb-2">View</p>
    {['All', 'Channels', 'Blocks'].map(option => (
      <button
        key={option}
        onClick={() => setView(option)}
        className={`block text-sm ${view === option ? 'text-white' : 'text-gray-500'}`}
      >
        {view === option ? '● ' : '  '}{option}
      </button>
    ))}
  </div>
  <div>
    <p className="text-xs text-gray-500 mb-2">Sort</p>
    {['Recently updated', 'Random'].map(option => (
      <button
        key={option}
        onClick={() => setSort(option)}
        className={`block text-sm ${sort === option ? 'text-white' : 'text-gray-500'}`}
      >
        {sort === option ? '● ' : '  '}{option}
      </button>
    ))}
  </div>
</div>
```

---

## Profile Page

```
Are.na / Dhiyaan Nirmal ●                                    🔍  More ⌄

Info                    View
—                       ● Channels
Joined   December 2025    Blocks
                          Table
                          Index
                          All

┌────────────────────────────────────────────────────────────────────────────┐
│ world          [img] [img] [text] [img] [img]                              │
│ by Dhiyaan Nirmal                                                          │
│ 5 blocks · 4 days ago                                                      │
└────────────────────────────────────────────────────────────────────────────┘
```

### Profile Header

- Username with optional status dot (● after name)
- Search icon and "More" dropdown on right

### Profile Info

- Minimal: just "Joined {date}"
- Optional bio would go here
- Em dash (—) as a separator/placeholder

### Profile Views

Multiple view options:
- **Channels** — shows channel cards with block previews
- **Blocks** — shows all blocks across all channels
- **Table** — tabular view
- **Index** — alphabetical list
- **All** — everything

---

## Interaction States

### Hover

- Text links: opacity change or underline appears
- Cards: border brightens slightly
- Images: no change (content is sacred)

### Focus (Keyboard)

- Visible focus ring
- Color: accent green or white
- Offset: 2px

### Selected (in lists)

- Filled circle ●
- Bolder text weight or white color

### Active/Pressed

- Slight opacity reduction

---

## Spacing

The interface is **dense but breathable**. Small text, generous gaps.

| Context | Value |
|---------|-------|
| Page side padding | 48px (desktop), 16px (mobile) |
| Page top padding | 24px |
| Grid column gap | 24px |
| Grid row gap | 24px |
| Card internal padding | 16-24px |
| Text below image | 8px (margin-top) |
| Between feed items | 64px+ |
| Between sections | 48px |
| Nav item spacing | 8-16px |

---

## Key Principles

### 1. Natural Aspect Ratios
Never force content into squares. A 4:3 image is 4:3. A 16:9 video is 16:9. A text block is as tall as its content needs.

### 2. Masonry Layout
Items flow into columns, heights vary. Not a uniform grid.

### 3. Text Blocks Have Borders
The only way to visually distinguish a text block from the black background is a subtle border.

### 4. Green for Interactive
Usernames, channel names, and links use the muted green accent color. Never white for links.

### 5. Labels Below
Filenames, titles, and sources appear below the content, not overlaid on it.

### 6. Activity is Human
The feed says "{person} connected {things} to {place}" — a sentence, not just a grid.

### 7. Generous Spacing
Small text, big gaps. Let content breathe.

### 8. Dense Information
Show metadata: block counts, timestamps, usernames, filenames. Users want context.

---

## What NOT to Do

| ❌ Don't | ✅ Do |
|---------|------|
| Force blocks into squares | Preserve natural aspect ratios |
| Use uniform CSS grid with fixed heights | Use masonry/columns layout |
| Skip borders on text blocks | Add subtle border to text blocks |
| Use white for links | Use green accent for interactive text |
| Overlay labels on images | Put labels below content |
| Show just a grid in feed | Show activity sentences with context |
| Use tight spacing | Use generous gaps between items |
| Hide metadata | Show filenames, dates, counts |

---

## CSS Reference

### Colors
```css
--bg-primary: #000000;
--text-primary: #FFFFFF;
--text-secondary: #888888;
--text-accent: #6B8E6B;
--border-subtle: #333333;
--border-card: #444444;
```

### Masonry Grid
```css
.masonry {
  columns: 4;
  column-gap: 24px;
}
.masonry > * {
  break-inside: avoid;
  margin-bottom: 24px;
}
```

### Font
```css
font-family: 'Neue Haas Grotesk Text Pro', Arial, sans-serif;
```
