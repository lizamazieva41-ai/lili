# Getting Started - Production Ready Setup

## ⚠️ IMPORTANT: Read This First

**This application requires two binary artifacts that are NOT included in the repository:**

1. `libtdjson.so` - TDLib shared library
2. `tdlib.node` - Native Node.js addon

**You MUST build these artifacts before running the application.**

## Quick Start (5 Minutes)

### Step 1: Build Artifacts (REQUIRED)

```bash
# Automatic build - builds both artifacts if missing
npm run ensure:artifacts
```

This will:
- ✅ Build `libtdjson.so` if missing
- ✅ Build `tdlib.node` if missing  
- ✅ Verify both artifacts are valid

**If this fails**, see troubleshooting below.

### Step 2: Configure Environment

```bash
# Copy example
cp .env.example .env

# Generate encryption key (REQUIRED)
openssl rand -hex 32
# Add to .env: ENCRYPTION_KEY=<generated-key>

# Set database and Redis URLs
# Edit .env file with your credentials
```

### Step 3: Install and Setup

```bash
# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev
```

### Step 4: Start Application

```bash
# Development
npm run start:dev

# Production
npm run build
pm2 start ecosystem.config.js
```

## Verification

After building artifacts, verify they exist:

```bash
# Check TDLib library
ls -lh native/vendor/tdlib/lib/libtdjson.so
# Should show: -rw-r--r-- ... 15M ... libtdjson.so

# Check native addon
ls -lh native/tdlib/build/Release/tdlib.node
# Should show: -rw-r--r-- ... 2.5M ... tdlib.node
```

## Troubleshooting

### Artifacts Not Building

**Problem:** `npm run ensure:artifacts` fails

**Solutions:**

1. **Check build environment:**
   ```bash
   bash scripts/check-build-environment.sh
   ```

2. **Install build dependencies:**
   ```bash
   # Ubuntu/Debian
   sudo apt-get install build-essential cmake libssl-dev zlib1g-dev

   # Or use Docker (see below)
   ```

3. **Manual build:**
   ```bash
   # Build TDLib library
   bash scripts/build-tdlib.sh

   # Build native addon
   npm run build:tdlib-addon
   ```

### Using Docker (Alternative)

If you can't install build tools locally:

```bash
# Build TDLib in Docker
cd ../..
docker build -f telegram-platform-backend/Dockerfile.tdlib-build -t tdlib-builder .
docker create --name tdlib-extract tdlib-builder
docker cp tdlib-extract:/build/output/lib/libtdjson.so telegram-platform-backend/native/vendor/tdlib/lib/
docker rm tdlib-extract

# Then build native addon
cd telegram-platform-backend
npm run build:tdlib-addon
```

### Application Fails to Start

**Error:** `TDLib library not found`

**Solution:**
```bash
# Rebuild artifacts
npm run ensure:artifacts

# Or set explicit path
export TDLIB_LIBRARY_PATH=$(pwd)/native/vendor/tdlib/lib/libtdjson.so
```

## Using Release Package

If you downloaded a release package (from GitHub Releases):

```bash
# Extract release
tar -xzf telegram-platform-backend-v*.tar.gz
cd telegram-platform-backend-v*

# Artifacts are already included!
# Just install and run:
npm install --production
npx prisma migrate deploy
pm2 start ecosystem.config.js
```

## Next Steps

- [Artifact Build Guide](docs/ARTIFACT_BUILD_GUIDE.md) - Detailed build instructions
- [Deployment Quick Start](docs/DEPLOYMENT_QUICK_START.md) - Deployment guide
- [TDLib Quick Start](README_TDLIB.md) - TDLib-specific guide
- [Production Deployment](docs/PRODUCTION_DEPLOYMENT.md) - Complete production guide

## Support

If you encounter issues:

1. Check [Troubleshooting](docs/DEPLOYMENT_QUICK_START.md#troubleshooting)
2. Verify build environment: `bash scripts/check-build-environment.sh`
3. Review logs for specific error messages

---

**Remember:** Always build artifacts before first run!
