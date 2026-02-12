/**
 * ObjectUI
 * Copyright (c) 2024-present ObjectStack Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { useState, useCallback } from 'react';

export interface ConfirmDialogState {
  /** Whether the dialog is open */
  isOpen: boolean;
  /** Title for the dialog */
  title: string;
  /** Message for the dialog */
  message: string;
  /** Open the dialog with a message, returns a promise that resolves to true/false */
  confirm: (title: string, message: string) => Promise<boolean>;
  /** Handle user accepting */
  onConfirm: () => void;
  /** Handle user cancelling */
  onCancel: () => void;
}

/**
 * Hook for confirmation dialogs before destructive actions.
 */
export function useConfirmDialog(): ConfirmDialogState {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [resolver, setResolver] = useState<((value: boolean) => void) | null>(null);

  const confirm = useCallback((title: string, message: string): Promise<boolean> => {
    setTitle(title);
    setMessage(message);
    setIsOpen(true);
    return new Promise<boolean>((resolve) => {
      setResolver(() => resolve);
    });
  }, []);

  const onConfirm = useCallback(() => {
    setIsOpen(false);
    resolver?.(true);
    setResolver(null);
  }, [resolver]);

  const onCancel = useCallback(() => {
    setIsOpen(false);
    resolver?.(false);
    setResolver(null);
  }, [resolver]);

  return { isOpen, title, message, confirm, onConfirm, onCancel };
}
