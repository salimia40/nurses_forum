import { describe, expect, test } from 'bun:test';

// Example utility function to test
function sum(a: number, b: number): number {
  return a + b;
}

describe('Utility functions', () => {
  test('sum adds two numbers correctly', () => {
    expect(sum(1, 2)).toBe(3);
    expect(sum(-1, 1)).toBe(0);
    expect(sum(0, 0)).toBe(0);
  });

  // An example of an async test
  test('async operations work', async () => {
    const result = await Promise.resolve(42);
    expect(result).toBe(42);
  });

  // Using test.each for data-driven tests
  test.each([
    [1, 1, 2],
    [2, 2, 4],
    [3, 3, 6],
  ])('sum(%i, %i) = %i', (a, b, expected) => {
    expect(sum(a, b)).toBe(expected);
  });
});
