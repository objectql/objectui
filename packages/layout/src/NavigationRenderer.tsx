/**
 * ObjectUI
 * Copyright (c) 2024-present ObjectStack Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * @object-ui/layout - Navigation Renderer
 *
 * Renders a `NavigationItem[]` tree from AppSchema JSON into a Shadcn sidebar.
 * Supports all 7 navigation item types: object, dashboard, page, report,
 * url, action, group — plus separators, badges, visibility expressions,
 * and RBAC permission guards.
 *
 * @module NavigationRenderer
 */

import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import * as LucideIcons from 'lucide-react';
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
  Badge,
  Separator,
} from '@object-ui/components';
import type { NavigationItem } from '@object-ui/types';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/**
 * Callback to evaluate a visibility expression.
 * Return `true` if the item should be visible.
 * When not provided, all items default to visible.
 */
export type VisibilityEvaluator = (
  expression: string | boolean | undefined,
) => boolean;

/**
 * Callback to check whether the current user satisfies **all** of the
 * given permission strings.  Each string is opaque — the consumer decides
 * the format (e.g. `"object:action"` or a named role).
 * When not provided, all items default to permitted.
 */
export type PermissionChecker = (permissions: string[]) => boolean;

export interface NavigationRendererProps {
  /** Navigation items to render */
  items: NavigationItem[];

  /**
   * Base URL prefix prepended to generated hrefs.
   * @example "/apps/crm"
   */
  basePath?: string;

  /** Optional visibility evaluator for `visible` expressions */
  evaluateVisibility?: VisibilityEvaluator;

  /** Optional permission checker for `requiredPermissions` */
  checkPermission?: PermissionChecker;

  /** Called when an `action`-type item is clicked */
  onAction?: (item: NavigationItem) => void;
}

// ---------------------------------------------------------------------------
// Icon Helper
// ---------------------------------------------------------------------------

const iconCache = new Map<string, React.ComponentType<any>>();

/**
 * Resolve a Lucide icon component by name string.
 * Supports PascalCase, camelCase, and kebab-case.
 */
export function resolveIcon(name?: string): React.ComponentType<any> {
  if (!name) return LucideIcons.FileText;

  const cached = iconCache.get(name);
  if (cached) return cached;

  // Direct match
  if ((LucideIcons as any)[name]) {
    iconCache.set(name, (LucideIcons as any)[name]);
    return (LucideIcons as any)[name];
  }

  // kebab-case → PascalCase
  const pascal = name
    .split('-')
    .filter(Boolean)
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join('');
  if ((LucideIcons as any)[pascal]) {
    iconCache.set(name, (LucideIcons as any)[pascal]);
    return (LucideIcons as any)[pascal];
  }

  return LucideIcons.FileText;
}

// ---------------------------------------------------------------------------
// Default evaluators (always-visible, always-permitted)
// ---------------------------------------------------------------------------

const defaultVisibility: VisibilityEvaluator = (expr) => {
  if (expr === false || expr === 'false') return false;
  return true;
};

const defaultPermission: PermissionChecker = () => true;

// ---------------------------------------------------------------------------
// Internal helper: resolve href from NavigationItem
// ---------------------------------------------------------------------------

function resolveHref(item: NavigationItem, basePath: string): { href: string; external: boolean } {
  switch (item.type) {
    case 'object':
      return { href: `${basePath}/${item.objectName ?? ''}`, external: false };
    case 'dashboard':
      return { href: item.dashboardName ? `${basePath}/dashboard/${item.dashboardName}` : '#', external: false };
    case 'page':
      return { href: item.pageName ? `${basePath}/page/${item.pageName}` : '#', external: false };
    case 'report':
      return { href: item.reportName ? `${basePath}/report/${item.reportName}` : '#', external: false };
    case 'url':
      return { href: item.url ?? '#', external: item.target === '_blank' };
    default:
      return { href: '#', external: false };
  }
}

// ---------------------------------------------------------------------------
// NavigationItemRenderer (recursive)
// ---------------------------------------------------------------------------

function NavigationItemRenderer({
  item,
  basePath,
  evalVis,
  checkPerm,
  onAction,
}: {
  item: NavigationItem;
  basePath: string;
  evalVis: VisibilityEvaluator;
  checkPerm: PermissionChecker;
  onAction?: (item: NavigationItem) => void;
}) {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(item.defaultOpen !== false);

  // --- Visibility guard ---
  if (!evalVis(item.visible)) return null;

  // --- Permission guard ---
  if (item.requiredPermissions?.length && !checkPerm(item.requiredPermissions)) return null;

  // --- Separator ---
  if (item.type === 'separator') {
    return <Separator className="my-2" />;
  }

  // --- Group (collapsible) ---
  if (item.type === 'group') {
    const children = (item.children ?? [])
      .slice()
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

    return (
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <SidebarGroup>
          <SidebarGroupLabel asChild>
            <CollapsibleTrigger className="flex w-full items-center justify-between">
              {item.label}
              <LucideIcons.ChevronRight
                className={`ml-auto h-4 w-4 transition-transform ${isOpen ? 'rotate-90' : ''}`}
              />
            </CollapsibleTrigger>
          </SidebarGroupLabel>
          <CollapsibleContent>
            <SidebarGroupContent>
              <SidebarMenu>
                {children.map((child) => (
                  <NavigationItemRenderer
                    key={child.id}
                    item={child}
                    basePath={basePath}
                    evalVis={evalVis}
                    checkPerm={checkPerm}
                    onAction={onAction}
                  />
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </CollapsibleContent>
        </SidebarGroup>
      </Collapsible>
    );
  }

  // --- Action ---
  if (item.type === 'action') {
    const Icon = resolveIcon(item.icon);
    return (
      <SidebarMenuItem>
        <SidebarMenuButton
          tooltip={item.label}
          onClick={() => onAction?.(item)}
        >
          <Icon className="h-4 w-4" />
          <span>{item.label}</span>
          {item.badge != null && (
            <Badge variant={item.badgeVariant ?? 'default'} className="ml-auto text-[10px] px-1.5 py-0">
              {item.badge}
            </Badge>
          )}
        </SidebarMenuButton>
      </SidebarMenuItem>
    );
  }

  // --- Leaf items (object / dashboard / page / report / url) ---
  const Icon = resolveIcon(item.icon);
  const { href, external } = resolveHref(item, basePath);
  const isActive = href !== '#' && location.pathname.startsWith(href);

  const content = (
    <>
      <Icon className="h-4 w-4" />
      <span>{item.label}</span>
      {item.badge != null && (
        <Badge variant={item.badgeVariant ?? 'default'} className="ml-auto text-[10px] px-1.5 py-0">
          {item.badge}
        </Badge>
      )}
    </>
  );

  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild isActive={isActive} tooltip={item.label}>
        {external ? (
          <a href={href} target="_blank" rel="noopener noreferrer">
            {content}
          </a>
        ) : (
          <Link to={href}>
            {content}
          </Link>
        )}
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}

// ---------------------------------------------------------------------------
// NavigationRenderer (main export)
// ---------------------------------------------------------------------------

/**
 * Renders a `NavigationItem[]` tree into Shadcn Sidebar components.
 *
 * Features:
 * - 7 navigation item types + separators
 * - Nested collapsible groups
 * - Badge indicators
 * - Visibility expression evaluation
 * - RBAC permission guards
 * - Active-route highlighting
 *
 * @example
 * ```tsx
 * <NavigationRenderer
 *   items={appSchema.navigation}
 *   basePath="/apps/crm"
 *   evaluateVisibility={(expr) => evaluateVisibility(expr, evaluator)}
 *   checkPermission={(perms) => perms.every(p => can(p))}
 * />
 * ```
 */
export function NavigationRenderer({
  items,
  basePath = '',
  evaluateVisibility: evalVis = defaultVisibility,
  checkPermission: checkPerm = defaultPermission,
  onAction,
}: NavigationRendererProps) {
  // Sort top-level items by order
  const sorted = items.slice().sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  const hasGroups = sorted.some((i) => i.type === 'group');

  // No explicit groups → wrap in a single SidebarGroup
  if (!hasGroups) {
    return (
      <SidebarGroup>
        <SidebarGroupContent>
          <SidebarMenu>
            {sorted.map((item) => (
              <NavigationItemRenderer
                key={item.id}
                item={item}
                basePath={basePath}
                evalVis={evalVis}
                checkPerm={checkPerm}
                onAction={onAction}
              />
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    );
  }

  // Mixed content: render groups inline, wrap consecutive leaf items
  const fragments: React.ReactNode[] = [];
  let leafBuffer: NavigationItem[] = [];

  const flushLeaves = (key: string) => {
    if (leafBuffer.length === 0) return;
    const leaves = leafBuffer;
    leafBuffer = [];
    fragments.push(
      <SidebarGroup key={key}>
        <SidebarGroupContent>
          <SidebarMenu>
            {leaves.map((item) => (
              <NavigationItemRenderer
                key={item.id}
                item={item}
                basePath={basePath}
                evalVis={evalVis}
                checkPerm={checkPerm}
                onAction={onAction}
              />
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>,
    );
  };

  sorted.forEach((item, idx) => {
    if (item.type === 'group') {
      flushLeaves(`leaf-${idx}`);
      fragments.push(
        <NavigationItemRenderer
          key={item.id}
          item={item}
          basePath={basePath}
          evalVis={evalVis}
          checkPerm={checkPerm}
          onAction={onAction}
        />,
      );
    } else {
      leafBuffer.push(item);
    }
  });

  flushLeaves('leaf-end');

  return <>{fragments}</>;
}
