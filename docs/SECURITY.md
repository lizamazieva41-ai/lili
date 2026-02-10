# Security Guide for TDLib Integration

## Overview

This document outlines security best practices and requirements for the TDLib integration in production environments.

## Encryption Requirements

### Session Data Encryption

**Status**: ✅ Implemented (configurable via `TDLIB_SESSION_ENCRYPTION_ENABLED`)

TDLib sessions contain sensitive information including:
- Client IDs
- Phone numbers
- Account IDs
- User IDs

**Configuration**:
```bash
# Enable session encryption (default: true)
TDLIB_SESSION_ENCRYPTION_ENABLED=true

# Set encryption key (REQUIRED in production)
ENCRYPTION_KEY=<32-byte hex string>
```

**Implementation**:
- Sessions stored in Redis are encrypted using AES-256-GCM
- Database backups are also encrypted
- Encryption is transparent to application code

### Proxy Password Encryption

**Status**: ✅ Implemented

Proxy passwords are encrypted before storage in the database.

**Configuration**:
```bash
# Encryption key (same as session encryption)
ENCRYPTION_KEY=<32-byte hex string>
```

**Implementation**:
- Passwords encrypted using AES-256-GCM
- Automatic decryption when reading from database
- Backward compatible with plaintext passwords (for migration)

## Environment Variables Security

### Required Production Variables

```bash
# Encryption (CRITICAL)
ENCRYPTION_KEY=<generate with: openssl rand -hex 32>

# Database
DATABASE_URL=<encrypted connection string>

# Redis
REDIS_URL=<encrypted connection string>

# JWT
JWT_SECRET=<strong random secret>

# TDLib Configuration
TDLIB_SESSION_ENCRYPTION_ENABLED=true
TDLIB_SESSION_TTL_SECONDS=604800  # 7 days
TDLIB_SESSION_DB_BACKUP=true
```

### Security Checklist

- [ ] `ENCRYPTION_KEY` is set and unique per environment
- [ ] All `.env` files are in `.gitignore`
- [ ] Environment variables are managed via secret management system
- [ ] No secrets committed to version control
- [ ] Database credentials are encrypted
- [ ] Redis credentials are encrypted

## Session Management Security

### Session Storage

- **Redis**: Encrypted session data with TTL
- **Database**: Encrypted backup for persistence
- **TTL**: Configurable expiration (default: 7 days)

### Session Revocation

Sessions can be revoked via:
- API endpoint: `DELETE /tdlib/sessions/:sessionId`
- Automatic cleanup of expired sessions
- Account-level session revocation

### Best Practices

1. **Rotate encryption keys periodically**
   - Plan for key rotation without service interruption
   - Support multiple keys during transition

2. **Monitor session activity**
   - Track last activity timestamps
   - Alert on suspicious patterns

3. **Limit session lifetime**
   - Use appropriate TTL based on use case
   - Implement session refresh mechanism

## Proxy Security

### Proxy Credentials

- Passwords encrypted at rest
- Credentials never logged
- Secure transmission to TDLib

### Proxy Rotation

- Automatic rotation on failure
- Health check integration
- Secure credential updates

## Network Security

### TDLib Communication

- All communication with Telegram servers is encrypted (TDLib handles this)
- Proxy connections use encrypted protocols (SOCKS5/HTTPS)

### Internal Communication

- Use TLS for all internal API calls
- Implement rate limiting
- Use authentication tokens

## Code Security

### Input Validation

- All user inputs validated via DTOs
- Phone number format validation
- Rate limiting on authentication endpoints

### Error Handling

- No sensitive data in error messages
- Structured logging without secrets
- Error messages don't expose internal structure

## Monitoring and Auditing

### Security Events

Monitor for:
- Failed authentication attempts
- Session creation/revocation
- Proxy rotation events
- Encryption/decryption errors

### Audit Logging

Log (without sensitive data):
- All authentication attempts
- Session lifecycle events
- Proxy configuration changes
- Account linking/unlinking

## Production Deployment Security

### Pre-Deployment

1. **Run security audit**
   ```bash
   npm audit
   npm run security:check
   ```

2. **Review dependencies**
   - Check for known vulnerabilities
   - Update to secure versions

3. **Validate configuration**
   ```bash
   bash scripts/prepare-production.sh
   ```

### Deployment

1. **Use secure secrets management**
   - AWS Secrets Manager
   - HashiCorp Vault
   - Kubernetes Secrets

2. **Enable all security features**
   ```bash
   TDLIB_SESSION_ENCRYPTION_ENABLED=true
   ```

3. **Configure firewall rules**
   - Limit access to necessary ports only
   - Use VPN for admin access

### Post-Deployment

1. **Verify encryption**
   - Check session data in Redis (should be encrypted)
   - Verify database backups are encrypted

2. **Test security features**
   - Session revocation
   - Proxy rotation
   - Error handling

## Incident Response

### Security Incident Checklist

1. **Identify breach**
   - Review logs
   - Check monitoring alerts

2. **Contain impact**
   - Revoke affected sessions
   - Rotate encryption keys
   - Disable affected accounts

3. **Investigate**
   - Preserve logs
   - Document timeline
   - Identify root cause

4. **Remediate**
   - Fix vulnerability
   - Update security measures
   - Notify affected users

## Compliance

### Data Protection

- Session data encrypted at rest and in transit
- Personal data (phone numbers) encrypted
- Automatic cleanup of expired data

### Access Control

- Role-based access control (RBAC)
- API authentication required
- Session ownership validation

## Key Rotation Procedure

### Encryption Key Rotation

1. **Generate new key**
   ```bash
   openssl rand -hex 32
   ```

2. **Update environment variable**
   ```bash
   ENCRYPTION_KEY=<new-key>
   ```

3. **Restart services**
   - New sessions will use new key
   - Old sessions will be decrypted with old key (if supported)

4. **Migrate existing data**
   - Re-encrypt sessions with new key
   - Update proxy passwords

## References

- [TDLib Security Documentation](https://core.telegram.org/tdlib/docs/td_docs_security.html)
- [NestJS Security Best Practices](https://docs.nestjs.com/security/authentication)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
