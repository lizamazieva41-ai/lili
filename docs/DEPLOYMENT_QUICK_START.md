# Deployment Quick Start

## ⚠️ Critical: Build Artifacts First

**The application REQUIRES two artifacts that are NOT in the repository:**

1. `libtdjson.so` - TDLib shared library (~10-50MB)
2. `tdlib.node` - Native Node.js addon

These must be built before first deployment.

## Quick Deployment Steps

### Step 1: Build Artifacts (REQUIRED)

```bash
# Automatic build (recommended)
npm run ensure:artifacts

# This will automatically:
# - Build libtdjson.so if missing
# - Build tdlib.node if missing
# - Verify both artifacts are valid
```

**If automatic build fails**, see [Artifact Build Guide](ARTIFACT_BUILD_GUIDE.md) for manual steps.

### Step 2: Verify Artifacts

```bash
# Check artifacts exist
ls -lh native/vendor/tdlib/lib/libtdjson.so
ls -lh native/tdlib/build/Release/tdlib.node

# Expected output:
# -rw-r--r-- 1 user user 15M ... libtdjson.so
# -rw-r--r-- 1 user user 2.5M ... tdlib.node
```

### Step 3: Set Environment Variables

```bash
# Copy example
cp .env.example .env

# Generate encryption key (REQUIRED)
export ENCRYPTION_KEY=$(openssl rand -hex 32)
echo "ENCRYPTION_KEY=${ENCRYPTION_KEY}" >> .env

# Set other required variables
echo "DATABASE_URL=postgresql://..." >> .env
echo "REDIS_URL=redis://..." >> .env
echo "JWT_SECRET=..." >> .env
echo "TDLIB_SESSION_ENCRYPTION_ENABLED=true" >> .env
```

### Step 4: Install Dependencies

```bash
npm install --production
```

### Step 5: Run Migrations

```bash
npx prisma migrate deploy
npx prisma generate
```

### Step 6: Start Application

```bash
# Development
npm run start:dev

# Production (with PM2)
pm2 start ecosystem.config.js
```

## Using Release Package

If you have a release package (from CI/CD or manual build):

```bash
# Extract release
tar -xzf telegram-platform-backend-v1.0.0-*.tar.gz
cd telegram-platform-backend-v1.0.0-*

# Artifacts are already included in release package
# Verify they exist:
ls -lh native/vendor/tdlib/lib/libtdjson.so
ls -lh native/tdlib/build/Release/tdlib.node

# Install and start
npm install --production
npx prisma migrate deploy
pm2 start ecosystem.config.js
```

## Troubleshooting

### Error: libtdjson.so not found

**Symptom:**
```
Error: TDLib library not found
```

**Solution:**
```bash
# Build the library
bash scripts/build-tdlib.sh

# Or use automatic build
npm run ensure:artifacts
```

### Error: tdlib.node not found

**Symptom:**
```
Error: Cannot find module 'native/tdlib/build/Release/tdlib.node'
```

**Solution:**
```bash
# Build the addon
npm run build:tdlib-addon

# Or use automatic build
npm run ensure:artifacts
```

### Error: TDLib library not initialized

**Symptom:**
```
Error: TDLib library not initialized
```

**Possible causes:**
1. Library path incorrect - Set `TDLIB_LIBRARY_PATH` environment variable
2. Library dependencies missing - Run `ldd native/vendor/tdlib/lib/libtdjson.so`
3. Wrong architecture - Ensure library matches system architecture

**Solution:**
```bash
# Check library dependencies
ldd native/vendor/tdlib/lib/libtdjson.so

# Set explicit path
export TDLIB_LIBRARY_PATH=$(pwd)/native/vendor/tdlib/lib/libtdjson.so

# Rebuild if needed
bash scripts/build-tdlib.sh
```

## Pre-Deployment Checklist

Before deploying to production:

- [ ] Artifacts built (`npm run ensure:artifacts`)
- [ ] Artifacts verified (check file sizes > 0)
- [ ] Environment variables set (especially `ENCRYPTION_KEY`)
- [ ] Database migrations run
- [ ] Dependencies installed
- [ ] Pre-deployment check passed (`npm run check:pre-deploy`)

## Production Deployment

For production deployment, use the release package:

```bash
# 1. Download release package
# (from GitHub Releases or CI/CD artifacts)

# 2. Extract
tar -xzf telegram-platform-backend-*.tar.gz

# 3. Verify checksums
sha256sum -c *.sha256

# 4. Deploy
cd telegram-platform-backend-*
npm install --production
npx prisma migrate deploy
export ENCRYPTION_KEY=...
pm2 start ecosystem.config.js
```

## Next Steps

- [Artifact Build Guide](ARTIFACT_BUILD_GUIDE.md) - Detailed build instructions
- [Production Deployment Guide](PRODUCTION_DEPLOYMENT.md) - Complete deployment guide
- [Security Guide](SECURITY.md) - Security best practices

---

**Last Updated**: 2026-01-27
