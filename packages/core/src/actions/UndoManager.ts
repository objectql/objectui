/**
 * ObjectUI
 * Copyright (c) 2024-present ObjectStack Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * @object-ui/core - Undo Manager
 *
 * Global undo/redo system for CRUD operations. Class-based singleton
 * pattern for use from ActionRunner, React hooks, and standalone contexts.
 * Maintains bounded history stacks with subscriber notifications.
 */

/** Represents a single undoable CRUD operation. */
export interface UndoableOperation {
  id: string;
  type: 'create' | 'update' | 'delete';
  objectName: string;
  recordId: string;
  timestamp: number;
  description: string;
  /** Data needed to undo: for create=recordId, for update=previousData, for delete=fullRecord */
  undoData: Record<string, unknown>;
  /** Data needed to redo: for create=newData, for update=newData, for delete=recordId */
  redoData: Record<string, unknown>;
}

export interface UndoManagerOptions {
  /** Maximum number of operations to retain in history. @default 50 */
  maxHistory?: number;
}

/**
 * Manages undo/redo stacks for CRUD operations.
 *
 * Designed as a framework-agnostic class so it can be used from
 * ActionRunner, React hooks, or any other consumer.
 */
export class UndoManager {
  private undoStack: UndoableOperation[] = [];
  private redoStack: UndoableOperation[] = [];
  private readonly maxHistory: number;
  private listeners: Set<() => void> = new Set();

  constructor(options?: UndoManagerOptions) {
    this.maxHistory = options?.maxHistory ?? 50;
  }

  /** Record an undoable operation. Clears the redo stack. */
  push(operation: UndoableOperation): void {
    this.undoStack.push(operation);
    if (this.undoStack.length > this.maxHistory) {
      this.undoStack.shift();
    }
    this.redoStack = [];
    this.notify();
  }

  /** Peek at the next undoable operation without removing it. */
  peekUndo(): UndoableOperation | undefined {
    return this.undoStack[this.undoStack.length - 1];
  }

  /** Peek at the next redoable operation without removing it. */
  peekRedo(): UndoableOperation | undefined {
    return this.redoStack[this.redoStack.length - 1];
  }

  /** Pop the last operation from the undo stack and move it to redo. */
  popUndo(): UndoableOperation | undefined {
    const op = this.undoStack.pop();
    if (op) {
      this.redoStack.push(op);
      this.notify();
    }
    return op;
  }

  /** Pop the last operation from the redo stack and move it to undo. */
  popRedo(): UndoableOperation | undefined {
    const op = this.redoStack.pop();
    if (op) {
      this.undoStack.push(op);
      this.notify();
    }
    return op;
  }

  /** Clear all undo and redo history. */
  clear(): void {
    this.undoStack = [];
    this.redoStack = [];
    this.notify();
  }

  get canUndo(): boolean { return this.undoStack.length > 0; }
  get canRedo(): boolean { return this.redoStack.length > 0; }
  get undoCount(): number { return this.undoStack.length; }
  get redoCount(): number { return this.redoStack.length; }

  /** Subscribe to state changes. Returns an unsubscribe function. */
  subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  /** Get a shallow copy of the undo history (for developer tools). */
  getHistory(): UndoableOperation[] { return [...this.undoStack]; }

  private notify(): void { this.listeners.forEach((fn) => fn()); }
}

/** Global singleton instance. */
export const globalUndoManager = new UndoManager();
