/**
 * Tests for useKeyboardShortcuts hook
 */
import { describe, it, expect, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useKeyboardShortcuts, getShortcutDescriptions } from '../useKeyboardShortcuts';
import type { KeyboardShortcutDefinition } from '../useKeyboardShortcuts';

describe('useKeyboardShortcuts', () => {
  it('registers shortcuts without error', () => {
    const handler = vi.fn();
    const shortcuts: KeyboardShortcutDefinition[] = [
      { key: 'k', ctrlOrMeta: true, handler, description: 'Search' },
    ];

    expect(() => {
      renderHook(() => useKeyboardShortcuts(shortcuts));
    }).not.toThrow();
  });

  it('handles empty shortcuts array', () => {
    expect(() => {
      renderHook(() => useKeyboardShortcuts([]));
    }).not.toThrow();
  });

  it('respects enabled option', () => {
    const handler = vi.fn();
    const shortcuts: KeyboardShortcutDefinition[] = [
      { key: 'k', handler },
    ];

    expect(() => {
      renderHook(() => useKeyboardShortcuts(shortcuts, { enabled: false }));
    }).not.toThrow();
  });

  it('fires handler on matching keyboard event', () => {
    const handler = vi.fn();
    const shortcuts: KeyboardShortcutDefinition[] = [
      { key: 'Escape', handler },
    ];

    renderHook(() => useKeyboardShortcuts(shortcuts));

    // Simulate keydown
    const event = new KeyboardEvent('keydown', {
      key: 'Escape',
      bubbles: true,
    });
    document.dispatchEvent(event);

    expect(handler).toHaveBeenCalledTimes(1);
  });

  it('does not fire handler for non-matching key', () => {
    const handler = vi.fn();
    const shortcuts: KeyboardShortcutDefinition[] = [
      { key: 'k', ctrlOrMeta: true, handler },
    ];

    renderHook(() => useKeyboardShortcuts(shortcuts));

    const event = new KeyboardEvent('keydown', {
      key: 'k',
      bubbles: true,
      // No ctrl or meta
    });
    document.dispatchEvent(event);

    expect(handler).not.toHaveBeenCalled();
  });

  it('fires handler when modifier keys match', () => {
    const handler = vi.fn();
    const shortcuts: KeyboardShortcutDefinition[] = [
      { key: 'k', ctrlOrMeta: true, handler },
    ];

    renderHook(() => useKeyboardShortcuts(shortcuts));

    const event = new KeyboardEvent('keydown', {
      key: 'k',
      ctrlKey: true,
      bubbles: true,
    });
    document.dispatchEvent(event);

    expect(handler).toHaveBeenCalledTimes(1);
  });

  it('skips disabled shortcuts', () => {
    const handler = vi.fn();
    const shortcuts: KeyboardShortcutDefinition[] = [
      { key: 'k', handler, enabled: false },
    ];

    renderHook(() => useKeyboardShortcuts(shortcuts));

    const event = new KeyboardEvent('keydown', {
      key: 'k',
      bubbles: true,
    });
    document.dispatchEvent(event);

    expect(handler).not.toHaveBeenCalled();
  });
});

describe('getShortcutDescriptions', () => {
  it('returns formatted descriptions', () => {
    const shortcuts: KeyboardShortcutDefinition[] = [
      { key: 'k', ctrlOrMeta: true, handler: vi.fn(), description: 'Search' },
      { key: 'n', ctrlOrMeta: true, shift: true, handler: vi.fn(), description: 'New' },
      { key: 'Escape', handler: vi.fn(), description: 'Close' },
    ];

    const descriptions = getShortcutDescriptions(shortcuts);

    expect(descriptions).toHaveLength(3);
    expect(descriptions[0]).toEqual({ keys: '⌘/Ctrl + K', description: 'Search' });
    expect(descriptions[1]).toEqual({ keys: '⌘/Ctrl + Shift + N', description: 'New' });
    expect(descriptions[2]).toEqual({ keys: 'Escape', description: 'Close' });
  });

  it('excludes shortcuts without descriptions', () => {
    const shortcuts: KeyboardShortcutDefinition[] = [
      { key: 'k', handler: vi.fn() },
      { key: 'n', handler: vi.fn(), description: 'New' },
    ];

    const descriptions = getShortcutDescriptions(shortcuts);
    expect(descriptions).toHaveLength(1);
  });

  it('excludes disabled shortcuts', () => {
    const shortcuts: KeyboardShortcutDefinition[] = [
      { key: 'k', handler: vi.fn(), description: 'Search', enabled: false },
    ];

    const descriptions = getShortcutDescriptions(shortcuts);
    expect(descriptions).toHaveLength(0);
  });
});
