#!/usr/bin/env bash
set -euo pipefail

##
## Ensure TDLib artifact (libtdjson.so) exists and is accessible
## This script verifies the library is present and can be loaded
##

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"

# Default library path
LIB_PATH="${PROJECT_ROOT}/vendor/tdlib/lib/libtdjson.so"

# Allow override via environment variable
if [[ -n "${TDLIB_LIBRARY_PATH:-}" ]]; then
  LIB_PATH="${TDLIB_LIBRARY_PATH}"
fi

echo "=== TDLib Artifact Verification ==="
echo "Library path: ${LIB_PATH}"
echo ""

# Check if library exists
if [[ ! -f "${LIB_PATH}" ]]; then
  echo "❌ ERROR: libtdjson.so not found at ${LIB_PATH}"
  echo ""
  echo "To build the library:"
  echo "  1. Ensure TDLib source is available (vendor/tdlib/source)"
  echo "  2. Run: bash scripts/build-tdlib.sh"
  echo ""
  echo "Or set TDLIB_LIBRARY_PATH environment variable to point to the library"
  exit 1
fi

# Check file permissions
if [[ ! -r "${LIB_PATH}" ]]; then
  echo "❌ ERROR: libtdjson.so is not readable"
  echo "  Fix: chmod 644 ${LIB_PATH}"
  exit 1
fi

# Check file size (should be > 0)
LIB_SIZE=$(stat -f%z "${LIB_PATH}" 2>/dev/null || stat -c%s "${LIB_PATH}" 2>/dev/null || echo "0")
if [[ "${LIB_SIZE}" -eq 0 ]]; then
  echo "❌ ERROR: libtdjson.so is empty (0 bytes)"
  exit 1
fi

echo "✅ Library found: ${LIB_PATH}"
echo "   Size: ${LIB_SIZE} bytes"

# Try to verify it's a valid shared library
if command -v file &> /dev/null; then
  FILE_TYPE=$(file "${LIB_PATH}" 2>/dev/null || echo "unknown")
  echo "   Type: ${FILE_TYPE}"
  
  if [[ "${FILE_TYPE}" != *"shared object"* ]] && [[ "${FILE_TYPE}" != *"ELF"* ]]; then
    echo "⚠️  WARNING: File type doesn't look like a shared library"
  fi
fi

# Check if library can be loaded (basic check)
if command -v ldd &> /dev/null && [[ "$(uname)" == "Linux" ]]; then
  echo ""
  echo "Checking dependencies..."
  if ldd "${LIB_PATH}" &> /dev/null; then
    echo "✅ Library dependencies check passed"
  else
    echo "⚠️  WARNING: Some dependencies may be missing"
    echo "   Run 'ldd ${LIB_PATH}' to see missing dependencies"
  fi
fi

# Verify library path is in LD_LIBRARY_PATH or rpath
LIB_DIR=$(dirname "${LIB_PATH}")
if [[ -n "${LD_LIBRARY_PATH:-}" ]]; then
  if [[ ":${LD_LIBRARY_PATH}:" != *":${LIB_DIR}:"* ]]; then
    echo ""
    echo "⚠️  WARNING: Library directory not in LD_LIBRARY_PATH"
    echo "   Add to LD_LIBRARY_PATH: export LD_LIBRARY_PATH=\${LD_LIBRARY_PATH}:${LIB_DIR}"
  else
    echo "✅ Library directory is in LD_LIBRARY_PATH"
  fi
else
  echo ""
  echo "⚠️  WARNING: LD_LIBRARY_PATH not set"
  echo "   Consider setting: export LD_LIBRARY_PATH=${LIB_DIR}"
fi

# Set environment variable for Node.js addon
export TDLIB_LIBRARY_PATH="${LIB_PATH}"

echo ""
echo "✅ TDLib artifact verification passed"
echo ""
echo "To use this library in Node.js:"
echo "  export TDLIB_LIBRARY_PATH=${LIB_PATH}"
echo "  # Or set in your .env file: TDLIB_LIBRARY_PATH=${LIB_PATH}"
