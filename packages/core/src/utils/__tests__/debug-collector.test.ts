/**
 * ObjectUI
 * Copyright (c) 2024-present ObjectStack Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { DebugCollector } from '../debug-collector';

describe('DebugCollector', () => {
  beforeEach(() => {
    DebugCollector.resetInstance();
  });

  it('should return a singleton instance', () => {
    const a = DebugCollector.getInstance();
    const b = DebugCollector.getInstance();
    expect(a).toBe(b);
  });

  it('should collect perf entries', () => {
    const collector = DebugCollector.getInstance();
    collector.addPerf({ type: 'button', id: 'btn1', durationMs: 5.2, timestamp: Date.now() });
    const entries = collector.getEntries('perf');
    expect(entries).toHaveLength(1);
    expect(entries[0].kind).toBe('perf');
    expect((entries[0].data as any).type).toBe('button');
  });

  it('should collect expr entries', () => {
    const collector = DebugCollector.getInstance();
    collector.addExpr({ expression: '${data.x > 1}', result: true, timestamp: Date.now() });
    const entries = collector.getEntries('expr');
    expect(entries).toHaveLength(1);
    expect(entries[0].kind).toBe('expr');
    expect((entries[0].data as any).result).toBe(true);
  });

  it('should collect event entries', () => {
    const collector = DebugCollector.getInstance();
    collector.addEvent({ action: 'navigate', payload: { to: '/home' }, timestamp: Date.now() });
    const entries = collector.getEntries('event');
    expect(entries).toHaveLength(1);
    expect(entries[0].kind).toBe('event');
    expect((entries[0].data as any).action).toBe('navigate');
  });

  it('should return all entries when no kind filter', () => {
    const collector = DebugCollector.getInstance();
    collector.addPerf({ type: 'text', durationMs: 1, timestamp: Date.now() });
    collector.addExpr({ expression: 'a', result: 1, timestamp: Date.now() });
    collector.addEvent({ action: 'click', timestamp: Date.now() });
    expect(collector.getEntries()).toHaveLength(3);
  });

  it('should notify subscribers on new entry', () => {
    const collector = DebugCollector.getInstance();
    const fn = vi.fn();
    collector.subscribe(fn);
    collector.addPerf({ type: 'card', durationMs: 2, timestamp: Date.now() });
    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith(expect.objectContaining({ kind: 'perf' }));
  });

  it('should allow unsubscribe', () => {
    const collector = DebugCollector.getInstance();
    const fn = vi.fn();
    const unsub = collector.subscribe(fn);
    unsub();
    collector.addPerf({ type: 'x', durationMs: 0, timestamp: Date.now() });
    expect(fn).not.toHaveBeenCalled();
  });

  it('should clear entries', () => {
    const collector = DebugCollector.getInstance();
    collector.addPerf({ type: 'x', durationMs: 0, timestamp: Date.now() });
    collector.addExpr({ expression: 'a', result: 1, timestamp: Date.now() });
    collector.clear();
    expect(collector.getEntries()).toHaveLength(0);
  });

  it('should cap entries at MAX_ENTRIES', () => {
    const collector = DebugCollector.getInstance();
    for (let i = 0; i < 250; i++) {
      collector.addPerf({ type: `c${i}`, durationMs: i, timestamp: Date.now() });
    }
    // MAX_ENTRIES is 200
    expect(collector.getEntries().length).toBeLessThanOrEqual(200);
  });

  it('should swallow subscriber errors gracefully', () => {
    const collector = DebugCollector.getInstance();
    const badFn = vi.fn(() => { throw new Error('boom'); });
    const goodFn = vi.fn();
    collector.subscribe(badFn);
    collector.subscribe(goodFn);
    collector.addPerf({ type: 'x', durationMs: 0, timestamp: Date.now() });
    expect(goodFn).toHaveBeenCalledTimes(1);
  });
});
