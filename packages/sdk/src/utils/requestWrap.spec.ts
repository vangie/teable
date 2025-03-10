import { describe, it, expect, vi, beforeEach } from 'vitest';
import { errorRequestHandler } from '../context';
import { requestWrap } from './requestWrap';

vi.mock('../context', () => ({
  errorRequestHandler: vi.fn(),
}));

describe('requestWrap', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should resolve with the original response on success', async () => {
    const mockResponse = { data: 'test' };
    const mockFn = vi.fn().mockResolvedValue(mockResponse);

    const wrappedFn = requestWrap(mockFn);
    const result = await wrappedFn('arg1', 'arg2');

    expect(result).toBe(mockResponse);
    expect(mockFn).toHaveBeenCalledWith('arg1', 'arg2');
  });

  it('should reject with the original error on failure', async () => {
    const mockError = new Error('test error');
    const mockFn = vi.fn().mockRejectedValue(mockError);

    const wrappedFn = requestWrap(mockFn);

    await expect(wrappedFn('arg1')).rejects.toThrow(mockError);
    expect(mockFn).toHaveBeenCalledWith('arg1');
  });

  it('should call errorRequestHandler on failure', async () => {
    const mockError = new Error('test error');
    const mockFn = vi.fn().mockRejectedValue(mockError);

    const wrappedFn = requestWrap(mockFn);

    await expect(wrappedFn('arg1')).rejects.toThrow(mockError);
    expect(errorRequestHandler).toHaveBeenCalledWith(mockError);
  });

  it('should pass through all arguments to the wrapped function', async () => {
    const mockFn = vi.fn().mockResolvedValue('test');
    const wrappedFn = requestWrap(mockFn);

    await wrappedFn(1, 'two', { three: 3 }, [4]);

    expect(mockFn).toHaveBeenCalledWith(1, 'two', { three: 3 }, [4]);
  });

  it('should maintain the promise chain', async () => {
    const mockFn = vi.fn().mockResolvedValue('test');
    const wrappedFn = requestWrap(mockFn);

    const result = await wrappedFn().then((res) => res + '_modified');

    expect(result).toBe('test_modified');
  });

  it('should handle async functions with no arguments', async () => {
    const mockFn = vi.fn().mockResolvedValue('test');
    const wrappedFn = requestWrap(mockFn);

    const result = await wrappedFn();

    expect(result).toBe('test');
    expect(mockFn).toHaveBeenCalledWith();
  });

  it('should not swallow errors when the wrapped function fails', async () => {
    const mockError = new Error('critical error');
    const mockFn = vi.fn().mockRejectedValue(mockError);

    const wrappedFn = requestWrap(mockFn);

    await expect(wrappedFn()).rejects.toThrow(mockError);
    expect(errorRequestHandler).toHaveBeenCalledWith(mockError);
  });

  it('should handle multiple arguments correctly', async () => {
    const mockResponse = 'success';
    const mockFn = vi.fn().mockResolvedValue(mockResponse);

    const wrappedFn = requestWrap(mockFn);
    const result = await wrappedFn('arg1', 'arg2', 'arg3');

    expect(result).toBe(mockResponse);
    expect(mockFn).toHaveBeenCalledWith('arg1', 'arg2', 'arg3');
  });

  it('should work with functions returning promises that resolve to undefined', async () => {
    const mockFn = vi.fn().mockResolvedValue(undefined);

    const wrappedFn = requestWrap(mockFn);
    const result = await wrappedFn();

    expect(result).toBeUndefined();
    expect(mockFn).toHaveBeenCalledWith();
  });

  it('should handle functions that throw synchronous errors', async () => {
    const syncError = new Error('synchronous error');
    const mockFn = vi.fn(() => {
      throw syncError;
    });

    const wrappedFn = requestWrap(async (...args: unknown[]) => {
      return mockFn(...args);
    });

    await expect(wrappedFn()).rejects.toThrow(syncError);
    expect(errorRequestHandler).toHaveBeenCalledWith(syncError);
  });
});
