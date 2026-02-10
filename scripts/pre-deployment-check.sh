#!/usr/bin/env bash
set -euo pipefail

##
## Pre-deployment checklist
## Verifies all requirements are met before production deployment
##

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"

echo "=== Pre-Deployment Checklist ==="
echo ""

ERRORS=0
WARNINGS=0

# 1. Ensure and check TDLib artifacts
echo "1. Ensuring TDLib artifacts..."
if bash "${SCRIPT_DIR}/ensure-artifacts.sh" 2>/dev/null; then
  echo "   ✅ TDLib artifacts verified"
else
  echo "   ❌ TDLib artifacts missing or invalid"
  echo "   Run: npm run ensure:artifacts"
  ((ERRORS++))
fi

# 2. Check build environment
echo ""
echo "2. Checking build environment..."
if bash "${SCRIPT_DIR}/check-build-environment.sh" 2>/dev/null; then
  echo "   ✅ Build environment OK"
else
  echo "   ⚠️  Build environment has warnings"
  ((WARNINGS++))
fi

# 3. Check encryption key
echo ""
echo "3. Checking encryption key..."
if [[ -z "${ENCRYPTION_KEY:-}" ]]; then
  echo "   ❌ ENCRYPTION_KEY not set"
  echo "      Generate with: openssl rand -hex 32"
  ((ERRORS++))
else
  KEY_LEN=${#ENCRYPTION_KEY}
  if [[ "${KEY_LEN}" -lt 64 ]]; then
    echo "   ⚠️  ENCRYPTION_KEY seems too short (${KEY_LEN} chars, need 64)"
    ((WARNINGS++))
  else
    echo "   ✅ ENCRYPTION_KEY set (${KEY_LEN} chars)"
  fi
fi

# 4. Check environment variables
echo ""
echo "4. Checking required environment variables..."
REQUIRED_VARS=(
  "DATABASE_URL"
  "REDIS_URL"
  "JWT_SECRET"
)

for var in "${REQUIRED_VARS[@]}"; do
  if [[ -z "${!var:-}" ]]; then
    echo "   ❌ ${var} not set"
    ((ERRORS++))
  else
    echo "   ✅ ${var} set"
  fi
done

# 5. Check for dev files
echo ""
echo "5. Checking for development files..."
DEV_FILES=(
  ".env"
  "coverage/"
  "logs/"
  "*.log"
)

FOUND_DEV=0
for pattern in "${DEV_FILES[@]}"; do
  if find "${PROJECT_ROOT}" -name "${pattern}" -not -path "*/node_modules/*" -not -path "*/.git/*" 2>/dev/null | grep -q .; then
    echo "   ⚠️  Found development files matching: ${pattern}"
    ((FOUND_DEV++))
  fi
done

if [[ ${FOUND_DEV} -eq 0 ]]; then
  echo "   ✅ No development files found"
else
  echo "   ⚠️  Found ${FOUND_DEV} development file pattern(s)"
  echo "      Run: npm run cleanup:production"
  ((WARNINGS++))
fi

# 6. Check Docker files (if not including Docker)
echo ""
echo "6. Checking Docker files..."
if [[ "${INCLUDE_DOCKER:-false}" != "true" ]]; then
  DOCKER_FILES=(
    "Dockerfile"
    "docker-compose.yml"
  )
  
  FOUND_DOCKER=0
  for pattern in "${DOCKER_FILES[@]}"; do
    if find "${PROJECT_ROOT}" -name "${pattern}" -not -path "*/node_modules/*" -not -path "*/.git/*" 2>/dev/null | grep -q .; then
      echo "   ⚠️  Found Docker file: ${pattern}"
      ((FOUND_DOCKER++))
    fi
  done
  
  if [[ ${FOUND_DOCKER} -eq 0 ]]; then
    echo "   ✅ No Docker files found (or INCLUDE_DOCKER=true)"
  else
    echo "   ⚠️  Found ${FOUND_DOCKER} Docker file(s)"
    echo "      Set INCLUDE_DOCKER=true to keep, or run cleanup"
    ((WARNINGS++))
  fi
else
  echo "   ℹ️  INCLUDE_DOCKER=true, skipping Docker file check"
fi

# 7. Check TypeScript build
echo ""
echo "7. Checking TypeScript build..."
if [[ -d "${PROJECT_ROOT}/dist" ]] && [[ -f "${PROJECT_ROOT}/dist/main.js" ]]; then
  echo "   ✅ TypeScript build found"
else
  echo "   ⚠️  TypeScript build not found"
  echo "      Run: npm run build"
  ((WARNINGS++))
fi

# 8. Check native addon
echo ""
echo "8. Checking native addon..."
ADDON_PATH="${PROJECT_ROOT}/native/tdlib/build/Release/tdlib.node"
if [[ -f "${ADDON_PATH}" ]]; then
  echo "   ✅ Native addon found"
else
  echo "   ⚠️  Native addon not found"
  echo "      Run: npm run build:tdlib-addon"
  ((WARNINGS++))
fi

# Summary
echo ""
echo "=== Summary ==="
echo "Errors: ${ERRORS}"
echo "Warnings: ${WARNINGS}"
echo ""

if [[ ${ERRORS} -gt 0 ]]; then
  echo "❌ Pre-deployment check FAILED"
  echo "   Fix errors before deploying"
  exit 1
elif [[ ${WARNINGS} -gt 0 ]]; then
  echo "⚠️  Pre-deployment check passed with warnings"
  echo "   Review warnings before deploying"
  exit 0
else
  echo "✅ Pre-deployment check PASSED"
  echo "   Ready for deployment"
  exit 0
fi
