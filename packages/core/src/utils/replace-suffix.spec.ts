import { describe, expect, it } from 'vitest';
import { replaceSuffix } from './replace-suffix';

describe('replaceSuffix', () => {
  it('should correctly replace suffix with simple urls', () => {
    const original = 'https://example.com/path/file.jpg';
    const prefix = 'https://storage.com/prefix';
    const result = replaceSuffix(original, prefix);
    expect(result).toBe('https://storage.com/prefix/path/file.jpg');
  });

  it('should handle urls with query parameters and hash', () => {
    const original = 'https://example.com/path/file.jpg?size=large#section1';
    const prefix = 'https://storage.com/prefix';
    const result = replaceSuffix(original, prefix);
    expect(result).toBe('https://storage.com/prefix/path/file.jpg?size=large#section1');
  });

  it('should handle prefix urls with trailing slash', () => {
    const original = 'https://example.com/file.jpg';
    const prefix = 'https://storage.com/prefix/';
    const result = replaceSuffix(original, prefix);
    expect(result).toBe('https://storage.com/prefix/file.jpg');
  });

  it('should handle original urls without leading slash', () => {
    const original = 'https://example.com/path/file.jpg';
    const prefix = 'https://storage.com/prefix';
    const result = replaceSuffix(original, prefix);
    expect(result).toBe('https://storage.com/prefix/path/file.jpg');
  });

  it('should handle empty paths', () => {
    const original = 'https://example.com';
    const prefix = 'https://storage.com/prefix';
    const result = replaceSuffix(original, prefix);
    expect(result).toBe('https://storage.com/prefix/');
  });

  it('should handle complex urls with multiple path segments', () => {
    const original = 'https://example.com/path1/path2/path3/file.jpg?param1=value1&param2=value2#section';
    const prefix = 'https://storage.com/prefix1/prefix2';
    const result = replaceSuffix(original, prefix);
    expect(result).toBe('https://storage.com/prefix1/prefix2/path1/path2/path3/file.jpg?param1=value1&param2=value2#section');
  });

  it('should handle different protocols', () => {
    const original = 'http://example.com/file.jpg';
    const prefix = 'https://storage.com/prefix';
    const result = replaceSuffix(original, prefix);
    expect(result).toBe('https://storage.com/prefix/file.jpg');
  });

  it('should handle urls with ports', () => {
    const original = 'https://example.com:8080/file.jpg';
    const prefix = 'https://storage.com:9000/prefix';
    const result = replaceSuffix(original, prefix);
    expect(result).toBe('https://storage.com:9000/prefix/file.jpg');
  });
});
