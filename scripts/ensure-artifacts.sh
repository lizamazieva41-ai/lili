#!/usr/bin/env bash
set -euo pipefail

##
## Ensure all required artifacts exist before deployment
## This script checks and builds missing artifacts automatically
##

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"

echo "=== Ensuring Required Artifacts ==="
echo ""

ERRORS=0
BUILT=0

# Check and build libtdjson.so
echo "1. Checking libtdjson.so..."
LIB_PATH="${PROJECT_ROOT}/vendor/tdlib/lib/libtdjson.so"

if [ ! -f "${LIB_PATH}" ]; then
  echo "   ⚠️  libtdjson.so not found at ${LIB_PATH}"
  echo "   Attempting to build..."
  
  if bash "${SCRIPT_DIR}/build-tdlib.sh"; then
    echo "   ✅ libtdjson.so built successfully"
    ((BUILT++))
  else
    echo "   ❌ Failed to build libtdjson.so"
    echo "   Please run manually: bash scripts/build-tdlib.sh"
    ((ERRORS++))
  fi
else
  echo "   ✅ libtdjson.so found"
fi

# Check and build native addon
echo ""
echo "2. Checking native addon..."
ADDON_PATH="${PROJECT_ROOT}/native/tdlib/build/Release/tdlib.node"

if [ ! -f "${ADDON_PATH}" ]; then
  echo "   ⚠️  tdlib.node not found at ${ADDON_PATH}"
  echo "   Attempting to build..."
  
  cd "${PROJECT_ROOT}"
  if npm run build:tdlib-addon; then
    echo "   ✅ Native addon built successfully"
    ((BUILT++))
  else
    echo "   ❌ Failed to build native addon"
    echo "   Please run manually: npm run build:tdlib-addon"
    ((ERRORS++))
  fi
else
  echo "   ✅ Native addon found"
fi

# Verify artifacts
echo ""
echo "3. Verifying artifacts..."

if [ ! -f "${LIB_PATH}" ]; then
  echo "   ❌ libtdjson.so still missing"
  ((ERRORS++))
else
  LIB_SIZE=$(stat -f%z "${LIB_PATH}" 2>/dev/null || stat -c%s "${LIB_PATH}" 2>/dev/null || echo "0")
  if [ "${LIB_SIZE}" -eq 0 ]; then
    echo "   ❌ libtdjson.so is empty"
    ((ERRORS++))
  else
    echo "   ✅ libtdjson.so verified (${LIB_SIZE} bytes)"
  fi
fi

if [ ! -f "${ADDON_PATH}" ]; then
  echo "   ❌ tdlib.node still missing"
  ((ERRORS++))
else
  ADDON_SIZE=$(stat -f%z "${ADDON_PATH}" 2>/dev/null || stat -c%s "${ADDON_PATH}" 2>/dev/null || echo "0")
  if [ "${ADDON_SIZE}" -eq 0 ]; then
    echo "   ❌ tdlib.node is empty"
    ((ERRORS++))
  else
    echo "   ✅ tdlib.node verified (${ADDON_SIZE} bytes)"
  fi
fi

# Summary
echo ""
echo "=== Summary ==="
echo "Artifacts built: ${BUILT}"
echo "Errors: ${ERRORS}"
echo ""

if [ ${ERRORS} -gt 0 ]; then
  echo "❌ Some artifacts are missing or invalid"
  echo ""
  echo "To build manually:"
  echo "  1. Build TDLib: bash scripts/build-tdlib.sh"
  echo "  2. Build addon: npm run build:tdlib-addon"
  exit 1
else
  echo "✅ All required artifacts are present"
  echo ""
  echo "Artifacts location:"
  echo "  - libtdjson.so: ${LIB_PATH}"
  echo "  - tdlib.node: ${ADDON_PATH}"
fi
