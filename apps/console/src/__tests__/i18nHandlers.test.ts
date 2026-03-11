/**
 * Tests for shared i18n MSW handlers.
 *
 * These tests verify the i18n translation endpoint that serves
 * application-specific locale bundles in the MSW (browser & test)
 * environment.  The handler factory follows the same pattern as
 * `createAuthHandlers` — producing `HttpHandler[]` for MSW.
 *
 * @vitest-environment node
 */

import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { setupServer } from 'msw/node';
import {
  loadAppLocale,
  createI18nService,
  createI18nHandlers,
} from '../mocks/i18nHandlers';

// ── Unit tests (no MSW required) ─────────────────────────────────────────

describe('loadAppLocale', () => {
  it('returns CRM translations namespaced under "crm" for a supported language', async () => {
    const result = await loadAppLocale('en');
    // The CRM example package ships English translations
    expect(result).toHaveProperty('crm');
    expect(typeof result.crm).toBe('object');
  });

  it('returns an empty object for an unsupported language', async () => {
    const result = await loadAppLocale('xx-nonexistent');
    expect(result).toEqual({});
  });

  it('returns CRM translations for Chinese', async () => {
    const result = await loadAppLocale('zh');
    expect(result).toHaveProperty('crm');
  });
});

describe('createI18nService', () => {
  it('creates a service with getTranslations method', () => {
    const svc = createI18nService();
    expect(svc).toHaveProperty('getTranslations');
    expect(typeof svc.getTranslations).toBe('function');
  });

  it('uses the default loader when none is provided', async () => {
    const svc = createI18nService();
    const result = await svc.getTranslations('en');
    expect(result).toHaveProperty('crm');
  });

  it('accepts a custom loader', async () => {
    const custom = async (lang: string) => ({ custom: { hello: `Hello in ${lang}` } });
    const svc = createI18nService(custom);
    const result = await svc.getTranslations('en');
    expect(result).toEqual({ custom: { hello: 'Hello in en' } });
  });
});

// ── Integration tests (MSW node server) ──────────────────────────────────

describe('createI18nHandlers (MSW integration)', () => {
  const BASE_URL = 'http://localhost/api/v1';
  const handlers = createI18nHandlers('/api/v1');
  const server = setupServer(...handlers);

  beforeAll(() => server.listen({ onUnhandledRequest: 'bypass' }));
  afterAll(() => server.close());

  it('serves English translations via GET /api/v1/i18n/translations/en', async () => {
    const res = await fetch(`${BASE_URL}/i18n/translations/en`);
    expect(res.ok).toBe(true);

    const body = await res.json();
    expect(body).toHaveProperty('crm');
    expect(typeof body.crm).toBe('object');
  });

  it('serves Chinese translations via GET /api/v1/i18n/translations/zh', async () => {
    const res = await fetch(`${BASE_URL}/i18n/translations/zh`);
    expect(res.ok).toBe(true);

    const body = await res.json();
    expect(body).toHaveProperty('crm');
  });

  it('returns empty object for an unsupported language', async () => {
    const res = await fetch(`${BASE_URL}/i18n/translations/xx-unknown`);
    expect(res.ok).toBe(true);

    const body = await res.json();
    expect(body).toEqual({});
  });

  it('returns consistent data structure across languages', async () => {
    const enRes = await fetch(`${BASE_URL}/i18n/translations/en`);
    const zhRes = await fetch(`${BASE_URL}/i18n/translations/zh`);
    const enBody = await enRes.json();
    const zhBody = await zhRes.json();

    // Both should have the same top-level namespace keys
    expect(Object.keys(enBody)).toEqual(Object.keys(zhBody));
  });
});

describe('createI18nHandlers with custom loader', () => {
  const custom = async (lang: string) => ({ test: { greeting: `Hi ${lang}` } });
  const handlers = createI18nHandlers('/api/v1', custom);
  const server = setupServer(...handlers);

  beforeAll(() => server.listen({ onUnhandledRequest: 'bypass' }));
  afterAll(() => server.close());

  it('uses the custom loader for API responses', async () => {
    const res = await fetch('http://localhost/api/v1/i18n/translations/fr');
    expect(res.ok).toBe(true);

    const body = await res.json();
    expect(body).toEqual({ test: { greeting: 'Hi fr' } });
  });
});
