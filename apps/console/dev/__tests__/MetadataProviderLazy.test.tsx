/**
 * MetadataProvider lazy-loading tests
 *
 * Verifies the Phase 1 refactor: only the `app` type is fetched at
 * provider mount; other metadata types are deferred until a consumer
 * actually reads them. Also covers in-flight de-duplication and
 * per-type invalidation/refresh behaviour.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, act, waitFor } from '@testing-library/react';
import { MetadataProvider, useMetadata, useMetadataItem } from '@object-ui/app-shell';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function createMockAdapter() {
  const meta = {
    getItems: vi.fn().mockImplementation((type: string) => {
      // Each type returns a distinguishable single-item payload.
      return Promise.resolve({ items: [{ name: `${type}-1` }] });
    }),
    getItem: vi.fn().mockImplementation((type: string, name: string) => {
      return Promise.resolve({ item: { name, type } });
    }),
  };
  const adapter = {
    getClient: () => ({ meta }),
  } as any;
  return { adapter, meta };
}

function flushAll() {
  // Two microtask ticks are needed: one for the `ensureType` promise
  // chain, another for the React state update that bumps the provider's
  // version counter. `waitFor` is used elsewhere for assertion polling;
  // `flushAll` just gets us past the initial mount transition.
  return act(async () => {
    await Promise.resolve();
    await Promise.resolve();
  });
}

// Component that captures the latest context value into a ref-like object
// so assertions can run outside of render.
function Capture({ sink, read }: { sink: { value: any }; read?: (ctx: any) => void }) {
  const ctx = useMetadata();
  sink.value = ctx;
  if (read) read(ctx);
  return null;
}

beforeEach(() => {
  if (typeof sessionStorage !== 'undefined') sessionStorage.clear();
});

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('MetadataProvider — lazy loading (Phase 1)', () => {
  it('fetches only the app list on initial mount', async () => {
    const { adapter, meta } = createMockAdapter();
    const sink = { value: null as any };

    render(
      <MetadataProvider adapter={adapter}>
        <Capture sink={sink} />
      </MetadataProvider>,
    );

    await flushAll();
    await waitFor(() => expect(sink.value.loading).toBe(false));

    // Only `app` should have been fetched at this point.
    const calledTypes = meta.getItems.mock.calls.map((c: any[]) => c[0]);
    expect(calledTypes).toEqual(['app']);
    expect(sink.value.apps).toEqual([{ name: 'app-1' }]);

    // Lazy buckets are still empty arrays — no fetch yet.
    expect(meta.getItems).toHaveBeenCalledTimes(1);
  });

  it('lazily fetches other types only when accessed via the legacy getter', async () => {
    const { adapter, meta } = createMockAdapter();
    const sink = { value: null as any };

    render(
      <MetadataProvider adapter={adapter}>
        <Capture sink={sink} />
      </MetadataProvider>,
    );
    await flushAll();
    await waitFor(() => expect(sink.value.loading).toBe(false));
    expect(meta.getItems).toHaveBeenCalledTimes(1);

    // Read `objects` via the legacy property (auto-triggers ensureType).
    let firstRead: any[] = [];
    await act(async () => {
      firstRead = sink.value.objects;
    });
    // Fetch is in-flight; the synchronous read returns the empty snapshot.
    expect(firstRead).toEqual([]);

    // Wait for the lazy fetch to settle.
    await waitFor(() =>
      expect(meta.getItems).toHaveBeenCalledWith('object'),
    );
    await waitFor(() => expect(sink.value.objects).toEqual([{ name: 'object-1' }]));

    // Still only two list fetches in total — `dashboard / report / page` untouched.
    expect(meta.getItems).toHaveBeenCalledTimes(2);
    const types = meta.getItems.mock.calls.map((c: any[]) => c[0]).sort();
    expect(types).toEqual(['app', 'object']);
  });

  it('deduplicates concurrent ensureType calls into a single network request', async () => {
    const { adapter, meta } = createMockAdapter();
    const sink = { value: null as any };

    render(
      <MetadataProvider adapter={adapter}>
        <Capture sink={sink} />
      </MetadataProvider>,
    );
    await flushAll();
    await waitFor(() => expect(sink.value.loading).toBe(false));

    await act(async () => {
      const a = sink.value.ensureType('dashboard');
      const b = sink.value.ensureType('dashboard');
      const c = sink.value.ensureType('dashboard');
      await Promise.all([a, b, c]);
    });

    const dashCalls = meta.getItems.mock.calls.filter((c: any[]) => c[0] === 'dashboard');
    expect(dashCalls.length).toBe(1);
  });

  it('getItem fetches a single record without triggering a list fetch', async () => {
    const { adapter, meta } = createMockAdapter();
    const sink = { value: null as any };

    render(
      <MetadataProvider adapter={adapter}>
        <Capture sink={sink} />
      </MetadataProvider>,
    );
    await flushAll();
    await waitFor(() => expect(sink.value.loading).toBe(false));

    let item: any;
    await act(async () => {
      item = await sink.value.getItem('dashboard', 'sales-overview');
    });
    expect(item).toEqual({ name: 'sales-overview', type: 'dashboard' });

    // No list fetch for `dashboard`.
    const dashCalls = meta.getItems.mock.calls.filter((c: any[]) => c[0] === 'dashboard');
    expect(dashCalls.length).toBe(0);
    expect(meta.getItem).toHaveBeenCalledWith('dashboard', 'sales-overview');

    // Second call serves from the in-memory cache.
    meta.getItem.mockClear();
    await act(async () => {
      item = await sink.value.getItem('dashboard', 'sales-overview');
    });
    expect(item).toEqual({ name: 'sales-overview', type: 'dashboard' });
    expect(meta.getItem).not.toHaveBeenCalled();
  });

  it('invalidate(type, name) drops a single record without dropping the bucket', async () => {
    const { adapter, meta } = createMockAdapter();
    const sink = { value: null as any };

    render(
      <MetadataProvider adapter={adapter}>
        <Capture sink={sink} />
      </MetadataProvider>,
    );
    await flushAll();
    await waitFor(() => expect(sink.value.loading).toBe(false));

    // Prime the dashboard bucket.
    await act(async () => {
      await sink.value.ensureType('dashboard');
    });
    expect(sink.value.dashboards).toEqual([{ name: 'dashboard-1' }]);

    // Invalidate the single item — the bucket is preserved but the entry vanishes.
    await act(async () => {
      sink.value.invalidate('dashboard', 'dashboard-1');
    });
    expect(sink.value.dashboards).toEqual([]);

    // Re-reading via getItem triggers a single-item fetch.
    meta.getItem.mockClear();
    await act(async () => {
      await sink.value.getItem('dashboard', 'dashboard-1');
    });
    expect(meta.getItem).toHaveBeenCalledWith('dashboard', 'dashboard-1');
  });

  it('refresh(type) re-fetches a single bucket; refresh() refreshes only loaded buckets', async () => {
    const { adapter, meta } = createMockAdapter();
    const sink = { value: null as any };

    render(
      <MetadataProvider adapter={adapter}>
        <Capture sink={sink} />
      </MetadataProvider>,
    );
    await flushAll();
    await waitFor(() => expect(sink.value.loading).toBe(false));

    // Load `object` only; leave dashboard/report/page idle.
    await act(async () => {
      await sink.value.ensureType('object');
    });

    meta.getItems.mockClear();
    await act(async () => {
      await sink.value.refresh();
    });

    // refresh() should re-fetch `app` and `object` (loaded), not the idle types.
    const refreshed = meta.getItems.mock.calls.map((c: any[]) => c[0]).sort();
    expect(refreshed).toEqual(['app', 'object']);
  });
});

describe('useMetadataItem hook', () => {
  it('resolves to the fetched item and reports loading transitions', async () => {
    const { adapter, meta } = createMockAdapter();
    let captured: any = null;

    function Probe() {
      const state = useMetadataItem('dashboard', 'sales');
      captured = state;
      return null;
    }

    render(
      <MetadataProvider adapter={adapter}>
        <Probe />
      </MetadataProvider>,
    );

    expect(captured.loading).toBe(true);
    await waitFor(() => expect(captured.loading).toBe(false));
    expect(captured.item).toEqual({ name: 'sales', type: 'dashboard' });
    expect(captured.error).toBeNull();
    expect(meta.getItem).toHaveBeenCalledWith('dashboard', 'sales');
  });
});
