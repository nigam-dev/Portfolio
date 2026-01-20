# Deployment Guide

## Prerequisites

- Server with Docker & Docker Compose
- Domain name with DNS configured
- SSL certificate (Let's Encrypt recommended)
- MongoDB instance (local or cloud)
- Redis instance (optional)
- Google OAuth credentials

## Environment Setup

### 1. Prepare Environment File

Create `.env` in project root:

```env
NODE_ENV=production
PORT=5000

MONGODB_URI=mongodb://your-mongo-host:27017/portfolio_db
REDIS_URL=redis://your-redis-host:6379

JWT_SECRET=generate_secure_random_string_here
JWT_EXPIRES_IN=7d

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=https://yourdomain.com/api/v1/auth/google/callback

ADMIN_EMAIL=nigmanand-dev@gmail.com

CLIENT_URL=https://yourdomain.com
ADMIN_URL=https://admin.yourdomain.com
```

### 2. Generate Secrets

```bash
# Generate JWT secret
openssl rand -base64 64

# Or use Node.js
node -e "console.log(require('crypto').randomBytes(64).toString('base64'))"
```

## Docker Deployment

### Build and Start

```bash
# Clone repository
git clone <repo-url>
cd Portfolio

# Build images
docker-compose build

# Start services
docker-compose up -d

# Check logs
docker-compose logs -f
```

### Service URLs
- Backend: http://localhost:5000
- Client: http://localhost:3000
- Admin: http://localhost:3001

## Nginx Reverse Proxy

### Install Nginx

```bash
sudo apt update
sudo apt install nginx
```

### Configure Site

Create `/etc/nginx/sites-available/portfolio`:

```nginx
# Backend API
upstream api_backend {
    server localhost:5000;
}

# Client frontend
upstream client_frontend {
    server localhost:3000;
}

# Admin panel
upstream admin_panel {
    server localhost:3001;
}

# Main domain - Client
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://client_frontend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    location /api {
        proxy_pass http://api_backend;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}

# Admin subdomain
server {
    listen 80;
    server_name admin.yourdomain.com;

    location / {
        proxy_pass http://admin_panel;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable site:

```bash
sudo ln -s /etc/nginx/sites-available/portfolio /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

## SSL with Let's Encrypt

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Get certificates
sudo certbot --nginx -d yourdomain.com -d admin.yourdomain.com

# Auto-renewal is set up automatically
# Test renewal
sudo certbot renew --dry-run
```

## Database Backup

### MongoDB Backup Script

Create `backup.sh`:

```bash
#!/bin/bash
BACKUP_DIR=/backups/mongodb
DATE=$(date +%Y%m%d_%H%M%S)

mkdir -p $BACKUP_DIR

docker exec portfolio-mongodb mongodump \
  --db portfolio_db \
  --out /tmp/backup_$DATE

docker cp portfolio-mongodb:/tmp/backup_$DATE $BACKUP_DIR/

echo "Backup completed: $BACKUP_DIR/backup_$DATE"
```

### Automate with Cron

```bash
# Edit crontab
crontab -e

# Add daily backup at 2 AM
0 2 * * * /path/to/backup.sh >> /var/log/portfolio-backup.log 2>&1
```

## Monitoring

### Health Check Endpoint

```bash
# Check server health
curl http://localhost:5000/health
```

### Docker Logs

```bash
# View all logs
docker-compose logs

# Follow specific service
docker-compose logs -f server

# Last 100 lines
docker-compose logs --tail=100 server
```

### System Resources

```bash
# Check Docker stats
docker stats

# Check disk usage
df -h

# Check MongoDB size
docker exec portfolio-mongodb mongo --eval "db.stats()"
```

## Scaling

### Horizontal Scaling

For high traffic, consider:

1. **Load Balancer**: Nginx/HAProxy in front of multiple server instances
2. **Database Replica Set**: MongoDB replica set for read scaling
3. **Redis Cluster**: Distributed caching
4. **CDN**: CloudFlare/CloudFront for static assets

### Vertical Scaling

Adjust Docker resources in `docker-compose.yml`:

```yaml
services:
  server:
    deploy:
      resources:
        limits:
          cpus: '2'
          memory: 2G
        reservations:
          cpus: '1'
          memory: 1G
```

## Troubleshooting

### Server Won't Start

```bash
# Check logs
docker-compose logs server

# Check MongoDB connection
docker exec portfolio-mongodb mongo --eval "db.adminCommand('ping')"

# Restart services
docker-compose restart
```

### Database Connection Issues

```bash
# Test MongoDB
docker exec -it portfolio-mongodb mongo
use portfolio_db
db.users.find()

# Check network
docker network ls
docker network inspect portfolio_portfolio-network
```

### Memory Issues

```bash
# Check memory usage
free -h

# Clear Docker system
docker system prune -a

# Restart Docker
sudo systemctl restart docker
```

## Security Checklist

- [ ] Strong JWT secret generated
- [ ] Google OAuth configured with correct callback URL
- [ ] Firewall configured (only 80, 443, SSH open)
- [ ] SSL certificates installed and auto-renewing
- [ ] Database has authentication enabled
- [ ] Regular backups automated
- [ ] Logs being monitored
- [ ] Rate limiting enabled
- [ ] CORS configured correctly
- [ ] Environment variables secured

## Updates

### Update Application

```bash
# Pull latest code
git pull origin main

# Rebuild and restart
docker-compose down
docker-compose build
docker-compose up -d

# Check logs
docker-compose logs -f
```

### Update Dependencies

```bash
# Update npm packages
npm update

# Update Docker images
docker-compose pull
```

## Support

For issues:
1. Check logs first
2. Review environment variables
3. Verify database connections
4. Check Docker container status
5. Review Nginx configuration
