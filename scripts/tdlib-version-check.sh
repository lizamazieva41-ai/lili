#!/usr/bin/env bash
set -euo pipefail

##
## Check TDLib version compatibility
## Compares version in tdlib-version.json with actual build
##

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"
TD_SOURCE_DIR="${ROOT_DIR}/vendor/tdlib/source"
VERSION_FILE="${TD_SOURCE_DIR}/tdlib-version.json"
CMAKE_FILE="${TD_SOURCE_DIR}/CMakeLists.txt"
LIB_PATH="${ROOT_DIR}/vendor/tdlib/lib/libtdjson.so"

echo "=== TDLib Version Check ==="
echo ""

ERRORS=0
WARNINGS=0

# Check version file
if [ -f "${VERSION_FILE}" ]; then
    echo "Reading version from ${VERSION_FILE}..."
    RECORDED_VERSION=$(cat "${VERSION_FILE}" | grep -o '"tdlib_version": "[^"]*"' | cut -d'"' -f4 || echo "")
    if [ -n "${RECORDED_VERSION}" ]; then
        echo "  Recorded version: ${RECORDED_VERSION}"
    else
        echo "  ⚠️  WARNING: Could not parse version from JSON"
        ((WARNINGS++))
    fi
else
    echo "  ⚠️  WARNING: Version file not found at ${VERSION_FILE}"
    ((WARNINGS++))
fi

# Check CMakeLists.txt version
if [ -f "${CMAKE_FILE}" ]; then
    echo "Reading version from ${CMAKE_FILE}..."
    CMAKE_VERSION=$(grep -o 'VERSION [0-9.]*' "${CMAKE_FILE}" | head -n1 | awk '{print $2}' || echo "")
    if [ -n "${CMAKE_VERSION}" ]; then
        echo "  CMake version: ${CMAKE_VERSION}"
    else
        echo "  ⚠️  WARNING: Could not parse version from CMakeLists.txt"
        ((WARNINGS++))
    fi
else
    echo "  ❌ ERROR: CMakeLists.txt not found at ${CMAKE_FILE}"
    ((ERRORS++))
fi

# Check if library exists and get its version (if possible)
if [ -f "${LIB_PATH}" ]; then
    echo "Library found at ${LIB_PATH}"
    
    # Try to get version from library (if strings command is available)
    if command -v strings &> /dev/null; then
        LIB_VERSION=$(strings "${LIB_PATH}" | grep -i "version\|tdlib" | head -n1 || echo "")
        if [ -n "${LIB_VERSION}" ]; then
            echo "  Library version info: ${LIB_VERSION}"
        fi
    fi
    
    # Check file modification time
    if command -v stat &> /dev/null; then
        LIB_MTIME=$(stat -f%m "${LIB_PATH}" 2>/dev/null || stat -c%Y "${LIB_PATH}" 2>/dev/null || echo "0")
        CMAKE_MTIME=$(stat -f%m "${CMAKE_FILE}" 2>/dev/null || stat -c%Y "${CMAKE_FILE}" 2>/dev/null || echo "0")
        
        if [ "${LIB_MTIME}" -lt "${CMAKE_MTIME}" ]; then
            echo "  ⚠️  WARNING: Library is older than source (may need rebuild)"
            ((WARNINGS++))
        fi
    fi
else
    echo "  ⚠️  WARNING: Library not found at ${LIB_PATH}"
    ((WARNINGS++))
fi

# Version comparison (basic)
if [ -n "${RECORDED_VERSION}" ] && [ -n "${CMAKE_VERSION}" ]; then
    echo ""
    echo "Version comparison:"
    echo "  Recorded: ${RECORDED_VERSION}"
    echo "  CMake:    ${CMAKE_VERSION}"
    
    # Extract major version
    RECORDED_MAJOR=$(echo "${RECORDED_VERSION}" | cut -d. -f1)
    CMAKE_MAJOR=$(echo "${CMAKE_VERSION}" | cut -d. -f1)
    
    if [ "${RECORDED_MAJOR}" != "${CMAKE_MAJOR}" ]; then
        echo "  ❌ ERROR: Major version mismatch!"
        ((ERRORS++))
    else
        echo "  ✅ Major versions match"
    fi
fi

echo ""
echo "=== Version Check Summary ==="
echo "Errors: ${ERRORS}"
echo "Warnings: ${WARNINGS}"

if [ ${ERRORS} -gt 0 ]; then
    echo ""
    echo "❌ Version check FAILED"
    exit 1
elif [ ${WARNINGS} -gt 0 ]; then
    echo ""
    echo "⚠️  Version check passed with warnings"
    exit 0
else
    echo ""
    echo "✅ Version check PASSED"
    exit 0
fi
