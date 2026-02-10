# Proxy Testing Configuration

This document describes the proxy testing implementation and configuration options.

## Overview

The proxy testing functionality performs real HTTP/HTTPS requests through proxies to verify connectivity and health. It supports:

- **HTTP/HTTPS proxies** - Using `https-proxy-agent`
- **SOCKS4/SOCKS4A/SOCKS5 proxies** - Using `socks-proxy-agent`

## Environment Variables

Configure proxy testing behavior using the following environment variables:

### `PROXY_TEST_ENDPOINT`

**Default:** `https://httpbin.org/ip`

The HTTP endpoint to use for testing proxy connectivity. This endpoint should:
- Return a simple JSON response (preferably with IP information)
- Be accessible via HTTP/HTTPS
- Respond quickly (< 10 seconds)

**Examples:**
```bash
# Use default (httpbin.org)
PROXY_TEST_ENDPOINT=https://httpbin.org/ip

# Use custom endpoint
PROXY_TEST_ENDPOINT=https://api.ipify.org?format=json

# Use internal endpoint (for testing)
PROXY_TEST_ENDPOINT=https://internal-api.example.com/health
```

### `PROXY_TEST_TIMEOUT_MS`

**Default:** `10000` (10 seconds)

Maximum time to wait for a proxy test request to complete, in milliseconds.

**Examples:**
```bash
# 5 second timeout
PROXY_TEST_TIMEOUT_MS=5000

# 30 second timeout (for slow proxies)
PROXY_TEST_TIMEOUT_MS=30000
```

### `PROXY_TEST_RETRIES`

**Default:** `2`

Number of retry attempts if a proxy test fails. The system will retry up to this many times before marking the proxy as unhealthy.

**Examples:**
```bash
# No retries (fail fast)
PROXY_TEST_RETRIES=0

# Retry 3 times
PROXY_TEST_RETRIES=3
```

### `PROXY_TEST_RETRY_DELAY_MS`

**Default:** `1000` (1 second)

Delay between retry attempts, in milliseconds.

**Examples:**
```bash
# 500ms delay
PROXY_TEST_RETRY_DELAY_MS=500

# 2 second delay
PROXY_TEST_RETRY_DELAY_MS=2000
```

## Security Considerations

### 1. Test Endpoint Selection

- **Public endpoints** (e.g., `httpbin.org`): Safe for testing, but may expose your proxy IPs to third parties
- **Internal endpoints**: More secure, but requires network access
- **Self-hosted endpoints**: Most secure, full control over logging and data

**Recommendation:** Use a self-hosted or internal endpoint in production to avoid exposing proxy IPs.

### 2. Timeout Configuration

Set appropriate timeouts to prevent:
- Resource exhaustion from hanging connections
- Slow proxy detection delays
- Denial of service from malicious proxies

**Recommendation:** Use 5-10 seconds for most cases, increase only if you have slow but reliable proxies.

### 3. Retry Logic

Retries help with flaky proxies but can:
- Increase load on test endpoints
- Delay failure detection
- Consume more resources

**Recommendation:** Use 1-2 retries for production, 0 for fast-fail scenarios.

### 4. SSL/TLS Certificate Validation

The implementation currently allows self-signed certificates (`rejectUnauthorized: false`) for testing purposes. In production:

- **Option 1:** Use endpoints with valid SSL certificates
- **Option 2:** Add certificate validation with custom CA certificates
- **Option 3:** Use internal endpoints with self-signed certs (if network is trusted)

**Recommendation:** Use valid SSL certificates or configure custom CA certificates for production.

## Testing

### Manual Testing via API

```bash
# Test a proxy by ID
curl -X POST http://localhost:3000/api/proxies/{proxy-id}/test \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Integration Testing Script

```bash
# Test with existing proxy
npm run test:proxy-integration <proxy-id>

# Test with new proxy (requires env vars)
TEST_PROXY_HOST=proxy.example.com \
TEST_PROXY_PORT=8080 \
TEST_PROXY_USERNAME=user \
TEST_PROXY_PASSWORD=pass \
npm run test:proxy-integration
```

### Environment Setup for Testing

Create a `.env` file or set environment variables:

```bash
# Database connection (required)
DATABASE_URL=postgresql://user:password@localhost:5432/telegram_platform

# Proxy test configuration (optional)
PROXY_TEST_ENDPOINT=https://httpbin.org/ip
PROXY_TEST_TIMEOUT_MS=10000
PROXY_TEST_RETRIES=2
PROXY_TEST_RETRY_DELAY_MS=1000

# Test proxy credentials (for integration test script)
TEST_PROXY_HOST=proxy.example.com
TEST_PROXY_PORT=8080
TEST_PROXY_USERNAME=testuser
TEST_PROXY_PASSWORD=testpass
```

## Implementation Details

### Supported Proxy Types

- `HTTP` - HTTP proxy
- `HTTPS` - HTTPS proxy (tunneled)
- `SOCKS4` - SOCKS4 proxy
- `SOCKS4A` - SOCKS4A proxy (with DNS resolution)
- `SOCKS5` - SOCKS5 proxy
- `SOCKS5_WITH_UDP` - SOCKS5 proxy with UDP support

### Test Flow

1. **Load proxy configuration** from database
2. **Create proxy agent** based on proxy type
3. **Make HTTP request** through proxy to test endpoint
4. **Extract IP information** from response (if available)
5. **Retry on failure** (if configured)
6. **Update proxy health metrics** in database
7. **Log test results** to `proxyHealthLog` table

### Error Handling

The implementation handles common proxy errors:

- `ECONNREFUSED` - Proxy server is down or unreachable
- `ETIMEDOUT` / `ECONNRESET` - Connection timeout
- `ENOTFOUND` - Proxy hostname cannot be resolved
- `EPROTO` / `CERT_HAS_EXPIRED` - SSL/TLS handshake failures
- HTTP errors (4xx, 5xx) - Proxy or endpoint errors

### Health Score Calculation

- **Successful test**: Health score increases to at least 80 (max 100)
- **Failed test**: Health score decreases to at most 20 (min 0)
- **Existing score preserved**: If proxy already has a score, it's adjusted within bounds

## Troubleshooting

### Proxy Test Always Fails

1. **Check proxy credentials**: Verify username/password are correct
2. **Verify proxy is accessible**: Test proxy manually with `curl` or `wget`
3. **Check firewall rules**: Ensure proxy server allows connections from your application
4. **Review timeout settings**: Increase `PROXY_TEST_TIMEOUT_MS` if proxy is slow
5. **Check endpoint accessibility**: Verify test endpoint is reachable without proxy

### Slow Test Performance

1. **Reduce timeout**: Lower `PROXY_TEST_TIMEOUT_MS` for faster failure detection
2. **Disable retries**: Set `PROXY_TEST_RETRIES=0` for fast-fail scenarios
3. **Use faster endpoint**: Choose a test endpoint with low latency
4. **Parallel testing**: Test multiple proxies concurrently (not yet implemented)

### False Positives

1. **Increase retries**: Set `PROXY_TEST_RETRIES=3` or higher
2. **Increase retry delay**: Set `PROXY_TEST_RETRY_DELAY_MS=2000` or higher
3. **Use more reliable endpoint**: Choose a stable test endpoint
4. **Review error messages**: Check `proxyHealthLog` table for specific error details

## Future Enhancements

- [ ] Support for custom CA certificates
- [ ] Parallel proxy testing
- [ ] Proxy performance benchmarking
- [ ] Integration with TDLib proxy testing
- [ ] Custom test endpoints per proxy
- [ ] Proxy rotation testing
- [ ] Geographic IP verification
