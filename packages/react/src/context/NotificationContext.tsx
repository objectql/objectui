/**
 * ObjectUI
 * Copyright (c) 2024-present ObjectStack Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * @object-ui/react - Notification Context
 *
 * Provides a spec-driven notification system to the component tree.
 * Implements NotificationSchema, NotificationConfigSchema, and
 * NotificationActionSchema from @objectstack/spec v2.0.7.
 */

import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';

/** Notification severity levels aligned with NotificationSeveritySchema */
export type NotificationSeverityLevel = 'info' | 'success' | 'warning' | 'error';

/** Notification display type aligned with NotificationTypeSchema */
export type NotificationDisplayType = 'toast' | 'banner' | 'snackbar' | 'modal';

/** Notification position aligned with NotificationPositionSchema */
export type NotificationPositionValue =
  | 'top-left'
  | 'top-center'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-right';

/** Action button on a notification */
export interface NotificationActionButton {
  label: string;
  onClick: () => void;
  variant?: 'default' | 'destructive' | 'outline';
}

/** A single notification item */
export interface NotificationItem {
  id: string;
  title: string;
  message?: string;
  severity: NotificationSeverityLevel;
  displayType?: NotificationDisplayType;
  actions?: NotificationActionButton[];
  /** Duration in ms (0 = persistent). Default: 5000 */
  duration?: number;
  /** Whether the notification has been read */
  read?: boolean;
  /** Timestamp */
  createdAt: Date;
  /** Optional icon name (lucide icon) */
  icon?: string;
}

/** Configuration for the notification system */
export interface NotificationSystemConfig {
  /** Default position for toast notifications */
  position?: NotificationPositionValue;
  /** Default duration in ms */
  defaultDuration?: number;
  /** Maximum number of visible notifications */
  maxVisible?: number;
  /** Whether to stack notifications */
  stacking?: boolean;
}

export interface NotificationProviderProps {
  children: React.ReactNode;
  /** System configuration */
  config?: NotificationSystemConfig;
  /** External toast handler (e.g., Sonner) for rendering toasts */
  onToast?: (notification: NotificationItem) => void;
}

interface NotificationContextValue {
  /** All notifications (including history) */
  notifications: NotificationItem[];
  /** Unread notification count */
  unreadCount: number;
  /** Add a notification */
  notify: (notification: Omit<NotificationItem, 'id' | 'createdAt' | 'read'>) => string;
  /** Convenience: show info notification */
  info: (title: string, message?: string) => string;
  /** Convenience: show success notification */
  success: (title: string, message?: string) => string;
  /** Convenience: show warning notification */
  warning: (title: string, message?: string) => string;
  /** Convenience: show error notification */
  error: (title: string, message?: string) => string;
  /** Mark a notification as read */
  markAsRead: (id: string) => void;
  /** Mark all notifications as read */
  markAllAsRead: () => void;
  /** Dismiss a notification */
  dismiss: (id: string) => void;
  /** Clear all notifications */
  clearAll: () => void;
  /** System configuration */
  config: NotificationSystemConfig;
}

let notificationCounter = 0;

const NotificationCtx = createContext<NotificationContextValue | null>(null);

/**
 * NotificationProvider — Provides a spec-driven notification system.
 *
 * @example
 * ```tsx
 * <NotificationProvider
 *   config={{ position: 'top-right', defaultDuration: 5000, maxVisible: 5 }}
 *   onToast={(n) => toast[n.severity](n.title, { description: n.message })}
 * >
 *   <App />
 * </NotificationProvider>
 * ```
 */
export const NotificationProvider: React.FC<NotificationProviderProps> = ({
  children,
  config: userConfig = {},
  onToast,
}) => {
  const config = useMemo<NotificationSystemConfig>(
    () => ({
      position: 'top-right',
      defaultDuration: 5000,
      maxVisible: 5,
      stacking: true,
      ...userConfig,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [JSON.stringify(userConfig)],
  );

  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  const notify = useCallback(
    (input: Omit<NotificationItem, 'id' | 'createdAt' | 'read'>): string => {
      const id = `notification-${++notificationCounter}`;
      const notification: NotificationItem = {
        ...input,
        id,
        createdAt: new Date(),
        read: false,
      };

      setNotifications((prev) => [notification, ...prev]);

      // Delegate to external toast handler if provided
      if (onToast) {
        onToast(notification);
      }

      // Auto-dismiss non-persistent notifications
      const duration = input.duration ?? config.defaultDuration ?? 5000;
      if (duration > 0) {
        setTimeout(() => {
          setNotifications((prev) => prev.filter((n) => n.id !== id));
        }, duration);
      }

      return id;
    },
    [config.defaultDuration, onToast],
  );

  const info = useCallback(
    (title: string, message?: string) =>
      notify({ title, message, severity: 'info' }),
    [notify],
  );

  const success = useCallback(
    (title: string, message?: string) =>
      notify({ title, message, severity: 'success' }),
    [notify],
  );

  const warning = useCallback(
    (title: string, message?: string) =>
      notify({ title, message, severity: 'warning' }),
    [notify],
  );

  const error = useCallback(
    (title: string, message?: string) =>
      notify({ title, message, severity: 'error' }),
    [notify],
  );

  const markAsRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const dismiss = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.read).length,
    [notifications],
  );

  const value = useMemo<NotificationContextValue>(
    () => ({
      notifications,
      unreadCount,
      notify,
      info,
      success,
      warning,
      error,
      markAsRead,
      markAllAsRead,
      dismiss,
      clearAll,
      config,
    }),
    [
      notifications,
      unreadCount,
      notify,
      info,
      success,
      warning,
      error,
      markAsRead,
      markAllAsRead,
      dismiss,
      clearAll,
      config,
    ],
  );

  return (
    <NotificationCtx.Provider value={value}>
      {children}
    </NotificationCtx.Provider>
  );
};

NotificationProvider.displayName = 'NotificationProvider';

/**
 * Hook to consume the NotificationProvider context.
 *
 * @throws Error if used outside a NotificationProvider
 */
export function useNotifications(): NotificationContextValue {
  const ctx = useContext(NotificationCtx);
  if (!ctx) {
    throw new Error(
      'useNotifications must be used within a <NotificationProvider>. ' +
        'Wrap your app with <NotificationProvider> to use the notification system.',
    );
  }
  return ctx;
}

/**
 * Hook to check if a NotificationProvider is available.
 */
export function useHasNotificationProvider(): boolean {
  return useContext(NotificationCtx) !== null;
}
