/**
 * Tests for useFocusTrap hook
 */
import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useFocusTrap } from '../useFocusTrap';

describe('useFocusTrap', () => {
  it('returns a ref object', () => {
    const { result } = renderHook(() => useFocusTrap());
    expect(result.current).toBeDefined();
    expect(result.current).toHaveProperty('current');
  });

  it('returns a ref with null initial value', () => {
    const { result } = renderHook(() => useFocusTrap());
    expect(result.current.current).toBeNull();
  });

  it('accepts disabled option', () => {
    const { result } = renderHook(() =>
      useFocusTrap({ enabled: false })
    );
    expect(result.current).toBeDefined();
  });

  it('accepts all options without error', () => {
    const onEscape = vi.fn();
    const { result } = renderHook(() =>
      useFocusTrap({
        enabled: true,
        autoFocus: true,
        restoreFocus: true,
        escapeDeactivates: true,
        onEscape,
        initialFocus: '.first-input',
      })
    );
    expect(result.current).toBeDefined();
  });

  it('defaults to enabled when no options provided', () => {
    const { result } = renderHook(() => useFocusTrap());
    // Should not throw
    expect(result.current.current).toBeNull();
  });
});
