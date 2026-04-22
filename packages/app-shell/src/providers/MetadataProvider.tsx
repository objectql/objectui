/**
 * MetadataProvider
 *
 * Runtime metadata cache for the Console.
 *
 * Goal: minimize the metadata payload fetched at app startup.
 *
 * History:
 *   v1 (eager) — On mount, fetched ALL items for every metadata type
 *   (`app`, `object`, `dashboard`, `report`, `page`) in parallel and held
 *   them in five top-level arrays. Cost scaled linearly with tenant size.
 *
 *   v2 (lazy, this file) — Only the `app` list is loaded at startup
 *   (it is required by the router and the App switcher). All other types
 *   are fetched on first access via `ensureType(type)`. Single items can
 *   be fetched directly with `getItem(type, name)` without paying the
 *   full-list cost.
 *
 * Backward compatibility:
 *   The `apps`, `objects`, `dashboards`, `reports`, `pages`, `loading`,
 *   `error`, `refresh`, and `getItemsByType` properties of the legacy
 *   `useMetadata()` API are preserved. Reading any of the array
 *   properties transparently triggers `ensureType` for that bucket the
 *   first time it is observed by a component, so existing call sites
 *   keep working unchanged while still benefiting from lazy loading.
 *
 * @module
 */

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo,
  type ReactNode,
} from 'react';
import type { ObjectStackAdapter } from '@object-ui/data-objectstack';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** Lifecycle status of a single metadata-type bucket in the cache. */
export type MetadataTypeStatus = 'idle' | 'loading' | 'ready' | 'error';

/** Internal cache entry for one metadata type (e.g. `'object'`). */
interface TypeCacheEntry {
  status: MetadataTypeStatus;
  items: any[];
  /** Per-name cache for single-item fetches. */
  byName: Map<string, any>;
  error: Error | null;
  /** Wall-clock timestamp (ms) of the last successful list fetch. */
  fetchedAt: number;
  /** In-flight list-fetch promise — used to dedupe concurrent ensureType. */
  promise: Promise<any[]> | null;
}

/** Per-name in-flight tracker for `getItem` deduplication. */
type ItemPromiseMap = Map<string, Promise<any | null>>;

export interface MetadataState {
  apps: any[];
  objects: any[];
  dashboards: any[];
  reports: any[];
  pages: any[];
  /**
   * True only while the *initial* `app` list is loading (i.e. before the
   * router has the data it needs to dispatch). Lazy fetches of other
   * types do NOT flip this flag — consumers that care about per-type
   * loading should use `useMetadataType(type)`.
   */
  loading: boolean;
  /** Most recent error from the initial `app` load (if any). */
  error: Error | null;
}

export interface MetadataContextValue extends MetadataState {
  /**
   * Re-fetch metadata from the API.
   *
   * - `refresh()` (no args) — re-fetch every type that has previously
   *   been loaded into the cache (legacy behaviour, scoped to what is
   *   actually in use).
   * - `refresh(type)` — re-fetch a single type bucket.
   */
  refresh: (type?: string) => Promise<void>;
  /**
   * Drop the cached entry for `type` (or for a specific item under that
   * type) so the next read triggers a network fetch. Use this from save
   * handlers to invalidate a single record without paying for a full
   * list refresh.
   */
  invalidate: (type: string, name?: string) => void;
  /**
   * Ensure the list of items for `type` has been loaded (or is being
   * loaded). Concurrent calls share the same in-flight promise. If the
   * cache is fresh (within the TTL), this is a no-op.
   */
  ensureType: (type: string) => Promise<any[]>;
  /**
   * Fetch a single item by `(type, name)`. Result is cached in the
   * per-name map and reused on subsequent calls. Returns `null` when
   * the item does not exist.
   */
  getItem: (type: string, name: string) => Promise<any | null>;
  /**
   * Synchronously read items for any metadata type from the cache.
   * Triggers `ensureType(type)` as a side effect when the bucket is
   * still idle, so legacy call sites keep working.
   */
  getItemsByType: (type: string) => any[];
}

interface MetadataProviderProps {
  children: ReactNode;
  adapter: ObjectStackAdapter;
  /**
   * Cache TTL in milliseconds for list fetches. After this interval a
   * read still returns cached data immediately, but `ensureType` will
   * also kick off a background re-fetch. Defaults to 5 minutes.
   */
  ttlMs?: number;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

/** Default freshness TTL for list buckets. */
const DEFAULT_TTL_MS = 5 * 60 * 1000;

/** Metadata types eagerly fetched at provider mount. */
const EAGER_TYPES = ['app'] as const;

/** Legacy state-key → metadata type mapping, used by getters. */
const TYPE_BY_STATE_KEY: Record<keyof Omit<MetadataState, 'loading' | 'error'>, string> = {
  apps: 'app',
  objects: 'object',
  dashboards: 'dashboard',
  reports: 'report',
  pages: 'page',
};

/** sessionStorage key prefix for list persistence. */
const SESSION_STORAGE_PREFIX = 'objectui:metadata:';

/** Dev-only debug logger — silenced in production builds. */
// Vite replaces `import.meta.env.MODE` at build time. Fall back to `process.env`
// for non-Vite runtimes (Node-based vitest, SSR) where `import.meta.env` is
// undefined. Wrapped in try/catch so a missing global never breaks rendering.
function isDev(): boolean {
  try {
    const meta: any = (import.meta as any);
    if (meta && meta.env && typeof meta.env.MODE === 'string') {
      return meta.env.MODE !== 'production';
    }
  } catch {
    /* import.meta unavailable — fall through */
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

/** Normalize a list-shaped metadata response to a plain array. */
function extractItems(res: unknown): any[] {
  if (res && typeof res === 'object' && 'items' in res && Array.isArray((res as { items: unknown[] }).items)) {
    return (res as { items: unknown[] }).items;
  }
  return [];
}

/** Normalize a single-item response (`{ item: {...} }` or raw) to the item. */
function extractItem(res: unknown): any | null {
  if (res == null) return null;
  if (typeof res === 'object' && 'item' in res) {
    return (res as { item: any }).item ?? null;
  }
  return res;
}

/** Type guard for metadata items that carry a string `name` identifier. */
function isNamedItem(item: unknown): item is { name: string } {
  return (
    !!item &&
    typeof item === 'object' &&
    'name' in item &&
    typeof (item as { name: unknown }).name === 'string'
  );
}

/** Build an empty cache entry for a type. */
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

/** Best-effort sessionStorage read for the eager `app` list. */
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

/** Best-effort sessionStorage write. Failures are silently ignored. */
function saveToSession(type: string, items: any[]): void {
  if (typeof sessionStorage === 'undefined') return;
  try {
    sessionStorage.setItem(SESSION_STORAGE_PREFIX + type, JSON.stringify(items));
  } catch {
    /* quota or serialization failure — non-fatal */
  }
}

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

const MetadataCtx = createContext<MetadataContextValue | null>(null);

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------

export function MetadataProvider({ children, adapter, ttlMs = DEFAULT_TTL_MS }: MetadataProviderProps) {
  // Cache map is the single source of truth. We keep it in a ref so
  // ensureType / getItem can mutate it without forcing a re-render, and
  // bump `version` to publish the new snapshot to consumers.
  const cacheRef = useRef<Map<string, TypeCacheEntry>>(new Map());
  const itemPromisesRef = useRef<Map<string, ItemPromiseMap>>(new Map());
  const adapterRef = useRef(adapter);
  adapterRef.current = adapter;

  const [version, setVersion] = useState(0);
  const bump = useCallback(() => setVersion(v => v + 1), []);

  /** Lookup-or-create the cache entry for a type (no fetching). */
  const getEntry = useCallback((type: string): TypeCacheEntry => {
    let entry = cacheRef.current.get(type);
    if (!entry) {
      entry = emptyEntry();
      cacheRef.current.set(type, entry);
    }
    return entry;
  }, []);

  // -------------------------------------------------------------------------
  // ensureType — load (or re-load) the list bucket for a type
  // -------------------------------------------------------------------------
  const ensureType = useCallback(
    (type: string): Promise<any[]> => {
      const entry = getEntry(type);

      // De-dupe concurrent loads.
      if (entry.promise) return entry.promise;

      // Fresh enough — return cached items, no fetch.
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
          // Hydrate per-name cache so subsequent getItem() calls hit memory.
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
          // Match v1 behaviour: never reject ensureType — surface error via state.
          return [] as any[];
        });

      entry.promise = promise;
      bump();
      return promise;
    },
    [bump, getEntry, ttlMs],
  );

  // -------------------------------------------------------------------------
  // getItem — fetch a single record
  // -------------------------------------------------------------------------
  const getItem = useCallback(
    (type: string, name: string): Promise<any | null> => {
      const entry = getEntry(type);

      // 1) Memory hit — already cached (either via list or prior single fetch).
      if (entry.byName.has(name)) {
        debug(`item cache hit type=${type} name=${name}`);
        return Promise.resolve(entry.byName.get(name) ?? null);
      }

      // 2) De-dupe concurrent single fetches per (type, name).
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
          // No bump() — single-item reads don't change the legacy arrays.
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

  // -------------------------------------------------------------------------
  // refresh — per-type or "everything currently loaded"
  // -------------------------------------------------------------------------
  const refresh = useCallback(
    async (type?: string): Promise<void> => {
      if (type) {
        const entry = getEntry(type);
        entry.fetchedAt = 0; // force a fetch
        entry.byName.clear();
        await ensureType(type);
        return;
      }
      // No-arg legacy form: refresh every type that's already in use.
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

  // -------------------------------------------------------------------------
  // invalidate — drop a single (type, name) or an entire type bucket
  // -------------------------------------------------------------------------
  const invalidate = useCallback(
    (type: string, name?: string): void => {
      const entry = cacheRef.current.get(type);
      if (!entry) return;
      if (name) {
        entry.byName.delete(name);
        // Also remove from list snapshot so legacy reads don't return stale.
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

  // -------------------------------------------------------------------------
  // Initial mount — only the `app` list is fetched eagerly.
  // -------------------------------------------------------------------------
  const [initialLoading, setInitialLoading] = useState(true);
  const [initialError, setInitialError] = useState<Error | null>(null);

  useEffect(() => {
    let cancelled = false;

    // Hydrate the `app` bucket from sessionStorage (instant first paint on
    // reload). The TTL refresh below will replace it with fresh data.
    const cached = loadFromSession('app');
    if (cached) {
      const entry = getEntry('app');
      entry.items = cached;
      entry.status = 'ready';
      entry.fetchedAt = 0; // mark as stale so a background refresh fires
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
    // adapter changes recreate the provider in practice; ensureType/getEntry
    // are stable callbacks.
  }, [adapter, ensureType, getEntry, bump]);

  // -------------------------------------------------------------------------
  // Build the legacy-shaped value with auto-ensure getters.
  // -------------------------------------------------------------------------
  const value = useMemo<MetadataContextValue>(() => {
    // Keep `version` in the dep array so the snapshot updates whenever
    // the cache mutates. The variable is otherwise unused — referencing
    // it here makes the lint rule happy and the dependency explicit.
    void version;

    const readType = (type: string): any[] => {
      const entry = getEntry(type);
      if (entry.status === 'idle') {
        // Kick off a fetch on first read. Fire-and-forget — the resulting
        // setState will re-render this provider and consumers.
        void ensureType(type);
      }
      return entry.items;
    };

    const getItemsByType = (type: string): any[] => readType(type);

    const base: MetadataContextValue = {
      // Eagerly-loaded — direct read.
      apps: getEntry('app').items,
      // Lazy — read via getter that auto-triggers ensureType on first access.
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

// ---------------------------------------------------------------------------
// Hooks
// ---------------------------------------------------------------------------

/**
 * Access the runtime metadata cache. Must be used inside a
 * `<MetadataProvider>`.
 */
export function useMetadata(): MetadataContextValue {
  const ctx = useContext(MetadataCtx);
  if (!ctx) {
    throw new Error('useMetadata must be used within a <MetadataProvider>');
  }
  return ctx;
}

/**
 * Subscribe to the items of a specific metadata type, triggering a
 * lazy fetch on first read. Prefer this over destructuring
 * `useMetadata().<type>` in new code — it makes the dependency
 * explicit and avoids accidentally pulling in unrelated buckets.
 */
export function useMetadataType(type: string): { items: any[]; loading: boolean; error: Error | null } {
  const ctx = useMetadata();
  // Reading via the snapshot getter both kicks off the fetch and
  // returns the current items.
  const items = ctx.getItemsByType(type);
  // We can't easily expose per-type status without adding it to the
  // context value; for now derive from the conventions: empty + first
  // render after ensureType => loading.
  return { items, loading: ctx.loading && type === 'app', error: ctx.error };
}

/**
 * Fetch (and cache) a single metadata item by `(type, name)`.
 * Returns `{ item, loading, error }`. Subsequent calls for the same
 * pair resolve from the in-memory cache.
 */
export function useMetadataItem(
  type: string,
  name: string | undefined | null,
): { item: any | null; loading: boolean; error: Error | null } {
  const { getItem } = useMetadata();
  const [state, setState] = useState<{ item: any | null; loading: boolean; error: Error | null }>({
    item: null,
    loading: !!name,
    error: null,
  });

  useEffect(() => {
    if (!name) {
      setState({ item: null, loading: false, error: null });
      return;
    }
    let cancelled = false;
    setState(s => ({ ...s, loading: true, error: null }));
    getItem(type, name)
      .then(item => {
        if (!cancelled) setState({ item, loading: false, error: null });
      })
      .catch(err => {
        if (!cancelled) {
          setState({
            item: null,
            loading: false,
            error: err instanceof Error ? err : new Error(String(err)),
          });
        }
      });
    return () => {
      cancelled = true;
    };
  }, [type, name, getItem]);

  return state;
}
