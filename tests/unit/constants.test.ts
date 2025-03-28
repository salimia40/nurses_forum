import { describe, expect, test } from 'bun:test';
import { APP_NAME, APP_VERSION, THEMES } from '@/server/utils/constants';

describe('Constants', () => {
  test('APP_NAME is correctly defined', () => {
    expect(APP_NAME).toBe('Nurses Forum');
  });

  test('APP_VERSION is correctly defined', () => {
    expect(APP_VERSION).toBe('0.1.0');
  });

  test('THEMES contains light and dark options', () => {
    expect(THEMES.LIGHT).toBe('light');
    expect(THEMES.DARK).toBe('dark');
  });
});
