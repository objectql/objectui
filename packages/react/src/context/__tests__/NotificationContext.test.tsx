/**
 * Tests for NotificationProvider and useNotifications
 */
import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import React from 'react';
import {
  NotificationProvider,
  useNotifications,
  useHasNotificationProvider,
} from '../NotificationContext';

const wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <NotificationProvider>{children}</NotificationProvider>
);

describe('NotificationProvider', () => {
  it('provides notifications context', () => {
    const { result } = renderHook(() => useNotifications(), { wrapper });
    expect(result.current.notifications).toEqual([]);
    expect(result.current.unreadCount).toBe(0);
  });

  it('adds a notification via notify', () => {
    const { result } = renderHook(() => useNotifications(), { wrapper });

    act(() => {
      result.current.notify({ title: 'Hello', severity: 'info' });
    });

    expect(result.current.notifications).toHaveLength(1);
    expect(result.current.notifications[0].title).toBe('Hello');
    expect(result.current.unreadCount).toBe(1);
  });

  it('adds info notification', () => {
    const { result } = renderHook(() => useNotifications(), { wrapper });

    act(() => {
      result.current.info('Info title', 'Info message');
    });

    expect(result.current.notifications[0].severity).toBe('info');
  });

  it('adds success notification', () => {
    const { result } = renderHook(() => useNotifications(), { wrapper });

    act(() => {
      result.current.success('Success!');
    });

    expect(result.current.notifications[0].severity).toBe('success');
  });

  it('adds warning notification', () => {
    const { result } = renderHook(() => useNotifications(), { wrapper });

    act(() => {
      result.current.warning('Warning!');
    });

    expect(result.current.notifications[0].severity).toBe('warning');
  });

  it('adds error notification', () => {
    const { result } = renderHook(() => useNotifications(), { wrapper });

    act(() => {
      result.current.error('Error!');
    });

    expect(result.current.notifications[0].severity).toBe('error');
  });

  it('marks notification as read', () => {
    const { result } = renderHook(() => useNotifications(), { wrapper });

    let id: string = '';
    act(() => {
      id = result.current.info('Test');
    });

    act(() => {
      result.current.markAsRead(id);
    });

    expect(result.current.notifications[0].read).toBe(true);
    expect(result.current.unreadCount).toBe(0);
  });

  it('marks all as read', () => {
    const { result } = renderHook(() => useNotifications(), { wrapper });

    act(() => {
      result.current.info('Test 1');
      result.current.info('Test 2');
    });

    act(() => {
      result.current.markAllAsRead();
    });

    expect(result.current.unreadCount).toBe(0);
  });

  it('dismisses a notification', () => {
    const { result } = renderHook(() => useNotifications(), { wrapper });

    let id: string = '';
    act(() => {
      id = result.current.info('Test');
    });

    act(() => {
      result.current.dismiss(id);
    });

    expect(result.current.notifications).toHaveLength(0);
  });

  it('clears all notifications', () => {
    const { result } = renderHook(() => useNotifications(), { wrapper });

    act(() => {
      result.current.info('Test 1');
      result.current.info('Test 2');
    });

    act(() => {
      result.current.clearAll();
    });

    expect(result.current.notifications).toHaveLength(0);
  });

  it('calls onToast handler', () => {
    const onToast = vi.fn();
    const customWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
      <NotificationProvider onToast={onToast}>{children}</NotificationProvider>
    );

    const { result } = renderHook(() => useNotifications(), {
      wrapper: customWrapper,
    });

    act(() => {
      result.current.info('Toast test');
    });

    expect(onToast).toHaveBeenCalledTimes(1);
    expect(onToast).toHaveBeenCalledWith(
      expect.objectContaining({ title: 'Toast test', severity: 'info' })
    );
  });
});

describe('useHasNotificationProvider', () => {
  it('returns false outside provider', () => {
    const { result } = renderHook(() => useHasNotificationProvider());
    expect(result.current).toBe(false);
  });

  it('returns true inside provider', () => {
    const { result } = renderHook(() => useHasNotificationProvider(), { wrapper });
    expect(result.current).toBe(true);
  });
});

describe('useNotifications without provider', () => {
  it('throws error', () => {
    expect(() => {
      renderHook(() => useNotifications());
    }).toThrow('useNotifications must be used within a <NotificationProvider>');
  });
});
