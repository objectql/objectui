/**
 * ObjectUI
 * Copyright (c) 2024-present ObjectStack Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ObjectViewConfigurator } from '../ObjectViewConfigurator';
import type { ViewConfig } from '../ObjectViewConfigurator';

const DEFAULT_CONFIG: ViewConfig = {
  viewType: 'grid',
  columns: [
    { name: 'name', label: 'Name', visible: true },
    { name: 'email', label: 'Email', visible: true },
    { name: 'status', label: 'Status', visible: false },
  ],
  showSearch: true,
  showFilters: true,
  showSort: true,
  rowHeight: 'medium',
  striped: false,
  bordered: false,
};

describe('ObjectViewConfigurator', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ============================
  // Rendering
  // ============================
  describe('Rendering', () => {
    it('should render the configurator', () => {
      const onChange = vi.fn();
      render(<ObjectViewConfigurator config={DEFAULT_CONFIG} onChange={onChange} />);
      expect(screen.getByTestId('object-view-configurator')).toBeDefined();
    });

    it('should render view type buttons', () => {
      const onChange = vi.fn();
      render(<ObjectViewConfigurator config={DEFAULT_CONFIG} onChange={onChange} />);
      expect(screen.getByTestId('view-type-grid')).toBeDefined();
      expect(screen.getByTestId('view-type-kanban')).toBeDefined();
      expect(screen.getByTestId('view-type-calendar')).toBeDefined();
    });

    it('should render column list', () => {
      const onChange = vi.fn();
      render(<ObjectViewConfigurator config={DEFAULT_CONFIG} onChange={onChange} />);
      expect(screen.getByTestId('view-column-name')).toBeDefined();
      expect(screen.getByTestId('view-column-email')).toBeDefined();
      expect(screen.getByTestId('view-column-status')).toBeDefined();
    });

    it('should render toolbar toggles', () => {
      const onChange = vi.fn();
      render(<ObjectViewConfigurator config={DEFAULT_CONFIG} onChange={onChange} />);
      expect(screen.getByTestId('view-toggle-search')).toBeDefined();
      expect(screen.getByTestId('view-toggle-filters')).toBeDefined();
      expect(screen.getByTestId('view-toggle-sort')).toBeDefined();
    });
  });

  // ============================
  // View Type Switching
  // ============================
  describe('View Type Switching', () => {
    it('should switch to kanban view', () => {
      const onChange = vi.fn();
      render(<ObjectViewConfigurator config={DEFAULT_CONFIG} onChange={onChange} />);
      fireEvent.click(screen.getByTestId('view-type-kanban'));
      expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ viewType: 'kanban' }));
    });

    it('should switch to calendar view', () => {
      const onChange = vi.fn();
      render(<ObjectViewConfigurator config={DEFAULT_CONFIG} onChange={onChange} />);
      fireEvent.click(screen.getByTestId('view-type-calendar'));
      expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ viewType: 'calendar' }));
    });
  });

  // ============================
  // Column Visibility
  // ============================
  describe('Column Visibility', () => {
    it('should toggle column visibility', () => {
      const onChange = vi.fn();
      render(<ObjectViewConfigurator config={DEFAULT_CONFIG} onChange={onChange} />);
      // Toggle "Status" field (currently hidden) by clicking the eye button
      const colRow = screen.getByTestId('view-column-status');
      const eyeBtn = colRow.querySelector('button');
      if (eyeBtn) fireEvent.click(eyeBtn);
      expect(onChange).toHaveBeenCalled();
    });

    it('should display visible count in section header', () => {
      const onChange = vi.fn();
      render(<ObjectViewConfigurator config={DEFAULT_CONFIG} onChange={onChange} />);
      expect(screen.getByText('Fields (2/3)')).toBeDefined();
    });
  });

  // ============================
  // Toolbar Toggles
  // ============================
  describe('Toolbar Toggles', () => {
    it('should toggle showSearch', () => {
      const onChange = vi.fn();
      render(<ObjectViewConfigurator config={DEFAULT_CONFIG} onChange={onChange} />);
      fireEvent.click(screen.getByTestId('view-toggle-search'));
      expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ showSearch: false }));
    });

    it('should toggle showFilters', () => {
      const onChange = vi.fn();
      render(<ObjectViewConfigurator config={DEFAULT_CONFIG} onChange={onChange} />);
      fireEvent.click(screen.getByTestId('view-toggle-filters'));
      expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ showFilters: false }));
    });
  });

  // ============================
  // Read-only Mode
  // ============================
  describe('Read-only Mode', () => {
    it('should disable view type buttons in read-only mode', () => {
      const onChange = vi.fn();
      render(<ObjectViewConfigurator config={DEFAULT_CONFIG} onChange={onChange} readOnly />);
      expect(screen.getByTestId('view-type-kanban').hasAttribute('disabled')).toBe(true);
    });

    it('should disable toggles in read-only mode', () => {
      const onChange = vi.fn();
      render(<ObjectViewConfigurator config={DEFAULT_CONFIG} onChange={onChange} readOnly />);
      expect((screen.getByTestId('view-toggle-search') as HTMLInputElement).disabled).toBe(true);
    });
  });
});
