/**
 * ObjectUI
 * Copyright (c) 2024-present ObjectStack Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { useState, useCallback, useRef, useMemo } from 'react';

/**
 * Persistence adapter interface for schema save/load operations.
 * Implement this to connect to any backend (REST API, GraphQL, localStorage, etc.).
 */
export interface SchemaPersistenceAdapter {
  /** Save a schema to the backend. Returns the saved schema ID. */
  save: (id: string, schema: Record<string, unknown>) => Promise<string>;
  /** Load a schema from the backend by ID. */
  load: (id: string) => Promise<Record<string, unknown> | null>;
  /** List all available schemas. */
  list?: () => Promise<Array<{ id: string; name?: string; updatedAt?: string }>>;
  /** Delete a schema from the backend. */
  delete?: (id: string) => Promise<void>;
}

export interface SchemaPersistenceState {
  /** Whether a save/load operation is in progress */
  loading: boolean;
  /** The last error from a save/load operation */
  error: Error | null;
  /** Whether the current schema has unsaved changes */
  isDirty: boolean;
  /** The last saved timestamp */
  lastSavedAt: Date | null;
}

export interface SchemaPersistenceResult extends SchemaPersistenceState {
  /** Save the current schema */
  save: (id: string, schema: Record<string, unknown>) => Promise<string | null>;
  /** Load a schema by ID */
  load: (id: string) => Promise<Record<string, unknown> | null>;
  /** List available schemas */
  list: () => Promise<Array<{ id: string; name?: string; updatedAt?: string }>>;
  /** Delete a schema */
  remove: (id: string) => Promise<boolean>;
  /** Mark the current schema as dirty (has unsaved changes) */
  markDirty: () => void;
  /** Clear the error state */
  clearError: () => void;
}

/**
 * Default localStorage adapter for schema persistence.
 * Useful for development and demos.
 */
export function createLocalStorageAdapter(prefix = 'objectui-schema'): SchemaPersistenceAdapter {
  return {
    async save(id: string, schema: Record<string, unknown>): Promise<string> {
      const key = `${prefix}:${id}`;
      const entry = { schema, updatedAt: new Date().toISOString() };
      localStorage.setItem(key, JSON.stringify(entry));
      // Update the index
      const indexKey = `${prefix}:__index__`;
      const index: string[] = JSON.parse(localStorage.getItem(indexKey) || '[]');
      if (!index.includes(id)) {
        index.push(id);
        localStorage.setItem(indexKey, JSON.stringify(index));
      }
      return id;
    },
    async load(id: string): Promise<Record<string, unknown> | null> {
      const key = `${prefix}:${id}`;
      const raw = localStorage.getItem(key);
      if (!raw) return null;
      const entry = JSON.parse(raw);
      return entry.schema ?? null;
    },
    async list(): Promise<Array<{ id: string; name?: string; updatedAt?: string }>> {
      const indexKey = `${prefix}:__index__`;
      const index: string[] = JSON.parse(localStorage.getItem(indexKey) || '[]');
      return index.map((id) => {
        const raw = localStorage.getItem(`${prefix}:${id}`);
        const entry = raw ? JSON.parse(raw) : {};
        return { id, name: id, updatedAt: entry.updatedAt };
      });
    },
    async delete(id: string): Promise<void> {
      const key = `${prefix}:${id}`;
      localStorage.removeItem(key);
      const indexKey = `${prefix}:__index__`;
      const index: string[] = JSON.parse(localStorage.getItem(indexKey) || '[]');
      localStorage.setItem(indexKey, JSON.stringify(index.filter((i) => i !== id)));
    },
  };
}

/**
 * Hook for persisting designer schemas (save/load/list/delete).
 * Implements schema persistence for @object-ui/plugin-designer.
 *
 * Accepts a pluggable adapter for connecting to any backend.
 * Falls back to a localStorage adapter for development use.
 *
 * @example
 * ```tsx
 * // With default localStorage adapter
 * const persistence = useSchemaPersistence();
 *
 * // Save current design
 * await persistence.save('my-page', pageSchema);
 *
 * // Load a design
 * const schema = await persistence.load('my-page');
 *
 * // With custom API adapter
 * const apiAdapter: SchemaPersistenceAdapter = {
 *   save: (id, schema) => fetch(`/api/schemas/${id}`, { method: 'PUT', body: JSON.stringify(schema) }).then(r => r.json()),
 *   load: (id) => fetch(`/api/schemas/${id}`).then(r => r.json()),
 *   list: () => fetch('/api/schemas').then(r => r.json()),
 *   delete: (id) => fetch(`/api/schemas/${id}`, { method: 'DELETE' }).then(() => {}),
 * };
 * const persistence = useSchemaPersistence(apiAdapter);
 * ```
 */
export function useSchemaPersistence(
  adapter?: SchemaPersistenceAdapter,
): SchemaPersistenceResult {
  const adapterRef = useRef(adapter ?? createLocalStorageAdapter());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [isDirty, setIsDirty] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);

  const save = useCallback(
    async (id: string, schema: Record<string, unknown>): Promise<string | null> => {
      setLoading(true);
      setError(null);
      try {
        const result = await adapterRef.current.save(id, schema);
        setIsDirty(false);
        setLastSavedAt(new Date());
        return result;
      } catch (err) {
        setError(err instanceof Error ? err : new Error(String(err)));
        return null;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const load = useCallback(async (id: string): Promise<Record<string, unknown> | null> => {
    setLoading(true);
    setError(null);
    try {
      const result = await adapterRef.current.load(id);
      setIsDirty(false);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const list = useCallback(async (): Promise<Array<{ id: string; name?: string; updatedAt?: string }>> => {
    setLoading(true);
    setError(null);
    try {
      if (adapterRef.current.list) {
        return await adapterRef.current.list();
      }
      return [];
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const remove = useCallback(async (id: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      if (adapterRef.current.delete) {
        await adapterRef.current.delete(id);
        return true;
      }
      return false;
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const markDirty = useCallback(() => setIsDirty(true), []);
  const clearError = useCallback(() => setError(null), []);

  return useMemo(
    () => ({
      loading,
      error,
      isDirty,
      lastSavedAt,
      save,
      load,
      list,
      remove,
      markDirty,
      clearError,
    }),
    [loading, error, isDirty, lastSavedAt, save, load, list, remove, markDirty, clearError],
  );
}
