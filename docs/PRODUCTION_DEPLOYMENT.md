# Production Deployment Guide

## Pre-Deployment Checklist

### 1. Environment Configuration

```bash
# Required environment variables
ENCRYPTION_KEY=<generate with: openssl rand -hex 32>
DATABASE_URL=<postgresql://...>
REDIS_URL=<redis://...>
JWT_SECRET=<strong random secret>

# TDLib Configuration
TDLIB_SESSION_ENCRYPTION_ENABLED=true
TDLIB_SESSION_TTL_SECONDS=604800
TDLIB_SESSION_DB_BACKUP=true
TDLIB_UPDATE_POLLING_ENABLED=true
TDLIB_SESSION_CLEANUP_ENABLED=true
```

### 2. Build TDLib Library

```bash
# Option 1: Using Docker (recommended)
cd tools-tele
docker build -f telegram-platform-backend/Dockerfile.tdlib-build -t tdlib-builder .
docker create --name tdlib-extract tdlib-builder
docker cp tdlib-extract:/build/output/lib/libtdjson.so telegram-platform-backend/native/vendor/tdlib/lib/
docker rm tdlib-extract

# Option 2: Using build script
cd telegram-platform-backend
bash scripts/build-tdlib.sh
```

### 3. Build Native Addon

```bash
cd telegram-platform-backend
npm run build:tdlib-addon
```

### 4. Run Production Cleanup

```bash
bash scripts/cleanup-production.sh
bash scripts/prepare-production.sh
```

### 5. Database Migrations

```bash
npx prisma migrate deploy
npx prisma generate
```

### 6. Run Tests

```bash
npm test
npm run test:e2e
```

## Deployment Steps

### Docker Deployment

```bash
# Build production image
docker build -t telegram-platform-backend:latest .

# Run container
docker run -d \
  --name telegram-backend \
  -p 3000:3000 \
  --env-file .env.production \
  telegram-platform-backend:latest
```

### Kubernetes Deployment

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: telegram-platform-backend
spec:
  replicas: 3
  template:
    spec:
      containers:
      - name: backend
        image: telegram-platform-backend:latest
        env:
        - name: ENCRYPTION_KEY
          valueFrom:
            secretKeyRef:
              name: app-secrets
              key: encryption-key
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: app-secrets
              key: database-url
        ports:
        - containerPort: 3000
        livenessProbe:
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /health/detailed
            port: 3000
          initialDelaySeconds: 10
          periodSeconds: 5
```

## Post-Deployment Verification

### 1. Health Checks

```bash
# Basic health
curl http://localhost:3000/health

# Detailed health
curl http://localhost:3000/health/detailed

# TDLib health
curl http://localhost:3000/tdlib/health
```

### 2. Metrics

```bash
# Prometheus metrics
curl http://localhost:3000/metrics
```

### 3. Verify Encryption

```bash
# Check Redis (should see encrypted data)
redis-cli KEYS "tdlib:session:*" | head -1 | xargs redis-cli GET

# Should return encrypted hex string, not JSON
```

### 4. Test Authentication Flow

```bash
# Request code
curl -X POST http://localhost:3000/tdlib/auth/request-code \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"phoneNumber": "+1234567890"}'
```

## Monitoring Setup

### Prometheus Configuration

```yaml
scrape_configs:
  - job_name: 'telegram-backend'
    static_configs:
      - targets: ['localhost:3000']
    metrics_path: '/metrics'
```

### Grafana Dashboard

Import dashboard from:
```
monitoring/grafana/tdlib-overview-dashboard.json
```

### Alerting Rules

Load Prometheus alerts:
```yaml
rule_files:
  - "monitoring/prometheus/tdlib-alerts.yml"
```

## Rollback Procedure

### Quick Rollback

1. **Stop new version**
   ```bash
   docker stop telegram-backend
   ```

2. **Start previous version**
   ```bash
   docker run -d \
     --name telegram-backend \
     -p 3000:3000 \
     --env-file .env.production \
     telegram-platform-backend:previous
   ```

3. **Verify health**
   ```bash
   curl http://localhost:3000/health
   ```

### Database Rollback

```bash
# Rollback last migration
npx prisma migrate resolve --rolled-back <migration-name>

# Or restore from backup
pg_restore -d database_name backup.dump
```

## Troubleshooting

### Issue: libtdjson.so not found

**Solution**:
1. Verify library exists: `ls -la native/vendor/tdlib/lib/libtdjson.so`
2. Check LD_LIBRARY_PATH: `export LD_LIBRARY_PATH=$PWD/native/vendor/tdlib/lib:$LD_LIBRARY_PATH`
3. Verify binding.gyp rpath configuration

### Issue: Native addon build fails

**Solution**:
1. Install build dependencies: `sudo apt-get install build-essential node-gyp`
2. Check Node.js version: `node --version` (should be 18+)
3. Clean and rebuild: `npm run clean && npm run build:tdlib-addon`

### Issue: Session decryption errors

**Solution**:
1. Verify ENCRYPTION_KEY matches across all instances
2. Check key format (should be 64 hex characters)
3. Review migration guide if upgrading from unencrypted

### Issue: High memory usage

**Solution**:
1. Monitor session count: `redis-cli DBSIZE`
2. Check cleanup service is running
3. Adjust TTL if needed: `TDLIB_SESSION_TTL_SECONDS`

## Performance Tuning

### Redis Configuration

```conf
# redis.conf
maxmemory 2gb
maxmemory-policy allkeys-lru
```

### Node.js Configuration

```bash
# Increase memory limit
NODE_OPTIONS="--max-old-space-size=4096"

# Enable production optimizations
NODE_ENV=production
```

### Database Connection Pool

```env
DATABASE_POOL_MIN=5
DATABASE_POOL_MAX=20
```

## Security Hardening

1. **Enable all security features**
   ```bash
   TDLIB_SESSION_ENCRYPTION_ENABLED=true
   ```

2. **Use HTTPS**
   - Configure reverse proxy (nginx/traefik)
   - Enable SSL/TLS certificates

3. **Firewall rules**
   - Only expose necessary ports
   - Restrict admin access

4. **Regular updates**
   - Keep dependencies updated
   - Monitor security advisories

## Maintenance

### Regular Tasks

- **Daily**: Monitor health endpoints and metrics
- **Weekly**: Review logs for errors
- **Monthly**: Rotate encryption keys
- **Quarterly**: Security audit and dependency updates

### Backup Strategy

1. **Database backups**: Daily automated backups
2. **Redis snapshots**: Configure Redis persistence
3. **Session backups**: Already handled by DB backup feature

## Support

For issues or questions:
- Check troubleshooting section
- Review logs: `logs/application-*.log`
- Check monitoring dashboards
- Consult security guide: `docs/SECURITY.md`
