// Jest global setup (runs before each test file).
// Keep this lightweight: only set required env vars so ConfigModule.validate doesn't explode
// when individual tests import modules that depend on config.
process.env.NODE_ENV ||= 'test';
process.env.JWT_SECRET ||= 'test_jwt_secret';
process.env.TELEGRAM_BOT_TOKEN ||= '123456:TEST_BOT_TOKEN';
process.env.DATABASE_URL ||= 'postgresql://test:test@localhost:5432/test';
process.env.REDIS_URL ||= 'redis://localhost:6379';