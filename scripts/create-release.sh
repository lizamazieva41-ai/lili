#!/usr/bin/env bash
set -euo pipefail

##
## Create production release package
## Guarantees clean artifacts with verification and checksums
##

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"
RELEASE_DIR="${PROJECT_ROOT}/release"
TIMESTAMP=$(date +%Y%m%d-%H%M%S)
VERSION=$(node -p "require('${PROJECT_ROOT}/package.json').version" 2>/dev/null || echo "unknown")
RELEASE_NAME="telegram-platform-backend-${VERSION}-${TIMESTAMP}"

echo "=== Production Release Creation ==="
echo "Version: ${VERSION}"
echo "Timestamp: ${TIMESTAMP}"
echo "Release name: ${RELEASE_NAME}"
echo ""

# Step 1: Pre-deployment check
echo "Step 1: Running pre-deployment checks..."
if ! bash "${SCRIPT_DIR}/pre-deployment-check.sh"; then
  echo "❌ Pre-deployment check failed"
  echo "   Fix issues before creating release"
  exit 1
fi

# Step 2: Cleanup production files
echo ""
echo "Step 2: Cleaning up production files..."
INCLUDE_DOCKER="${INCLUDE_DOCKER:-false}"
bash "${SCRIPT_DIR}/cleanup-production.sh"

# Step 3: Build TypeScript
echo ""
echo "Step 3: Building TypeScript..."
cd "${PROJECT_ROOT}"
if ! npm run build; then
  echo "❌ TypeScript build failed"
  exit 1
fi

# Step 4: Ensure artifacts exist (build if missing)
echo ""
echo "Step 4: Ensuring artifacts exist..."
if ! bash "${SCRIPT_DIR}/ensure-artifacts.sh"; then
  echo "❌ Failed to ensure artifacts"
  exit 1
fi

# Verify artifacts after build attempt
LIB_PATH="${PROJECT_ROOT}/vendor/tdlib/lib/libtdjson.so"
ADDON_PATH="${PROJECT_ROOT}/native/tdlib/build/Release/tdlib.node"

if [ ! -f "${LIB_PATH}" ]; then
  echo "❌ ERROR: libtdjson.so not found at ${LIB_PATH}"
  echo "   Run: bash scripts/build-tdlib.sh"
  exit 1
fi

if [ ! -f "${ADDON_PATH}" ]; then
  echo "❌ ERROR: tdlib.node not found at ${ADDON_PATH}"
  echo "   Run: npm run build:tdlib-addon"
  exit 1
fi

echo "  ✅ All artifacts verified"

# Check dist
if [ ! -d "${PROJECT_ROOT}/dist" ] || [ ! -f "${PROJECT_ROOT}/dist/main.js" ]; then
  echo "❌ ERROR: TypeScript build output not found"
  exit 1
fi
echo "  ✅ TypeScript build found"

# Step 5: Create release directory
echo ""
echo "Step 5: Creating release package..."
rm -rf "${RELEASE_DIR}"
mkdir -p "${RELEASE_DIR}/${RELEASE_NAME}"

# Copy essential files
echo "  Copying files..."

# Built application
cp -r "${PROJECT_ROOT}/dist" "${RELEASE_DIR}/${RELEASE_NAME}/"

# Native addon
mkdir -p "${RELEASE_DIR}/${RELEASE_NAME}/native/tdlib"
cp -r "${PROJECT_ROOT}/native/tdlib/build" "${RELEASE_DIR}/${RELEASE_NAME}/native/tdlib/" 2>/dev/null || true
cp "${PROJECT_ROOT}/native/tdlib/binding.gyp" "${RELEASE_DIR}/${RELEASE_NAME}/native/tdlib/" 2>/dev/null || true

# TDLib library
mkdir -p "${RELEASE_DIR}/${RELEASE_NAME}/vendor/tdlib/lib"
cp "${LIB_PATH}" "${RELEASE_DIR}/${RELEASE_NAME}/vendor/tdlib/lib/"
echo "  ✅ Copied libtdjson.so"

# Configuration files
cp "${PROJECT_ROOT}/package.json" "${RELEASE_DIR}/${RELEASE_NAME}/"
cp "${PROJECT_ROOT}/package-lock.json" "${RELEASE_DIR}/${RELEASE_NAME}/" 2>/dev/null || true
cp "${PROJECT_ROOT}/tsconfig.json" "${RELEASE_DIR}/${RELEASE_NAME}/"
cp "${PROJECT_ROOT}/nest-cli.json" "${RELEASE_DIR}/${RELEASE_NAME}/" 2>/dev/null || true

# Prisma
cp -r "${PROJECT_ROOT}/prisma" "${RELEASE_DIR}/${RELEASE_NAME}/" 2>/dev/null || true

# Production scripts only
mkdir -p "${RELEASE_DIR}/${RELEASE_NAME}/scripts"
for script in deploy.sh health-check.sh rollback.sh migrate.sh; do
  if [ -f "${PROJECT_ROOT}/scripts/${script}" ]; then
    cp "${PROJECT_ROOT}/scripts/${script}" "${RELEASE_DIR}/${RELEASE_NAME}/scripts/"
  fi
done

# Documentation (production only)
mkdir -p "${RELEASE_DIR}/${RELEASE_NAME}/docs"
for doc in PRODUCTION_DEPLOYMENT.md SECURITY.md MIGRATION_GUIDE.md README.md README_TDLIB.md; do
  if [ -f "${PROJECT_ROOT}/docs/${doc}" ] || [ -f "${PROJECT_ROOT}/${doc}" ]; then
    cp "${PROJECT_ROOT}/docs/${doc}" "${RELEASE_DIR}/${RELEASE_NAME}/docs/" 2>/dev/null || \
    cp "${PROJECT_ROOT}/${doc}" "${RELEASE_DIR}/${RELEASE_NAME}/docs/" 2>/dev/null || true
  fi
done

# Monitoring
if [ -d "${PROJECT_ROOT}/monitoring" ]; then
  cp -r "${PROJECT_ROOT}/monitoring" "${RELEASE_DIR}/${RELEASE_NAME}/"
fi

# Step 6: Create release manifest
echo ""
echo "Step 6: Creating release manifest..."
cat > "${RELEASE_DIR}/${RELEASE_NAME}/RELEASE_MANIFEST.txt" << EOF
Release Information
===================
Version: ${VERSION}
Timestamp: ${TIMESTAMP}
Release Name: ${RELEASE_NAME}
Created: $(date -u +"%Y-%m-%d %H:%M:%S UTC")

Artifacts
=========
- Application: dist/
- Native Addon: native/tdlib/build/Release/tdlib.node
- TDLib Library: vendor/tdlib/lib/libtdjson.so
- Prisma Schema: prisma/
- Documentation: docs/
- Scripts: scripts/

Verification
============
Run the following to verify the release:
1. Check libtdjson.so: ls -la vendor/tdlib/lib/libtdjson.so
2. Check native addon: ls -la native/tdlib/build/Release/tdlib.node
3. Check application: ls -la dist/main.js

Installation
============
1. Extract release archive
2. Install dependencies: npm install --production
3. Run migrations: npx prisma migrate deploy
4. Set environment variables (see docs/PRODUCTION_DEPLOYMENT.md)
5. Start application: pm2 start ecosystem.config.js

Environment Variables Required
==============================
- DATABASE_URL
- REDIS_URL
- JWT_SECRET
- ENCRYPTION_KEY (64-character hex string)
- TDLIB_SESSION_ENCRYPTION_ENABLED=true

EOF

# Step 7: Generate checksums
echo ""
echo "Step 7: Generating checksums..."
cd "${RELEASE_DIR}/${RELEASE_NAME}"
find . -type f -not -path "./node_modules/*" -not -path "./.git/*" | sort | while read -r file; do
  if command -v sha256sum &> /dev/null; then
    sha256sum "${file}" >> CHECKSUMS.txt
  elif command -v shasum &> /dev/null; then
    shasum -a 256 "${file}" >> CHECKSUMS.txt
  fi
done

if [ -f "CHECKSUMS.txt" ]; then
  echo "  ✅ Checksums generated"
else
  echo "  ⚠️  WARNING: Could not generate checksums (sha256sum/shasum not found)"
fi

# Step 8: Create archive
echo ""
echo "Step 8: Creating release archive..."
cd "${RELEASE_DIR}"

# Create tarball
if command -v tar &> /dev/null; then
  tar -czf "${RELEASE_NAME}.tar.gz" "${RELEASE_NAME}/"
  TAR_SIZE=$(du -h "${RELEASE_NAME}.tar.gz" | cut -f1)
  echo "  ✅ Created: ${RELEASE_NAME}.tar.gz (${TAR_SIZE})"
  
  # Generate checksum for archive
  if command -v sha256sum &> /dev/null; then
    sha256sum "${RELEASE_NAME}.tar.gz" > "${RELEASE_NAME}.tar.gz.sha256"
  elif command -v shasum &> /dev/null; then
    shasum -a 256 "${RELEASE_NAME}.tar.gz" > "${RELEASE_NAME}.tar.gz.sha256"
  fi
fi

# Create zip (if available)
if command -v zip &> /dev/null; then
  zip -r "${RELEASE_NAME}.zip" "${RELEASE_NAME}/" > /dev/null
  ZIP_SIZE=$(du -h "${RELEASE_NAME}.zip" | cut -f1)
  echo "  ✅ Created: ${RELEASE_NAME}.zip (${ZIP_SIZE})"
  
  # Generate checksum for archive
  if command -v sha256sum &> /dev/null; then
    sha256sum "${RELEASE_NAME}.zip" > "${RELEASE_NAME}.zip.sha256"
  elif command -v shasum &> /dev/null; then
    shasum -a 256 "${RELEASE_NAME}.zip" > "${RELEASE_NAME}.zip.sha256"
  fi
fi

# Step 9: Final verification
echo ""
echo "Step 9: Final verification..."

VERIFY_ERRORS=0

# Verify archive exists
if [ -f "${RELEASE_DIR}/${RELEASE_NAME}.tar.gz" ] || [ -f "${RELEASE_DIR}/${RELEASE_NAME}.zip" ]; then
  echo "  ✅ Release archive created"
else
  echo "  ❌ ERROR: Release archive not created"
  ((VERIFY_ERRORS++))
fi

# Verify checksums exist
if [ -f "${RELEASE_DIR}/${RELEASE_NAME}/CHECKSUMS.txt" ]; then
  echo "  ✅ Checksums file created"
else
  echo "  ⚠️  WARNING: Checksums file not created"
fi

# Verify no dev files
DEV_FILES_FOUND=0
for pattern in ".env" "coverage" "logs" "*.log"; do
  if find "${RELEASE_DIR}/${RELEASE_NAME}" -name "${pattern}" -not -path "*/node_modules/*" 2>/dev/null | grep -q .; then
    ((DEV_FILES_FOUND++))
  fi
done

if [ ${DEV_FILES_FOUND} -eq 0 ]; then
  echo "  ✅ No development files found"
else
  echo "  ⚠️  WARNING: Found ${DEV_FILES_FOUND} development file pattern(s)"
fi

# Summary
echo ""
echo "=== Release Summary ==="
echo "Release directory: ${RELEASE_DIR}/${RELEASE_NAME}"
if [ -f "${RELEASE_DIR}/${RELEASE_NAME}.tar.gz" ]; then
  echo "Tarball: ${RELEASE_DIR}/${RELEASE_NAME}.tar.gz"
fi
if [ -f "${RELEASE_DIR}/${RELEASE_NAME}.zip" ]; then
  echo "ZIP: ${RELEASE_DIR}/${RELEASE_NAME}.zip"
fi
echo ""

if [ ${VERIFY_ERRORS} -gt 0 ]; then
  echo "❌ Release creation completed with errors"
  exit 1
else
  echo "✅ Release created successfully"
  echo ""
  echo "Next steps:"
  echo "  1. Review release contents: ls -la ${RELEASE_DIR}/${RELEASE_NAME}"
  echo "  2. Test extraction and installation"
  echo "  3. Upload to release repository or distribution system"
fi
