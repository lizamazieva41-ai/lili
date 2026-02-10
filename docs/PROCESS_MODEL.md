# Process Model - API vs Worker Separation

## Overview

The telegram-platform-backend uses a **separated process model** where:
- **API Server**: Handles HTTP requests, REST API, WebSocket connections
- **Worker Process**: Handles background job processing (BullMQ)

This separation provides:
- Better resource isolation
- Independent scaling
- Better fault tolerance
- Easier monitoring and debugging

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    PM2 Process Manager                   │
└─────────────────────────────────────────────────────────┘
                          │
        ┌─────────────────┴─────────────────┐
        │                                     │
┌───────▼────────┐                  ┌───────▼────────┐
│  API Server    │                  │  Worker Process  │
│  (Cluster)     │                  │  (Fork)         │
│                │                  │                 │
│  - HTTP API    │                  │  - Job Queue   │
│  - WebSocket   │                  │  - Processors  │
│  - Health      │                  │  - Workers     │
│  - Swagger     │                  │                 │
└───────┬────────┘                  └───────┬───────┘
        │                                     │
        └─────────────────┬───────────────────┘
                          │
        ┌─────────────────▼───────────────────┐
        │         Shared Resources             │
        │  - PostgreSQL Database               │
        │  - Redis (Cache + Queue)            │
        │  - TDLib Clients                    │
        └─────────────────────────────────────┘
```

## PM2 Configuration

### Ecosystem File

The `ecosystem.config.js` defines two apps:

1. **telegram-platform-api**: API server (cluster mode)
2. **telegram-platform-worker**: Worker process (fork mode)

### Starting Processes

```bash
# Start both API and worker
pm2 start ecosystem.config.js

# Start only API
pm2 start ecosystem.config.js --only telegram-platform-api

# Start only worker
pm2 start ecosystem.config.js --only telegram-platform-worker

# Start in development mode
pm2 start ecosystem.config.js --env development
```

### Process Management

```bash
# List processes
pm2 list

# Monitor
pm2 monit

# View logs
pm2 logs telegram-platform-api
pm2 logs telegram-platform-worker

# Restart
pm2 restart telegram-platform-api
pm2 restart telegram-platform-worker

# Stop
pm2 stop telegram-platform-api
pm2 stop telegram-platform-worker

# Delete
pm2 delete telegram-platform-api
pm2 delete telegram-platform-worker
```

## API Server

### Entry Point
- **File**: `src/main.ts`
- **Built**: `dist/main.js`
- **Mode**: Cluster (multiple instances)

### Responsibilities
- HTTP REST API endpoints
- WebSocket connections
- Swagger documentation
- Health checks
- Authentication/Authorization

### Health Endpoints
- `GET /api/health` - Basic health check
- `GET /api/health/detailed` - Detailed health with stats
- `GET /api/tdlib/health` - TDLib-specific health

### Scaling
- Uses PM2 cluster mode
- Instances: `max` (one per CPU core)
- Memory limit: 1GB per instance
- Auto-restart on crash

## Worker Process

### Entry Point
- **File**: `src/worker.ts`
- **Built**: `dist/worker.js`
- **Mode**: Fork (single instance)

### Responsibilities
- Process BullMQ jobs
- Handle message sending
- Execute campaigns
- Process Telegram updates
- Background tasks

### Health Monitoring
Workers don't have HTTP endpoints by default, but health can be monitored via:
- Queue metrics (via API server)
- PM2 process status
- Log monitoring
- Redis queue stats

### Scaling
- Single instance (BullMQ handles concurrency internally)
- Memory limit: 2GB
- Concurrency: Configurable per queue (default: 5)
- Auto-restart on crash

## Environment Variables

### Shared Variables
Both processes use the same environment variables:
- `DATABASE_URL`
- `REDIS_URL`
- `JWT_SECRET`
- `ENCRYPTION_KEY`
- `TDLIB_*` variables

### Process-Specific
- `APP_MODE`: `api` or `worker` (set automatically by PM2)
- `PORT`: Only used by API server (default: 3000)

## Deployment

### Production Deployment

1. **Build application**:
   ```bash
   npm run build
   npm run build:tdlib-addon
   ```

2. **Set environment variables**:
   ```bash
   export ENCRYPTION_KEY=$(openssl rand -hex 32)
   export DATABASE_URL=...
   export REDIS_URL=...
   ```

3. **Run pre-deployment check**:
   ```bash
   npm run check:pre-deploy
   ```

4. **Start with PM2**:
   ```bash
   pm2 start ecosystem.config.js --env production
   pm2 save
   pm2 startup
   ```

### Docker Deployment

If using Docker, you can run API and worker in separate containers:

```yaml
# docker-compose.yml
services:
  api:
    build: .
    command: node dist/main.js
    environment:
      - APP_MODE=api
    ports:
      - "3000:3000"
  
  worker:
    build: .
    command: node dist/worker.js
    environment:
      - APP_MODE=worker
    depends_on:
      - api
```

## Monitoring

### PM2 Monitoring

```bash
# Real-time monitoring
pm2 monit

# Process info
pm2 describe telegram-platform-api
pm2 describe telegram-platform-worker

# Metrics
pm2 list
```

### Health Checks

#### API Server
```bash
# Basic health
curl http://localhost:3000/api/health

# Detailed health
curl http://localhost:3000/api/health/detailed
```

#### Worker
Workers are monitored via:
- PM2 process status
- Queue metrics (via API)
- Log analysis

### Metrics

Available metrics:
- `tdlib_active_clients` - Active TDLib clients
- `tdlib_sessions_total` - Total sessions
- `tdlib_queue_depth` - Queue depth
- `tdlib_requests_total` - Request count
- `tdlib_errors_total` - Error count

## Troubleshooting

### API Server Issues

**Problem**: API server not responding
```bash
# Check status
pm2 status telegram-platform-api

# Check logs
pm2 logs telegram-platform-api --lines 100

# Restart
pm2 restart telegram-platform-api
```

**Problem**: High memory usage
```bash
# Check memory
pm2 monit

# Restart to clear memory
pm2 restart telegram-platform-api
```

### Worker Issues

**Problem**: Jobs not processing
```bash
# Check worker status
pm2 status telegram-platform-worker

# Check logs
pm2 logs telegram-platform-worker --lines 100

# Check queue stats (via API)
curl http://localhost:3000/api/health/detailed

# Restart worker
pm2 restart telegram-platform-worker
```

**Problem**: Worker crashes
```bash
# Check error logs
pm2 logs telegram-platform-worker --err --lines 50

# Check restart count
pm2 describe telegram-platform-worker

# If max restarts reached, investigate root cause
```

### Shared Resource Issues

**Problem**: Database connection errors
- Check `DATABASE_URL`
- Verify database is accessible
- Check connection pool settings

**Problem**: Redis connection errors
- Check `REDIS_URL`
- Verify Redis is accessible
- Check Redis memory limits

## Best Practices

1. **Separate Logs**: Use separate log files for API and worker
2. **Monitor Both**: Monitor both processes independently
3. **Scale Appropriately**: Scale API based on HTTP load, worker based on queue depth
4. **Health Checks**: Set up health checks for both processes
5. **Graceful Shutdown**: Both processes handle SIGTERM/SIGINT gracefully
6. **Resource Limits**: Set appropriate memory limits for each process
7. **Error Handling**: Monitor error rates for both processes

## Configuration

### PM2 Ecosystem

Key configuration options:
- `instances`: Number of instances (API: `max`, Worker: `1`)
- `exec_mode`: Execution mode (`cluster` for API, `fork` for worker)
- `max_memory_restart`: Memory limit before restart
- `autorestart`: Auto-restart on crash
- `max_restarts`: Maximum restart attempts
- `min_uptime`: Minimum uptime before considered stable

### Queue Configuration

Worker concurrency is configured in queue processors:
```typescript
// In processor
@Processor('telegram-queue')
export class TelegramProcessor {
  constructor(
    @InjectQueue('telegram-queue') private queue: Queue,
  ) {
    // Concurrency is set in QueueService.createWorker()
    // Default: 5 concurrent jobs
  }
}
```

---

**Last Updated**: 2026-01-27
