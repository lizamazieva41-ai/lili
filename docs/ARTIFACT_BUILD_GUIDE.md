# Artifact Build Guide

## Overview

This guide explains how to build the required artifacts (`libtdjson.so` and `tdlib.node`) for production deployment.

## Required Artifacts

1. **libtdjson.so** - TDLib shared library (built from td-master)
2. **tdlib.node** - Native Node.js addon (built from native/tdlib/)

## Quick Start

### Automatic Build (Recommended)

```bash
# Build all artifacts automatically
bash scripts/ensure-artifacts.sh
```

This script will:
- Check if artifacts exist
- Build missing artifacts automatically
- Verify artifacts are valid

### Manual Build

#### 1. Build TDLib Library (libtdjson.so)

```bash
# From telegram-platform-backend directory
bash scripts/build-tdlib.sh
```

**Requirements:**
- Linux (Ubuntu 22.04+ recommended)
- CMake >= 3.0
- g++ or clang++ with C++17 support
- OpenSSL, zlib, readline dev packages

**Output:** `native/vendor/tdlib/lib/libtdjson.so`

#### 2. Build Native Addon (tdlib.node)

```bash
# From telegram-platform-backend directory
npm run build:tdlib-addon
```

**Requirements:**
- Node.js 18+
- node-gyp
- C++ compiler (g++ or clang++)

**Output:** `native/tdlib/build/Release/tdlib.node`

## Verification

After building, verify artifacts:

```bash
# Check libtdjson.so
ls -lh native/vendor/tdlib/lib/libtdjson.so

# Check native addon
ls -lh native/tdlib/build/Release/tdlib.node

# Or use verification script
bash scripts/ensure-tdlib-artifact.sh
```

## Docker Build (Alternative)

If you prefer Docker:

```bash
# Build TDLib in Docker
cd ../..  # From telegram-platform-backend
docker build -f telegram-platform-backend/Dockerfile.tdlib-build -t tdlib-builder .

# Extract library
docker create --name tdlib-extract tdlib-builder
docker cp tdlib-extract:/build/output/lib/libtdjson.so telegram-platform-backend/native/vendor/tdlib/lib/
docker rm tdlib-extract
```

## CI/CD Build

The GitHub Actions workflow (`.github/workflows/build-tdlib.yml`) automatically builds artifacts on:
- Push to main/develop branches
- Pull requests
- Manual workflow dispatch

Artifacts are uploaded to GitHub Actions and can be downloaded from the workflow run.

## Release Artifacts

When creating a release:

```bash
# Create release (automatically builds artifacts if missing)
npm run create:release
```

The release script will:
1. Run `ensure-artifacts.sh` to build missing artifacts
2. Verify all artifacts exist
3. Package artifacts in release archive
4. Generate checksums

## Troubleshooting

### libtdjson.so not found

**Error:** `TDLib library not found`

**Solutions:**
1. Build the library: `bash scripts/build-tdlib.sh`
2. Set `TDLIB_LIBRARY_PATH` environment variable
3. Check library is in expected location: `native/vendor/tdlib/lib/libtdjson.so`

### Native addon build fails

**Error:** `Failed to build native addon`

**Solutions:**
1. Install build dependencies: `sudo apt-get install build-essential python3`
2. Clean and rebuild: `cd native/tdlib && node-gyp clean && node-gyp rebuild`
3. Check Node.js version: `node --version` (should be 18+)

### Library path resolution

The native addon will try these paths in order:
1. `TDLIB_LIBRARY_PATH` environment variable
2. Relative path: `../../vendor/tdlib/lib/libtdjson.so`
3. Absolute paths: `/app/native/vendor/tdlib/lib/libtdjson.so`, `/usr/local/lib/libtdjson.so`, etc.

Set `TDLIB_LIBRARY_PATH` if using a custom location.

## Production Deployment

### Pre-Deployment Checklist

1. ✅ Build TDLib library
2. ✅ Build native addon
3. ✅ Verify artifacts exist
4. ✅ Set `TDLIB_LIBRARY_PATH` (if needed)
5. ✅ Run pre-deployment check: `npm run check:pre-deploy`

### Deployment Steps

1. **Build artifacts** (if not in release):
   ```bash
   bash scripts/ensure-artifacts.sh
   ```

2. **Create release package**:
   ```bash
   npm run create:release
   ```

3. **Deploy release**:
   - Extract release archive
   - Install dependencies: `npm install --production`
   - Run migrations: `npx prisma migrate deploy`
   - Set environment variables
   - Start application: `pm2 start ecosystem.config.js`

## Artifact Locations

### Development
- TDLib library: `native/vendor/tdlib/lib/libtdjson.so`
- Native addon: `native/tdlib/build/Release/tdlib.node`

### Production (after deployment)
- TDLib library: `/app/native/vendor/tdlib/lib/libtdjson.so` (or custom path)
- Native addon: `/app/native/tdlib/build/Release/tdlib.node`

## Environment Variables

- `TDLIB_LIBRARY_PATH` - Custom path to libtdjson.so (optional)
- `TDLIB_ADDON_PATH` - Custom path to tdlib.node (optional)
- `TDLIB_ENABLED` - Enable/disable TDLib (default: true)

## Notes

- Artifacts are **not** committed to git (see `.gitignore`)
- Artifacts must be built before first deployment
- CI/CD workflows build artifacts automatically
- Release packages include pre-built artifacts

---

**Last Updated**: 2026-01-27
