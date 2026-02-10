#!/bin/bash

# Health Check Script
# Usage: ./scripts/health-check.sh

set -e

HEALTH_URL="http://localhost:3000/api/health"
DETAILED_URL="http://localhost:3000/api/health/detailed"

echo "🏥 Running health checks..."

# Check PM2 processes
echo "Checking PM2 processes..."
if ! pm2 list | grep -q "online"; then
    echo "❌ PM2 processes are not running"
    exit 1
fi
echo "✓ PM2 processes are running"

# Check API health endpoint
echo "Checking API health..."
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" $HEALTH_URL || echo "000")
if [ "$HTTP_CODE" != "200" ]; then
    echo "❌ API health check failed (HTTP $HTTP_CODE)"
    exit 1
fi
echo "✓ API is healthy"

# Check detailed health
echo "Checking detailed health..."
DETAILED_HEALTH=$(curl -s $DETAILED_URL)
echo "$DETAILED_HEALTH" | jq '.' || echo "$DETAILED_HEALTH"

# Check database
echo "Checking database connection..."
if ! PGPASSWORD=$DB_PASSWORD psql -h localhost -U $DB_USER -d $DB_NAME -c "SELECT 1" > /dev/null 2>&1; then
    echo "❌ Database connection failed"
    exit 1
fi
echo "✓ Database is connected"

# Check Redis
echo "Checking Redis connection..."
if ! redis-cli -h localhost ping > /dev/null 2>&1; then
    echo "❌ Redis connection failed"
    exit 1
fi
echo "✓ Redis is connected"

# Check disk space
echo "Checking disk space..."
DISK_USAGE=$(df -h / | awk 'NR==2 {print $5}' | sed 's/%//')
if [ "$DISK_USAGE" -gt 85 ]; then
    echo "⚠️  Disk usage is high: ${DISK_USAGE}%"
else
    echo "✓ Disk usage: ${DISK_USAGE}%"
fi

# Check memory
echo "Checking memory..."
MEM_USAGE=$(free | awk 'NR==2{printf "%.0f", $3*100/$2}')
if [ "$MEM_USAGE" -gt 90 ]; then
    echo "⚠️  Memory usage is high: ${MEM_USAGE}%"
else
    echo "✓ Memory usage: ${MEM_USAGE}%"
fi

echo ""
echo "✅ All health checks passed!"
