# Boerd — System Design

> **Version:** 1.0.0

---

## Architecture

```
┌─────────────────────────────────────────────┐
│           Next.js 16 Application            │
│  ┌─────────────┐  ┌─────────────────────┐  │
│  │   Pages     │  │   Server Actions    │  │
│  │   (RSC)     │  │   (Mutations)       │  │
│  └─────────────┘  └─────────────────────┘  │
│                      │                      │
│                      ▼                      │
│  ┌─────────────────────────────────────┐   │
│  │     Drizzle ORM + bun:sqlite        │   │
│  └─────────────────────────────────────┘   │
│                      │                      │
│                      ▼                      │
│  ┌─────────────────────────────────────┐   │
│  │         ./data/boerd.db             │   │
│  │         ./data/uploads/             │   │
│  └─────────────────────────────────────┘   │
└─────────────────────────────────────────────┘
```

---

## Database Schema

### Tables

**users**
- id (PK)
- username (unique)
- displayName
- createdAt, updatedAt

**blocks**
- id (PK)
- type (text|image|link|embed|attachment)
- title, description, content
- sourceUrl, assetPath, thumbnailPath
- metadata (JSON)
- userId (FK)
- createdAt, updatedAt

**boerds**
- id (PK)
- slug
- title, description
- status (public|closed|private)
- userId (FK)
- createdAt, updatedAt

**connections**
- id (PK)
- blockId (FK)
- boerdId (FK)
- position
- connectedAt
- connectedById (FK)
- UNIQUE(blockId, boerdId)

---

## File Storage

```
data/
├── boerd.db
└── uploads/
    ├── images/
    │   ├── original/
    │   └── thumbnails/
    └── files/
```

Files are named with CUID2 to prevent collisions.

---

## bun:sqlite Configuration

```typescript
import { Database } from 'bun:sqlite';

const sqlite = new Database('data/boerd.db', { create: true });

sqlite.exec('PRAGMA journal_mode = WAL');
sqlite.exec('PRAGMA busy_timeout = 5000');
sqlite.exec('PRAGMA synchronous = NORMAL');
sqlite.exec('PRAGMA cache_size = 20000');
sqlite.exec('PRAGMA foreign_keys = ON');
```

WAL mode enables concurrent reads while writing.

---

## Key Patterns

### Server Actions for Mutations

```typescript
'use server';

export async function createBlock(data: NewBlock) {
  const id = createId();
  await db.insert(blocks).values({ id, ...data });
  revalidatePath('/');
  return { id };
}
```

### Connection Model

Blocks can exist in multiple boerds via the connections table:

```sql
-- Get all boerds a block is in
SELECT b.* FROM boerds b
JOIN connections c ON c.boerd_id = b.id
WHERE c.block_id = ?;

-- Get all blocks in a boerd
SELECT bl.* FROM blocks bl
JOIN connections c ON c.block_id = bl.id
WHERE c.boerd_id = ?
ORDER BY c.position;
```
