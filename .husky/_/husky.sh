#!/usr/bin/env sh
# Husky shell script
# This is a helper script that sets up the environment for husky hooks

# Get the directory where this script is located
HUSKY_DIR="$(cd "$(dirname "$0")" && pwd)"

# Source common functions if available
if [ -f "$HUSKY_DIR/_/husky.sh" ]; then
    . "$HUSKY_DIR/_/husky.sh"
fi

# Default implementations for hook variables if not set
if [ -z "$husky_skip_init" ]; then
    export husky_skip_init=1
fi
