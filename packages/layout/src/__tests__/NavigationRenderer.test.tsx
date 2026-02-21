/**
 * ObjectUI
 * Copyright (c) 2024-present ObjectStack Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import type { NavigationItem } from '@object-ui/types';
import { NavigationRenderer } from '../NavigationRenderer';
import { SidebarProvider } from '@object-ui/components';

/** Wrap component in required providers */
function renderNav(
  items: NavigationItem[],
  props: Partial<React.ComponentProps<typeof NavigationRenderer>> = {},
  initialEntries: string[] = ['/'],
) {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <SidebarProvider defaultOpen={true}>
        <NavigationRenderer items={items} basePath="/apps/test" {...props} />
      </SidebarProvider>
    </MemoryRouter>,
  );
}

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

const objectItem: NavigationItem = {
  id: 'nav-accounts',
  type: 'object',
  label: 'Accounts',
  icon: 'Users',
  objectName: 'account',
};

const dashboardItem: NavigationItem = {
  id: 'nav-dash',
  type: 'dashboard',
  label: 'Sales Dashboard',
  icon: 'LayoutDashboard',
  dashboardName: 'sales-overview',
};

const pageItem: NavigationItem = {
  id: 'nav-page',
  type: 'page',
  label: 'Home Page',
  icon: 'Home',
  pageName: 'home',
};

const reportItem: NavigationItem = {
  id: 'nav-report',
  type: 'report',
  label: 'Monthly Report',
  icon: 'BarChart',
  reportName: 'monthly',
};

const urlItem: NavigationItem = {
  id: 'nav-url',
  type: 'url',
  label: 'Documentation',
  icon: 'ExternalLink',
  url: 'https://docs.example.com',
  target: '_blank',
};

const actionItem: NavigationItem = {
  id: 'nav-action',
  type: 'action',
  label: 'Create Record',
  icon: 'Plus',
};

const groupItem: NavigationItem = {
  id: 'nav-group',
  type: 'group',
  label: 'Sales',
  icon: 'Briefcase',
  children: [objectItem, dashboardItem],
  defaultOpen: true,
};

const separatorItem: NavigationItem = {
  id: 'nav-sep',
  type: 'separator',
  label: '',
};

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('NavigationRenderer', () => {
  // --- Basic rendering of 7 navigation types ---

  it('renders object navigation item as link', () => {
    renderNav([objectItem]);
    expect(screen.getByText('Accounts')).toBeTruthy();
    const link = screen.getByText('Accounts').closest('a');
    expect(link?.getAttribute('href')).toBe('/apps/test/account');
  });

  it('renders dashboard navigation item', () => {
    renderNav([dashboardItem]);
    expect(screen.getByText('Sales Dashboard')).toBeTruthy();
    const link = screen.getByText('Sales Dashboard').closest('a');
    expect(link?.getAttribute('href')).toBe('/apps/test/dashboard/sales-overview');
  });

  it('renders page navigation item', () => {
    renderNav([pageItem]);
    expect(screen.getByText('Home Page')).toBeTruthy();
    const link = screen.getByText('Home Page').closest('a');
    expect(link?.getAttribute('href')).toBe('/apps/test/page/home');
  });

  it('renders report navigation item', () => {
    renderNav([reportItem]);
    expect(screen.getByText('Monthly Report')).toBeTruthy();
    const link = screen.getByText('Monthly Report').closest('a');
    expect(link?.getAttribute('href')).toBe('/apps/test/report/monthly');
  });

  it('renders url navigation item as external link', () => {
    renderNav([urlItem]);
    expect(screen.getByText('Documentation')).toBeTruthy();
    const link = screen.getByText('Documentation').closest('a');
    expect(link?.getAttribute('href')).toBe('https://docs.example.com');
    expect(link?.getAttribute('target')).toBe('_blank');
    expect(link?.getAttribute('rel')).toContain('noopener');
  });

  it('renders action navigation item as button', () => {
    const onAction = vi.fn();
    renderNav([actionItem], { onAction });
    expect(screen.getByText('Create Record')).toBeTruthy();
  });

  it('renders group with children', () => {
    renderNav([groupItem]);
    expect(screen.getByText('Sales')).toBeTruthy();
    expect(screen.getByText('Accounts')).toBeTruthy();
    expect(screen.getByText('Sales Dashboard')).toBeTruthy();
  });

  it('renders separator', () => {
    const { container } = renderNav([objectItem, separatorItem, pageItem]);
    expect(screen.getByText('Accounts')).toBeTruthy();
    expect(screen.getByText('Home Page')).toBeTruthy();
    // Separator is rendered as a Separator component (role="none" or hr)
    const separators = container.querySelectorAll('[role="none"], hr, [data-orientation]');
    expect(separators.length).toBeGreaterThan(0);
  });

  // --- Visibility guards ---

  it('hides items with visible=false', () => {
    const hiddenItem: NavigationItem = {
      ...objectItem,
      id: 'nav-hidden',
      visible: false,
    };
    renderNav([hiddenItem]);
    expect(screen.queryByText('Accounts')).toBeNull();
  });

  it('shows items with visible=true', () => {
    const visibleItem: NavigationItem = {
      ...objectItem,
      id: 'nav-visible',
      visible: true,
    };
    renderNav([visibleItem]);
    expect(screen.getByText('Accounts')).toBeTruthy();
  });

  it('evaluates visibility expression via callback', () => {
    const item: NavigationItem = {
      ...objectItem,
      id: 'nav-expr',
      visible: '${user.isAdmin}',
    };
    const evalVis = vi.fn().mockReturnValue(false);
    renderNav([item], { evaluateVisibility: evalVis });
    expect(evalVis).toHaveBeenCalledWith('${user.isAdmin}');
    expect(screen.queryByText('Accounts')).toBeNull();
  });

  // --- Permission guards ---

  it('hides items when permission check fails', () => {
    const item: NavigationItem = {
      ...objectItem,
      id: 'nav-perm',
      requiredPermissions: ['account:read'],
    };
    const checkPerm = vi.fn().mockReturnValue(false);
    renderNav([item], { checkPermission: checkPerm });
    expect(checkPerm).toHaveBeenCalledWith(['account:read']);
    expect(screen.queryByText('Accounts')).toBeNull();
  });

  it('shows items when permission check passes', () => {
    const item: NavigationItem = {
      ...objectItem,
      id: 'nav-perm-ok',
      requiredPermissions: ['account:read'],
    };
    const checkPerm = vi.fn().mockReturnValue(true);
    renderNav([item], { checkPermission: checkPerm });
    expect(screen.getByText('Accounts')).toBeTruthy();
  });

  it('shows all items when no permission checker is provided', () => {
    const item: NavigationItem = {
      ...objectItem,
      id: 'nav-no-checker',
      requiredPermissions: ['account:admin'],
    };
    renderNav([item]);
    expect(screen.getByText('Accounts')).toBeTruthy();
  });

  // --- Badges ---

  it('renders badge on navigation items', () => {
    const item: NavigationItem = {
      ...objectItem,
      id: 'nav-badge',
      badge: 42,
    };
    renderNav([item]);
    expect(screen.getByText('42')).toBeTruthy();
  });

  it('renders string badge', () => {
    const item: NavigationItem = {
      ...objectItem,
      id: 'nav-badge-str',
      badge: 'New',
    };
    renderNav([item]);
    expect(screen.getByText('New')).toBeTruthy();
  });

  // --- Ordering ---

  it('sorts items by order field', () => {
    const items: NavigationItem[] = [
      { ...objectItem, id: 'b', label: 'B', order: 2 },
      { ...pageItem, id: 'a', label: 'A', order: 1 },
      { ...reportItem, id: 'c', label: 'C', order: 3 },
    ];
    const { container } = renderNav(items);
    const labels = Array.from(container.querySelectorAll('span'))
      .map((el) => el.textContent)
      .filter((t) => ['A', 'B', 'C'].includes(t ?? ''));
    expect(labels).toEqual(['A', 'B', 'C']);
  });

  // --- Mixed groups and leaf items ---

  it('renders mixed groups and leaf items correctly', () => {
    const items: NavigationItem[] = [
      pageItem,
      groupItem,
      reportItem,
    ];
    renderNav(items);
    expect(screen.getByText('Home Page')).toBeTruthy();
    expect(screen.getByText('Sales')).toBeTruthy();
    expect(screen.getByText('Monthly Report')).toBeTruthy();
  });

  // --- Active route highlighting ---

  it('highlights active route', () => {
    renderNav([objectItem], {}, ['/apps/test/account']);
    const link = screen.getByText('Accounts').closest('a');
    // The parent button should have data-active="true" set by SidebarMenuButton
    const button = link?.closest('[data-active]');
    expect(button?.getAttribute('data-active')).toBe('true');
  });

  // --- Empty items ---

  it('renders nothing for empty items array', () => {
    const { container } = renderNav([]);
    // Should render the wrapper SidebarGroup but no menu items
    expect(container.querySelectorAll('a').length).toBe(0);
  });
});
