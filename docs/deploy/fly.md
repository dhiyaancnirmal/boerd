# Deploy to Fly.io

Fly.io provides global edge deployment with persistent volumes. Great for hobby projects.

## Prerequisites

- GitHub account
- Fly.io account ([fly.io](https://fly.io))
- `flyctl` CLI tool

```bash
brew install flyctl
# or
curl -L https://fly.io/install.sh | sh
```

## Deploy

### 1. Login to Fly

```bash
flyctl auth signup
```

### 2. Launch Your App

From the boerd root directory:

```bash
flyctl launch
```

This will:

- Detect `fly.toml` configuration
- Ask for app name (default: "boerd")
- Select region (default: "iad" - Virginia)
- Create the app

### 3. Deploy

```bash
flyctl deploy
```

Fly will:

- Build Docker image
- Create persistent volume
- Deploy to your region
- Configure health checks

### 4. Access Your Boerd

```bash
flyctl apps open
```

Or visit: `https://your-app-name.fly.dev`

## Configuration

`fly.toml` includes:

- **Persistent volume** for data (1GB)
- **HTTP service** on port 3000
- **Health checks** every 15 seconds
- **0 to 1 machines** (scale-to-zero to save cost)

## Environment Variables

Fly sets these from `fly.toml`:

```bash
NODE_ENV=production
DATA_DIR=/data
PORT=3000
```

Add custom variables:

```bash
flyctl secrets set VARIABLE_NAME=value
```

## Storage

Data lives in a named volume at `/data`:

```
/data/
├── boerd.db              # SQLite database
└── uploads/
    ├── images/
    │   ├── original/
    │   └── thumbnails/
    └── files/
```

Volumes persist across deployments and restarts.

## Scaling

### Manual Scaling

```bash
flyctl scale count 2
```

### Auto-scaling

Edit `fly.toml`:

```toml
[http_service]
  min_machines_running = 1
  max_machines_running = 5
```

### Resources

Default:

- **1 CPU** (shared)
- **512MB RAM**
- **1GB volume**

To upgrade:

```bash
flyctl scale vm dedicated-cpu-1x --volume-size=3
```

## Backup

### Snapshot Volume

```bash
flyctl volumes snapshot boerd_data
```

### List Snapshots

```bash
flyctl volumes list --snapshot
```

### Restore

Create new volume from snapshot:

```bash
flyctl volumes create --snapshot-id <snapshot-id>
```

Then update `fly.toml` with new volume name.

## Cost

Fly.io pricing (as of 2024):

- **Free tier**: ~$0-3/month (depends on usage)
  - Includes 3GB volume
  - 160GB outbound transfer
  - 2 shared CPUs
- **Paid**: Usage-based after free tier

Calculate cost: `flyctl org bills`

## Troubleshooting

### App Won't Start

```bash
flyctl logs
```

Check for:

- Missing volume
- Port conflicts
- Database errors

### Volume Issues

```bash
flyctl volumes list
```

Ensure volume is mounted in `fly.toml`:

```toml
[[mounts]]
  source = "boerd_data"
  destination = "/data"
```

### Disk Full

```bash
flyctl volumes list
```

Check volume size and increase if needed:

```bash
flyctl volumes extend boerd_data --size 3GB
```

## Global Regions

Fly has regions worldwide:

- `iad` - Virginia (US)
- `lhr` - London (UK)
- `fra` - Frankfurt (DE)
- `syd` - Sydney (AU)
- `nrt` - Tokyo (JP)

To change region:

```bash
flyctl regions set fra
flyctl deploy
```

## Next Steps

After deployment:

- Create your first boerd
- Test paste/drop functionality
- Configure a custom domain (`flyctl certs add yourdomain.com`)

For ActivityPub federation, see [ActivityPub Setup](../activitypub/README.md)
