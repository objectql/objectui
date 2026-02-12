/**
 * ObjectUI
 * Copyright (c) 2024-present ObjectStack Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { useState, useCallback, useRef } from 'react';

export interface UndoRedoOptions {
  /** Maximum history size */
  maxHistory?: number;
}

export interface UndoRedoState<T> {
  /** Current state */
  current: T;
  /** Whether undo is available */
  canUndo: boolean;
  /** Whether redo is available */
  canRedo: boolean;
  /** Number of undo steps available */
  undoCount: number;
  /** Number of redo steps available */
  redoCount: number;
  /** Push a new state (clears redo stack) */
  push: (state: T) => void;
  /** Undo to previous state */
  undo: () => void;
  /** Redo to next state */
  redo: () => void;
  /** Reset to initial state, clearing all history */
  reset: (state: T) => void;
}

/**
 * Hook for undo/redo functionality using command pattern with state history.
 * Maintains a stack of past states and future states for undo/redo operations.
 */
export function useUndoRedo<T>(initialState: T, options: UndoRedoOptions = {}): UndoRedoState<T> {
  const { maxHistory = 50 } = options;
  const [current, setCurrent] = useState<T>(initialState);
  const pastRef = useRef<T[]>([]);
  const futureRef = useRef<T[]>([]);

  const push = useCallback((state: T) => {
    setCurrent((prev) => {
      pastRef.current = [...pastRef.current.slice(-(maxHistory - 1)), prev];
      futureRef.current = []; // Clear redo stack
      return state;
    });
  }, [maxHistory]);

  const undo = useCallback(() => {
    if (pastRef.current.length === 0) return;
    setCurrent((prev) => {
      const past = [...pastRef.current];
      const previous = past.pop()!;
      pastRef.current = past;
      futureRef.current = [prev, ...futureRef.current];
      return previous;
    });
  }, []);

  const redo = useCallback(() => {
    if (futureRef.current.length === 0) return;
    setCurrent((prev) => {
      const future = [...futureRef.current];
      const next = future.shift()!;
      futureRef.current = future;
      pastRef.current = [...pastRef.current, prev];
      return next;
    });
  }, []);

  const reset = useCallback((state: T) => {
    pastRef.current = [];
    futureRef.current = [];
    setCurrent(state);
  }, []);

  return {
    current,
    canUndo: pastRef.current.length > 0,
    canRedo: futureRef.current.length > 0,
    undoCount: pastRef.current.length,
    redoCount: futureRef.current.length,
    push,
    undo,
    redo,
    reset,
  };
}
