# Deploy with Docker

Docker lets you deploy Boerd anywhere: your own server, VPS, on-premise, or any cloud provider.

## Quick Start

### Prerequisites

- Docker installed
- Docker Compose (optional but recommended)

### Run with Docker

From boerd root:

```bash
docker build -t boerd .
docker run -p 3000:3000 -v $(pwd)/data:/app/data boerd
```

Visit `http://localhost:3000`

## Docker Compose (Recommended)

Create `docker-compose.yml` in your project root:

```yaml
version: "3.8"

services:
  boerd:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - PORT=3000
      - DATA_DIR=/app/data
    volumes:
      - ./data:/app/data
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s
```

Run:

```bash
docker-compose up -d
```

## Persistent Data

Data is stored in a volume at `/app/data`:

```bash
# In the container:
/app/data/
├── boerd.db
└── uploads/
    ├── images/
    │   ├── original/
    │   └── thumbnails/
    └── files/

# On the host:
./data/          # Mounted volume
```

Back up by copying the `./data` directory.

## Environment Variables

Docker supports all Boerd environment variables:

```yaml
environment:
  - NODE_ENV=production
  - PORT=3000
  - DATA_DIR=/app/data
  # Optional: Cloudflare R2
  - STORAGE_TYPE=r2
  - R2_ACCOUNT_ID=your-account-id
  - R2_ACCESS_KEY_ID=your-key
  - R2_SECRET_ACCESS_KEY=your-secret
  - R2_BUCKET_NAME=boerd-uploads
```

## Custom Configuration

### Change Port

```bash
docker run -p 8080:3000 -v $(pwd)/data:/app/data boerd
```

```yaml
ports:
  - "8080:3000"
environment:
  - PORT=3000 # Keep 3000 inside container
```

### Use R2 Instead of Local Storage

```yaml
environment:
  - STORAGE_TYPE=r2
  - R2_ACCOUNT_ID=${R2_ACCOUNT_ID}
  - R2_ACCESS_KEY_ID=${R2_ACCESS_KEY_ID}
  - R2_SECRET_ACCESS_KEY=${R2_SECRET_ACCESS_KEY}
  - R2_BUCKET_NAME=boerd-uploads
  - R2_PUBLIC_URL=https://your-bucket.r2.cloudflarestorage.com
```

## Production Tips

### Use Traefik/Reverse Proxy

```yaml
services:
  boerd:
    build: .
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.boerd.rule=Host(`boerd.yourdomain.com`)"
      - "traefik.http.routers.boerd.tls=true"
      - "traefik.http.routers.boerd.tls.certresolver=letsencrypt"
    networks:
      - web

networks:
  web:
    external: true
```

### Auto-Restart

```yaml
restart: unless-stopped
```

Options:

- `no` - Don't restart
- `always` - Always restart
- `on-failure` - Restart on failure
- `unless-stopped` - Restart unless manually stopped

### Resource Limits

```yaml
services:
  boerd:
    deploy:
      resources:
        limits:
          cpus: "1.0"
          memory: 512M
        reservations:
          cpus: "0.5"
          memory: 256M
```

## Backup

### Stop and Backup

```bash
docker-compose stop
tar -czf boerd-backup-$(date +%Y%m%d).tar.gz data/
```

### Restore

```bash
tar -xzf boerd-backup-YYYYMMDD.tar.gz
docker-compose up -d
```

### Live Backup (without downtime)

```bash
docker exec boerd cp -a /app/data /tmp/data-backup
docker cp boerd:/tmp/data-backup ./data-backup-$(date +%Y%m%d)
```

## Cloud Platforms

### DigitalOcean App Platform

1. Create app
2. Select Dockerfile
3. Set environment variables
4. Add persistent volume (1GB+)
5. Deploy

### AWS ECS

1. Push Docker image to ECR
2. Create task definition
3. Configure EFS for storage
4. Set up load balancer
5. Deploy

### Google Cloud Run

```bash
gcloud builds submit --tag gcr.io/your-project/boerd
gcloud run deploy boerd \
  --image gcr.io/your-project/boerd \
  --platform managed \
  --region us-central1 \
  --memory 512Mi \
  --allow-unauthenticated
```

Mount Cloud Storage for persistence.

## Self-Hosted Server

### Ubuntu/Debian

```bash
# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Clone repo
git clone https://github.com/yourusername/boerd.git
cd boerd

# Run with Docker Compose
sudo docker-compose up -d
```

### Raspberry Pi (ARM64)

Dockerfile works on ARM64. Run:

```bash
docker build --platform linux/arm64 -t boerd .
docker run -p 3000:3000 -v $(pwd)/data:/app/data boerd
```

### Nginx Reverse Proxy

```nginx
server {
    listen 80;
    server_name boerd.yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

SSL with Let's Encrypt:

```bash
sudo certbot --nginx -d boerd.yourdomain.com
```

## Monitoring

### View Logs

```bash
docker-compose logs -f
```

### Inspect Container

```bash
docker exec -it boerd sh
```

### Resource Usage

```bash
docker stats boerd
```

## Troubleshooting

### Container Won't Start

```bash
docker logs boerd
```

Check for:

- Port conflicts
- Permission issues with volume
- Missing environment variables

### Data Not Persisting

Ensure volume is mounted:

```bash
docker inspect boerd | grep -A 10 Mounts
```

Should show:

```json
{
  "Source": "/path/to/host/data",
  "Destination": "/app/data"
}
```

### Permission Denied

Fix volume permissions:

```bash
sudo chown -R 1001:1001 ./data
```

(1001 is the `nextjs` user ID in Dockerfile)

### Out of Disk Space

Check container size:

```bash
docker system df
```

Clean up:

```bash
docker system prune -a
```

## Next Steps

After running Boerd:

1. Create your first boerd
2. Test all functionality
3. Set up reverse proxy and SSL
4. Configure automated backups
5. For ActivityPub federation, see [ActivityPub Setup](../activitypub/README.md)
