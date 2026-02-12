/**
 * ObjectUI
 * Copyright (c) 2024-present ObjectStack Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { useGesture } from './useGesture';
import type { GestureType, SpecGestureConfig } from '@object-ui/types';

export interface UseSpecGestureOptions {
  /** Spec gesture configuration */
  config: SpecGestureConfig;
  /** Callback when a swipe gesture is detected */
  onSwipe?: (direction: string) => void;
  /** Callback when a pinch gesture is detected */
  onPinch?: (scale: number) => void;
  /** Callback when a long-press gesture is detected */
  onLongPress?: () => void;
}

const SWIPE_DIRECTION_MAP: Record<string, GestureType> = {
  left: 'swipe-left',
  right: 'swipe-right',
  up: 'swipe-up',
  down: 'swipe-down',
};

/**
 * Spec-aware gesture hook that maps an @objectstack/spec GestureConfig
 * to the existing useGesture hook.
 *
 * @example
 * ```tsx
 * const ref = useSpecGesture({
 *   config: { type: 'swipe', enabled: true, swipe: { direction: 'left', threshold: 80 } },
 *   onSwipe: (dir) => console.log('Swiped', dir),
 * });
 * return <div ref={ref}>Swipe me</div>;
 * ```
 */
export function useSpecGesture<T extends HTMLElement = HTMLElement>(
  options: UseSpecGestureOptions,
) {
  const { config, onSwipe, onPinch, onLongPress } = options;
  const enabled = config.enabled ?? true;

  let gestureType: GestureType = 'tap';
  let threshold: number | undefined;
  let longPressDuration: number | undefined;
  let onGesture: (ctx: { direction?: string; scale?: number }) => void = () => {};

  if (config.swipe && onSwipe) {
    const dir = Array.isArray(config.swipe.direction)
      ? config.swipe.direction[0]
      : config.swipe.direction;
    gestureType = (dir && SWIPE_DIRECTION_MAP[dir]) ?? 'swipe-left';
    threshold = config.swipe.threshold;
    onGesture = (ctx) => onSwipe(ctx.direction ?? dir ?? 'left');
  } else if (config.longPress && onLongPress) {
    gestureType = 'long-press';
    longPressDuration = config.longPress.duration;
    onGesture = () => onLongPress();
  } else if (config.pinch && onPinch) {
    gestureType = 'pinch';
    onGesture = (ctx) => onPinch(ctx.scale ?? 1);
  }

  return useGesture<T>({
    type: gestureType,
    onGesture,
    threshold,
    longPressDuration,
    enabled,
  });
}
