# TDLib Integration Deployment Guide

## Overview

This guide provides step-by-step instructions for deploying the TDLib-integrated `telegram-platform-backend` to production.

## Prerequisites

### System Requirements

- **OS**: Ubuntu 22.04 LTS (recommended) or compatible Linux distribution
- **CPU**: 4+ cores (8+ recommended for production)
- **RAM**: 8GB minimum (16GB+ recommended)
- **Disk**: 50GB+ free space
- **Network**: Stable internet connection

### Software Requirements

- Docker 20.10+ and Docker Compose 2.0+
- Node.js 20.x (if building locally)
- PostgreSQL 15+
- Redis 7+
- Git

## Pre-Deployment Checklist

### 1. Environment Variables

Create `.env` file with required variables:

```bash
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/telegram_platform

# Redis
REDIS_URL=redis://localhost:6379

# JWT
JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRES_IN=7d

# TDLib Configuration
TDLIB_ENABLED=true
TDLIB_ADDON_PATH=/app/native/tdlib/build/Release/tdlib.node
TDLIB_LIBRARY_PATH=/app/native/vendor/tdlib/lib/libtdjson.so
TDLIB_SESSION_TTL_SECONDS=604800
TDLIB_SESSION_DB_BACKUP=true
TDLIB_UPDATE_POLLING_ENABLED=true
TDLIB_POLL_INTERVAL_MS=100
TDLIB_POLL_TIMEOUT_SECONDS=1.0

# Encryption (for proxy passwords)
ENCRYPTION_KEY=your-encryption-key-hex-64-chars
ENCRYPTION_SALT=your-salt-change-in-production

# Application
NODE_ENV=production
PORT=3000
```

### 2. Build TDLib Library

**Option A: Using Docker (Recommended)**

```bash
cd tools-tele
docker build -f telegram-platform-backend/Dockerfile.tdlib-build -t tdlib-builder .
docker run --rm -v $(pwd)/telegram-platform-backend/native/vendor/tdlib/lib:/output tdlib-builder \
  sh -c 'cp /app/native/vendor/tdlib/lib/libtdjson.so /output/'
```

**Option B: Using Build Script**

```bash
cd tools-tele/telegram-platform-backend
chmod +x scripts/build-tdlib.sh
./scripts/build-tdlib.sh
```

**Option C: Using CI/CD Artifacts**

Download `libtdjson.so` from GitHub Actions artifacts and place in:
```
tools-tele/telegram-platform-backend/native/vendor/tdlib/lib/libtdjson.so
```

### 3. Build Native Addon

```bash
cd tools-tele/telegram-platform-backend
npm install
npm run build:tdlib-addon
```

Verify build:
```bash
test -f native/tdlib/build/Release/tdlib.node && echo "✓ Native addon built" || echo "✗ Build failed"
```

### 4. Database Migration

```bash
cd tools-tele/telegram-platform-backend
npx prisma migrate deploy
npx prisma generate
```

### 5. Verify Build

```bash
cd tools-tele/telegram-platform-backend
chmod +x scripts/verify-tdlib-build.sh
./scripts/verify-tdlib-build.sh
```

## Deployment Methods

### Method 1: Docker Compose (Recommended for Single Server)

1. **Create docker-compose.yml**:

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: telegram_platform
      POSTGRES_USER: ${DB_USER}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

  app:
    build:
      context: .
      dockerfile: telegram-platform-backend/Dockerfile
    environment:
      DATABASE_URL: postgresql://${DB_USER}:${DB_PASSWORD}@postgres:5432/telegram_platform
      REDIS_URL: redis://redis:6379
      # ... other env vars
    ports:
      - "3000:3000"
    depends_on:
      - postgres
      - redis
    volumes:
      - ./telegram-platform-backend/native/vendor/tdlib/lib:/app/native/vendor/tdlib/lib:ro
```

2. **Deploy**:

```bash
cd tools-tele
docker-compose up -d
```

### Method 2: Kubernetes

1. **Create deployment YAML**:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: telegram-platform-backend
spec:
  replicas: 3
  selector:
    matchLabels:
      app: telegram-platform-backend
  template:
    metadata:
      labels:
        app: telegram-platform-backend
    spec:
      containers:
      - name: app
        image: your-registry/telegram-platform-backend:latest
        env:
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: app-secrets
              key: database-url
        # ... other env vars
        volumeMounts:
        - name: tdlib-lib
          mountPath: /app/native/vendor/tdlib/lib
          readOnly: true
      volumes:
      - name: tdlib-lib
        hostPath:
          path: /path/to/libtdjson.so
          type: File
```

2. **Apply**:

```bash
kubectl apply -f deployment.yaml
```

### Method 3: PM2 (Node.js Process Manager)

1. **Build application**:

```bash
cd tools-tele/telegram-platform-backend
npm run build
```

2. **Start with PM2**:

```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

## Post-Deployment Verification

### 1. Health Checks

```bash
# Application health
curl http://localhost:3000/api/health

# TDLib health
curl http://localhost:3000/tdlib/health

# Metrics
curl http://localhost:3000/metrics | grep tdlib
```

### 2. Smoke Tests

```bash
# Test authentication flow
curl -X POST http://localhost:3000/tdlib/auth/request-code \
  -H "Authorization: Bearer ${TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{"phoneNumber": "+1234567890"}'

# Test session listing
curl http://localhost:3000/tdlib/sessions \
  -H "Authorization: Bearer ${TOKEN}"
```

### 3. Monitoring Setup

1. **Prometheus**: Configure to scrape `/metrics` endpoint
2. **Grafana**: Import dashboards from `monitoring/grafana/`
3. **Alerts**: Configure alerts from `monitoring/prometheus/tdlib-alerts.yml`

## Rollback Procedure

### Quick Rollback

```bash
# Docker Compose
docker-compose down
docker-compose up -d --scale app=0
# Restore previous version
docker-compose up -d

# Kubernetes
kubectl rollout undo deployment/telegram-platform-backend

# PM2
pm2 restart telegram-platform-backend --update-env
```

### Data Rollback

If database migrations need to be rolled back:

```bash
cd tools-tele/telegram-platform-backend
npx prisma migrate resolve --rolled-back <migration-name>
npx prisma migrate deploy
```

## Troubleshooting

### TDLib Not Loading

**Symptoms**: `TDLib service not ready` in health check

**Solutions**:
1. Check `libtdjson.so` exists and is readable
2. Verify `LD_LIBRARY_PATH` includes library directory
3. Check library dependencies: `ldd libtdjson.so`
4. Verify native addon built: `test -f native/tdlib/build/Release/tdlib.node`

### High Memory Usage

**Symptoms**: Memory usage > 80%

**Solutions**:
1. Reduce `TDLIB_POLL_INTERVAL_MS` (increase interval)
2. Reduce concurrent clients
3. Enable session cleanup: `TDLIB_SESSION_TTL_SECONDS`
4. Monitor for memory leaks

### High Error Rate

**Symptoms**: `tdlib_errors_total` increasing rapidly

**Solutions**:
1. Check TDLib version compatibility
2. Verify proxy configurations
3. Check network connectivity
4. Review error logs for specific error codes

## Maintenance

### Regular Tasks

1. **Daily**: Monitor metrics and alerts
2. **Weekly**: Review error logs and performance metrics
3. **Monthly**: Update TDLib version (if needed)
4. **Quarterly**: Performance testing and optimization

### Updates

1. **TDLib Update**:
   ```bash
   git pull origin main  # Update td-master
   ./scripts/build-tdlib.sh
   npm run build:tdlib-addon
   # Test thoroughly before deploying
   ```

2. **Application Update**:
   ```bash
   git pull origin main
   npm install
   npm run build
   # Deploy using chosen method
   ```

## Support

For issues or questions:
- Check logs: `docker-compose logs app` or `pm2 logs`
- Review metrics: Grafana dashboards
- Check health: `/tdlib/health` endpoint
- Review documentation: `docs/` directory
