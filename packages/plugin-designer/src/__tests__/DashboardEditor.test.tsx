/**
 * ObjectUI
 * Copyright (c) 2024-present ObjectStack Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { DashboardEditor } from '../DashboardEditor';
import type { DashboardSchema } from '@object-ui/types';

const EMPTY_DASHBOARD: DashboardSchema = {
  type: 'dashboard',
  title: 'Test Dashboard',
  columns: 2,
  widgets: [],
};

const DASHBOARD_WITH_WIDGETS: DashboardSchema = {
  type: 'dashboard',
  title: 'Test Dashboard',
  columns: 2,
  widgets: [
    { id: 'w1', title: 'Revenue', type: 'metric', object: 'orders', valueField: 'amount', aggregate: 'sum' },
    { id: 'w2', title: 'Sales Chart', type: 'bar', object: 'orders', categoryField: 'month' },
  ],
};

describe('DashboardEditor', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ============================
  // Rendering
  // ============================
  describe('Rendering', () => {
    it('should render with empty dashboard', () => {
      const onChange = vi.fn();
      render(<DashboardEditor schema={EMPTY_DASHBOARD} onChange={onChange} />);
      expect(screen.getByTestId('dashboard-editor')).toBeDefined();
      expect(screen.getByText(/No widgets/)).toBeDefined();
    });

    it('should render widget add buttons', () => {
      const onChange = vi.fn();
      render(<DashboardEditor schema={EMPTY_DASHBOARD} onChange={onChange} />);
      expect(screen.getByTestId('dashboard-add-metric')).toBeDefined();
      expect(screen.getByTestId('dashboard-add-bar')).toBeDefined();
      expect(screen.getByTestId('dashboard-add-line')).toBeDefined();
      expect(screen.getByTestId('dashboard-add-pie')).toBeDefined();
      expect(screen.getByTestId('dashboard-add-table')).toBeDefined();
      expect(screen.getByTestId('dashboard-add-grid')).toBeDefined();
    });

    it('should render existing widgets', () => {
      const onChange = vi.fn();
      render(<DashboardEditor schema={DASHBOARD_WITH_WIDGETS} onChange={onChange} />);
      expect(screen.getByTestId('dashboard-widget-w1')).toBeDefined();
      expect(screen.getByTestId('dashboard-widget-w2')).toBeDefined();
    });
  });

  // ============================
  // Adding Widgets
  // ============================
  describe('Adding Widgets', () => {
    it('should add a metric widget', () => {
      const onChange = vi.fn();
      render(<DashboardEditor schema={EMPTY_DASHBOARD} onChange={onChange} />);
      fireEvent.click(screen.getByTestId('dashboard-add-metric'));
      expect(onChange).toHaveBeenCalledOnce();
      const newSchema = onChange.mock.calls[0][0] as DashboardSchema;
      expect(newSchema.widgets).toHaveLength(1);
      expect(newSchema.widgets[0].type).toBe('metric');
    });

    it('should add a bar chart widget', () => {
      const onChange = vi.fn();
      render(<DashboardEditor schema={EMPTY_DASHBOARD} onChange={onChange} />);
      fireEvent.click(screen.getByTestId('dashboard-add-bar'));
      const newSchema = onChange.mock.calls[0][0] as DashboardSchema;
      expect(newSchema.widgets[0].type).toBe('bar');
    });
  });

  // ============================
  // Removing Widgets
  // ============================
  describe('Removing Widgets', () => {
    it('should remove a widget', () => {
      const onChange = vi.fn();
      render(<DashboardEditor schema={DASHBOARD_WITH_WIDGETS} onChange={onChange} />);
      fireEvent.click(screen.getByTestId('dashboard-widget-remove-w1'));
      expect(onChange).toHaveBeenCalledOnce();
      const newSchema = onChange.mock.calls[0][0] as DashboardSchema;
      expect(newSchema.widgets.find((w) => w.id === 'w1')).toBeUndefined();
    });
  });

  // ============================
  // Widget Selection & Property Panel
  // ============================
  describe('Widget Property Panel', () => {
    it('should show property panel when widget is selected', () => {
      const onChange = vi.fn();
      render(<DashboardEditor schema={DASHBOARD_WITH_WIDGETS} onChange={onChange} />);
      fireEvent.click(screen.getByTestId('dashboard-widget-w1'));
      expect(screen.getByTestId('widget-property-panel')).toBeDefined();
      expect(screen.getByTestId('widget-prop-title')).toBeDefined();
      expect(screen.getByTestId('widget-prop-type')).toBeDefined();
    });

    it('should update widget title via property panel', () => {
      const onChange = vi.fn();
      render(<DashboardEditor schema={DASHBOARD_WITH_WIDGETS} onChange={onChange} />);
      // Select widget
      fireEvent.click(screen.getByTestId('dashboard-widget-w1'));
      // Edit title
      fireEvent.change(screen.getByTestId('widget-prop-title'), { target: { value: 'New Title' } });
      expect(onChange).toHaveBeenCalled();
    });

    it('should update widget data source', () => {
      const onChange = vi.fn();
      render(<DashboardEditor schema={DASHBOARD_WITH_WIDGETS} onChange={onChange} />);
      fireEvent.click(screen.getByTestId('dashboard-widget-w1'));
      fireEvent.change(screen.getByTestId('widget-prop-object'), { target: { value: 'products' } });
      expect(onChange).toHaveBeenCalled();
    });
  });

  // ============================
  // Read-only Mode
  // ============================
  describe('Read-only Mode', () => {
    it('should disable add buttons in read-only mode', () => {
      const onChange = vi.fn();
      render(<DashboardEditor schema={EMPTY_DASHBOARD} onChange={onChange} readOnly />);
      expect(screen.getByTestId('dashboard-add-metric').hasAttribute('disabled')).toBe(true);
    });
  });
});
