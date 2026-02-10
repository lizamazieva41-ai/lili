#!/bin/bash

# Rollback Script
# Usage: ./scripts/rollback.sh [backup_timestamp]

set -e

BACKUP_TIMESTAMP=${1:-$(ls -t /var/www/app/backups/db_backup_*.sql.gz | head -1 | grep -oP '\d{8}_\d{6}')}
APP_DIR="/var/www/app"
BACKUP_DIR="/var/www/app/backups"

if [ -z "$BACKUP_TIMESTAMP" ]; then
    echo "❌ No backup timestamp provided or found"
    exit 1
fi

echo "🔄 Rolling back to backup: $BACKUP_TIMESTAMP"

# Stop application
echo "Stopping application..."
cd $APP_DIR
pm2 stop all || true

# Restore database
echo "Restoring database..."
if [ -f "$BACKUP_DIR/db_backup_${BACKUP_TIMESTAMP}.sql.gz" ]; then
    gunzip -c $BACKUP_DIR/db_backup_${BACKUP_TIMESTAMP}.sql.gz | psql -h localhost -U $DB_USER -d $DB_NAME
    echo "✓ Database restored"
else
    echo "❌ Backup file not found: $BACKUP_DIR/db_backup_${BACKUP_TIMESTAMP}.sql.gz"
    exit 1
fi

# Restore application files if available
if [ -f "$BACKUP_DIR/app_backup_${BACKUP_TIMESTAMP}.tar.gz" ]; then
    echo "Restoring application files..."
    tar -xzf $BACKUP_DIR/app_backup_${BACKUP_TIMESTAMP}.tar.gz -C /var/www
    echo "✓ Application files restored"
fi

# Start application
echo "Starting application..."
pm2 start ecosystem.config.js

# Health check
echo "Running health check..."
sleep 5
if curl -f http://localhost:3000/api/health > /dev/null 2>&1; then
    echo "✓ Rollback completed successfully"
else
    echo "⚠️  Health check failed, but rollback completed"
fi
