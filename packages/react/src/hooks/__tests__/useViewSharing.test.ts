/**
 * Tests for useViewSharing hook
 */
import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useViewSharing } from '../useViewSharing';
import type { SavedView } from '../useViewSharing';

const createView = (overrides?: Partial<SavedView>): SavedView => ({
  id: 'test-1',
  name: 'Test View',
  config: { filters: [] },
  visibility: 'private',
  updatedAt: new Date(),
  ...overrides,
});

describe('useViewSharing', () => {
  it('starts with empty views by default', () => {
    const { result } = renderHook(() => useViewSharing());
    expect(result.current.views).toEqual([]);
    expect(result.current.activeView).toBeNull();
  });

  it('starts with provided initial views', () => {
    const initial = [createView()];
    const { result } = renderHook(() => useViewSharing(initial));
    expect(result.current.views).toHaveLength(1);
    expect(result.current.activeView?.id).toBe('test-1');
  });

  it('saves a new view', () => {
    const { result } = renderHook(() => useViewSharing());

    act(() => {
      result.current.saveView({
        name: 'My View',
        config: { sort: 'name' },
        visibility: 'private',
      });
    });

    expect(result.current.views).toHaveLength(1);
    expect(result.current.views[0].name).toBe('My View');
  });

  it('returns ID when saving a view', () => {
    const { result } = renderHook(() => useViewSharing());

    let id: string = '';
    act(() => {
      id = result.current.saveView({
        name: 'My View',
        config: {},
        visibility: 'private',
      });
    });

    expect(id).toBeTruthy();
    expect(id).toContain('view-');
  });

  it('deletes a view', () => {
    const initial = [createView()];
    const { result } = renderHook(() => useViewSharing(initial));

    act(() => {
      result.current.deleteView('test-1');
    });

    expect(result.current.views).toHaveLength(0);
  });

  it('sets active view', () => {
    const initial = [
      createView({ id: 'v1', name: 'View 1' }),
      createView({ id: 'v2', name: 'View 2' }),
    ];
    const { result } = renderHook(() => useViewSharing(initial));

    act(() => {
      result.current.setActiveView('v2');
    });

    expect(result.current.activeView?.id).toBe('v2');
  });

  it('duplicates a view', () => {
    const initial = [createView()];
    const { result } = renderHook(() => useViewSharing(initial));

    act(() => {
      result.current.duplicateView('test-1', 'Copy of Test');
    });

    expect(result.current.views).toHaveLength(2);
    expect(result.current.views[1].name).toBe('Copy of Test');
    expect(result.current.views[1].isDefault).toBe(false);
  });

  it('updates view visibility', () => {
    const initial = [createView()];
    const { result } = renderHook(() => useViewSharing(initial));

    act(() => {
      result.current.setVisibility('test-1', 'organization');
    });

    expect(result.current.views[0].visibility).toBe('organization');
  });

  it('selects default view as active', () => {
    const initial = [
      createView({ id: 'v1', name: 'View 1' }),
      createView({ id: 'v2', name: 'View 2', isDefault: true }),
    ];
    const { result } = renderHook(() => useViewSharing(initial));

    expect(result.current.activeView?.id).toBe('v2');
  });
});
