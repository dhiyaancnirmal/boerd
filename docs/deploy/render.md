# Deploy to Render

Render offers a free tier with persistent disk storage. Great for static-friendly deployments.

## Prerequisites

- GitHub account
- Render account ([render.com](https://render.com))
- Render blueprint support in `render.yaml`

## Deploy

### 1. Prepare Repository

Ensure your repository has:

- `render.yaml` configuration
- `Dockerfile` at root

### 2. Deploy via Blueprint

1. Go to [dashboard.render.com](https://dashboard.render.com)
2. Click "New +"
3. Select "Blueprint" tab
4. Enter your GitHub repo URL: `https://github.com/yourusername/boerd`
5. Click "Apply" to create

### 3. Configure Environment

Render will create:

- **Web Service** from `Dockerfile`
- **Persistent Disk** (1GB)
- Environment variables

### 4. Monitor Build

Watch build logs in Render dashboard. First deploy takes ~5 minutes.

### 5. Access Your Boerd

After build completes:

1. Click on your service in Render dashboard
2. Find the URL (e.g., `https://boerd.onrender.com`)
3. Visit your Boerd instance

## Configuration

`render.yaml` defines:

- **Docker build** with Bun
- **1GB disk** mounted at `/opt/render/project/data`
- **Port 3000** exposed
- **Oregon region**

## Environment Variables

Render auto-sets:

```bash
NODE_ENV=production
PORT=3000
DATA_DIR=/opt/render/project/data
```

Add custom variables:

1. Go to service settings
2. "Environment" tab
3. "Add Environment Variable"

## Storage

Data is stored on persistent disk:

```
/opt/render/project/data/
├── boerd.db              # SQLite database
└── uploads/
    ├── images/
    │   ├── original/
    │   └── thumbnails/
    └── files/
```

## Free Tier

Render free tier includes:

- ✅ **750 hours/month** compute
- ✅ **1GB disk** storage
- ✅ **100GB bandwidth** per month
- ✅ Automatic HTTPS
- ✅ 30-day logs

After free tier:

- **$7/month** - Standard web service
- **Additional storage**: $0.25/GB/month

## Custom Domain

1. Go to service settings
2. "Custom Domains" tab
3. "Add Custom Domain"
4. Enter your domain (e.g., `boerd.yourdomain.com`)
5. Update DNS records per Render instructions

## Scaling

### Increase Resources

In service dashboard:

1. "Advanced" tab
2. "Instances" section
3. Increase RAM/CPU as needed

### Add Storage

1. "Disk" tab in service settings
2. "Resize Disk"
3. Update size (pricing: $0.25/GB/month)

## Backup

### Manual Backup

1. Use Render CLI or access disk via SSH
2. Copy `/opt/render/project/data` directory

### Database Export

Since it's SQLite, you can:

```bash
sqlite3 boerd.db .dump > backup.sql
```

## Troubleshooting

### Build Fails

Check logs:

- "Events" tab in Render dashboard
- Look for Docker build errors
- Verify `Dockerfile` syntax

### App Won't Start

- Check "Logs" tab
- Verify `PORT` is 3000
- Ensure disk is attached
- Look for database errors

### Disk Full

1. Go to service "Disk" tab
2. Check usage
3. Resize if needed

### Slow Performance

Free tier has resource limits:

- **CPU** may be throttled
- Consider upgrading to Standard tier
- Or try a different platform (Fly.io, Railway)

## Next Steps

After successful deployment:

- Create your first boerd
- Test paste/drop functionality
- Share with others

For ActivityPub federation, see [ActivityPub Setup](../activitypub/README.md)
