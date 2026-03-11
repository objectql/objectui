/**
 * Shared i18n handlers for ObjectStack Runtime
 *
 * Provides a unified locale-loading strategy and MSW handler factory
 * so that browser (MSW setupWorker), test (MSW setupServer), and real
 * server (HonoServerPlugin) environments all serve the same i18n API
 * through the kernel service mechanism.
 *
 * ## Architecture
 *
 * 1. `loadAppLocale(lang)` — single source of truth for loading
 *    application-specific translation bundles from installed example
 *    packages (e.g. @object-ui/example-crm).
 *
 * 2. `createI18nService(loader?)` — creates a service object suitable
 *    for `kernel.registerService('i18n', ...)`.  The kernel's broker
 *    (or the broker shim in MSW mode) routes `i18n.getTranslations`
 *    calls to this service.
 *
 * 3. `createI18nHandlers(baseUrl)` — creates MSW `HttpHandler[]` for
 *    the i18n API endpoint.  Used as `customHandlers` in MSWPlugin
 *    options to ensure the endpoint is available before the kernel
 *    dispatcher learns about the i18n service.
 */

import { http, HttpResponse } from 'msw';
import type { HttpHandler } from 'msw';

/**
 * Load application-specific locale bundles.
 *
 * In demo/MSW/dev environments this dynamically imports translations
 * from the installed example packages.  The returned object is namespaced
 * by application (e.g. `{ crm: { ... } }`) so that multiple apps can
 * coexist without key collisions.
 *
 * @param lang - BCP-47 language code (e.g. 'en', 'zh', 'ja')
 * @returns A flat translation resource for the given language, or `{}`
 *          when no translations are available.
 */
export async function loadAppLocale(lang: string): Promise<Record<string, unknown>> {
  try {
    const { crmLocales } = await import('@object-ui/example-crm');
    const translations = (crmLocales as Record<string, any>)[lang];
    if (!translations) return {};
    return { crm: translations };
  } catch {
    return {};
  }
}

/**
 * Service interface expected by `kernel.registerService('i18n', ...)`.
 */
export interface I18nServiceImpl {
  /** Return translation resources for the given language code. */
  getTranslations: (lang: string) => Promise<Record<string, unknown>>;
}

/**
 * Create an i18n service object that can be registered on the kernel.
 *
 * When no custom `loader` is provided, `loadAppLocale` is used as the
 * default implementation — keeping the data source identical across all
 * environments.
 *
 * @param loader — Optional custom locale loader (defaults to `loadAppLocale`)
 */
export function createI18nService(
  loader: (lang: string) => Promise<Record<string, unknown>> = loadAppLocale,
): I18nServiceImpl {
  return {
    getTranslations: (lang: string) => loader(lang),
  };
}

/**
 * Create MSW request handlers for the i18n REST endpoint.
 *
 * This mirrors the pattern used by `createAuthHandlers` — a factory that
 * returns `HttpHandler[]` suitable for the MSWPlugin `customHandlers` option.
 *
 * @param baseUrl — The API prefix (e.g. "/api/v1")
 * @param loader  — Optional custom locale loader (defaults to `loadAppLocale`)
 */
export function createI18nHandlers(
  baseUrl: string,
  loader: (lang: string) => Promise<Record<string, unknown>> = loadAppLocale,
): HttpHandler[] {
  // Prefix with wildcard so handlers match full URLs in both browser
  // (MSW worker, relative paths) and node (MSW server, absolute URLs).
  const p = `*${baseUrl}`;

  return [
    http.get(`${p}/i18n/translations/:lang`, async ({ params }) => {
      const lang = params.lang as string;
      const resources = await loader(lang);
      return HttpResponse.json(resources);
    }),
  ];
}
