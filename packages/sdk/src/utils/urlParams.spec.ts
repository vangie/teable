import { describe, expect, it } from 'vitest';
import { addQueryParamsToWebSocketUrl } from './urlParams';

describe('addQueryParamsToWebSocketUrl', () => {
  const baseUrl = 'ws://localhost:8080';

  it('should add query params to a WebSocket URL without existing params', () => {
    const params = {
      token: 'abc123',
      userId: '123',
    };

    const result = addQueryParamsToWebSocketUrl(baseUrl, params);
    expect(result).toBe('ws://localhost:8080/?token=abc123&userId=123');
  });

  it('should add query params to a WebSocket URL with existing params', () => {
    const url = 'ws://localhost:8080?existing=true';
    const params = {
      token: 'abc123',
    };

    const result = addQueryParamsToWebSocketUrl(url, params);
    expect(result).toBe('ws://localhost:8080/?existing=true&token=abc123');
  });

  it('should handle empty params object', () => {
    const params = {};

    const result = addQueryParamsToWebSocketUrl(baseUrl, params);
    expect(result).toBe('ws://localhost:8080/');
  });

  it('should handle secure WebSocket URLs', () => {
    const url = 'wss://example.com';
    const params = {
      token: 'abc123',
    };

    const result = addQueryParamsToWebSocketUrl(url, params);
    expect(result).toBe('wss://example.com/?token=abc123');
  });

  it('should handle URLs with paths', () => {
    const url = 'ws://example.com/socket';
    const params = {
      token: 'abc123',
    };

    const result = addQueryParamsToWebSocketUrl(url, params);
    expect(result).toBe('ws://example.com/socket?token=abc123');
  });

  it('should handle special characters in params', () => {
    const params = {
      token: 'abc 123!@#$',
    };

    const result = addQueryParamsToWebSocketUrl(baseUrl, params);
    expect(result).toBe('ws://localhost:8080/?token=abc+123%21%40%23%24');
  });

  it('should override existing params with same key', () => {
    const url = 'ws://localhost:8080?token=old';
    const params = {
      token: 'new',
    };

    const result = addQueryParamsToWebSocketUrl(url, params);
    expect(result).toBe('ws://localhost:8080/?token=new');
  });
});
