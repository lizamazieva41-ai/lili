#!/usr/bin/env bash
set -euo pipefail

##
## Production cleanup script
## Removes development files, logs, coverage, and other non-production artifacts
##

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"

echo "=== Production Cleanup Script ==="
echo ""

# Files and directories to remove
REMOVE_PATTERNS=(
  ".env"
  ".env.*"
  "*.log"
  "logs/"
  "coverage/"
  ".nyc_output/"
  ".vscode/"
  ".idea/"
  "*.swp"
  "*.swo"
  ".DS_Store"
  "Thumbs.db"
  "*.db"
  "*.sqlite"
  "tmp/"
  "temp/"
  "backups/"
  "*.backup"
  "*.bak"
  ".pytest_cache/"
  "__pycache__/"
  "*.pyc"
  "*.pyo"
  ".mypy_cache/"
  ".ruff_cache/"
  ".node_modules/.cache/"
  ".cache/"
  "*.test.ts"
  "*.spec.ts"
  "test/"
  "tests/"
  ".test/"
  ".tests/"
)

# Files to remove if INCLUDE_DOCKER is not set
DOCKER_FILES=(
  "Dockerfile"
  "Dockerfile.*"
  "docker-compose*.yml"
  ".dockerignore"
  "docker-compose.yml"
  "docker-compose.build.yml"
)

REMOVED_COUNT=0
WARNED_COUNT=0

cd "${ROOT_DIR}"

# Remove files matching patterns
for pattern in "${REMOVE_PATTERNS[@]}"; do
  if [[ "${pattern}" == *"/" ]]; then
    # Directory pattern
    find . -type d -name "${pattern%/}" -not -path "./node_modules/*" -not -path "./.git/*" | while read -r dir; do
      echo "Removing directory: ${dir}"
      rm -rf "${dir}"
      ((REMOVED_COUNT++))
    done
  else
    # File pattern
    find . -name "${pattern}" -type f -not -path "./node_modules/*" -not -path "./.git/*" | while read -r file; do
      echo "Removing file: ${file}"
      rm -f "${file}"
      ((REMOVED_COUNT++))
    done
  fi
done

# Remove Docker files if not including Docker
if [[ "${INCLUDE_DOCKER:-false}" != "true" ]]; then
  for pattern in "${DOCKER_FILES[@]}"; do
    find . -name "${pattern}" -type f -not -path "./node_modules/*" -not -path "./.git/*" | while read -r file; do
      echo "Removing Docker file: ${file}"
      rm -f "${file}"
      ((REMOVED_COUNT++))
    done
  done
else
  for pattern in "${DOCKER_FILES[@]}"; do
    find . -name "${pattern}" -type f -not -path "./node_modules/*" -not -path "./.git/*" | while read -r file; do
      echo "⚠️  WARNING: Found ${file} - keeping because INCLUDE_DOCKER=true"
      ((WARNED_COUNT++))
    done
  done
fi

# Remove empty directories
find . -type d -empty -not -path "./node_modules/*" -not -path "./.git/*" -delete 2>/dev/null || true

# Verification: Check for remaining dev files
echo ""
echo "Verifying cleanup..."
VERIFY_ERRORS=0

# Check for .env files (except .env.example)
ENV_FILES=$(find . -name ".env*" -not -name ".env.example" -not -path "./node_modules/*" -not -path "./.git/*" 2>/dev/null | wc -l | tr -d ' ')
if [ "${ENV_FILES}" -gt 0 ]; then
  echo "  ⚠️  WARNING: Found ${ENV_FILES} .env file(s) (excluding .env.example)"
  ((VERIFY_ERRORS++))
else
  echo "  ✅ No .env files found (except .env.example)"
fi

# Check for coverage
if [ -d "coverage" ] || [ -d ".nyc_output" ]; then
  echo "  ⚠️  WARNING: Coverage directories still exist"
  ((VERIFY_ERRORS++))
else
  echo "  ✅ Coverage directories removed"
fi

# Check for logs
if [ -d "logs" ] || find . -name "*.log" -not -path "./node_modules/*" -not -path "./.git/*" 2>/dev/null | grep -q .; then
  echo "  ⚠️  WARNING: Log files/directories still exist"
  ((VERIFY_ERRORS++))
else
  echo "  ✅ Log files/directories removed"
fi

# Check for test files (if removing them)
if [ "${REMOVE_TEST_FILES:-false}" = "true" ]; then
  TEST_FILES=$(find . -name "*.test.ts" -o -name "*.spec.ts" -not -path "./node_modules/*" -not -path "./.git/*" 2>/dev/null | wc -l | tr -d ' ')
  if [ "${TEST_FILES}" -gt 0 ]; then
    echo "  ⚠️  WARNING: Found ${TEST_FILES} test file(s)"
    ((VERIFY_ERRORS++))
  else
    echo "  ✅ Test files removed"
  fi
fi

echo ""
echo "=== Cleanup Summary ==="
echo "Files/directories removed: ${REMOVED_COUNT}"
echo "Files warned about: ${WARNED_COUNT}"
echo "Verification errors: ${VERIFY_ERRORS}"
echo ""

if [ ${VERIFY_ERRORS} -gt 0 ]; then
  echo "⚠️  Cleanup completed with warnings"
  echo "   Some dev files may still exist"
else
  echo "✅ Production cleanup completed successfully"
fi
