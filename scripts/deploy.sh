#!/bin/bash

# Telegram Platform Backend - Deployment Script
# Usage: ./scripts/deploy.sh [environment]

set -e

ENVIRONMENT=${1:-production}
APP_DIR="/var/www/app"
BACKUP_DIR="/var/www/app/backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

echo "🚀 Starting deployment for environment: $ENVIRONMENT"
echo "📅 Timestamp: $TIMESTAMP"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✓${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

# Check if running as correct user
if [ "$USER" != "deploy" ] && [ "$EUID" -ne 0 ]; then
    print_error "This script should be run as 'deploy' user or with sudo"
    exit 1
fi

# Pre-deployment checks
print_status "Running pre-deployment checks..."

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 20 ]; then
    print_error "Node.js version 20+ required. Current: $(node -v)"
    exit 1
fi

# Check PM2
if ! command -v pm2 &> /dev/null; then
    print_error "PM2 is not installed"
    exit 1
fi

# Check database connection
print_status "Checking database connection..."
if ! PGPASSWORD=$DB_PASSWORD psql -h localhost -U $DB_USER -d $DB_NAME -c "SELECT 1" > /dev/null 2>&1; then
    print_error "Cannot connect to database"
    exit 1
fi

# Check Redis connection
print_status "Checking Redis connection..."
if ! redis-cli -h localhost ping > /dev/null 2>&1; then
    print_error "Cannot connect to Redis"
    exit 1
fi

# Create backup
print_status "Creating backup..."
mkdir -p $BACKUP_DIR

# Backup database
print_status "Backing up database..."
pg_dump -h localhost -U $DB_USER -d $DB_NAME > $BACKUP_DIR/db_backup_$TIMESTAMP.sql
gzip $BACKUP_DIR/db_backup_$TIMESTAMP.sql

# Backup application files
print_status "Backing up application files..."
tar -czf $BACKUP_DIR/app_backup_$TIMESTAMP.tar.gz -C /var/www app/backend app/frontend ecosystem.config.js .env 2>/dev/null || true

print_status "Backup completed: $BACKUP_DIR/backup_$TIMESTAMP.*"

# Stop application
print_status "Stopping application..."
cd $APP_DIR
pm2 stop all || true
sleep 2

# Deploy new code
print_status "Deploying new code..."
if [ -d "$APP_DIR/backend.new" ]; then
    # Swap directories
    mv $APP_DIR/backend $APP_DIR/backend.old
    mv $APP_DIR/backend.new $APP_DIR/backend
    rm -rf $APP_DIR/backend.old
fi

# Install dependencies
print_status "Installing dependencies..."
cd $APP_DIR/backend
npm ci --production

# Generate Prisma client
print_status "Generating Prisma client..."
npx prisma generate

# Run database migrations
print_status "Running database migrations..."
npx prisma migrate deploy

# Build application
print_status "Building application..."
npm run build

# Start application
print_status "Starting application..."
pm2 start ecosystem.config.js
pm2 save

# Wait for application to be ready
print_status "Waiting for application to be ready..."
sleep 5

# Health check
print_status "Running health check..."
MAX_RETRIES=10
RETRY_COUNT=0

while [ $RETRY_COUNT -lt $MAX_RETRIES ]; do
    if curl -f http://localhost:3000/api/health > /dev/null 2>&1; then
        print_status "Health check passed!"
        break
    fi
    
    RETRY_COUNT=$((RETRY_COUNT + 1))
    if [ $RETRY_COUNT -eq $MAX_RETRIES ]; then
        print_error "Health check failed after $MAX_RETRIES attempts"
        print_warning "Rolling back..."
        ./scripts/rollback.sh
        exit 1
    fi
    
    sleep 2
done

# Reload Nginx
print_status "Reloading Nginx..."
sudo systemctl reload nginx || true

print_status "Deployment completed successfully!"
echo "📊 Application is running on port 3000"
echo "🔍 Check logs: pm2 logs"
echo "📈 Monitor: pm2 monit"
