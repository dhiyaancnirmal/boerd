# Deploy to Railway

Railway is the easiest way to deploy Boerd. Railway provides:

- Persistent disk storage (1GB)
- Automatic HTTPS
- Zero-downtime deployments
- Built-in logs and metrics

## Prerequisites

- GitHub account
- Railway account ([railway.app](https://railway.app))

## One-Click Deploy

1. Click the "Deploy on Railway" button (create this in `railway.json`)
2. Connect your GitHub account
3. Railway will build and deploy automatically

## Manual Deploy

### 1. Prepare Your Repository

Ensure your repository has:

- `railway.json` configuration
- `Dockerfile` at the root

### 2. Create New Project

1. Go to [railway.app](https://railway.app)
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Select your boerd repository

### 3. Configure

Railway will auto-detect `railway.json` and configure:

- **Web service** with 1GB persistent disk
- **Environment variables** (NODE_ENV, PORT, DATA_DIR)

### 4. Access Your Boerd

After deployment (~2-3 minutes):

1. Click on your project in Railway dashboard
2. Find the domain under "Networking"
3. Click to visit your Boerd instance

## Environment Variables

Railway automatically sets:

```bash
NODE_ENV=production
PORT=3000
DATA_DIR=/data
```

You can add custom variables if needed.

## Storage

Your data is stored in a persistent disk at `/data`:

```
/data/
├── boerd.db              # SQLite database
└── uploads/
    ├── images/
    │   ├── original/
    │   └── thumbnails/
    └── files/
```

## Scaling

The default config uses a shared CPU with:

- **512MB RAM** - sufficient for small-to-medium use
- **1GB disk** - stores ~1000+ images

To scale:

1. Go to your project settings
2. Click "Add Volume"
3. Increase disk size as needed
4. Adjust CPU/RAM in service settings

## Backup

To backup your data:

1. Go to Railway project dashboard
2. Click on your service
3. Go to "Storage" tab
4. Download your disk

To restore:

1. Stop the service
2. Delete existing volume
3. Create new volume
4. Upload your backup
5. Restart service

## Cost

Railway pricing:

- **$5/month** after initial $5 credit
- Includes 512MB RAM, 1GB disk
- Good for personal/small team use

## Troubleshooting

### Build Fails

- Check `railway.json` syntax
- Ensure `Dockerfile` exists
- View build logs in Railway dashboard

### App Won't Start

- Check logs for errors
- Verify `PORT` is set to 3000
- Ensure disk is attached

### Files Not Uploading

- Check disk space in Railway dashboard
- Verify `DATA_DIR` is set to `/data`

## Next Steps

After deployment:

- Create your first boerd
- Add blocks by pasting URLs or dropping files
- Share your boerd URL with others

For ActivityPub federation, see [ActivityPub Setup](../activitypub/README.md)
