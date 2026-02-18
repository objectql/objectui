/**
 * ObjectUI
 * Copyright (c) 2024-present ObjectStack Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render } from '@testing-library/react';
import { DashboardRenderer } from '../DashboardRenderer';
import type { DashboardSchema } from '@object-ui/types';

describe('DashboardRenderer mobile layout', () => {
  let originalInnerWidth: number;

  beforeEach(() => {
    originalInnerWidth = window.innerWidth;
  });

  afterEach(() => {
    // Restore original window size
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: originalInnerWidth,
    });
  });

  const setWindowWidth = (width: number) => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: width,
    });
    window.dispatchEvent(new Event('resize'));
  };

  it('should use mobile layout when window width is less than 768px', () => {
    const schema: DashboardSchema = {
      type: 'dashboard',
      name: 'test',
      title: 'Test Dashboard',
      widgets: [
        {
          type: 'metric',
          title: 'Revenue',
          options: { value: '$100k', label: 'Total Revenue' },
        },
        {
          type: 'metric',
          title: 'Users',
          options: { value: '1,234', label: 'Active Users' },
        },
      ],
    };

    // Set mobile viewport width
    setWindowWidth(375);
    
    const { container } = render(<DashboardRenderer schema={schema} />);
    
    // Mobile layout should have px-4 class and grid grid-cols-2 for metrics
    const mobileContainer = container.querySelector('.px-4');
    expect(mobileContainer).toBeTruthy();
    
    const metricGrid = container.querySelector('.grid.grid-cols-2');
    expect(metricGrid).toBeTruthy();
  });

  it('should use desktop layout when window width is 768px or more', () => {
    const schema: DashboardSchema = {
      type: 'dashboard',
      name: 'test',
      title: 'Test Dashboard',
      widgets: [
        {
          type: 'metric',
          title: 'Revenue',
          options: { value: '$100k', label: 'Total Revenue' },
        },
      ],
    };

    // Set desktop viewport width
    setWindowWidth(1024);
    
    const { container } = render(<DashboardRenderer schema={schema} />);
    
    // Desktop layout should have grid class but not px-4 or grid-cols-2
    const desktopGrid = container.querySelector('.grid.auto-rows-min');
    expect(desktopGrid).toBeTruthy();
    
    const mobileContainer = container.querySelector('.px-4');
    expect(mobileContainer).toBeFalsy();
  });

  it('should separate metric and non-metric widgets in mobile layout', () => {
    const schema: DashboardSchema = {
      type: 'dashboard',
      name: 'test',
      title: 'Test Dashboard',
      widgets: [
        {
          type: 'metric',
          title: 'Metric 1',
          options: { value: '100', label: 'Count' },
        },
        {
          type: 'metric',
          title: 'Metric 2',
          options: { value: '200', label: 'Total' },
        },
        {
          type: 'bar',
          title: 'Chart',
          options: {
            data: { items: [{ name: 'A', value: 10 }] },
            xField: 'name',
            yField: 'value',
          },
        },
      ],
    };

    // Set mobile viewport width
    setWindowWidth(375);
    
    const { container } = render(<DashboardRenderer schema={schema} />);
    
    // Should have a 2-column grid for metrics
    const metricGrid = container.querySelector('.grid.grid-cols-2');
    expect(metricGrid).toBeTruthy();
    
    // Should have metric widgets in the grid
    const metricWidgets = metricGrid?.children;
    expect(metricWidgets?.length).toBe(2);
    
    // Should have a flex-col container for other widgets
    const otherWidgetsContainer = container.querySelector('.flex.flex-col.gap-4');
    expect(otherWidgetsContainer).toBeTruthy();
  });

  it('should handle mobile layout with only metric widgets', () => {
    const schema: DashboardSchema = {
      type: 'dashboard',
      name: 'test',
      title: 'Test Dashboard',
      widgets: [
        {
          type: 'metric',
          title: 'Metric 1',
          options: { value: '100' },
        },
        {
          type: 'metric',
          title: 'Metric 2',
          options: { value: '200' },
        },
      ],
    };

    // Set mobile viewport width
    setWindowWidth(375);
    
    const { container } = render(<DashboardRenderer schema={schema} />);
    
    // Should have a 2-column grid for metrics
    const metricGrid = container.querySelector('.grid.grid-cols-2');
    expect(metricGrid).toBeTruthy();
    expect(metricGrid?.children.length).toBe(2);
  });

  it('should handle mobile layout with only non-metric widgets', () => {
    const schema: DashboardSchema = {
      type: 'dashboard',
      name: 'test',
      title: 'Test Dashboard',
      widgets: [
        {
          type: 'bar',
          title: 'Chart 1',
          options: {
            data: { items: [{ name: 'A', value: 10 }] },
            xField: 'name',
            yField: 'value',
          },
        },
        {
          type: 'line',
          title: 'Chart 2',
          options: {
            data: { items: [{ name: 'B', value: 20 }] },
            xField: 'name',
            yField: 'value',
          },
        },
      ],
    };

    // Set mobile viewport width
    setWindowWidth(375);
    
    const { container } = render(<DashboardRenderer schema={schema} />);
    
    // Should not have a metric grid
    const metricGrid = container.querySelector('.grid.grid-cols-2');
    expect(metricGrid).toBeFalsy();
    
    // Should have a flex-col container for other widgets
    const otherWidgetsContainer = container.querySelector('.flex.flex-col.gap-4');
    expect(otherWidgetsContainer).toBeTruthy();
  });
});
