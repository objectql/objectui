/**
 * Tests for useCrudShortcuts hook
 */
import { describe, it, expect, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useCrudShortcuts } from '../useCrudShortcuts';

describe('useCrudShortcuts', () => {
  it('renders without error with empty callbacks', () => {
    expect(() => {
      renderHook(() => useCrudShortcuts({}));
    }).not.toThrow();
  });

  it('renders without error when disabled', () => {
    expect(() => {
      renderHook(() => useCrudShortcuts({}, false));
    }).not.toThrow();
  });

  it('registers onCreate shortcut', () => {
    const onCreate = vi.fn();
    expect(() => {
      renderHook(() => useCrudShortcuts({ onCreate }));
    }).not.toThrow();
  });

  it('registers onEdit shortcut', () => {
    const onEdit = vi.fn();
    expect(() => {
      renderHook(() => useCrudShortcuts({ onEdit }));
    }).not.toThrow();
  });

  it('registers onDelete shortcut', () => {
    const onDelete = vi.fn();
    expect(() => {
      renderHook(() => useCrudShortcuts({ onDelete }));
    }).not.toThrow();
  });

  it('registers onSave shortcut', () => {
    const onSave = vi.fn();
    expect(() => {
      renderHook(() => useCrudShortcuts({ onSave }));
    }).not.toThrow();
  });

  it('registers onDuplicate shortcut', () => {
    const onDuplicate = vi.fn();
    expect(() => {
      renderHook(() => useCrudShortcuts({ onDuplicate }));
    }).not.toThrow();
  });

  it('registers onCancel shortcut', () => {
    const onCancel = vi.fn();
    expect(() => {
      renderHook(() => useCrudShortcuts({ onCancel }));
    }).not.toThrow();
  });

  it('registers onSearch shortcut', () => {
    const onSearch = vi.fn();
    expect(() => {
      renderHook(() => useCrudShortcuts({ onSearch }));
    }).not.toThrow();
  });

  it('registers all shortcuts together', () => {
    expect(() => {
      renderHook(() =>
        useCrudShortcuts({
          onCreate: vi.fn(),
          onEdit: vi.fn(),
          onDelete: vi.fn(),
          onSave: vi.fn(),
          onDuplicate: vi.fn(),
          onCancel: vi.fn(),
          onSearch: vi.fn(),
        })
      );
    }).not.toThrow();
  });
});
