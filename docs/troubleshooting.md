# Troubleshooting Guide

## Common Issues and Solutions

### Database Connection Issues

**Problem**: Cannot connect to database
```
Error: P1001: Can't reach database server
```

**Solutions**:
1. Verify DATABASE_URL in .env file
2. Check PostgreSQL is running: `sudo systemctl status postgresql`
3. Verify network connectivity
4. Check firewall rules
5. Verify connection pool settings in DATABASE_URL

### Redis Connection Issues

**Problem**: Redis connection failed
```
Error: Redis connection error
```

**Solutions**:
1. Verify REDIS_URL in .env file
2. Check Redis is running: `redis-cli ping`
3. Verify Redis password if configured
4. Check Redis memory limits

### Port Already in Use

**Problem**: Port 3000 already in use
```
Error: listen EADDRINUSE: address already in use :::3000
```

**Solutions**:
1. Change PORT in .env file
2. Kill process using port: `lsof -ti:3000 | xargs kill`
3. Use different port: `PORT=3001 npm run start:dev`

### Prisma Client Generation Issues

**Problem**: Prisma client not generated
```
Error: @prisma/client did not initialize yet
```

**Solutions**:
1. Run `npx prisma generate`
2. Verify schema.prisma is valid
3. Check Prisma version compatibility

### Migration Issues

**Problem**: Migration failed
```
Error: Migration failed to apply
```

**Solutions**:
1. Check database connection
2. Verify migration files are valid
3. Check for conflicting migrations
4. Review migration logs
5. Use `npx prisma migrate resolve` to mark migrations as applied

### Memory Issues

**Problem**: Out of memory errors
```
Error: JavaScript heap out of memory
```

**Solutions**:
1. Increase Node.js memory: `NODE_OPTIONS=--max-old-space-size=4096`
2. Reduce PM2 instance count
3. Check for memory leaks
4. Monitor with `pm2 monit`

### Rate Limiting Issues

**Problem**: Too many requests error
```
Error: ThrottlerException: Too Many Requests
```

**Solutions**:
1. Wait for rate limit window to reset
2. Check rate limit configuration
3. Use API keys for higher limits
4. Implement request batching

### Cache Issues

**Problem**: Stale cache data

**Solutions**:
1. Clear cache: `redis-cli FLUSHDB`
2. Check cache TTL settings
3. Verify cache invalidation on updates
4. Monitor cache hit rates

## Performance Issues

### Slow API Responses

1. Check database query performance
2. Review slow query logs
3. Verify indexes are being used
4. Check Redis cache hit rate
5. Monitor PM2 process metrics

### High Memory Usage

1. Check for memory leaks
2. Review PM2 memory limits
3. Monitor with `pm2 monit`
4. Restart processes if needed

## Getting Help

1. Check logs: `pm2 logs`
2. Review error messages
3. Check health endpoint: `GET /api/health/detailed`
4. Open an issue with:
   - Error message
   - Steps to reproduce
   - Environment details
   - Relevant logs
