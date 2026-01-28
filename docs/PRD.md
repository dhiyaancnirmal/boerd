# Boerd — Product Requirements Document

---

## Overview

Boerd is an open-source, self-hostable Are.na alternative for building mixed-media moodboards.

**If Are.na is the paid community version, Boerd is the self-hosted freedom version.**

---

## Core Concepts

### Block

A piece of content. Can be anything:

| Type | What it is | How it displays |
|------|-----------|-----------------|
| `image` | Uploaded or pasted image | Image at natural aspect ratio |
| `video` | Uploaded video file | Thumbnail with play indicator |
| `audio` | Uploaded audio file | Waveform or audio icon |
| `pdf` | PDF document | First page preview |
| `link` | Any URL | og:image + title |
| `embed` | YouTube, Vimeo, Twitter, etc. | Thumbnail + platform badge |
| `text` | Plain text or markdown | Text in a bordered box |
| `file` | Any other file | File icon + filename |

**Key insight:** Blocks maintain their natural aspect ratio. A wide image is wide. A tall image is tall. Nothing is cropped to fit a grid.

### Boerd

A collection of blocks. Like Are.na's "Channel."

- Has a title, optional description
- Has a URL: `/{username}/{slug}`
- Can be public or private
- Displays blocks in a masonry grid

### Connection

A block can exist in **multiple boerds** simultaneously. This is the core value proposition. You don't copy content; you connect it. Ideas accumulate context across collections.

---

## The Core Interaction

### How Users Add Content

**There are no forms. No type selectors. No "Add" buttons with dropdowns.**

Users just:
1. **Paste** anything — images, URLs, text
2. **Drop** anything — files from their desktop
3. **Type** anything — text that becomes a text block

The system auto-detects the content type and renders it appropriately.

### The "Add Zone"

At the bottom of a boerd (or floating, or wherever), there's a subtle input area:

```
┌─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┐
│                                                       │
│          Paste, drop, or type anything...             │
│                                                       │
└─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┘
```

That's it. No buttons. No menus. Just paste, drop, or type.

---

## Pages

### Home / Landing
- Hero explaining the product
- Call to action to explore or create

### Explore
- Masonry grid of public channels and blocks
- Filter: All / Channels / Blocks
- Sort: Recently updated / Random

### Feed
- Activity stream showing what users connected
- Each item is a sentence: "{user} connected {N blocks} to {channel}"
- Below the sentence, the actual blocks

### Profile (`/{username}`)
- User info (joined date, bio)
- View options: Channels / Blocks / Table / Index
- Channel cards with mini block previews

### Boerd View (`/{username}/{slug}`)
- Boerd title and description
- Masonry grid of blocks
- Add zone at bottom

### Block Detail
- Full content at natural size
- Metadata: source, date added
- List of boerds it's connected to

---

## Visual Design Summary

See `docs/UI_DESIGN_GUIDE.md` for complete specs.

**Key points:**
- Dark background (#000), white text (#FFF)
- Green accent (#6B8E6B) for interactive elements
- Masonry grid, NOT uniform squares
- Text blocks have borders; images don't
- Labels below content, not overlaid
- Generous spacing

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Runtime | Bun |
| Framework | Next.js 16 (App Router) |
| Database | bun:sqlite + Drizzle ORM |
| UI | Tailwind + shadcn/ui |
| Font | Neue Haas Grotesk Text Pro |

---

## MVP Features (P0)

### Blocks
- [ ] Create blocks via paste/drop/type (auto-detect type)
- [ ] Edit block title/description
- [ ] Delete blocks
- [ ] View block detail with full content
- [ ] See which boerds a block is connected to

### Boerds
- [ ] Create boerd (just type a title, done)
- [ ] Edit boerd title/description
- [ ] Delete boerd
- [ ] Set visibility (public/private)
- [ ] View boerd as masonry grid

### Connections
- [ ] Connect block to boerd (via drag or menu)
- [ ] Disconnect block from boerd
- [ ] Reorder blocks within boerd (drag-and-drop)

### Content Processing
- [ ] Upload images, generate thumbnails
- [ ] Fetch og:image and metadata for links
- [ ] Fetch oEmbed for YouTube/Vimeo/Twitter
- [ ] Support paste from clipboard (images + text)
- [ ] Support drag-and-drop files

### Views
- [ ] Grid view (masonry)
- [ ] Feed view (activity sentences)
- [ ] Profile view (channel cards with previews)

---

## Future Features (P1+)

- Multi-user with authentication
- Federation (JSON Feed or ActivityPub)
- Embed widget for external sites
- Search
- Mobile app
- Collaboration
- Comments

---

## Out of Scope (Never)

- AI-powered anything
- Social features (likes, followers, notifications)
- Algorithmic feeds
- Monetization

---

## Success Metrics

1. **Time to first block:** < 30 seconds from landing
2. **Interaction friction:** 0 clicks to add content (just paste)
3. **Self-host success rate:** Works on first `docker compose up`
