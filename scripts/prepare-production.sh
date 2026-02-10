#!/usr/bin/env bash
set -euo pipefail

##
## Prepare repository for production deployment
## Runs cleanup, validates structure, and creates production archive
##

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"

echo "=== Production Preparation Script ==="
echo ""

# Step 1: Run cleanup
echo "Step 1: Running production cleanup..."
bash "${SCRIPT_DIR}/cleanup-production.sh"

# Step 2: Validate structure
echo ""
echo "Step 2: Validating production structure..."

ERRORS=0

# Check for required files
REQUIRED_FILES=(
  "package.json"
  "tsconfig.json"
  "prisma/schema.prisma"
  "src/main.ts"
)

for file in "${REQUIRED_FILES[@]}"; do
  if [ ! -f "${ROOT_DIR}/${file}" ]; then
    echo "❌ ERROR: Required file missing: ${file}"
    ((ERRORS++))
  else
    echo "✅ Found: ${file}"
  fi
done

# Check for sensitive files that shouldn't be in production
SENSITIVE_PATTERNS=(
  ".env"
  ".env.local"
  ".env.production"
  "*.pem"
  "*.key"
  "secrets/"
)

for pattern in "${SENSITIVE_PATTERNS[@]}"; do
  if find "${ROOT_DIR}" -name "${pattern}" -type f -not -path "./node_modules/*" -not -path "./.git/*" | grep -q .; then
    echo "⚠️  WARNING: Found sensitive file matching ${pattern}"
  fi
done

# Step 3: Check build artifacts
echo ""
echo "Step 3: Checking build artifacts..."

if [ ! -d "${ROOT_DIR}/vendor/tdlib/lib" ]; then
  echo "⚠️  WARNING: TDLib library directory not found"
  echo "   Run build-tdlib.sh to build libtdjson.so"
else
  if [ ! -f "${ROOT_DIR}/vendor/tdlib/lib/libtdjson.so" ]; then
    echo "⚠️  WARNING: libtdjson.so not found"
    echo "   Run build-tdlib.sh to build the library"
  else
    echo "✅ Found: libtdjson.so"
  fi
fi

# Step 4: Generate production checklist
echo ""
echo "Step 4: Generating production checklist..."
cat > "${ROOT_DIR}/PRODUCTION_CHECKLIST.md" << 'EOF'
# Production Deployment Checklist

## Pre-Deployment

- [ ] All environment variables configured in production environment
- [ ] Encryption key (ENCRYPTION_KEY) set and secure
- [ ] Database migrations applied
- [ ] TDLib library (libtdjson.so) built and available
- [ ] Native addon (tdlib.node) built
- [ ] All tests passing
- [ ] Security audit completed

## Deployment

- [ ] Docker image built successfully
- [ ] Health checks configured
- [ ] Monitoring and alerts configured
- [ ] Backup strategy in place
- [ ] Rollback plan ready

## Post-Deployment

- [ ] Health endpoint responding
- [ ] Metrics endpoint accessible
- [ ] Logs being collected
- [ ] Alerts configured and tested
- [ ] Performance monitoring active

## Security

- [ ] Session encryption enabled (TDLIB_SESSION_ENCRYPTION_ENABLED=true)
- [ ] Proxy passwords encrypted
- [ ] API keys rotated
- [ ] SSL/TLS configured
- [ ] Firewall rules configured
EOF

echo "✅ Created PRODUCTION_CHECKLIST.md"

# Summary
echo ""
echo "=== Preparation Summary ==="
if [ ${ERRORS} -eq 0 ]; then
  echo "✅ Production preparation completed successfully"
  echo ""
  echo "Next steps:"
  echo "1. Review PRODUCTION_CHECKLIST.md"
  echo "2. Set environment variables"
  echo "3. Build Docker image"
  echo "4. Deploy to production"
else
  echo "❌ Production preparation completed with ${ERRORS} error(s)"
  exit 1
fi
