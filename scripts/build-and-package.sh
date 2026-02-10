#!/usr/bin/env bash
set -euo pipefail

##
## Build TDLib and native addon, then package for production
## Creates a clean production-ready package
##

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"
PACKAGE_DIR="${PROJECT_ROOT}/dist-package"
TIMESTAMP=$(date +%Y%m%d-%H%M%S)

echo "=== Build and Package Script ==="
echo "Project root: ${PROJECT_ROOT}"
echo "Package dir: ${PACKAGE_DIR}"
echo ""

# Step 1: Check build environment
echo "Step 1: Checking build environment..."
bash "${SCRIPT_DIR}/check-build-environment.sh" || {
  echo "❌ Build environment check failed"
  exit 1
}

# Step 2: Build TDLib library
echo ""
echo "Step 2: Building TDLib library..."
if bash "${SCRIPT_DIR}/build-tdlib.sh"; then
  echo "✅ TDLib library built successfully"
else
  echo "⚠️  WARNING: TDLib build failed or skipped"
  echo "   Continuing with package creation..."
fi

# Step 3: Build native addon
echo ""
echo "Step 3: Building native addon..."
cd "${PROJECT_ROOT}"
if npm run build:tdlib-addon; then
  echo "✅ Native addon built successfully"
else
  echo "⚠️  WARNING: Native addon build failed"
  echo "   Continuing with package creation..."
fi

# Step 4: Build TypeScript
echo ""
echo "Step 4: Building TypeScript..."
if npm run build; then
  echo "✅ TypeScript build successful"
else
  echo "❌ TypeScript build failed"
  exit 1
fi

# Step 5: Run production cleanup
echo ""
echo "Step 5: Running production cleanup..."
bash "${SCRIPT_DIR}/cleanup-production.sh"

# Step 6: Create package directory
echo ""
echo "Step 6: Creating package..."
rm -rf "${PACKAGE_DIR}"
mkdir -p "${PACKAGE_DIR}"

# Copy essential files
echo "  Copying files..."

# Source code (built)
cp -r "${PROJECT_ROOT}/dist" "${PACKAGE_DIR}/" 2>/dev/null || true

# Native addon
mkdir -p "${PACKAGE_DIR}/native/tdlib"
cp -r "${PROJECT_ROOT}/native/tdlib/build" "${PACKAGE_DIR}/native/tdlib/" 2>/dev/null || true
cp "${PROJECT_ROOT}/native/tdlib/binding.gyp" "${PACKAGE_DIR}/native/tdlib/" 2>/dev/null || true

# TDLib library
mkdir -p "${PACKAGE_DIR}/vendor/tdlib/lib"
if [ -f "${PROJECT_ROOT}/vendor/tdlib/lib/libtdjson.so" ]; then
  cp "${PROJECT_ROOT}/vendor/tdlib/lib/libtdjson.so" "${PACKAGE_DIR}/vendor/tdlib/lib/"
  echo "  ✅ Copied libtdjson.so"
else
  echo "  ⚠️  WARNING: libtdjson.so not found at vendor/tdlib/lib/libtdjson.so"
fi

# Configuration files
cp "${PROJECT_ROOT}/package.json" "${PACKAGE_DIR}/"
cp "${PROJECT_ROOT}/package-lock.json" "${PACKAGE_DIR}/" 2>/dev/null || true
cp "${PROJECT_ROOT}/tsconfig.json" "${PACKAGE_DIR}/"
cp "${PROJECT_ROOT}/nest-cli.json" "${PACKAGE_DIR}/" 2>/dev/null || true

# Prisma
cp -r "${PROJECT_ROOT}/prisma" "${PACKAGE_DIR}/" 2>/dev/null || true

# Scripts (production only)
mkdir -p "${PACKAGE_DIR}/scripts"
cp "${PROJECT_ROOT}/scripts/deploy.sh" "${PACKAGE_DIR}/scripts/" 2>/dev/null || true
cp "${PROJECT_ROOT}/scripts/health-check.sh" "${PACKAGE_DIR}/scripts/" 2>/dev/null || true
cp "${PROJECT_ROOT}/scripts/rollback.sh" "${PACKAGE_DIR}/scripts/" 2>/dev/null || true
cp "${PROJECT_ROOT}/scripts/migrate.sh" "${PACKAGE_DIR}/scripts/" 2>/dev/null || true

# Documentation
mkdir -p "${PACKAGE_DIR}/docs"
cp "${PROJECT_ROOT}/docs/PRODUCTION_DEPLOYMENT.md" "${PACKAGE_DIR}/docs/" 2>/dev/null || true
cp "${PROJECT_ROOT}/docs/SECURITY.md" "${PACKAGE_DIR}/docs/" 2>/dev/null || true
cp "${PROJECT_ROOT}/docs/MIGRATION_GUIDE.md" "${PACKAGE_DIR}/docs/" 2>/dev/null || true
cp "${PROJECT_ROOT}/README.md" "${PACKAGE_DIR}/" 2>/dev/null || true
cp "${PROJECT_ROOT}/README_TDLIB.md" "${PACKAGE_DIR}/" 2>/dev/null || true

# Monitoring
cp -r "${PROJECT_ROOT}/monitoring" "${PACKAGE_DIR}/" 2>/dev/null || true

# Docker (optional - include if needed)
if [ "${INCLUDE_DOCKER:-false}" = "true" ]; then
  cp "${PROJECT_ROOT}/Dockerfile" "${PACKAGE_DIR}/" 2>/dev/null || true
  cp "${PROJECT_ROOT}/docker-compose.build.yml" "${PACKAGE_DIR}/" 2>/dev/null || true
fi

# Create package info
cat > "${PACKAGE_DIR}/PACKAGE_INFO.txt" << EOF
Package created: ${TIMESTAMP}
Project: telegram-platform-backend
Version: $(node -p "require('${PROJECT_ROOT}/package.json').version" 2>/dev/null || echo "unknown")

Contents:
- Built application (dist/)
- Native addon (native/tdlib/build/)
- TDLib library (vendor/tdlib/lib/libtdjson.so)
- Configuration files
- Production scripts
- Documentation

Next steps:
1. Install dependencies: npm install --production
2. Run migrations: npx prisma migrate deploy
3. Set environment variables (see docs/PRODUCTION_DEPLOYMENT.md)
4. Start application: npm run start:prod
EOF

# Step 7: Create archive (optional)
if [ "${CREATE_ARCHIVE:-false}" = "true" ]; then
  echo ""
  echo "Step 7: Creating archive..."
  ARCHIVE_NAME="telegram-platform-backend-${TIMESTAMP}.tar.gz"
  cd "${PROJECT_ROOT}"
  tar -czf "${ARCHIVE_NAME}" -C "${PACKAGE_DIR}" .
  echo "✅ Archive created: ${ARCHIVE_NAME}"
  echo "   Size: $(du -h "${ARCHIVE_NAME}" | cut -f1)"
fi

# Summary
echo ""
echo "=== Package Summary ==="
echo "Package directory: ${PACKAGE_DIR}"
echo ""

# Verify package contents
echo "Package contents:"
find "${PACKAGE_DIR}" -type f | head -20
echo ""

# Check for required files
REQUIRED_FILES=(
  "dist/main.js"
  "package.json"
  "prisma/schema.prisma"
)

MISSING=0
for file in "${REQUIRED_FILES[@]}"; do
  if [ -f "${PACKAGE_DIR}/${file}" ]; then
    echo "✅ ${file}"
  else
    echo "❌ ${file} - MISSING"
    ((MISSING++))
  fi
done

if [ ${MISSING} -eq 0 ]; then
  echo ""
  echo "✅ Package created successfully"
  echo ""
  echo "To create archive:"
  echo "  CREATE_ARCHIVE=true bash scripts/build-and-package.sh"
  echo ""
  echo "To include Docker files:"
  echo "  INCLUDE_DOCKER=true bash scripts/build-and-package.sh"
else
  echo ""
  echo "⚠️  Package created with ${MISSING} missing required file(s)"
fi
