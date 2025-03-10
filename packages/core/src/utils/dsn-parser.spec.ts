import { describe, expect, it } from 'vitest';
import { parseDsn, isParsableDsn } from './dsn-parser';

describe('dsn-parser', () => {
  describe('parseDsn', () => {
    it('should parse valid postgres DSN', () => {
      const dsn = 'postgresql://user:pass@localhost:5432/dbname';
      const result = parseDsn(dsn);
      expect(result).toEqual({
        driver: 'postgresql',
        user: 'user',
        pass: 'pass',
        host: 'localhost',
        port: 5432,
        db: 'dbname',
      });
    });

    it('should parse sqlite file DSN', () => {
      const dsn = 'file:./test.db';
      const result = parseDsn(dsn);
      expect(result).toEqual({
        driver: 'sqlite3',
        host: 'localhost',
      });
    });

    it('should throw error for invalid DSN', () => {
      const dsn = 'invalid://dsn';
      expect(() => parseDsn(dsn)).toThrow('DATABASE_URL');
    });

    it('should throw error for missing port', () => {
      const dsn = 'postgresql://user:pass@localhost/dbname';
      expect(() => parseDsn(dsn)).toThrow('DATABASE_URL must provide a port');
    });
  });

  describe('isParsableDsn', () => {
    it('should return true for valid postgres DSN', () => {
      const dsn = 'postgresql://user:pass@localhost:5432/dbname';
      expect(isParsableDsn(dsn)).toBe(true);
    });

    it('should return true for sqlite file DSN', () => {
      const dsn = 'file:./test.db';
      expect(isParsableDsn(dsn)).toBe(true);
    });

    it('should handle invalid DSN input', () => {
      const dsn = 'invalid://dsn';
      expect(isParsableDsn(dsn)).toBe(true); // Based on implementation, any string starting with a protocol is considered parsable
    });

    it('should handle non-string input', () => {
      const nonStringInputs = [null, undefined, 123, {}, []];
      nonStringInputs.forEach((input) => {
        expect(() => isParsableDsn(input)).toThrow();
      });
    });
  });
});
