/**
 * ObjectUI
 * Copyright (c) 2024-present ObjectStack Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import {
  useSchemaPersistence,
  createLocalStorageAdapter,
} from '../useSchemaPersistence';
import type { SchemaPersistenceAdapter } from '../useSchemaPersistence';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => { store[key] = value; },
    removeItem: (key: string) => { delete store[key]; },
    clear: () => { store = {}; },
  };
})();

Object.defineProperty(window, 'localStorage', { value: localStorageMock });

describe('useSchemaPersistence', () => {
  beforeEach(() => {
    localStorageMock.clear();
  });

  it('should initialize with default state', () => {
    const { result } = renderHook(() => useSchemaPersistence());
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.isDirty).toBe(false);
    expect(result.current.lastSavedAt).toBeNull();
  });

  it('should save and load a schema with default localStorage adapter', async () => {
    const { result } = renderHook(() => useSchemaPersistence());
    const testSchema = { type: 'page', title: 'My Page', regions: [] };

    let savedId: string | null = null;
    await act(async () => {
      savedId = await result.current.save('test-page', testSchema);
    });

    expect(savedId).toBe('test-page');
    expect(result.current.isDirty).toBe(false);
    expect(result.current.lastSavedAt).not.toBeNull();

    let loaded: Record<string, unknown> | null = null;
    await act(async () => {
      loaded = await result.current.load('test-page');
    });

    expect(loaded).toEqual(testSchema);
  });

  it('should list saved schemas', async () => {
    const { result } = renderHook(() => useSchemaPersistence());

    await act(async () => {
      await result.current.save('schema-1', { type: 'page' });
      await result.current.save('schema-2', { type: 'form' });
    });

    let items: Array<{ id: string }> = [];
    await act(async () => {
      items = await result.current.list();
    });

    expect(items).toHaveLength(2);
    expect(items.map((i) => i.id)).toEqual(['schema-1', 'schema-2']);
  });

  it('should delete a schema', async () => {
    const { result } = renderHook(() => useSchemaPersistence());

    await act(async () => {
      await result.current.save('to-delete', { type: 'grid' });
    });

    let success = false;
    await act(async () => {
      success = await result.current.remove('to-delete');
    });

    expect(success).toBe(true);

    let loaded: Record<string, unknown> | null = null;
    await act(async () => {
      loaded = await result.current.load('to-delete');
    });

    expect(loaded).toBeNull();
  });

  it('should track dirty state', () => {
    const { result } = renderHook(() => useSchemaPersistence());

    expect(result.current.isDirty).toBe(false);

    act(() => {
      result.current.markDirty();
    });

    expect(result.current.isDirty).toBe(true);
  });

  it('should clear dirty state after save', async () => {
    const { result } = renderHook(() => useSchemaPersistence());

    act(() => {
      result.current.markDirty();
    });
    expect(result.current.isDirty).toBe(true);

    await act(async () => {
      await result.current.save('test', { type: 'page' });
    });
    expect(result.current.isDirty).toBe(false);
  });

  it('should handle save errors gracefully', async () => {
    const failingAdapter: SchemaPersistenceAdapter = {
      save: () => Promise.reject(new Error('Network error')),
      load: () => Promise.resolve(null),
    };

    const { result } = renderHook(() => useSchemaPersistence(failingAdapter));

    await act(async () => {
      await result.current.save('test', { type: 'page' });
    });

    expect(result.current.error).not.toBeNull();
    expect(result.current.error?.message).toBe('Network error');
  });

  it('should clear errors', async () => {
    const failingAdapter: SchemaPersistenceAdapter = {
      save: () => Promise.reject(new Error('fail')),
      load: () => Promise.resolve(null),
    };

    const { result } = renderHook(() => useSchemaPersistence(failingAdapter));

    await act(async () => {
      await result.current.save('test', { type: 'page' });
    });
    expect(result.current.error).not.toBeNull();

    act(() => {
      result.current.clearError();
    });
    expect(result.current.error).toBeNull();
  });

  it('should work with custom adapter', async () => {
    const mockStore: Record<string, Record<string, unknown>> = {};
    const customAdapter: SchemaPersistenceAdapter = {
      save: async (id, schema) => { mockStore[id] = schema; return id; },
      load: async (id) => mockStore[id] ?? null,
      list: async () => Object.keys(mockStore).map((id) => ({ id })),
      delete: async (id) => { delete mockStore[id]; },
    };

    const { result } = renderHook(() => useSchemaPersistence(customAdapter));

    await act(async () => {
      await result.current.save('custom-1', { type: 'dashboard' });
    });

    let loaded: Record<string, unknown> | null = null;
    await act(async () => {
      loaded = await result.current.load('custom-1');
    });

    expect(loaded).toEqual({ type: 'dashboard' });
  });
});

describe('createLocalStorageAdapter', () => {
  beforeEach(() => {
    localStorageMock.clear();
  });

  it('should create an adapter with custom prefix', async () => {
    const adapter = createLocalStorageAdapter('my-prefix');

    await adapter.save('test', { hello: 'world' });
    const result = await adapter.load('test');
    expect(result).toEqual({ hello: 'world' });
  });

  it('should maintain an index of saved schemas', async () => {
    const adapter = createLocalStorageAdapter('test-prefix');

    await adapter.save('a', { type: 'a' });
    await adapter.save('b', { type: 'b' });

    const items = await adapter.list!();
    expect(items).toHaveLength(2);
  });

  it('should not duplicate IDs in index', async () => {
    const adapter = createLocalStorageAdapter('test-prefix');

    await adapter.save('same-id', { v: 1 });
    await adapter.save('same-id', { v: 2 });

    const items = await adapter.list!();
    expect(items).toHaveLength(1);
  });
});
