# Production Ready Checklist

## Overview

This checklist ensures the application is ready for production deployment with all critical requirements met.

## ✅ Completed Improvements

### 1. TDLib Artifact Management ✅
- **Script**: `scripts/ensure-tdlib-artifact.sh`
- **Purpose**: Verifies `libtdjson.so` exists and is accessible
- **Usage**: `npm run ensure:tdlib`
- **Status**: ✅ Complete

### 2. Production Cleanup ✅
- **Script**: `scripts/cleanup-production.sh`
- **Purpose**: Removes dev files, logs, coverage, Docker files (optional)
- **Usage**: `npm run cleanup:production`
- **Configuration**: Set `INCLUDE_DOCKER=true` to keep Docker files
- **Status**: ✅ Complete

### 3. Security Hardening ✅
- **Session Encryption**: ✅ Implemented (AES-256-GCM)
- **Proxy Password Encryption**: ✅ Already implemented
- **Key Rotation Service**: ✅ Created (manual rotation)
- **Configuration**: `TDLIB_SESSION_ENCRYPTION_ENABLED=true`
- **Status**: ✅ Complete

### 4. Process Model Separation ✅
- **PM2 Config**: ✅ Updated with API and Worker separation
- **Worker Entry Point**: ✅ `src/worker.ts` created
- **Health Checks**: ✅ Worker health monitoring
- **Documentation**: ✅ `docs/PROCESS_MODEL.md`
- **Status**: ✅ Complete

### 5. Pre-Deployment Validation ✅
- **Script**: `scripts/pre-deployment-check.sh`
- **Purpose**: Validates all requirements before deployment
- **Usage**: `npm run check:pre-deploy`
- **Checks**:
  - TDLib artifact
  - Build environment
  - Encryption key
  - Environment variables
  - Dev files
  - TypeScript build
  - Native addon
- **Status**: ✅ Complete

## Pre-Deployment Steps

### Step 1: Build Artifacts

```bash
# 1. Build TDLib library
bash scripts/build-tdlib.sh

# 2. Build native addon
npm run build:tdlib-addon

# 3. Build TypeScript
npm run build

# 4. Verify artifacts
npm run ensure:tdlib
```

### Step 2: Set Environment Variables

```bash
# Generate encryption key
export ENCRYPTION_KEY=$(openssl rand -hex 32)

# Set required variables
export DATABASE_URL=postgresql://...
export REDIS_URL=redis://...
export JWT_SECRET=...
export TDLIB_SESSION_ENCRYPTION_ENABLED=true
```

### Step 3: Run Pre-Deployment Check

```bash
npm run check:pre-deploy
```

### Step 4: Cleanup Production Files

```bash
# Remove dev files (keeps Docker if INCLUDE_DOCKER=true)
npm run cleanup:production

# Or exclude Docker files
INCLUDE_DOCKER=false npm run cleanup:production
```

### Step 5: Create Production Package (Optional)

```bash
# Create package
npm run build:package

# Create package with archive
CREATE_ARCHIVE=true npm run build:package
```

### Step 6: Deploy

```bash
# Install dependencies
npm install --production

# Run migrations
npx prisma migrate deploy
npx prisma generate

# Start with PM2
pm2 start ecosystem.config.js --env production
pm2 save
pm2 startup
```

## Production Configuration

### Environment Variables

**Required**:
- `DATABASE_URL` - PostgreSQL connection string
- `REDIS_URL` - Redis connection string
- `JWT_SECRET` - JWT signing secret
- `ENCRYPTION_KEY` - 64-character hex string for encryption

**TDLib**:
- `TDLIB_SESSION_ENCRYPTION_ENABLED=true` - Enable session encryption
- `TDLIB_SESSION_TTL_SECONDS=604800` - Session TTL (7 days)
- `TDLIB_SESSION_DB_BACKUP=true` - Enable DB backup
- `TDLIB_LIBRARY_PATH` - Path to libtdjson.so (optional, auto-detected)

**Optional**:
- `PORT=3000` - API server port
- `NODE_ENV=production` - Environment
- `LOG_LEVEL=info` - Logging level
- `INCLUDE_DOCKER=false` - Include Docker files in package

### PM2 Process Management

**Start**:
```bash
pm2 start ecosystem.config.js
```

**Monitor**:
```bash
pm2 monit
pm2 logs
```

**Restart**:
```bash
pm2 restart all
pm2 restart telegram-platform-api
pm2 restart telegram-platform-worker
```

**Stop**:
```bash
pm2 stop all
```

## Security Checklist

- [x] Session encryption enabled
- [x] Proxy password encryption enabled
- [x] Encryption key set (64+ characters)
- [x] JWT secret set
- [x] Database credentials secure
- [x] Redis credentials secure
- [x] Production cleanup run
- [x] Dev files removed
- [ ] Security audit completed
- [ ] Penetration testing done
- [ ] Key rotation scheduled

## Monitoring Checklist

- [x] Health endpoints configured
- [x] Prometheus metrics enabled
- [x] Grafana dashboards created
- [x] Prometheus alerts configured
- [x] Log aggregation set up
- [ ] Alerting channels configured
- [ ] Uptime monitoring configured

## Performance Checklist

- [x] PM2 cluster mode for API
- [x] Worker process separated
- [x] Connection pooling configured
- [x] Rate limiting enabled
- [x] Session cleanup scheduled
- [ ] Load testing completed
- [ ] Performance benchmarks met

## Backup & Recovery

- [x] Database backups configured
- [x] Session DB backup enabled
- [x] Encryption key backup (manual)
- [ ] Disaster recovery plan documented
- [ ] Recovery testing completed

## Documentation

- [x] Production deployment guide
- [x] Security guide
- [x] Process model documentation
- [x] Migration guide
- [x] API documentation (Swagger)
- [x] Update mapping conventions
- [x] Lifecycle management guide

## Verification

After deployment, verify:

1. **Health Checks**:
   ```bash
   curl http://localhost:3000/api/health
   curl http://localhost:3000/api/health/detailed
   ```

2. **Process Status**:
   ```bash
   pm2 status
   pm2 list
   ```

3. **Logs**:
   ```bash
   pm2 logs telegram-platform-api --lines 50
   pm2 logs telegram-platform-worker --lines 50
   ```

4. **Metrics**:
   - Check Prometheus metrics endpoint
   - Verify Grafana dashboards
   - Check alert status

5. **Functionality**:
   - Test authentication
   - Test message sending
   - Test campaign execution
   - Verify TDLib integration

## Troubleshooting

### Common Issues

**Issue**: TDLib library not found
```bash
# Solution
npm run ensure:tdlib
# Or set TDLIB_LIBRARY_PATH
```

**Issue**: Encryption errors
```bash
# Solution
# Verify ENCRYPTION_KEY is set correctly
echo $ENCRYPTION_KEY | wc -c  # Should be 65 (64 + newline)
```

**Issue**: Worker not processing jobs
```bash
# Solution
# Check worker status
pm2 status telegram-platform-worker
# Check queue connection
curl http://localhost:3000/api/health/detailed
# Restart worker
pm2 restart telegram-platform-worker
```

**Issue**: High memory usage
```bash
# Solution
# Check memory
pm2 monit
# Restart processes
pm2 restart all
```

## Post-Deployment

1. **Monitor** for 24-48 hours
2. **Review** logs for errors
3. **Verify** metrics are being collected
4. **Test** critical functionality
5. **Document** any issues or improvements

## Support

For issues or questions:
- Check documentation in `docs/` directory
- Review logs: `pm2 logs`
- Check health endpoints
- Review monitoring dashboards

---

**Last Updated**: 2026-01-27  
**Status**: ✅ Production Ready (pending build artifacts)
