# Boerd Deployment Options

Boerd can be deployed to multiple platforms with minimal configuration. All deployments support:

- **Zero-form input** - paste, drop, or type content
- **Auto-detection** - URLs become links/embeds, images get thumbnails
- **Masonry grid** - natural aspect ratios
- **SQLite database** - fast, portable, no external database needed
- **File storage** - images, PDFs, and other media

## Quick Comparison

| Platform       | Free Tier           | Storage              | Database       | Difficulty    | Notes                       |
| -------------- | ------------------- | -------------------- | -------------- | ------------- | --------------------------- |
| **Railway**    | $5 credit/month     | 1GB disk             | SQLite (local) | ⭐ Very Easy  | One-click deploy            |
| **Fly.io**     | ~$0-3/month         | Volume mount         | SQLite (local) | ⭐⭐ Easy     | Docker-based                |
| **Render**     | Free tier available | 1GB disk             | SQLite (local) | ⭐⭐ Easy     | Blueprint deploy            |
| **Cloudflare** | Truly free          | R2 (10GB) + D1 (5GB) | D1 (SQLite)    | ⭐⭐⭐ Medium | Requires Workers adaptation |
| **Docker**     | Your hosting cost   | Volume mount         | SQLite (local) | ⭐⭐ Medium   | Self-host anywhere          |

## Environment Variables

All deployments use these environment variables:

| Variable               | Default      | Description                        |
| ---------------------- | ------------ | ---------------------------------- |
| `NODE_ENV`             | `production` | Node environment                   |
| `PORT`                 | `3000`       | Server port                        |
| `DATA_DIR`             | `./data`     | Directory for database and uploads |
| `DATABASE_TYPE`        | `sqlite`     | Database type (`sqlite` or `d1`)   |
| `STORAGE_TYPE`         | `local`      | Storage type (`local` or `r2`)     |
| `R2_ACCOUNT_ID`        | -            | Cloudflare R2 account ID           |
| `R2_ACCESS_KEY_ID`     | -            | Cloudflare R2 access key           |
| `R2_SECRET_ACCESS_KEY` | -            | Cloudflare R2 secret key           |
| `R2_BUCKET_NAME`       | -            | Cloudflare R2 bucket name          |
| `R2_PUBLIC_URL`        | -            | Cloudflare R2 public URL           |

## Platform-Specific Guides

- [Railway Guide](./railway.md) - Recommended for beginners
- [Fly.io Guide](./fly.md) - Great for hobby projects
- [Render Guide](./render.md) - Good for static deployments
- [Cloudflare Guide](./cloudflare.md) - Truly free forever
- [Docker Guide](./docker.md) - Self-host on any server

## What Gets Stored?

**Database (`DATA_DIR/boerd.db`):**

- Users
- Boerds (collections)
- Blocks (content metadata)
- Connections (block-to-boerd relationships)

**Files (`DATA_DIR/uploads/`):**

```
uploads/
├── images/
│   ├── original/     # Full-resolution images
│   └── thumbnails/   # 400x400 WebP thumbnails
└── files/            # PDFs, videos, audio, etc.
```

## Persistence

- **Database** is a single SQLite file - easy to backup
- **Files** are stored in a flat directory structure
- **Backup** can be done by copying the entire `DATA_DIR`

## Choosing Your Platform

### Choose Railway if:

- You want the easiest setup
- You're okay with small monthly cost (~$5 after credits)
- You want persistent storage built-in

### Choose Fly.io if:

- You want near-free deployment
- You're comfortable with Docker
- You want global edge deployment options

### Choose Render if:

- You want free tier
- You prefer blueprints over Docker
- You need predictable URLs

### Choose Cloudflare if:

- You want truly free forever
- You're comfortable with edge computing
- You want the fastest global distribution

### Choose Docker if:

- You have your own server
- You want complete control
- You're deploying on-premise
