/**
 * Tests for usePageTransition hook
 */
import { describe, it, expect, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { usePageTransition } from '../usePageTransition';

describe('usePageTransition', () => {

  it('returns inactive result when type is none (default)', () => {
    const { result } = renderHook(() => usePageTransition());
    expect(result.current.isActive).toBe(false);
    expect(result.current.enterClassName).toBe('');
    expect(result.current.exitClassName).toBe('');
    expect(result.current.type).toBe('none');
  });

  it('returns active result for fade transition', () => {
    const { result } = renderHook(() => usePageTransition({ type: 'fade' }));
    expect(result.current.isActive).toBe(true);
    expect(result.current.enterClassName).toContain('fade-in');
    expect(result.current.exitClassName).toContain('fade-out');
    expect(result.current.type).toBe('fade');
  });

  it('returns correct classes for slide_up transition', () => {
    const { result } = renderHook(() => usePageTransition({ type: 'slide_up' }));
    expect(result.current.isActive).toBe(true);
    expect(result.current.enterClassName).toContain('slide-in-from-bottom');
    expect(result.current.exitClassName).toContain('slide-out-to-top');
  });

  it('returns correct classes for slide_down transition', () => {
    const { result } = renderHook(() => usePageTransition({ type: 'slide_down' }));
    expect(result.current.enterClassName).toContain('slide-in-from-top');
    expect(result.current.exitClassName).toContain('slide-out-to-bottom');
  });

  it('returns correct classes for slide_left transition', () => {
    const { result } = renderHook(() => usePageTransition({ type: 'slide_left' }));
    expect(result.current.enterClassName).toContain('slide-in-from-right');
    expect(result.current.exitClassName).toContain('slide-out-to-left');
  });

  it('returns correct classes for slide_right transition', () => {
    const { result } = renderHook(() => usePageTransition({ type: 'slide_right' }));
    expect(result.current.enterClassName).toContain('slide-in-from-left');
    expect(result.current.exitClassName).toContain('slide-out-to-right');
  });

  it('returns correct classes for scale transition', () => {
    const { result } = renderHook(() => usePageTransition({ type: 'scale' }));
    expect(result.current.enterClassName).toContain('zoom-in');
    expect(result.current.exitClassName).toContain('zoom-out');
  });

  it('returns correct classes for rotate transition', () => {
    const { result } = renderHook(() => usePageTransition({ type: 'rotate' }));
    expect(result.current.enterClassName).toContain('spin-in');
    expect(result.current.exitClassName).toContain('spin-out');
  });

  it('returns correct classes for flip transition', () => {
    const { result } = renderHook(() => usePageTransition({ type: 'flip' }));
    expect(result.current.enterClassName).toContain('zoom-in');
    expect(result.current.exitClassName).toContain('zoom-out');
  });

  it('uses default duration of 300ms', () => {
    const { result } = renderHook(() => usePageTransition({ type: 'fade' }));
    expect(result.current.duration).toBe(300);
    expect(result.current.enterStyle.animationDuration).toBe('300ms');
  });

  it('accepts custom duration', () => {
    const { result } = renderHook(() => usePageTransition({ type: 'fade', duration: 500 }));
    expect(result.current.duration).toBe(500);
    expect(result.current.enterStyle.animationDuration).toBe('500ms');
  });

  it('uses ease_in_out easing by default', () => {
    const { result } = renderHook(() => usePageTransition({ type: 'fade' }));
    expect(result.current.enterStyle.animationTimingFunction).toBe('ease-in-out');
  });

  it('accepts custom easing', () => {
    const { result } = renderHook(() => usePageTransition({ type: 'fade', easing: 'spring' }));
    expect(result.current.enterStyle.animationTimingFunction).toBe('cubic-bezier(0.34, 1.56, 0.64, 1)');
  });

  it('sets animationFillMode to both', () => {
    const { result } = renderHook(() => usePageTransition({ type: 'fade' }));
    expect(result.current.enterStyle.animationFillMode).toBe('both');
    expect(result.current.exitStyle.animationFillMode).toBe('both');
  });

  it('applies crossFade positioning', () => {
    const { result } = renderHook(() => usePageTransition({ type: 'fade', crossFade: true }));
    expect(result.current.enterStyle.position).toBe('absolute');
    expect(result.current.enterStyle.inset).toBe('0');
    expect(result.current.exitStyle.position).toBe('absolute');
    expect(result.current.exitStyle.inset).toBe('0');
  });

  it('does not apply crossFade positioning when disabled', () => {
    const { result } = renderHook(() => usePageTransition({ type: 'fade', crossFade: false }));
    expect(result.current.enterStyle.position).toBeUndefined();
    expect(result.current.exitStyle.position).toBeUndefined();
  });

  it('returns inactive when reduced motion is preferred', () => {
    // Mock window.matchMedia to simulate reduced motion preference
    const original = window.matchMedia;
    window.matchMedia = vi.fn((query: string) => ({
      matches: query === '(prefers-reduced-motion: reduce)',
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })) as unknown as typeof window.matchMedia;

    const { result } = renderHook(() => usePageTransition({ type: 'fade' }));
    expect(result.current.isActive).toBe(false);
    expect(result.current.enterClassName).toBe('');
    expect(result.current.exitClassName).toBe('');

    window.matchMedia = original;
  });

  it('returns empty styles when inactive', () => {
    const { result } = renderHook(() => usePageTransition({ type: 'none' }));
    expect(result.current.enterStyle).toEqual({});
    expect(result.current.exitStyle).toEqual({});
  });

  it('accepts linear easing', () => {
    const { result } = renderHook(() => usePageTransition({ type: 'fade', easing: 'linear' }));
    expect(result.current.enterStyle.animationTimingFunction).toBe('linear');
  });

  it('accepts ease easing', () => {
    const { result } = renderHook(() => usePageTransition({ type: 'fade', easing: 'ease' }));
    expect(result.current.enterStyle.animationTimingFunction).toBe('ease');
  });

  it('accepts ease_in easing', () => {
    const { result } = renderHook(() => usePageTransition({ type: 'fade', easing: 'ease_in' }));
    expect(result.current.enterStyle.animationTimingFunction).toBe('ease-in');
  });

  it('accepts ease_out easing', () => {
    const { result } = renderHook(() => usePageTransition({ type: 'fade', easing: 'ease_out' }));
    expect(result.current.enterStyle.animationTimingFunction).toBe('ease-out');
  });
});
