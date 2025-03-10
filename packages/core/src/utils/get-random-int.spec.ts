import { describe, it, expect } from 'vitest';
import { getRandomInt } from './get-random-int';

describe('getRandomInt tests', () => {
  it('should return an integer between min and max', () => {
    expect([100, 101].includes(getRandomInt(100, 101))).toBeTruthy();
    expect([-101, -100].includes(getRandomInt(-101, -100))).toBeTruthy();

    // Test larger ranges
    const result = getRandomInt(1, 1000);
    expect(result).toBeGreaterThanOrEqual(1);
    expect(result).toBeLessThanOrEqual(1000);
    expect(Number.isInteger(result)).toBe(true);
  });

  it('should handle edge cases', () => {
    // Same min and max
    expect(getRandomInt(5, 5)).toBe(5);

    // Test with integer inputs
    const result = getRandomInt(2, 3);
    expect(result).toBeGreaterThanOrEqual(2);
    expect(result).toBeLessThanOrEqual(3);
    expect(Number.isInteger(result)).toBe(true);
  });

  it('should throw if not a valid integer', () => {
    expect(() => getRandomInt(NaN, 100)).toThrow(/min/i);
    expect(() => getRandomInt(10, {} as unknown as number)).toThrow(/max/i);
    expect(() => getRandomInt(Infinity, 100)).toThrow(/min/i);
    expect(() => getRandomInt(10, -Infinity)).toThrow(/max/i);
    expect(() => getRandomInt(1.1, 5)).toThrow(/min/i);
    expect(() => getRandomInt(1, 5.5)).toThrow(/max/i);
  });

  it('should throw if min > max', () => {
    expect(() => getRandomInt(100, 10)).toThrow(/greater/i);
    expect(() => getRandomInt(0, -1)).toThrow(/greater/i);
  });
});
