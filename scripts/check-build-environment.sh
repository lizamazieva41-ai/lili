#!/usr/bin/env bash
set -euo pipefail

##
## Check build environment for TDLib and native addon
## Validates all dependencies and paths
##

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"

echo "=== Build Environment Check ==="
echo ""

ERRORS=0
WARNINGS=0

# Check Node.js version
echo "Checking Node.js..."
if command -v node &> /dev/null; then
  NODE_VERSION=$(node --version)
  echo "  ✅ Node.js: ${NODE_VERSION}"
  
  # Check version >= 18
  NODE_MAJOR=$(echo "${NODE_VERSION}" | cut -d. -f1 | sed 's/v//')
  if [ "${NODE_MAJOR}" -lt 18 ]; then
    echo "  ⚠️  WARNING: Node.js 18+ recommended"
    ((WARNINGS++))
  fi
else
  echo "  ❌ Node.js not found"
  ((ERRORS++))
fi

# Check npm
echo "Checking npm..."
if command -v npm &> /dev/null; then
  NPM_VERSION=$(npm --version)
  echo "  ✅ npm: ${NPM_VERSION}"
else
  echo "  ❌ npm not found"
  ((ERRORS++))
fi

# Check build tools
echo "Checking build tools..."
if command -v node-gyp &> /dev/null; then
  echo "  ✅ node-gyp installed"
else
  echo "  ⚠️  WARNING: node-gyp not found globally (will use local)"
  ((WARNINGS++))
fi

# Check for C++ compiler
echo "Checking C++ compiler..."
if command -v g++ &> /dev/null; then
  GPP_VERSION=$(g++ --version | head -n1)
  echo "  ✅ g++: ${GPP_VERSION}"
elif command -v clang++ &> /dev/null; then
  CLANG_VERSION=$(clang++ --version | head -n1)
  echo "  ✅ clang++: ${CLANG_VERSION}"
else
  echo "  ❌ No C++ compiler found (g++ or clang++)"
  ((ERRORS++))
fi

# Check for CMake (for TDLib build)
echo "Checking CMake..."
if command -v cmake &> /dev/null; then
  CMAKE_VERSION=$(cmake --version | head -n1)
  echo "  ✅ CMake: ${CMAKE_VERSION}"
else
  echo "  ⚠️  WARNING: CMake not found (needed for TDLib build)"
  ((WARNINGS++))
fi

# Check TDLib source location
echo "Checking TDLib source..."
TD_SRC_FOUND=false

# Check vendored source (unified layout)
if [[ -d "${PROJECT_ROOT}/vendor/tdlib/source" ]]; then
  TD_SRC_DIR="${PROJECT_ROOT}/vendor/tdlib/source"
  echo "  ✅ Found (vendor): ${TD_SRC_DIR}"
  TD_SRC_FOUND=true
elif [[ -n "${TDLIB_SOURCE_DIR:-}" ]]; then
  TD_SRC_DIR="${TDLIB_SOURCE_DIR}"
  echo "  ✅ Found (env var): ${TD_SRC_DIR}"
  TD_SRC_FOUND=true
fi

if [ "${TD_SRC_FOUND}" = false ]; then
  echo "  ⚠️  WARNING: TDLib source not found"
  echo "     Expected at: vendor/tdlib/source"
  echo "     Or set TDLIB_SOURCE_DIR environment variable"
  ((WARNINGS++))
fi

# Check for libtdjson.so
echo "Checking libtdjson.so..."
LIB_PATH="${PROJECT_ROOT}/vendor/tdlib/lib/libtdjson.so"
if [ -f "${LIB_PATH}" ]; then
  LIB_SIZE=$(stat -f%z "${LIB_PATH}" 2>/dev/null || stat -c%s "${LIB_PATH}" 2>/dev/null || echo "0")
  echo "  ✅ Found: ${LIB_PATH} (${LIB_SIZE} bytes)"
else
  echo "  ⚠️  WARNING: libtdjson.so not found at ${LIB_PATH}"
  echo "     Run: bash scripts/build-tdlib.sh"
  ((WARNINGS++))
fi

# Check for native addon
echo "Checking native addon..."
ADDON_PATH="${PROJECT_ROOT}/native/tdlib/build/Release/tdlib.node"
if [ -f "${ADDON_PATH}" ]; then
  echo "  ✅ Found: ${ADDON_PATH}"
else
  echo "  ⚠️  WARNING: tdlib.node not found"
  echo "     Run: npm run build:tdlib-addon"
  ((WARNINGS++))
fi

# Check environment variables
echo "Checking environment variables..."
if [ -z "${ENCRYPTION_KEY:-}" ]; then
  echo "  ⚠️  WARNING: ENCRYPTION_KEY not set"
  echo "     Required for production: openssl rand -hex 32"
  ((WARNINGS++))
else
  KEY_LEN=${#ENCRYPTION_KEY}
  if [ "${KEY_LEN}" -lt 64 ]; then
    echo "  ⚠️  WARNING: ENCRYPTION_KEY seems too short (${KEY_LEN} chars, need 64)"
    ((WARNINGS++))
  else
    echo "  ✅ ENCRYPTION_KEY set (${KEY_LEN} chars)"
  fi
fi

# Summary
echo ""
echo "=== Summary ==="
echo "Errors: ${ERRORS}"
echo "Warnings: ${WARNINGS}"

if [ ${ERRORS} -gt 0 ]; then
  echo ""
  echo "❌ Build environment check FAILED"
  exit 1
elif [ ${WARNINGS} -gt 0 ]; then
  echo ""
  echo "⚠️  Build environment check passed with warnings"
  exit 0
else
  echo ""
  echo "✅ Build environment check PASSED"
  exit 0
fi
