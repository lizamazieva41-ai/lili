#!/usr/bin/env bash
set -euo pipefail

##
## Validate build environment for TDLib
## Checks for required dependencies and versions
##

echo "=== TDLib Build Environment Validation ==="
echo ""

ERRORS=0
WARNINGS=0

# Check CMake
echo -n "Checking CMake... "
if command -v cmake &> /dev/null; then
    CMAKE_VERSION=$(cmake --version | head -n1 | awk '{print $3}')
    CMAKE_MAJOR=$(echo "$CMAKE_VERSION" | cut -d. -f1)
    CMAKE_MINOR=$(echo "$CMAKE_VERSION" | cut -d. -f2)
    if [ "$CMAKE_MAJOR" -gt 3 ] || ([ "$CMAKE_MAJOR" -eq 3 ] && [ "$CMAKE_MINOR" -ge 10 ]); then
        echo "OK (version $CMAKE_VERSION)"
    else
        echo "FAIL (version $CMAKE_VERSION, required >= 3.10)"
        ((ERRORS++))
    fi
else
    echo "FAIL (not found)"
    ((ERRORS++))
fi

# Check C++ Compiler
echo -n "Checking C++ Compiler... "
if command -v g++ &> /dev/null; then
    GCC_VERSION=$(g++ --version | head -n1 | awk '{print $NF}')
    echo "OK (g++ $GCC_VERSION)"
elif command -v clang++ &> /dev/null; then
    CLANG_VERSION=$(clang++ --version | head -n1 | awk '{print $NF}')
    echo "OK (clang++ $CLANG_VERSION)"
else
    echo "FAIL (g++ or clang++ not found)"
    ((ERRORS++))
fi

# Check OpenSSL
echo -n "Checking OpenSSL... "
if command -v openssl &> /dev/null; then
    OPENSSL_VERSION=$(openssl version | awk '{print $2}')
    echo "OK (version $OPENSSL_VERSION)"
    
    # Check for development headers
    if [ -d "/usr/include/openssl" ] || [ -d "/usr/local/include/openssl" ]; then
        echo "  OpenSSL headers: OK"
    else
        echo "  OpenSSL headers: WARNING (may need libssl-dev)"
        ((WARNINGS++))
    fi
else
    echo "FAIL (not found)"
    ((ERRORS++))
fi

# Check zlib
echo -n "Checking zlib... "
if command -v zlib-flate &> /dev/null || [ -f "/usr/lib/x86_64-linux-gnu/libz.so" ] || [ -f "/usr/lib/libz.so" ]; then
    echo "OK"
    
    # Check for development headers
    if [ -f "/usr/include/zlib.h" ] || [ -f "/usr/local/include/zlib.h" ]; then
        echo "  zlib headers: OK"
    else
        echo "  zlib headers: WARNING (may need zlib1g-dev)"
        ((WARNINGS++))
    fi
else
    echo "WARNING (not found, may need zlib1g-dev)"
    ((WARNINGS++))
fi

# Check gperf
echo -n "Checking gperf... "
if command -v gperf &> /dev/null; then
    GPERF_VERSION=$(gperf --version | head -n1 | awk '{print $NF}')
    echo "OK (version $GPERF_VERSION)"
else
    echo "WARNING (not found, may need gperf package)"
    ((WARNINGS++))
fi

# Check make
echo -n "Checking make... "
if command -v make &> /dev/null; then
    MAKE_VERSION=$(make --version | head -n1 | awk '{print $3}')
    echo "OK (version $MAKE_VERSION)"
else
    echo "FAIL (not found)"
    ((ERRORS++))
fi

# Check ninja (optional)
echo -n "Checking ninja (optional)... "
if command -v ninja &> /dev/null; then
    NINJA_VERSION=$(ninja --version)
    echo "OK (version $NINJA_VERSION)"
else
    echo "SKIP (not found, using make instead)"
fi

# Check ccache (optional)
echo -n "Checking ccache (optional)... "
if command -v ccache &> /dev/null; then
    CCACHE_VERSION=$(ccache --version | head -n1 | awk '{print $3}')
    echo "OK (version $CCACHE_VERSION)"
else
    echo "SKIP (not found, build will be slower)"
fi

# Check available memory
echo -n "Checking available memory... "
if command -v free &> /dev/null; then
    MEM_AVAILABLE=$(free -m | awk '/^Mem:/{print $7}')
    if [ "$MEM_AVAILABLE" -gt 2048 ]; then
        echo "OK (${MEM_AVAILABLE}MB available)"
    else
        echo "WARNING (${MEM_AVAILABLE}MB available, recommended > 2GB)"
        ((WARNINGS++))
    fi
else
    echo "SKIP (cannot check)"
fi

# Check disk space
echo -n "Checking disk space... "
if command -v df &> /dev/null; then
    DISK_AVAILABLE=$(df -BG . | tail -n1 | awk '{print $4}' | sed 's/G//')
    if [ "$DISK_AVAILABLE" -gt 5 ]; then
        echo "OK (${DISK_AVAILABLE}GB available)"
    else
        echo "WARNING (${DISK_AVAILABLE}GB available, recommended > 5GB)"
        ((WARNINGS++))
    fi
else
    echo "SKIP (cannot check)"
fi

echo ""
echo "=== Validation Summary ==="
echo "Errors: $ERRORS"
echo "Warnings: $WARNINGS"

if [ $ERRORS -gt 0 ]; then
    echo ""
    echo "❌ Validation FAILED. Please install missing dependencies."
    exit 1
elif [ $WARNINGS -gt 0 ]; then
    echo ""
    echo "⚠️  Validation passed with warnings. Build may still succeed."
    exit 0
else
    echo ""
    echo "✅ Validation PASSED. Environment is ready for building TDLib."
    exit 0
fi
