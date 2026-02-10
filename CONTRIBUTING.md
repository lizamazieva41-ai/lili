# Contributing to Telegram Tool Backend

Thank you for your interest in contributing! This document provides guidelines and instructions for contributing to the unified project `telegram-tool-backend`.

## Code of Conduct

- Be respectful and inclusive
- Focus on constructive feedback
- Follow the project's coding standards

## Development Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/your-org/telegram-tool-backend.git
   cd telegram-tool-backend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Build TDLib (Required)**
   Before running the application, you must build the TDLib shared library and the native addon.

   ```bash
   # Build TDLib from vendored source (vendor/tdlib/source)
   npm run ensure:artifacts
   
   # Or manually:
   # bash scripts/build-tdlib.sh
   # npm run build:tdlib-addon
   ```

4. **Setup environment**

   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

5. **Setup database**

   ```bash
   npx prisma generate
   npx prisma migrate dev
   ```

6. **Start development server**

   ```bash
   npm run start:dev
   ```

## Development Workflow

### Branch Naming

- `feature/description` - New features
- `fix/description` - Bug fixes
- `docs/description` - Documentation updates
- `refactor/description` - Code refactoring

### Commit Messages

Follow conventional commits format:

```
<type>(<scope>): <subject>

<body>

<footer>
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

Example:

```
feat(auth): add JWT token refresh endpoint

Implements token refresh functionality with automatic rotation
and improved security measures.

Closes #123
```

### Pull Request Process

1. Create a feature branch from `main`
2. Make your changes
3. Ensure all tests pass: `npm test`
4. Run linter: `npm run lint`
5. Update documentation if needed
6. Create pull request with clear description

### Code Standards

- Follow TypeScript best practices
- Use ESLint and Prettier (configured)
- Write unit tests for new features
- Maintain >80% test coverage
- Add JSDoc comments for public methods

## Testing

### Run tests

```bash
npm test              # Unit tests
npm run test:cov      # With coverage
npm run test:e2e      # E2E tests
```

### Writing Tests

- Place unit tests in `test/unit/`
- Place integration tests in `test/integration/`
- Place E2E tests in `test/e2e/`
- Use descriptive test names
- Follow AAA pattern (Arrange, Act, Assert)

## Code Review Guidelines

- All PRs require at least one approval
- Address review comments promptly
- Keep PRs focused and reasonably sized
- Update CHANGELOG.md for user-facing changes

## Questions?

Open an issue or contact the maintainers.
