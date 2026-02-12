/**
 * ObjectUI
 * Copyright (c) 2024-present ObjectStack Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { DashboardRenderer } from '../DashboardRenderer';
import type { DashboardSchema } from '@object-ui/types';

describe('DashboardRenderer auto-refresh', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  const mockSchema: DashboardSchema = {
    type: 'dashboard',
    name: 'test_dashboard',
    title: 'Test Dashboard',
    widgets: [],
  };

  it('should not render refresh button when onRefresh is not provided', () => {
    render(<DashboardRenderer schema={mockSchema} />);
    expect(screen.queryByLabelText('Refresh dashboard')).not.toBeInTheDocument();
  });

  it('should render refresh button when onRefresh is provided', () => {
    const onRefresh = vi.fn();
    render(<DashboardRenderer schema={mockSchema} onRefresh={onRefresh} />);
    expect(screen.getByLabelText('Refresh dashboard')).toBeInTheDocument();
  });

  it('should call onRefresh when refresh button is clicked', () => {
    const onRefresh = vi.fn();
    render(<DashboardRenderer schema={mockSchema} onRefresh={onRefresh} />);

    const button = screen.getByLabelText('Refresh dashboard');
    fireEvent.click(button);

    expect(onRefresh).toHaveBeenCalledTimes(1);
  });

  it('should auto-refresh at the configured interval', () => {
    const onRefresh = vi.fn();
    const schemaWithRefresh: DashboardSchema = {
      ...mockSchema,
      refreshInterval: 30, // 30 seconds
    };

    render(<DashboardRenderer schema={schemaWithRefresh} onRefresh={onRefresh} />);

    expect(onRefresh).not.toHaveBeenCalled();

    // Advance past one interval
    act(() => {
      vi.advanceTimersByTime(30_000);
    });
    expect(onRefresh).toHaveBeenCalledTimes(1);

    // Advance past another interval
    act(() => {
      vi.advanceTimersByTime(30_000);
    });
    expect(onRefresh).toHaveBeenCalledTimes(2);
  });

  it('should not auto-refresh when refreshInterval is 0', () => {
    const onRefresh = vi.fn();
    const schemaWithZeroInterval: DashboardSchema = {
      ...mockSchema,
      refreshInterval: 0,
    };

    render(<DashboardRenderer schema={schemaWithZeroInterval} onRefresh={onRefresh} />);

    act(() => {
      vi.advanceTimersByTime(60_000);
    });

    expect(onRefresh).not.toHaveBeenCalled();
  });

  it('should not auto-refresh when onRefresh is not provided', () => {
    const schemaWithRefresh: DashboardSchema = {
      ...mockSchema,
      refreshInterval: 10,
    };

    // Should not throw
    render(<DashboardRenderer schema={schemaWithRefresh} />);

    act(() => {
      vi.advanceTimersByTime(30_000);
    });
  });

  it('should clean up interval on unmount', () => {
    const onRefresh = vi.fn();
    const schemaWithRefresh: DashboardSchema = {
      ...mockSchema,
      refreshInterval: 5,
    };

    const { unmount } = render(
      <DashboardRenderer schema={schemaWithRefresh} onRefresh={onRefresh} />
    );

    unmount();

    act(() => {
      vi.advanceTimersByTime(30_000);
    });

    expect(onRefresh).not.toHaveBeenCalled();
  });
});
