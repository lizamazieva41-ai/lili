# Telegram Tool Backend

Unified backend for Telegram automation — enterprise-grade with built-in TDLib integration.

## Features

- **TDLib Integration**: Built-in Telegram Database Library with native C++ addon
- **Authentication**: JWT + Telegram OAuth 2.0
- **Session Management**: Secure session lifecycle with Redis
- **Licensing**: Subscription management with feature gating
- **Proxy Management**: HTTP/SOCKS proxy support with health monitoring
- **Job Processing**: BullMQ-based background task processing
- **Account Management**: Telegram account management with activity scoring
- **Campaign Management**: Bulk messaging campaigns with scheduling
- **Analytics**: Comprehensive analytics and reporting
- **API Documentation**: OpenAPI 3.0 with Swagger
- **Health Monitoring**: Comprehensive health checks + Prometheus metrics
- **Security**: Rate limiting, input validation, audit logging

## Tech Stack

- **Framework**: NestJS (Node.js + TypeScript)
- **Database**: PostgreSQL 15+ with Prisma ORM
- **Cache**: Redis 7+
- **TDLib**: Vendored C++ source with native N-API addon
- **Authentication**: JWT + Telegram OAuth
- **Queue**: BullMQ
- **Monitoring**: Prometheus + Grafana
- **Documentation**: Swagger/OpenAPI 3.0
- **Testing**: Jest

## Project Structure

```
telegram-tool-backend/
├── vendor/tdlib/             # TDLib C++ library (vendored)
│   ├── source/               # TDLib source code
│   └── lib/                  # Built shared library (libtdjson.so)
├── native/tdlib/             # Node.js native addon (C++ → N-API)
│   ├── tdlib_addon.cc        # Native binding code
│   └── binding.gyp           # Build configuration
├── src/                      # NestJS TypeScript source
│   ├── tdlib/                # TDLib integration module
│   ├── auth/                 # Authentication module
│   ├── accounts/             # Telegram account management
│   ├── campaigns/            # Campaign management
│   ├── messages/             # Message handling
│   ├── jobs/                 # Background job processing
│   ├── proxies/              # Proxy management
│   ├── analytics/            # Analytics & reporting
│   ├── webhooks/             # Webhook system
│   ├── licenses/             # Licensing system
│   ├── licensing/            # API keys, feature gating
│   ├── common/               # Shared utilities
│   └── config/               # Configuration modules
├── prisma/                   # Database schema & migrations
├── scripts/                  # Build & deployment scripts
├── test/                     # Test suites (unit, integration, e2e)
├── tests/                    # Additional test configurations
├── docs/                     # Documentation
├── monitoring/               # Grafana dashboards & alerts
├── backups/                  # Database backup storage
└── logs/                    # Application logs
```

## Quick Start

### Prerequisites

- Node.js 20+
- PostgreSQL 15+
- Redis 7+
- Linux/macOS environment
- CMake 3.0+, g++/clang++ with C++17 support (for building TDLib)

### Installation

```bash
# Install dependencies
npm install

# Build TDLib and native addon (REQUIRED before running)
npm run ensure:artifacts

# Setup environment variables
cp .env.example .env
# Edit .env with your values

# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev

# Start development server
npm run start:dev
```

### Docker

```bash
# Build and run with Docker Compose (includes PostgreSQL, Redis)
docker compose -f docker-compose.build.yml up --build

# Or build just the Docker image
docker build -t telegram-tool-backend .
```

### Environment Variables

Copy `.env.example` to `.env` and configure:

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | ✅ |
| `REDIS_URL` | Redis connection URL | ✅ |
| `JWT_SECRET` | JWT signing secret | ✅ |
| `TELEGRAM_BOT_TOKEN` | Telegram bot token | ✅ |
| `TDLIB_LIBRARY_PATH` | Path to libtdjson.so | Optional |
| `TDLIB_ADDON_PATH` | Path to tdlib.node | Optional |

See `.env.example` for the complete list.

## API Documentation

Once running, visit `http://localhost:3000/api/docs` for interactive API documentation.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run start:dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start:prod` | Start production server |
| `npm test` | Run unit tests |
| `npm run test:cov` | Tests with coverage |
| `npm run test:e2e` | End-to-end tests |
| `npm run ensure:artifacts` | Build TDLib + native addon |
| `bash scripts/build-tdlib.sh` | Build TDLib from source |
| `npm run build:tdlib-addon` | Build native addon only |

## Health Check

- Basic: `GET /api/health`
- Detailed: `GET /api/health/detailed`
- TDLib: `GET /tdlib/health`
- Metrics: `GET /metrics`

## Documentation

- [Getting Started](GETTING_STARTED.md)
- [Deployment Guide](docs/DEPLOYMENT_GUIDE.md)
- [TDLib Integration](docs/TDLIB_IMPLEMENTATION_SUMMARY.md)
- [Contributing](CONTRIBUTING.md)
- [Troubleshooting](docs/troubleshooting.md)

## License

UNLICENSED
