/**
 * ObjectUI
 * Copyright (c) 2024-present ObjectStack Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { TokenStorage } from './createAuthClient';

/**
 * Options for creating an authenticated adapter.
 */
export interface AuthenticatedAdapterOptions {
  /** Base URL for the ObjectStack API */
  baseUrl: string;
  /** Additional adapter options */
  [key: string]: unknown;
}

const ACTIVE_ORG_STORAGE_KEY = 'auth-active-organization-id';

/**
 * Get/set the active organization ID for tenant-scoped API requests.
 * Used by createAuthenticatedFetch to inject X-Tenant-ID header.
 */
export const ActiveOrganizationStorage = {
  _memoryValue: null as string | null,

  get(): string | null {
    try {
      if (typeof localStorage !== 'undefined') {
        return localStorage.getItem(ACTIVE_ORG_STORAGE_KEY);
      }
    } catch { /* SSR / test */ }
    return this._memoryValue;
  },

  set(orgId: string): void {
    this._memoryValue = orgId;
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(ACTIVE_ORG_STORAGE_KEY, orgId);
      }
    } catch { /* SSR / test */ }
  },

  clear(): void {
    this._memoryValue = null;
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.removeItem(ACTIVE_ORG_STORAGE_KEY);
      }
    } catch { /* SSR / test */ }
  },
};

/**
 * Creates an authenticated fetch wrapper that injects the Bearer token
 * from localStorage into every request to the ObjectStack API.
 * Also injects X-Tenant-ID header when an active organization is set.
 *
 * @example
 * ```ts
 * import { ObjectStackAdapter } from '@object-ui/data-objectstack';
 * import { createAuthenticatedFetch } from '@object-ui/auth';
 *
 * const authenticatedFetch = createAuthenticatedFetch();
 *
 * const adapter = new ObjectStackAdapter({
 *   baseUrl: '/api/v1',
 *   fetch: authenticatedFetch,
 * });
 * ```
 */
export function createAuthenticatedFetch(): (input: RequestInfo | URL, init?: RequestInit) => Promise<Response> {
  return async (input: RequestInfo | URL, init?: RequestInit) => {
    const headers = new Headers(init?.headers);
    const token = TokenStorage.get();
    if (token) {
      const url = typeof input === 'string' ? input : input instanceof URL ? input.href : input.url;
      if (/\/api\//i.test(url)) {
        headers.set('Authorization', `Bearer ${token}`);
      }
    }
    // Inject tenant header for multi-tenant routing
    const activeOrgId = ActiveOrganizationStorage.get();
    if (activeOrgId) {
      headers.set('X-Tenant-ID', activeOrgId);
    }
    return fetch(input, { ...init, headers });
  };
}
