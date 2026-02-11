/**
 * Tests for useAnimation and useReducedMotion hooks
 */
import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useAnimation } from '../useAnimation';
import { useReducedMotion } from '../useReducedMotion';

describe('useAnimation', () => {
  it('returns empty className and style for no config', () => {
    const { result } = renderHook(() => useAnimation());
    expect(result.current.className).toBe('');
    expect(result.current.style).toEqual({});
  });

  it('returns empty when preset is none', () => {
    const { result } = renderHook(() => useAnimation({ preset: 'none' }));
    expect(result.current.className).toBe('');
  });

  it('returns empty when disabled', () => {
    const { result } = renderHook(() =>
      useAnimation({ preset: 'fade', enabled: false })
    );
    expect(result.current.className).toBe('');
  });

  it('returns correct className for fade preset', () => {
    const { result } = renderHook(() => useAnimation({ preset: 'fade' }));
    expect(result.current.className).toContain('fade-in');
  });

  it('returns correct className for slide-up preset', () => {
    const { result } = renderHook(() => useAnimation({ preset: 'slide-up' }));
    expect(result.current.className).toContain('slide-in-from-bottom');
  });

  it('returns correct className for scale preset', () => {
    const { result } = renderHook(() => useAnimation({ preset: 'scale' }));
    expect(result.current.className).toContain('zoom-in');
  });

  it('returns correct className for scale-fade preset', () => {
    const { result } = renderHook(() => useAnimation({ preset: 'scale-fade' }));
    expect(result.current.className).toContain('fade-in');
    expect(result.current.className).toContain('zoom-in');
  });

  it('applies custom duration', () => {
    const { result } = renderHook(() =>
      useAnimation({ preset: 'fade', duration: 300 })
    );
    expect(result.current.style.animationDuration).toBe('300ms');
  });

  it('applies custom delay', () => {
    const { result } = renderHook(() =>
      useAnimation({ preset: 'fade', delay: 100 })
    );
    expect(result.current.style.animationDelay).toBe('100ms');
  });

  it('applies easing function', () => {
    const { result } = renderHook(() =>
      useAnimation({ preset: 'fade', easing: 'spring' })
    );
    expect(result.current.style.animationTimingFunction).toContain('cubic-bezier');
  });
});

describe('useReducedMotion', () => {
  it('returns a boolean value', () => {
    const { result } = renderHook(() => useReducedMotion());
    expect(typeof result.current).toBe('boolean');
  });

  it('defaults to false when matchMedia returns false', () => {
    const { result } = renderHook(() => useReducedMotion());
    // jsdom matchMedia always returns false by default
    expect(result.current).toBe(false);
  });
});
