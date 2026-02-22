/**
 * ObjectUI
 * Copyright (c) 2024-present ObjectStack Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { DashboardConfigPanel } from '../DashboardConfigPanel';

const defaultConfig = {
  columns: 3,
  gap: 4,
  rowHeight: '120',
  refreshInterval: '0',
  title: 'My Dashboard',
  showDescription: true,
  theme: 'auto',
};

describe('DashboardConfigPanel', () => {
  it('should render nothing when closed', () => {
    const { container } = render(
      <DashboardConfigPanel
        open={false}
        onClose={vi.fn()}
        config={defaultConfig}
        onSave={vi.fn()}
      />,
    );
    expect(container.innerHTML).toBe('');
  });

  it('should render panel when open', () => {
    render(
      <DashboardConfigPanel
        open={true}
        onClose={vi.fn()}
        config={defaultConfig}
        onSave={vi.fn()}
      />,
    );
    expect(screen.getByTestId('config-panel')).toBeDefined();
  });

  it('should display dashboard breadcrumb', () => {
    render(
      <DashboardConfigPanel
        open={true}
        onClose={vi.fn()}
        config={defaultConfig}
        onSave={vi.fn()}
      />,
    );
    expect(screen.getByText('Dashboard')).toBeDefined();
    expect(screen.getByText('Configuration')).toBeDefined();
  });

  it('should display layout section fields', () => {
    render(
      <DashboardConfigPanel
        open={true}
        onClose={vi.fn()}
        config={defaultConfig}
        onSave={vi.fn()}
      />,
    );
    expect(screen.getByText('Layout')).toBeDefined();
    expect(screen.getByText('Columns')).toBeDefined();
    expect(screen.getByText('Gap')).toBeDefined();
    expect(screen.getByText('Row height')).toBeDefined();
  });

  it('should display data section', () => {
    render(
      <DashboardConfigPanel
        open={true}
        onClose={vi.fn()}
        config={defaultConfig}
        onSave={vi.fn()}
      />,
    );
    expect(screen.getByText('Data')).toBeDefined();
    expect(screen.getByText('Refresh interval')).toBeDefined();
  });

  it('should have appearance section collapsed by default', () => {
    render(
      <DashboardConfigPanel
        open={true}
        onClose={vi.fn()}
        config={defaultConfig}
        onSave={vi.fn()}
      />,
    );
    expect(screen.getByText('Appearance')).toBeDefined();
    // Title field should be hidden since appearance is collapsed by default
    // Note: 'My Dashboard' is the title field value from the config, not the section title.
    // The input label 'Title' should not be visible while collapsed
    expect(screen.queryByText('Show description')).toBeNull();
  });

  it('should expand appearance section on click', () => {
    render(
      <DashboardConfigPanel
        open={true}
        onClose={vi.fn()}
        config={defaultConfig}
        onSave={vi.fn()}
      />,
    );
    // Click to expand
    fireEvent.click(screen.getByTestId('section-header-appearance'));
    expect(screen.getByText('Show description')).toBeDefined();
    expect(screen.getByText('Theme')).toBeDefined();
  });

  it('should call onClose when close button clicked', () => {
    const onClose = vi.fn();
    render(
      <DashboardConfigPanel
        open={true}
        onClose={onClose}
        config={defaultConfig}
        onSave={vi.fn()}
      />,
    );
    fireEvent.click(screen.getByTestId('config-panel-close'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('should show save/discard footer after editing a field', () => {
    render(
      <DashboardConfigPanel
        open={true}
        onClose={vi.fn()}
        config={defaultConfig}
        onSave={vi.fn()}
      />,
    );
    // Edit the row height input
    const rowHeightInput = screen.getByTestId('config-field-rowHeight');
    fireEvent.change(rowHeightInput, { target: { value: '200' } });
    expect(screen.getByTestId('config-panel-footer')).toBeDefined();
  });

  it('should call onSave with updated draft', () => {
    const onSave = vi.fn();
    render(
      <DashboardConfigPanel
        open={true}
        onClose={vi.fn()}
        config={defaultConfig}
        onSave={onSave}
      />,
    );
    // Modify a field
    fireEvent.change(screen.getByTestId('config-field-rowHeight'), {
      target: { value: '200' },
    });
    // Save
    fireEvent.click(screen.getByTestId('config-panel-save'));
    expect(onSave).toHaveBeenCalledTimes(1);
    const savedDraft = onSave.mock.calls[0][0];
    expect(savedDraft.rowHeight).toBe('200');
  });

  it('should revert changes on discard', () => {
    render(
      <DashboardConfigPanel
        open={true}
        onClose={vi.fn()}
        config={defaultConfig}
        onSave={vi.fn()}
      />,
    );
    const input = screen.getByTestId('config-field-rowHeight') as HTMLInputElement;
    fireEvent.change(input, { target: { value: '999' } });
    expect(input.value).toBe('999');

    // Discard
    fireEvent.click(screen.getByTestId('config-panel-discard'));

    // Footer should disappear (no longer dirty)
    expect(screen.queryByTestId('config-panel-footer')).toBeNull();
  });

  it('should call onFieldChange for live updates', () => {
    const onFieldChange = vi.fn();
    render(
      <DashboardConfigPanel
        open={true}
        onClose={vi.fn()}
        config={defaultConfig}
        onSave={vi.fn()}
        onFieldChange={onFieldChange}
      />,
    );
    fireEvent.change(screen.getByTestId('config-field-rowHeight'), {
      target: { value: '150' },
    });
    expect(onFieldChange).toHaveBeenCalledWith('rowHeight', '150');
  });
});
