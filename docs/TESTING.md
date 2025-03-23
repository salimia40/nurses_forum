# Testing Guide

This project uses Bun's built-in test runner with Jest-compatible APIs for testing.

## Running Tests

You can run tests using the following commands:

```bash
# Run all tests
bun test

# Run tests in watch mode (reruns on file changes)
bun test --watch

# Run tests with coverage report
bun test --coverage
```

## Test Structure

Tests are organized into the following directories:

- `tests/unit/`: Unit tests for individual functions and components
- `tests/integration/`: Tests that verify multiple components work together
- `tests/e2e/`: End-to-end tests that simulate user flows

## Writing Tests

### Unit Test Example

```typescript
import { describe, expect, test } from 'bun:test';

function sum(a: number, b: number): number {
  return a + b;
}

describe('sum function', () => {
  test('adds two numbers correctly', () => {
    expect(sum(1, 2)).toBe(3);
  });
});
```

### Component Test Example

```typescript
import { describe, expect, test } from 'bun:test';
import { render, screen } from '@testing-library/react';
import { Button } from '../src/components/ui/button';

describe('Button component', () => {
  test('renders correctly', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });
});
```

## Test Utilities

- **Test Globals**: `describe`, `test`, `expect`, `beforeEach`, `afterEach`, etc.
- **Mocking**: Use `mock` and `spyOn` for mocking functions and modules
- **React Testing Library**: For rendering and interacting with React components
- **Jest DOM**: For enhanced DOM element matchers

## Best Practices

1. **Test Isolation**: Each test should be independent and not rely on other tests
2. **Mock External Dependencies**: Use mocks for API calls, databases, etc.
3. **Focus on Behavior**: Test what functions do, not how they do it
4. **Keep Tests Simple**: Tests should be easy to read and understand
5. **Test Edge Cases**: Don't just test the "happy path"
