/**
 * Tests for createAuthenticatedFetch
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createAuthenticatedFetch } from '../createAuthenticatedFetch';
import { TokenStorage } from '../createAuthClient';

describe('createAuthenticatedFetch', () => {
  beforeEach(() => {
    TokenStorage.clear();
  });

  afterEach(() => {
    TokenStorage.clear();
  });

  it('injects Authorization header when session exists', async () => {
    TokenStorage.set('bearer-token-123');

    const authenticatedFetch = createAuthenticatedFetch();

    const originalFetch = globalThis.fetch;
    const mockFetch = vi.fn().mockResolvedValue(new Response('ok'));
    globalThis.fetch = mockFetch;

    try {
      await authenticatedFetch('https://api.example.com/api/data');

      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.example.com/api/data',
        expect.objectContaining({
          headers: expect.any(Headers),
        }),
      );

      const calledHeaders = mockFetch.mock.calls[0][1].headers as Headers;
      expect(calledHeaders.get('Authorization')).toBe('Bearer bearer-token-123');
    } finally {
      globalThis.fetch = originalFetch;
    }
  });

  it('does not inject Authorization header when no session', async () => {
    const authenticatedFetch = createAuthenticatedFetch();

    const originalFetch = globalThis.fetch;
    const mockFetch = vi.fn().mockResolvedValue(new Response('ok'));
    globalThis.fetch = mockFetch;

    try {
      await authenticatedFetch('https://api.example.com/api/data');

      const calledHeaders = mockFetch.mock.calls[0][1].headers as Headers;
      expect(calledHeaders.get('Authorization')).toBeNull();
    } finally {
      globalThis.fetch = originalFetch;
    }
  });

  it('preserves existing request headers', async () => {
    TokenStorage.set('tok');

    const authenticatedFetch = createAuthenticatedFetch();

    const originalFetch = globalThis.fetch;
    const mockFetch = vi.fn().mockResolvedValue(new Response('ok'));
    globalThis.fetch = mockFetch;

    try {
      await authenticatedFetch('https://api.example.com/api/data', {
        headers: { 'X-Custom': 'value' },
      });

      const calledHeaders = mockFetch.mock.calls[0][1].headers as Headers;
      expect(calledHeaders.get('X-Custom')).toBe('value');
      expect(calledHeaders.get('Authorization')).toBe('Bearer tok');
    } finally {
      globalThis.fetch = originalFetch;
    }
  });
});
