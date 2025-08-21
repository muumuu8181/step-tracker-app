import { describe, it, expect } from 'vitest';
import { greet } from '@core/domain/greeting';

describe('greet function', () => {
  it('should return greeting message with name', () => {
    const result = greet('World');
    expect(result).toBe('Hello, World!');
  });

  it('should throw error for empty name', () => {
    expect(() => greet('')).toThrow('Name cannot be empty');
  });

  it('should throw error for whitespace only name', () => {
    expect(() => greet('   ')).toThrow('Name cannot be empty');
  });
});