/**
 * ObjectUI — resolveDataSource
 * Copyright (c) 2024-present ObjectStack Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * Factory function to create the right DataSource from a ViewData config.
 */

import type { DataSource, ViewData } from '@object-ui/types';
import { ApiDataSource, type ApiDataSourceConfig } from './ApiDataSource.js';
import { ValueDataSource } from './ValueDataSource.js';

export interface ResolveDataSourceOptions {
  /** Custom fetch implementation passed to ApiDataSource */
  fetch?: (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;
  /** Default headers for API requests */
  defaultHeaders?: Record<string, string>;
  /** Custom ID field for ValueDataSource */
  idField?: string;
}

/**
 * Resolve a ViewData configuration into a concrete DataSource instance.
 *
 * - `provider: 'object'` → returns `fallback` (the context DataSource — typically ObjectStackAdapter)
 * - `provider: 'api'`    → returns a new `ApiDataSource`
 * - `provider: 'value'`  → returns a new `ValueDataSource`
 *
 * @param viewData - The ViewData configuration from the schema
 * @param fallback - The default DataSource from context (for `provider: 'object'`)
 * @param options  - Additional options for adapter construction
 * @returns A DataSource instance, or null if neither viewData nor fallback is available
 *
 * @example
 * ```ts
 * const ds = resolveDataSource(
 *   { provider: 'api', read: { url: '/api/users' } },
 *   contextDataSource,
 * );
 * const result = await ds.find('users');
 * ```
 */
export function resolveDataSource<T = any>(
  viewData: ViewData | null | undefined,
  fallback?: DataSource<T> | null,
  options?: ResolveDataSourceOptions,
): DataSource<T> | null {
  if (!viewData) {
    return fallback ?? null;
  }

  switch (viewData.provider) {
    case 'object':
      // Delegate to the context DataSource (ObjectStackAdapter, etc.)
      return fallback ?? null;

    case 'api': {
      const config: ApiDataSourceConfig = {
        read: viewData.read,
        write: viewData.write,
        fetch: options?.fetch,
        defaultHeaders: options?.defaultHeaders,
      };
      return new ApiDataSource<T>(config);
    }

    case 'value':
      return new ValueDataSource<T>({
        items: (viewData.items ?? []) as T[],
        idField: options?.idField,
      });

    default:
      // Unknown provider — fall back to context
      return fallback ?? null;
  }
}
