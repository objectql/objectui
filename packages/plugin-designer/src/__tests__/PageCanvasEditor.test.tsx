/**
 * ObjectUI
 * Copyright (c) 2024-present ObjectStack Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { PageCanvasEditor } from '../PageCanvasEditor';
import type { PageSchema } from '@object-ui/types';

const EMPTY_PAGE: PageSchema = {
  type: 'page',
  title: 'Test Page',
};

const PAGE_WITH_COMPONENTS: PageSchema = {
  type: 'page',
  title: 'Dashboard Page',
  children: [
    { type: 'grid', id: 'grid_1', title: 'Data Grid' },
    { type: 'kanban', id: 'kanban_1', title: 'Board View' },
  ],
};

describe('PageCanvasEditor', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ============================
  // Rendering
  // ============================
  describe('Rendering', () => {
    it('should render with empty page', () => {
      const onChange = vi.fn();
      render(<PageCanvasEditor schema={EMPTY_PAGE} onChange={onChange} />);
      expect(screen.getByTestId('page-canvas-editor')).toBeDefined();
      expect(screen.getByText(/Empty page/)).toBeDefined();
    });

    it('should render add component buttons', () => {
      const onChange = vi.fn();
      render(<PageCanvasEditor schema={EMPTY_PAGE} onChange={onChange} />);
      expect(screen.getByTestId('canvas-add-grid')).toBeDefined();
      expect(screen.getByTestId('canvas-add-kanban')).toBeDefined();
      expect(screen.getByTestId('canvas-add-calendar')).toBeDefined();
      expect(screen.getByTestId('canvas-add-gallery')).toBeDefined();
      expect(screen.getByTestId('canvas-add-dashboard')).toBeDefined();
      expect(screen.getByTestId('canvas-add-form')).toBeDefined();
    });

    it('should render existing components', () => {
      const onChange = vi.fn();
      render(<PageCanvasEditor schema={PAGE_WITH_COMPONENTS} onChange={onChange} />);
      expect(screen.getByTestId('canvas-component-grid_1')).toBeDefined();
      expect(screen.getByTestId('canvas-component-kanban_1')).toBeDefined();
    });
  });

  // ============================
  // Adding Components
  // ============================
  describe('Adding Components', () => {
    it('should add a grid component', () => {
      const onChange = vi.fn();
      render(<PageCanvasEditor schema={EMPTY_PAGE} onChange={onChange} />);
      fireEvent.click(screen.getByTestId('canvas-add-grid'));
      expect(onChange).toHaveBeenCalledOnce();
    });

    it('should add a kanban component', () => {
      const onChange = vi.fn();
      render(<PageCanvasEditor schema={EMPTY_PAGE} onChange={onChange} />);
      fireEvent.click(screen.getByTestId('canvas-add-kanban'));
      expect(onChange).toHaveBeenCalledOnce();
    });
  });

  // ============================
  // Removing Components
  // ============================
  describe('Removing Components', () => {
    it('should remove a component', () => {
      const onChange = vi.fn();
      render(<PageCanvasEditor schema={PAGE_WITH_COMPONENTS} onChange={onChange} />);
      fireEvent.click(screen.getByTestId('canvas-component-remove-grid_1'));
      expect(onChange).toHaveBeenCalledOnce();
    });
  });

  // ============================
  // Component Selection & Property Panel
  // ============================
  describe('Component Property Panel', () => {
    it('should show property panel when component is selected', () => {
      const onChange = vi.fn();
      render(<PageCanvasEditor schema={PAGE_WITH_COMPONENTS} onChange={onChange} />);
      fireEvent.click(screen.getByTestId('canvas-component-grid_1'));
      expect(screen.getByTestId('component-property-panel')).toBeDefined();
      expect(screen.getByTestId('component-prop-label')).toBeDefined();
    });

    it('should update component label via property panel', () => {
      const onChange = vi.fn();
      render(<PageCanvasEditor schema={PAGE_WITH_COMPONENTS} onChange={onChange} />);
      fireEvent.click(screen.getByTestId('canvas-component-grid_1'));
      fireEvent.change(screen.getByTestId('component-prop-label'), { target: { value: 'Updated Grid' } });
      expect(onChange).toHaveBeenCalled();
    });
  });

  // ============================
  // Read-only Mode
  // ============================
  describe('Read-only Mode', () => {
    it('should disable add buttons in read-only mode', () => {
      const onChange = vi.fn();
      render(<PageCanvasEditor schema={EMPTY_PAGE} onChange={onChange} readOnly />);
      expect(screen.getByTestId('canvas-add-grid').hasAttribute('disabled')).toBe(true);
    });
  });
});
