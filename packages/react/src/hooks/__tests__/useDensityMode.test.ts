/**
 * Tests for useDensityMode hook
 */
import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useDensityMode } from '../useDensityMode';

describe('useDensityMode', () => {
  it('defaults to comfortable mode', () => {
    const { result } = renderHook(() => useDensityMode());
    expect(result.current.mode).toBe('comfortable');
  });

  it('accepts initial mode', () => {
    const { result } = renderHook(() => useDensityMode('compact'));
    expect(result.current.mode).toBe('compact');
  });

  it('provides correct row height for compact', () => {
    const { result } = renderHook(() => useDensityMode('compact'));
    expect(result.current.rowHeight).toBe(32);
  });

  it('provides correct row height for comfortable', () => {
    const { result } = renderHook(() => useDensityMode('comfortable'));
    expect(result.current.rowHeight).toBe(40);
  });

  it('provides correct row height for spacious', () => {
    const { result } = renderHook(() => useDensityMode('spacious'));
    expect(result.current.rowHeight).toBe(52);
  });

  it('provides padding classes', () => {
    const { result } = renderHook(() => useDensityMode('compact'));
    expect(result.current.paddingClass).toContain('py-1');
    expect(result.current.paddingClass).toContain('px-2');
  });

  it('provides font size classes', () => {
    const { result } = renderHook(() => useDensityMode('compact'));
    expect(result.current.fontSizeClass).toBe('text-xs');
  });

  it('cycles through modes', () => {
    const { result } = renderHook(() => useDensityMode('compact'));

    act(() => {
      result.current.cycle();
    });
    expect(result.current.mode).toBe('comfortable');

    act(() => {
      result.current.cycle();
    });
    expect(result.current.mode).toBe('spacious');

    act(() => {
      result.current.cycle();
    });
    expect(result.current.mode).toBe('compact');
  });

  it('allows setting mode directly', () => {
    const { result } = renderHook(() => useDensityMode());

    act(() => {
      result.current.setMode('spacious');
    });
    expect(result.current.mode).toBe('spacious');
  });

  it('accepts custom row heights', () => {
    const { result } = renderHook(() =>
      useDensityMode('compact', {
        rowHeights: { compact: 24, comfortable: 36, spacious: 48 },
      })
    );
    expect(result.current.rowHeight).toBe(24);
  });
});
