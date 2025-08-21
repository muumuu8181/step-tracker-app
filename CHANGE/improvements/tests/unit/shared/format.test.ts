import { describe, it, expect } from 'vitest';
import { formatMessage, capitalize } from '@shared/utils/format';

describe('format utilities', () => {
  describe('formatMessage', () => {
    it('should add emoji prefix to message', () => {
      const result = formatMessage('test message');
      expect(result).toBe('📝 test message');
    });
  });

  describe('capitalize', () => {
    it('should capitalize first letter', () => {
      const result = capitalize('hello');
      expect(result).toBe('Hello');
    });

    it('should handle empty string', () => {
      const result = capitalize('');
      expect(result).toBe('');
    });
  });
});