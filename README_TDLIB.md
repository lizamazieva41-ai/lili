# TDLib Integration - Quick Start Guide

## Overview

This guide provides a quick start for the TDLib integration in `telegram-platform-backend`.

## Prerequisites

- Node.js 18+
- PostgreSQL 15+
- Redis 7+
- Linux environment (for TDLib build)
- CMake 3.0+, g++/clang++ with C++17 support

## Quick Setup

### ⚠️ IMPORTANT: Build Artifacts First

**Before running the application, you MUST build the required artifacts:**

```bash
# Automatic build (recommended)
npm run ensure:artifacts

# This will:
# 1. Build libtdjson.so (TDLib library)
# 2. Build tdlib.node (native addon)
# 3. Verify both artifacts exist and are valid
```

### Manual Build (if automatic fails)

#### 1. Check Build Environment

```bash
bash scripts/check-build-environment.sh
```

#### 2. Build TDLib Library

```bash
# Option A: Using build script (recommended for development)
bash scripts/build-tdlib.sh

# Option B: Using Docker
cd ../..  # From telegram-platform-backend directory
docker build -f telegram-platform-backend/Dockerfile.tdlib-build -t tdlib-builder .
docker create --name tdlib-extract tdlib-builder
docker cp tdlib-extract:/build/output/lib/libtdjson.so telegram-platform-backend/native/vendor/tdlib/lib/
docker rm tdlib-extract
```

#### 3. Build Native Addon

```bash
npm run build:tdlib-addon
```

### Verify Artifacts

```bash
# Check artifacts exist
ls -lh native/vendor/tdlib/lib/libtdjson.so
ls -lh native/tdlib/build/Release/tdlib.node

# Or use verification script
bash scripts/ensure-tdlib-artifact.sh
```

### 4. Configure Environment

```bash
# Copy example env file
cp .env.example .env

# Generate encryption key
openssl rand -hex 32

# Add to .env:
ENCRYPTION_KEY=<generated-key>
TDLIB_SESSION_ENCRYPTION_ENABLED=true
TDLIB_SESSION_TTL_SECONDS=604800
TDLIB_SESSION_DB_BACKUP=true
```

### 5. Run Database Migrations

```bash
npx prisma migrate deploy
npx prisma generate
```

### 6. Start Application

```bash
# Development
npm run start:dev

# Production
npm run build
npm run start:prod
```

## Verification

### Health Checks

```bash
# Basic health
curl http://localhost:3000/health

# TDLib health
curl http://localhost:3000/tdlib/health
```

### Test Authentication

```bash
# Request code (requires authentication token)
curl -X POST http://localhost:3000/tdlib/auth/request-code \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"phoneNumber": "+1234567890"}'
```

## Architecture

```
┌─────────────────┐
│  REST API       │
└────────┬────────┘
         │
┌────────▼────────┐
│  Services       │ (Accounts, Messages, Campaigns)
└────────┬────────┘
         │
┌────────▼────────┐
│  Queue Layer    │ (BullMQ)
└────────┬────────┘
         │
┌────────▼────────┐
│  Processors     │ (TelegramProcessor, MessageProcessor)
└────────┬────────┘
         │
┌────────▼────────┐
│  TDLib Module   │ (TdlibService, TdlibAuthService)
└────────┬────────┘
         │
┌────────▼────────┐
│  Native Addon  │ (tdlib.node)
└────────┬────────┘
         │
┌────────▼────────┐
│  TDLib Library  │ (libtdjson.so)
└────────┬────────┘
         │
┌────────▼────────┐
│  Telegram API   │
└─────────────────┘
```

## Key Features

- ✅ Complete authentication flow (phone code, 2FA)
- ✅ Session management with encryption
- ✅ Message sending with status tracking
- ✅ Campaign execution with rate limiting
- ✅ Proxy integration and rotation
- ✅ Update handling and dispatching
- ✅ Comprehensive monitoring and metrics

## Documentation

- [Security Guide](docs/SECURITY.md)
- [Production Deployment](docs/PRODUCTION_DEPLOYMENT.md)
- [Migration Guide](docs/MIGRATION_GUIDE.md)
- [Implementation Status](docs/IMPLEMENTATION_STATUS.md)
- [Rollout Plan](docs/TDLIB_ROLLOUT_PLAN.md)

## Troubleshooting

### libtdjson.so not found

```bash
# Check if library exists
ls -la native/vendor/tdlib/lib/libtdjson.so

# If missing, build it
bash scripts/build-tdlib.sh
```

### Native addon build fails

```bash
# Install build dependencies
sudo apt-get install build-essential python3

# Clean and rebuild
cd native/tdlib
node-gyp clean
node-gyp rebuild
```

### Session decryption errors

```bash
# Verify encryption key
echo $ENCRYPTION_KEY | wc -c  # Should be 65 (64 hex + newline)

# Check if encryption is enabled
echo $TDLIB_SESSION_ENCRYPTION_ENABLED  # Should be "true"
```

## Support

For detailed information, see:
- [Implementation Status](docs/IMPLEMENTATION_STATUS.md)
- [Security Guide](docs/SECURITY.md)
- [Production Deployment Guide](docs/PRODUCTION_DEPLOYMENT.md)
