import { describe, expect, it } from 'vitest';
import { has, getEnumValueIfExists } from './enum';

describe('enum utils', () => {
  describe('has', () => {
    it('should return true for existing property', () => {
      const obj = { foo: 'bar' };
      expect(has(obj, 'foo')).toBe(true);
    });

    it('should return false for non-existing property', () => {
      const obj = { foo: 'bar' };
      expect(has(obj, 'baz')).toBe(false);
    });

    it('should work with inherited properties', () => {
      const parent = { foo: 'bar' };
      const child = Object.create(parent);
      child.baz = 'qux';

      expect(has(child, 'baz')).toBe(true);
      expect(has(child, 'foo')).toBe(false);
    });
  });

  describe('getEnumValueIfExists', () => {
    enum TestEnum {
      FOO = 'foo',
      BAR = 'bar',
      BAZ = 'baz',
    }

    it('should return enum value if exists', () => {
      expect(getEnumValueIfExists(TestEnum, 'foo')).toBe('foo');
      expect(getEnumValueIfExists(TestEnum, 'bar')).toBe('bar');
      expect(getEnumValueIfExists(TestEnum, 'baz')).toBe('baz');
    });

    it('should return null if value does not exist', () => {
      expect(getEnumValueIfExists(TestEnum, 'INVALID')).toBeNull();
      expect(getEnumValueIfExists(TestEnum, '')).toBeNull();
    });

    it('should handle case sensitivity', () => {
      expect(getEnumValueIfExists(TestEnum, 'FOO')).toBeNull();
      expect(getEnumValueIfExists(TestEnum, 'foo')).toBe('foo');
    });

    it('should memoize inverted enum', () => {
      const result1 = getEnumValueIfExists(TestEnum, 'foo');
      const result2 = getEnumValueIfExists(TestEnum, 'foo');
      expect(result1).toBe(result2);
    });

    it('should work with empty object', () => {
      const emptyEnum = {};
      expect(getEnumValueIfExists(emptyEnum, 'ANY')).toBeNull();
    });

    it('should handle string enums', () => {
      enum StringEnum {
        ONE = '1',
        TWO = '2',
      }
      expect(getEnumValueIfExists(StringEnum, '1')).toBe('1');
      expect(getEnumValueIfExists(StringEnum, '2')).toBe('2');
      expect(getEnumValueIfExists(StringEnum, '3')).toBeNull();
    });

    it('should handle numeric-like string enums', () => {
      const numericLikeEnum = {
        ZERO: '0',
        ONE: '1',
        TWO: '2',
      };
      expect(getEnumValueIfExists(numericLikeEnum, '0')).toBe('0');
      expect(getEnumValueIfExists(numericLikeEnum, '1')).toBe('1');
      expect(getEnumValueIfExists(numericLikeEnum, '3')).toBeNull();
    });
  });
});
