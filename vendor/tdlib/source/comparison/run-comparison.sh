#!/usr/bin/env bash
set -euo pipefail

# TDLib C++ vs Node/NestJS wrapper comparison harness (skeleton).
# This script documents the expected steps to:
#  1) Run a TDLib C++ example client.
#  2) Call the Node/NestJS TDLib service for the same flows.
#  3) Store JSON outputs under expected/ and actual/ for later diff.

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
EXPECTED_DIR="${ROOT_DIR}/comparison/expected/tdlib_cpp"
ACTUAL_DIR="${ROOT_DIR}/comparison/actual/node_wrapper"

mkdir -p "${EXPECTED_DIR}" "${ACTUAL_DIR}"

echo "[comparison] Root:         ${ROOT_DIR}"
echo "[comparison] Expected dir: ${EXPECTED_DIR}"
echo "[comparison] Actual dir:   ${ACTUAL_DIR}"

echo "[comparison] NOTE: This is a skeleton harness."
echo "You should implement:"
echo "  - Running C++ example client (example/cpp or example/python) to produce JSON into ${EXPECTED_DIR}"
echo "  - Calling Node/NestJS TDLib endpoints to produce JSON into ${ACTUAL_DIR}"
echo "Then use the Node comparison tool in telegram-platform-backend to diff results."

