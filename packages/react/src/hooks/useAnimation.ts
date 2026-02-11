/**
 * ObjectUI
 * Copyright (c) 2024-present ObjectStack Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { useMemo } from 'react';

/** Animation trigger type */
export type AnimationTriggerType = 'enter' | 'exit' | 'hover' | 'focus' | 'click';

/** Easing presets aligned with EasingFunctionSchema */
export type EasingPreset =
  | 'linear'
  | 'ease'
  | 'ease-in'
  | 'ease-out'
  | 'ease-in-out'
  | 'spring';

/** Transition preset aligned with TransitionPresetSchema */
export type TransitionPresetType =
  | 'fade'
  | 'slide-up'
  | 'slide-down'
  | 'slide-left'
  | 'slide-right'
  | 'scale'
  | 'scale-fade'
  | 'none';

export interface AnimationConfig {
  /** The animation/transition preset */
  preset?: TransitionPresetType;
  /** Duration in milliseconds */
  duration?: number;
  /** Delay in milliseconds */
  delay?: number;
  /** Easing function */
  easing?: EasingPreset;
  /** Whether animation is enabled */
  enabled?: boolean;
}

/** Resolved CSS classes and styles for animation */
export interface AnimationResult {
  /** Tailwind CSS classes for the animation */
  className: string;
  /** Inline style for custom durations/delays (only when needed) */
  style: React.CSSProperties;
}

const EASING_MAP: Record<EasingPreset, string> = {
  linear: 'linear',
  ease: 'ease',
  'ease-in': 'ease-in',
  'ease-out': 'ease-out',
  'ease-in-out': 'ease-in-out',
  spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
};

const PRESET_CLASSES: Record<TransitionPresetType, string> = {
  fade: 'animate-in fade-in',
  'slide-up': 'animate-in slide-in-from-bottom-2',
  'slide-down': 'animate-in slide-in-from-top-2',
  'slide-left': 'animate-in slide-in-from-right-2',
  'slide-right': 'animate-in slide-in-from-left-2',
  scale: 'animate-in zoom-in-95',
  'scale-fade': 'animate-in fade-in zoom-in-95',
  none: '',
};

/**
 * Hook for applying spec-driven animations to components.
 * Implements ComponentAnimationSchema and TransitionPresetSchema
 * from @objectstack/spec v2.0.7.
 *
 * @example
 * ```tsx
 * function Card() {
 *   const animation = useAnimation({ preset: 'fade', duration: 200, easing: 'ease-out' });
 *   return <div className={animation.className} style={animation.style}>...</div>;
 * }
 * ```
 */
export function useAnimation(config: AnimationConfig = {}): AnimationResult {
  const {
    preset = 'none',
    duration,
    delay,
    easing = 'ease-out',
    enabled = true,
  } = config;

  return useMemo(() => {
    if (!enabled || preset === 'none') {
      return { className: '', style: {} };
    }

    const className = PRESET_CLASSES[preset] || '';
    const style: React.CSSProperties = {};

    if (duration !== undefined) {
      style.animationDuration = `${duration}ms`;
    }
    if (delay !== undefined) {
      style.animationDelay = `${delay}ms`;
    }
    if (easing) {
      style.animationTimingFunction = EASING_MAP[easing] || easing;
    }

    return { className, style };
  }, [preset, duration, delay, easing, enabled]);
}
