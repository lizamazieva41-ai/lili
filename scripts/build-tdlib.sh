#!/usr/bin/env bash
set -euo pipefail

##
## Build TDLib (libtdjson.so) from vendor/tdlib/source for Linux runtime
##
## Requirements:
##   - Linux (Ubuntu 22.04+ recommended)
##   - cmake >= 3.0
##   - g++ or clang++ with C++17 support
##   - make or ninja
##   - OpenSSL, zlib, readline dev packages
##
## This script is idempotent: re-running will rebuild into the same output directory.
##

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"

# Detect TDLib source location
# Priority: 1) vendor/tdlib/source (unified layout), 2) env var override
if [[ -d "${PROJECT_ROOT}/vendor/tdlib/source" ]]; then
  # Unified monorepo layout: TDLib source vendored in project
  TD_SRC_DIR="${PROJECT_ROOT}/vendor/tdlib/source"
  INSTALL_DIR="${PROJECT_ROOT}/vendor/tdlib"
elif [[ -n "${TDLIB_SOURCE_DIR:-}" ]]; then
  # Environment variable override
  TD_SRC_DIR="${TDLIB_SOURCE_DIR}"
  INSTALL_DIR="${PROJECT_ROOT}/vendor/tdlib"
else
  echo "[build-tdlib] ERROR: Could not locate TDLib source directory" >&2
  echo "[build-tdlib] Tried:" >&2
  echo "  - ${PROJECT_ROOT}/vendor/tdlib/source" >&2
  echo "[build-tdlib] Set TDLIB_SOURCE_DIR environment variable to specify custom path" >&2
  exit 1
fi

BUILD_DIR="${TD_SRC_DIR}/build"

echo "[build-tdlib] Project root:    ${PROJECT_ROOT}"
echo "[build-tdlib] TDLib source:    ${TD_SRC_DIR}"
echo "[build-tdlib] Build directory: ${BUILD_DIR}"
echo "[build-tdlib] Install to:      ${INSTALL_DIR}"

if [[ ! -d "${TD_SRC_DIR}" ]]; then
  echo "[build-tdlib] ERROR: TDLib source directory not found at ${TD_SRC_DIR}" >&2
  exit 1
fi

mkdir -p "${BUILD_DIR}"
mkdir -p "${INSTALL_DIR}/lib"

cd "${BUILD_DIR}"

echo "[build-tdlib] Configuring CMake..."
cmake \
  -DCMAKE_BUILD_TYPE=Release \
  -DCMAKE_INSTALL_PREFIX="${INSTALL_DIR}" \
  -DTD_ENABLE_LTO=OFF \
  -DTD_INSTALL_STATIC_LIBRARIES=OFF \
  -DTD_INSTALL_SHARED_LIBRARIES=ON \
  ..

echo "[build-tdlib] Building TDLib..."
cmake --build . --target tdjson --config Release -- -j"$(nproc || echo 4)"

echo "[build-tdlib] Copying libtdjson.so to vendor directory..."
if [[ -f "${BUILD_DIR}/libtdjson.so" ]]; then
  cp "${BUILD_DIR}/libtdjson.so" "${INSTALL_DIR}/lib/libtdjson.so"
elif [[ -f "${BUILD_DIR}/libtdjson.dylib" ]]; then
  # In case of macOS build (for dev), keep naming consistent
  cp "${BUILD_DIR}/libtdjson.dylib" "${INSTALL_DIR}/lib/libtdjson.dylib"
else
  echo "[build-tdlib] ERROR: libtdjson shared library not found in build directory." >&2
  exit 1
fi

echo "[build-tdlib] Done. Shared library is in: ${INSTALL_DIR}/lib"

