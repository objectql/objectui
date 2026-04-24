import { createContext, useContext, useEffect, useState } from 'react';
import type { ObjectStackAdapter } from '@object-ui/data-objectstack';

// ---------------------------------------------------------------------------
// AdapterContext
// ---------------------------------------------------------------------------

export const AdapterCtx = createContext<ObjectStackAdapter | null>(null);

export function useAdapter(): ObjectStackAdapter | null {
  return useContext(AdapterCtx);
}

// ---------------------------------------------------------------------------
// MetadataContext
// ---------------------------------------------------------------------------

export interface MetadataState {
  apps: any[];
  objects: any[];
  dashboards: any[];
  reports: any[];
  pages: any[];
  loading: boolean;
  error: Error | null;
}

export interface MetadataContextValue extends MetadataState {
  refresh: (type?: string) => Promise<void>;
  invalidate: (type: string, name?: string) => void;
  ensureType: (type: string) => Promise<any[]>;
  getItem: (type: string, name: string) => Promise<any | null>;
  getItemsByType: (type: string) => any[];
}

export const MetadataCtx = createContext<MetadataContextValue | null>(null);

export function useMetadata(): MetadataContextValue {
  const ctx = useContext(MetadataCtx);
  if (!ctx) {
    // Graceful fallback: when a consumer is rendered outside a MetadataProvider
    // (common in unit tests that only need to assert on rendering), return an
    // empty no-op implementation rather than crash. Production code paths
    // should always wrap in <MetadataProvider>.
    return {
      apps: [],
      objects: [],
      dashboards: [],
      reports: [],
      pages: [],
      loading: false,
      error: null,
      refresh: async () => {},
      invalidate: () => {},
      ensureType: async () => [],
      getItem: async () => null,
      getItemsByType: () => [],
    };
  }
  return ctx;
}

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
