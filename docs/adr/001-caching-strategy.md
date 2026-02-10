# ADR 001: Caching Strategy

## Status
Accepted

## Context
The application needs to reduce database load and improve response times for frequently accessed data like user profiles, licenses, and proxy configurations.

## Decision
Implement Redis-based caching using cache-aside pattern with:
- TTL-based expiration (30 minutes for users, 1 hour for licenses, 10 minutes for proxies)
- Automatic cache invalidation on updates
- Fallback to database on cache errors
- Metrics tracking for cache hits/misses

## Consequences
- **Positive**: Reduced database load, faster response times
- **Negative**: Potential stale data (mitigated by TTL and invalidation)
- **Risk**: Cache inconsistency (handled by invalidation on writes)

## Implementation
- CacheService with Redis backend
- Integration in UsersService, LicensesService, ProxiesService
- Cache metrics via Prometheus
