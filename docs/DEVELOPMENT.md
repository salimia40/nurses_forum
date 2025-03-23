# Development Guide

This document contains information and best practices for developing the Nurses Forum application.

## Project Structure

```text
nurses_forum/
├── src/              # Source code
│   ├── components/   # UI components
│   ├── utils/        # Utility functions
│   └── ...
├── tests/            # Test files
│   ├── unit/         # Unit tests
│   ├── integration/  # Integration tests
│   └── e2e/          # End-to-end tests
└── ...
```

## Import Path Aliases

This project uses TypeScript path aliases to make imports cleaner and more manageable.

### Using the `@/` Alias

The `@/` path alias points to the `src/` directory, allowing you to import files from the source directory without using relative paths:

```typescript
// Instead of this (relative import)
import { Button } from '../../components/ui/button';

// Use this (path alias)
import { Button } from '@/components/ui/button';
```

This is particularly useful for deeply nested files where relative paths become unwieldy.

### Configuration

Path aliases are configured in two places:

1. **tsconfig.json** - For TypeScript type checking:

   ```json
   {
     "compilerOptions": {
       "baseUrl": ".",
       "paths": {
         "@/*": ["./src/*"]
       }
     }
   }
   ```

2. **bunfig.toml** - For Bun's runtime resolution:

   ```toml
   [import]
   root = "."

   [resolver]
   extensions = [".ts", ".tsx", ".js", ".jsx", ".json"]
   main-fields = ["browser", "module", "main"]
   ```

## Test Coverage

This project uses Bun's built-in test coverage tools to track test coverage metrics.

### Coverage Configuration

The test coverage configuration is defined in `bunfig.toml`:

```toml
[test]
coverage = true
coverage-exclude = ["**/src/components/ui/**"]
```

UI components in `src/components/ui` are excluded from coverage reports because:

- These are typically pre-built components (e.g., from Shadcn/UI)
- They're considered stable and pre-tested
- Their implementation details aren't the focus of our application testing

### Running Coverage Reports

To generate a coverage report:

```bash
bun test --coverage
```

This will create a coverage report in the `coverage` directory.

## Best Practices

- Always use the `@/` alias for imports from the `src/` directory
- Use relative imports only for files in the same directory or adjacent directories
- When creating new files, consider their location in the directory structure to optimize import patterns
- When writing tests, focus on covering business logic and application-specific components
- UI library components don't need to be tested, as they're excluded from coverage

## Continuous Integration

This project uses GitHub Actions for continuous integration. The CI pipeline runs automatically on:

- Every push to the `main` or `master` branch
- Every pull request to the `main` or `master` branch

### CI Workflow

The CI pipeline performs the following checks:

1. **Code Linting**: Ensures code follows the project's style guidelines

   ```bash
   bun run lint
   ```

2. **Tests**: Runs all tests to ensure functionality works as expected

   ```bash
   bun test
   ```

### Running Tests Locally

Before pushing changes, you should run the same checks locally:

```bash
# Run linting
bun run lint

# Run tests
bun test
```

This helps catch issues before they reach CI, speeding up your development process.
