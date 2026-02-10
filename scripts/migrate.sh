#!/bin/bash

# Database Migration Script
# Usage: ./scripts/migrate.sh [up|down|status]

set -e

ACTION=${1:-up}
APP_DIR="/var/www/app"

echo "🗄️  Database Migration: $ACTION"

cd $APP_DIR/backend

case $ACTION in
    up)
        echo "Running migrations..."
        npx prisma migrate deploy
        echo "✓ Migrations applied successfully"
        ;;
    down)
        echo "⚠️  Rollback not supported with Prisma migrate deploy"
        echo "Use manual rollback or restore from backup"
        exit 1
        ;;
    status)
        echo "Migration status:"
        npx prisma migrate status
        ;;
    *)
        echo "Usage: $0 [up|down|status]"
        exit 1
        ;;
esac
