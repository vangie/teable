import { describe, expect, it } from 'vitest';
import { replaceSuffix } from './replace-suffix';

describe('replaceSuffix', () => {
  const baseFilePath = '/file.jpg';
  const baseQueryParam = '?size=large';
  const baseHash = '#section1';
  const storageUrlBase = 'https://storage.com/prefix';
  const storageUrlWithTrailingSlash = `${storageUrlBase}/`;
  const exampleUrlBase = 'https://example.com';
  const specialStorageUrlBase = 'https://storage.com/prefix-with-special@chars';
  const specialFilePathBase = '/path/to/file-with-special@chars.jpg';
  const complexStorageUrlBase = 'https://storage-service.net/custom/prefix';

  const testCases = [
    {
      description: 'should replace suffix correctly with basic URLs',
      originalUrl: `${exampleUrlBase}/path/file.jpg`,
      storagePrefix: storageUrlBase,
      expected: `${storageUrlBase}/path/file.jpg`,
    },
    {
      description: 'should handle URLs with query parameters and hash',
      originalUrl: `${exampleUrlBase}/path/file.jpg${baseQueryParam}${baseHash}`,
      storagePrefix: storageUrlBase,
      expected: `${storageUrlBase}/path/file.jpg${baseQueryParam}${baseHash}`,
    },
    {
      description: 'should handle storage prefix without trailing slash',
      originalUrl: `${exampleUrlBase}${baseFilePath}`,
      storagePrefix: storageUrlBase,
      expected: `${storageUrlBase}/file.jpg`,
    },
    {
      description: 'should handle storage prefix with trailing slash',
      originalUrl: `${exampleUrlBase}${baseFilePath}`,
      storagePrefix: storageUrlWithTrailingSlash,
      expected: `${storageUrlBase}/file.jpg`,
    },
    {
      description: 'should handle original URL without leading slash',
      originalUrl: `${exampleUrlBase}/path/file.jpg`,
      storagePrefix: storageUrlBase,
      expected: `${storageUrlBase}/path/file.jpg`,
    },
    {
      description: 'should handle complex paths and different domains',
      originalUrl: `${exampleUrlBase}/path/to/deep/file.jpg`,
      storagePrefix: complexStorageUrlBase,
      expected: `${complexStorageUrlBase}/path/to/deep/file.jpg`,
    },
    {
      description: 'should handle empty query strings',
      originalUrl: `${exampleUrlBase}${baseFilePath}?`,
      storagePrefix: storageUrlBase,
      expected: `${storageUrlBase}/file.jpg`,
    },
    {
      description: 'should handle empty hashes',
      originalUrl: `${exampleUrlBase}${baseFilePath}#`,
      storagePrefix: storageUrlBase,
      expected: `${storageUrlBase}/file.jpg`,
    },
    {
      description: 'should handle storage prefix with special characters',
      originalUrl: `${exampleUrlBase}${baseFilePath}`,
      storagePrefix: specialStorageUrlBase,
      expected: `${specialStorageUrlBase}/file.jpg`,
    },
    {
      description: 'should handle original URL with special characters in path',
      originalUrl: `${exampleUrlBase}${specialFilePathBase}`,
      storagePrefix: storageUrlBase,
      expected: `${storageUrlBase}/path/to/file-with-special@chars.jpg`,
    },
    {
      description: 'should handle original URL with multiple query parameters',
      originalUrl: `${exampleUrlBase}/path/file.jpg?size=large&color=blue`,
      storagePrefix: storageUrlBase,
      expected: `${storageUrlBase}/path/file.jpg?size=large&color=blue`,
    },
    {
      description: 'should handle original URL with multiple hashes',
      originalUrl: `${exampleUrlBase}/path/file.jpg#section1#section2`,
      storagePrefix: storageUrlBase,
      expected: `${storageUrlBase}/path/file.jpg#section1#section2`,
    },
  ];

  testCases.forEach(({ description, originalUrl, storagePrefix, expected }) => {
    it(description, () => {
      const result = replaceSuffix(originalUrl, storagePrefix);
      expect(result).toBe(expected);
    });
  });
});
