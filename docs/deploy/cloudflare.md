# Deploy to Cloudflare (Pages + D1 + R2)

Cloudflare offers truly free deployment with:

- **Unlimited sites** on Pages
- **5GB D1 database** (SQLite-compatible)
- **10GB R2 storage** (S3-compatible)
- **Global CDN** with edge computing

> ⚠️ **Note**: Cloudflare deployment is more complex than other platforms. Start with Railway or Fly.io if you want an easier setup.

## Prerequisites

- Wrangler CLI:
  ```bash
  npm install -g wrangler
  ```
- Cloudflare account with Workers enabled

## Setup

### 1. Initialize Cloudflare

```bash
wrangler login
```

### 2. Create D1 Database

```bash
wrangler d1 create boerd
```

Copy the output `database_id` and update `wrangler.toml`:

```toml
[[d1_databases]]
binding = "DB"
database_name = "boerd"
database_id = "<your-database-id>"
```

### 3. Create R2 Bucket

```bash
wrangler r2 bucket create boerd-uploads
```

Get your credentials:

```bash
wrangler r2 bucket list
```

Add environment variables:

```bash
wrangler secret put R2_ACCOUNT_ID
wrangler secret put R2_ACCESS_KEY_ID
wrangler secret put R2_SECRET_ACCESS_KEY
wrangler secret put R2_BUCKET_NAME
```

### 4. Initialize D1 Schema

```bash
cd packages/database
bun run generate
wrangler d1 execute boerd --remote --file=./migrations/0001_init.sql
```

### 5. Deploy to Workers

```bash
cd ../..
wrangler deploy
```

## Configuration

`wrangler.toml` includes:

- **D1 binding** for database
- **R2 binding** for storage
- **Environment variables** for D1/R2 usage

## Cloudflare-Specific Considerations

### No Server-Side Image Processing

Cloudflare Workers don't support Sharp. Boerd on Cloudflare:

- ❌ No server-side thumbnails
- ✅ Stores full images in R2
- ✅ Browsers handle resizing

**Workaround**: Resize images client-side before upload, or use a CDN service like Cloudinary.

### No Local Filesystem

Everything runs in memory or on R2:

- ❌ No local `/data` directory
- ✅ All files in R2 bucket
- ✅ Easy to backup and migrate

### Edge Computing

Your Boerd runs on Cloudflare's edge:

- ⚡ **Global distribution** - fast everywhere
- ⚡ **Cold starts** - ~50ms first request
- ⚡ **Auto-scaling** - no server to manage

## Environment Variables

Set via Wrangler secrets:

```bash
wrangler secret put VARIABLE_NAME
```

Required for R2:

- `R2_ACCOUNT_ID` - From Cloudflare dashboard
- `R2_ACCESS_KEY_ID` - R2 token
- `R2_SECRET_ACCESS_KEY` - R2 secret
- `R2_BUCKET_NAME` - `boerd-uploads`
- `R2_PUBLIC_URL` - Your R2 public URL

## Free Tier Limits

Cloudflare Workers free tier:

- ✅ **100,000 requests/day**
- ✅ **10ms CPU time per request**
- ✅ **Unlimited sites** on Pages
- ✅ **5GB D1 database**
- ✅ **10GB R2 storage** (includes 10M reads/month)

Paid plans available if you exceed limits.

## Custom Domain

### Via Cloudflare Pages

1. Go to Pages dashboard
2. Select your Boerd project
3. "Custom domains" tab
4. Add your domain
5. Update DNS (CNAME or A record)

### Public URL for R2

Your R2 bucket needs a public URL. Set `R2_PUBLIC_URL`:

```
https://your-r2-bucket.your-account-id.r2.cloudflarestorage.com
```

Or use Cloudflare Workers for a custom domain:

```javascript
// Add to your Worker
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const objectName = url.pathname.slice(1);

    // Serve from R2
    return env.STORAGE.get(objectName);
  },
};
```

## Backup

### D1 Database Export

```bash
wrangler d1 export boerd --remote --output=boerd-backup.sql
```

### R2 Backup

```bash
wrangler r2 object list boerd-uploads
wrangler r2 object get boerd-uploads file.jpg --file=backup.jpg
```

Sync to local:

```bash
# Using rclone or similar
rclone sync :r2:boerd-uploads ./backup
```

## Migration

### From SQLite to D1

If migrating from another deployment:

1. Export SQLite:

   ```bash
   sqlite3 boerd.db .dump > dump.sql
   ```

2. Import to D1:

   ```bash
   wrangler d1 execute boerd --remote --file=dump.sql
   ```

3. Copy files to R2:
   ```bash
   wrangler r2 object put boerd-uploads --path=./uploads
   ```

## Troubleshooting

### Workers Not Starting

```bash
wrangler tail
```

Check for:

- Missing bindings (DB, STORAGE)
- Incorrect secrets
- Syntax errors in Worker code

### D1 Connection Failed

Verify database exists:

```bash
wrangler d1 list
```

Check `wrangler.toml` has correct `database_id`.

### R2 Upload Fails

Check secrets:

```bash
wrangler secret list
```

Verify bucket exists:

```bash
wrangler r2 bucket list
```

### File Not Found

Ensure `R2_PUBLIC_URL` is set correctly. Test:

```bash
curl https://your-r2-bucket.r2.cloudflarestorage.com/file.jpg
```

## Performance

### Cold Starts

First request to your Worker takes ~50ms. Subsequent requests are faster.

### Image Serving

Without server-side thumbnails:

- Full images served from R2
- Browser handles resizing
- Consider using Cloudflare Images for optimization

### Database Queries

D1 is fast for read operations:

- **Latency**: ~10-20ms globally
- **Write limits**: 5 writes/second per account
- **Read limits**: 400,000 reads/day free

## Cost

Cloudflare free tier is **truly free**:

- ✅ Workers: 100K requests/day free
- ✅ D1: 5GB free
- ✅ R2: 10GB free
- ✅ Pages: Unlimited sites

Paid plans (if needed):

- **Workers**: $5/month for 10M requests
- **D1**: $0.15/million row reads
- **R2**: $0.015/GB storage, $0.01/10K reads

## Next Steps

After deployment:

1. Test basic functionality
2. Upload images to R2
3. Query D1 database
4. Monitor with `wrangler tail`

For ActivityPub federation, see [ActivityPub Setup](../activitypub/README.md)
