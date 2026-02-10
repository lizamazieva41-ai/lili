#!/usr/bin/env bash
set -euo pipefail

##
## Verify TDLib build output
## Checks that libtdjson.so exists and is valid
##

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"
LIB_PATH="${1:-${ROOT_DIR}/vendor/tdlib/lib/libtdjson.so}"

echo "=== TDLib Build Verification ==="
echo "Library path: ${LIB_PATH}"
echo ""

ERRORS=0

# Check if file exists
if [ ! -f "${LIB_PATH}" ]; then
    echo "❌ ERROR: Library file not found at ${LIB_PATH}"
    exit 1
fi

echo "✅ Library file exists"

# Check file type
echo -n "Checking file type... "
if command -v file &> /dev/null; then
    FILE_TYPE=$(file "${LIB_PATH}")
    echo "${FILE_TYPE}"
    
    if echo "${FILE_TYPE}" | grep -q "shared object\|ELF.*shared"; then
        echo "✅ File is a shared library"
    else
        echo "⚠️  WARNING: File may not be a shared library"
        ((ERRORS++))
    fi
else
    echo "SKIP (file command not available)"
fi

# Check file size
echo -n "Checking file size... "
FILE_SIZE=$(stat -f%z "${LIB_PATH}" 2>/dev/null || stat -c%s "${LIB_PATH}" 2>/dev/null || echo "0")
if [ "${FILE_SIZE}" -gt 1000000 ]; then
    echo "OK (${FILE_SIZE} bytes)"
else
    echo "WARNING (${FILE_SIZE} bytes, seems small)"
    ((ERRORS++))
fi

# Check for required symbols (if nm is available)
if command -v nm &> /dev/null; then
    echo -n "Checking for required symbols... "
    REQUIRED_SYMBOLS=(
        "td_json_client_create"
        "td_json_client_send"
        "td_json_client_receive"
        "td_json_client_execute"
        "td_json_client_destroy"
    )
    
    MISSING_SYMBOLS=0
    for symbol in "${REQUIRED_SYMBOLS[@]}"; do
        if ! nm -D "${LIB_PATH}" 2>/dev/null | grep -q "${symbol}"; then
            echo ""
            echo "  ❌ Missing symbol: ${symbol}"
            ((MISSING_SYMBOLS++))
        fi
    done
    
    if [ ${MISSING_SYMBOLS} -eq 0 ]; then
        echo "OK (all required symbols found)"
    else
        echo "FAIL (${MISSING_SYMBOLS} symbols missing)"
        ((ERRORS++))
    fi
else
    echo "SKIP (nm command not available)"
fi

# Check library dependencies (if ldd is available)
if command -v ldd &> /dev/null; then
    echo "Checking library dependencies..."
    LDD_OUTPUT=$(ldd "${LIB_PATH}" 2>&1 || true)
    
    if echo "${LDD_OUTPUT}" | grep -q "not a dynamic executable\|No such file"; then
        echo "  ⚠️  WARNING: Cannot check dependencies (may be expected on non-Linux)"
    else
        echo "${LDD_OUTPUT}" | while read -r line; do
            if echo "${line}" | grep -q "not found"; then
                echo "  ❌ Missing dependency: ${line}"
                ((ERRORS++))
            fi
        done
        
        if [ ${ERRORS} -eq 0 ]; then
            echo "  ✅ All dependencies resolved"
        fi
    fi
else
    echo "SKIP (ldd command not available)"
fi

# Try to load library (if dlopen test is available)
echo -n "Testing library load... "
if command -v node &> /dev/null && [ -f "${ROOT_DIR}/native/tdlib/build/Release/tdlib.node" ]; then
    # Try a simple Node.js test
    NODE_TEST=$(node -e "
        try {
            const addon = require('${ROOT_DIR}/native/tdlib/build/Release/tdlib.node');
            console.log('OK');
            process.exit(0);
        } catch (e) {
            console.log('FAIL: ' + e.message);
            process.exit(1);
        }
    " 2>&1 || echo "FAIL")
    
    if [ "${NODE_TEST}" = "OK" ]; then
        echo "OK (addon can load library)"
    else
        echo "FAIL (${NODE_TEST})"
        ((ERRORS++))
    fi
else
    echo "SKIP (Node.js or addon not available)"
fi

echo ""
echo "=== Verification Summary ==="
if [ ${ERRORS} -eq 0 ]; then
    echo "✅ Verification PASSED"
    exit 0
else
    echo "❌ Verification FAILED (${ERRORS} errors)"
    exit 1
fi
