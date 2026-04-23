import {
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo,
  type ReactNode,
} from 'react';
import type { ObjectStackAdapter } from '@object-ui/data-objectstack';
import { MetadataCtx, useMetadata, type MetadataContextValue, type MetadataState } from '@object-ui/react';

export type { MetadataState, MetadataContextValue };
export { useMetadataItem } from '@object-ui/react';
export { useMetadata };

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type MetadataTypeStatus = 'idle' | 'loading' | 'ready' | 'error';

interface TypeCacheEntry {
  status: MetadataTypeStatus;
  items: any[];
  byName: Map<string, any>;
  error: Error | null;
  fetchedAt: number;
  promise: Promise<any[]> | null;
}

type ItemPromiseMap = Map<string, Promise<any | null>>;

interface MetadataProviderProps {
  children: ReactNode;
  adapter: ObjectStackAdapter;
  ttlMs?: number;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const DEFAULT_TTL_MS = 5 * 60 * 1000;
const EAGER_TYPES = ['app'] as const;

const TYPE_BY_STATE_KEY: Record<keyof Omit<MetadataState, 'loading' | 'error'>, string> = {
  apps: 'app',
  objects: 'object',
  dashboards: 'dashboard',
  reports: 'report',
  pages: 'page',
};

const SESSION_STORAGE_PREFIX = 'objectui:metadata:';

function isDev(): boolean {
  try {
    const meta: any = (import.meta as any);
    if (meta && meta.env && typeof meta.env.MODE === 'string') {
      return meta.env.MODE !== 'production';
    }
  } catch {
    /* import.meta unavailable */
  }
  if (typeof process !== 'undefined' && process.env && typeof process.env.NODE_ENV === 'string') {
    return process.env.NODE_ENV !== 'production';
  }
  return false;
}
const DEV = isDev();
function debug(...args: unknown[]) {
  if (DEV) {
    // eslint-disable-next-line no-console
    console.debug('[MetadataProvider]', ...args);
  }
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function extractItems(res: unknown): any[] {
  if (res && typeof res === 'object' && 'items' in res && Array.isArray((res as { items: unknown[] }).items)) {
    return (res as { items: unknown[] }).items;
  }
  return [];
}

function extractItem(res: unknown): any | null {
  if (res == null) return null;
  if (typeof res === 'object' && 'item' in res) {
    return (res as { item: any }).item ?? null;
  }
  return res;
}

function isNamedItem(item: unknown): item is { name: string } {
  return (
    !!item &&
    typeof item === 'object' &&
    'name' in item &&
    typeof (item as { name: unknown }).name === 'string'
  );
}

function emptyEntry(): TypeCacheEntry {
  return {
    status: 'idle',
    items: [],
    byName: new Map(),
    error: null,
    fetchedAt: 0,
    promise: null,
  };
}

function loadFromSession(type: string): any[] | null {
  if (typeof sessionStorage === 'undefined') return null;
  try {
    const raw = sessionStorage.getItem(SESSION_STORAGE_PREFIX + type);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

function saveToSession(type: string, items: any[]): void {
  if (typeof sessionStorage === 'undefined') return;
  try {
    sessionStorage.setItem(SESSION_STORAGE_PREFIX + type, JSON.stringify(items));
  } catch {
    /* quota or serialization failure */
  }
}

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------

export function MetadataProvider({ children, adapter, ttlMs = DEFAULT_TTL_MS }: MetadataProviderProps) {
  const cacheRef = useRef<Map<string, TypeCacheEntry>>(new Map());
  const itemPromisesRef = useRef<Map<string, ItemPromiseMap>>(new Map());
  const adapterRef = useRef(adapter);
  adapterRef.current = adapter;

  const [version, setVersion] = useState(0);
  const bump = useCallback(() => setVersion(v => v + 1), []);

  const getEntry = useCallback((type: string): TypeCacheEntry => {
    let entry = cacheRef.current.get(type);
    if (!entry) {
      entry = emptyEntry();
      cacheRef.current.set(type, entry);
    }
    return entry;
  }, []);

  const ensureType = useCallback(
    (type: string): Promise<any[]> => {
      const entry = getEntry(type);

      if (entry.promise) return entry.promise;

      if (entry.status === 'ready' && Date.now() - entry.fetchedAt < ttlMs) {
        debug(`cache hit (fresh) type=${type} items=${entry.items.length}`);
        return Promise.resolve(entry.items);
      }

      const started = Date.now();
      entry.status = 'loading';
      entry.error = null;
      const client = adapterRef.current.getClient();
      const promise = client.meta
        .getItems(type)
        .then((res: unknown) => {
          const items = extractItems(res);
          entry.items = items;
          entry.status = 'ready';
          entry.error = null;
          entry.fetchedAt = Date.now();
          entry.promise = null;
          entry.byName.clear();
          for (const it of items) {
            if (isNamedItem(it)) {
              entry.byName.set(it.name, it);
            }
          }
          if (type === 'app') saveToSession(type, items);
          debug(`fetched type=${type} items=${items.length} in ${Date.now() - started}ms`);
          bump();
          return items;
        })
        .catch((err: unknown) => {
          const error = err instanceof Error ? err : new Error(String(err));
          entry.status = 'error';
          entry.error = error;
          entry.promise = null;
          debug(`fetch failed type=${type}`, error);
          bump();
          return [] as any[];
        });

      entry.promise = promise;
      bump();
      return promise;
    },
    [bump, getEntry, ttlMs],
  );

  const getItem = useCallback(
    (type: string, name: string): Promise<any | null> => {
      const entry = getEntry(type);

      if (entry.byName.has(name)) {
        debug(`item cache hit type=${type} name=${name}`);
        return Promise.resolve(entry.byName.get(name) ?? null);
      }

      let pending = itemPromisesRef.current.get(type);
      if (!pending) {
        pending = new Map();
        itemPromisesRef.current.set(type, pending);
      }
      const existing = pending.get(name);
      if (existing) return existing;

      const started = Date.now();
      const client = adapterRef.current.getClient();
      const promise = client.meta
        .getItem(type, name)
        .then((res: unknown) => {
          const item = extractItem(res);
          if (item) entry.byName.set(name, item);
          debug(`fetched item type=${type} name=${name} in ${Date.now() - started}ms`);
          pending!.delete(name);
          return item;
        })
        .catch((err: unknown) => {
          pending!.delete(name);
          debug(`fetch item failed type=${type} name=${name}`, err);
          return null;
        });

      pending.set(name, promise);
      return promise;
    },
    [getEntry],
  );

  const refresh = useCallback(
    async (type?: string): Promise<void> => {
      if (type) {
        const entry = getEntry(type);
        entry.fetchedAt = 0;
        entry.byName.clear();
        await ensureType(type);
        return;
      }
      const types = Array.from(cacheRef.current.keys()).filter(
        t => cacheRef.current.get(t)!.status !== 'idle',
      );
      await Promise.all(
        types.map(t => {
          const entry = cacheRef.current.get(t)!;
          entry.fetchedAt = 0;
          entry.byName.clear();
          return ensureType(t);
        }),
      );
    },
    [ensureType, getEntry],
  );

  const invalidate = useCallback(
    (type: string, name?: string): void => {
      const entry = cacheRef.current.get(type);
      if (!entry) return;
      if (name) {
        entry.byName.delete(name);
        entry.items = entry.items.filter((it: any) => it?.name !== name);
        debug(`invalidated type=${type} name=${name}`);
      } else {
        entry.status = 'idle';
        entry.items = [];
        entry.byName.clear();
        entry.error = null;
        entry.fetchedAt = 0;
        debug(`invalidated type=${type}`);
      }
      bump();
    },
    [bump],
  );

  const [initialLoading, setInitialLoading] = useState(true);
  const [initialError, setInitialError] = useState<Error | null>(null);

  useEffect(() => {
    let cancelled = false;

    const cached = loadFromSession('app');
    if (cached) {
      const entry = getEntry('app');
      entry.items = cached;
      entry.status = 'ready';
      entry.fetchedAt = 0;
      for (const it of cached) {
        if (isNamedItem(it)) {
          entry.byName.set(it.name, it);
        }
      }
      bump();
      setInitialLoading(false);
    }

    (async () => {
      for (const type of EAGER_TYPES) {
        try {
          await ensureType(type);
          if (!cancelled) setInitialError(null);
        } catch (err) {
          if (!cancelled) {
            setInitialError(err instanceof Error ? err : new Error(String(err)));
          }
        }
      }
      if (!cancelled) setInitialLoading(false);
    })();

    return () => {
      cancelled = true;
    };
  }, [adapter, ensureType, getEntry, bump]);

  const value = useMemo<MetadataContextValue>(() => {
    void version;

    const readType = (type: string): any[] => {
      const entry = getEntry(type);
      if (entry.status === 'idle') {
        void ensureType(type);
      }
      return entry.items;
    };

    const getItemsByType = (type: string): any[] => readType(type);

    const base: MetadataContextValue = {
      apps: getEntry('app').items,
      get objects() {
        return readType(TYPE_BY_STATE_KEY.objects);
      },
      get dashboards() {
        return readType(TYPE_BY_STATE_KEY.dashboards);
      },
      get reports() {
        return readType(TYPE_BY_STATE_KEY.reports);
      },
      get pages() {
        return readType(TYPE_BY_STATE_KEY.pages);
      },
      loading: initialLoading,
      error: initialError ?? getEntry('app').error,
      refresh,
      invalidate,
      ensureType,
      getItem,
      getItemsByType,
    };

    return base;
  }, [version, initialLoading, initialError, ensureType, getItem, getEntry, refresh, invalidate]);

  return <MetadataCtx.Provider value={value}>{children}</MetadataCtx.Provider>;
}

export function useMetadataType(type: string): { items: any[]; loading: boolean; error: Error | null } {
  const ctx = useMetadata();
  const items = ctx.getItemsByType(type);
  return { items, loading: ctx.loading && type === 'app', error: ctx.error };
}
