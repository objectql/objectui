/**
 * ObjectUI
 * Copyright (c) 2024-present ObjectStack Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { TabBar } from '../components/TabBar';
import type { ViewTab } from '../components/TabBar';

describe('TabBar', () => {
  const baseTabs: ViewTab[] = [
    { name: 'all', label: 'All Records', isDefault: true },
    { name: 'active', label: 'Active' },
    { name: 'archived', label: 'Archived' },
  ];

  it('should render tab bar with tabs', () => {
    render(<TabBar tabs={baseTabs} />);
    expect(screen.getByTestId('view-tabs')).toBeInTheDocument();
    expect(screen.getByTestId('view-tab-all')).toBeInTheDocument();
    expect(screen.getByTestId('view-tab-active')).toBeInTheDocument();
    expect(screen.getByTestId('view-tab-archived')).toBeInTheDocument();
  });

  it('should render tab labels', () => {
    render(<TabBar tabs={baseTabs} />);
    expect(screen.getByText('All Records')).toBeInTheDocument();
    expect(screen.getByText('Active')).toBeInTheDocument();
    expect(screen.getByText('Archived')).toBeInTheDocument();
  });

  it('should not render when tabs array is empty', () => {
    const { container } = render(<TabBar tabs={[]} />);
    expect(container.innerHTML).toBe('');
    expect(screen.queryByTestId('view-tabs')).not.toBeInTheDocument();
  });

  // isDefault tab should be selected by default
  it('should select isDefault tab initially', () => {
    render(<TabBar tabs={baseTabs} />);
    const defaultTab = screen.getByTestId('view-tab-all');
    expect(defaultTab).toHaveAttribute('aria-selected', 'true');
    const otherTab = screen.getByTestId('view-tab-active');
    expect(otherTab).toHaveAttribute('aria-selected', 'false');
  });

  it('should select first tab when no isDefault is set', () => {
    const tabs: ViewTab[] = [
      { name: 'alpha', label: 'Alpha' },
      { name: 'beta', label: 'Beta' },
    ];
    render(<TabBar tabs={tabs} />);
    expect(screen.getByTestId('view-tab-alpha')).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByTestId('view-tab-beta')).toHaveAttribute('aria-selected', 'false');
  });

  // Tab click changes active tab
  it('should switch active tab on click', () => {
    render(<TabBar tabs={baseTabs} />);
    const activeTab = screen.getByTestId('view-tab-active');
    fireEvent.click(activeTab);
    expect(activeTab).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByTestId('view-tab-all')).toHaveAttribute('aria-selected', 'false');
  });

  it('should call onTabChange callback on click', () => {
    const onTabChange = vi.fn();
    render(<TabBar tabs={baseTabs} onTabChange={onTabChange} />);
    fireEvent.click(screen.getByTestId('view-tab-active'));
    expect(onTabChange).toHaveBeenCalledTimes(1);
    expect(onTabChange).toHaveBeenCalledWith(expect.objectContaining({ name: 'active', label: 'Active' }));
  });

  // Pinned tabs always visible
  it('should always show pinned tabs even if visible is false', () => {
    const tabs: ViewTab[] = [
      { name: 'all', label: 'All', isDefault: true },
      { name: 'pinned-tab', label: 'Pinned', pinned: true, visible: 'false' },
      { name: 'hidden', label: 'Hidden', visible: 'false' },
    ];
    render(<TabBar tabs={tabs} />);
    expect(screen.getByTestId('view-tab-pinned-tab')).toBeInTheDocument();
    expect(screen.queryByTestId('view-tab-hidden')).not.toBeInTheDocument();
  });

  // Hidden tabs filtered out
  it('should filter out hidden tabs (visible: "false")', () => {
    const tabs: ViewTab[] = [
      { name: 'all', label: 'All Records' },
      { name: 'hidden', label: 'Hidden Tab', visible: 'false' },
    ];
    render(<TabBar tabs={tabs} />);
    expect(screen.getByText('All Records')).toBeInTheDocument();
    expect(screen.queryByText('Hidden Tab')).not.toBeInTheDocument();
  });

  it('should filter out tabs with visible: boolean false', () => {
    const tabs: ViewTab[] = [
      { name: 'all', label: 'All Records' },
      { name: 'hidden', label: 'Hidden Tab', visible: false as any },
    ];
    render(<TabBar tabs={tabs} />);
    expect(screen.getByText('All Records')).toBeInTheDocument();
    expect(screen.queryByText('Hidden Tab')).not.toBeInTheDocument();
  });

  // Order sorting
  it('should sort tabs by order property', () => {
    const tabs: ViewTab[] = [
      { name: 'c', label: 'Third', order: 3 },
      { name: 'a', label: 'First', order: 1 },
      { name: 'b', label: 'Second', order: 2 },
    ];
    render(<TabBar tabs={tabs} />);
    const tabContainer = screen.getByTestId('view-tabs');
    const buttons = tabContainer.querySelectorAll('button');
    expect(buttons[0]).toHaveTextContent('First');
    expect(buttons[1]).toHaveTextContent('Second');
    expect(buttons[2]).toHaveTextContent('Third');
  });

  // Icon rendering
  it('should render Lucide icon when icon prop is provided', () => {
    const tabs: ViewTab[] = [
      { name: 'starred', label: 'Starred', icon: 'star' },
    ];
    render(<TabBar tabs={tabs} />);
    const tab = screen.getByTestId('view-tab-starred');
    // Lucide icons render as SVG elements
    const svg = tab.querySelector('svg');
    expect(svg).toBeTruthy();
  });

  it('should handle kebab-case icon names', () => {
    const tabs: ViewTab[] = [
      { name: 'test', label: 'Test', icon: 'arrow-right' },
    ];
    render(<TabBar tabs={tabs} />);
    const tab = screen.getByTestId('view-tab-test');
    const svg = tab.querySelector('svg');
    expect(svg).toBeTruthy();
  });

  it('should not render icon when icon is not provided', () => {
    const tabs: ViewTab[] = [
      { name: 'noicon', label: 'No Icon' },
    ];
    render(<TabBar tabs={tabs} />);
    const tab = screen.getByTestId('view-tab-noicon');
    const svg = tab.querySelector('svg');
    expect(svg).toBeFalsy();
  });

  // Controlled activeTab
  it('should respect controlled activeTab prop', () => {
    render(<TabBar tabs={baseTabs} activeTab="archived" />);
    expect(screen.getByTestId('view-tab-archived')).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByTestId('view-tab-all')).toHaveAttribute('aria-selected', 'false');
  });

  // Tab role attributes
  it('should have proper ARIA attributes', () => {
    render(<TabBar tabs={baseTabs} />);
    const tabBar = screen.getByTestId('view-tabs');
    expect(tabBar).toHaveAttribute('role', 'tablist');
    const tab = screen.getByTestId('view-tab-all');
    expect(tab).toHaveAttribute('role', 'tab');
  });

  // Tab with filter config
  it('should pass tab with filter to onTabChange', () => {
    const onTabChange = vi.fn();
    const tabs: ViewTab[] = [
      { name: 'all', label: 'All', isDefault: true },
      {
        name: 'active',
        label: 'Active',
        filter: { logic: 'and', conditions: [{ field: 'status', operator: 'eq', value: 'active' }] },
      },
    ];
    render(<TabBar tabs={tabs} onTabChange={onTabChange} />);
    fireEvent.click(screen.getByTestId('view-tab-active'));
    expect(onTabChange).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'active',
        filter: expect.objectContaining({
          logic: 'and',
          conditions: expect.arrayContaining([
            expect.objectContaining({ field: 'status' }),
          ]),
        }),
      }),
    );
  });
});
