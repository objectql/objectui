/**
 * ObjectUI
 * Copyright (c) 2024-present ObjectStack Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * ObjectViewConfigurator Component
 *
 * Configuration panel for ListViewSchema/FormViewSchema. Supports
 * multi-view type switching, column visibility control, quick filters,
 * and display options. Aligned with @objectstack/spec ListViewSchema.
 */

import React, { useState, useCallback, useMemo } from 'react';
import type { NavigationItem } from '@object-ui/types';
import {
  LayoutGrid,
  Kanban,
  CalendarDays,
  GalleryHorizontalEnd,
  Clock,
  Map,
  GanttChart,
  Eye,
  EyeOff,
  ChevronDown,
  ChevronUp,
  Filter,
  ArrowUpDown,
  Columns3,
  Settings2,
} from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: (string | undefined | false)[]) {
  return twMerge(clsx(inputs));
}

// ============================================================================
// Types
// ============================================================================

export type ViewType = 'grid' | 'kanban' | 'calendar' | 'gallery' | 'timeline' | 'map' | 'gantt';

export interface ViewColumn {
  name: string;
  label: string;
  visible: boolean;
  width?: number;
}

export interface ViewConfig {
  viewType: ViewType;
  columns: ViewColumn[];
  showSearch: boolean;
  showFilters: boolean;
  showSort: boolean;
  rowHeight: 'compact' | 'medium' | 'tall';
  striped: boolean;
  bordered: boolean;
  groupBy?: string;
  sortField?: string;
  sortDirection?: 'asc' | 'desc';
}

export interface ObjectViewConfiguratorProps {
  /** Current view configuration */
  config: ViewConfig;
  /** Callback when config changes */
  onChange: (config: ViewConfig) => void;
  /** Available view types */
  availableViewTypes?: ViewType[];
  /** Read-only mode */
  readOnly?: boolean;
  /** CSS class */
  className?: string;
}

// ============================================================================
// Constants
// ============================================================================

const VIEW_TYPE_META: Record<ViewType, { label: string; Icon: React.FC<{ className?: string }> }> = {
  grid: { label: 'Grid', Icon: LayoutGrid },
  kanban: { label: 'Kanban', Icon: Kanban },
  calendar: { label: 'Calendar', Icon: CalendarDays },
  gallery: { label: 'Gallery', Icon: GalleryHorizontalEnd },
  timeline: { label: 'Timeline', Icon: Clock },
  map: { label: 'Map', Icon: Map },
  gantt: { label: 'Gantt', Icon: GanttChart },
};

const ROW_HEIGHT_OPTIONS: Array<{ value: ViewConfig['rowHeight']; label: string }> = [
  { value: 'compact', label: 'Compact' },
  { value: 'medium', label: 'Medium' },
  { value: 'tall', label: 'Tall' },
];

// ============================================================================
// Collapsible Section
// ============================================================================

interface SectionProps {
  title: string;
  icon: React.ReactNode;
  defaultOpen?: boolean;
  children: React.ReactNode;
}

function Section({ title, icon, defaultOpen = true, children }: SectionProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-gray-100 pb-3">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center gap-2 py-2 text-left"
      >
        {icon}
        <span className="flex-1 text-xs font-semibold uppercase text-gray-500">{title}</span>
        {open ? (
          <ChevronUp className="h-3.5 w-3.5 text-gray-400" />
        ) : (
          <ChevronDown className="h-3.5 w-3.5 text-gray-400" />
        )}
      </button>
      {open && <div className="space-y-2">{children}</div>}
    </div>
  );
}

// ============================================================================
// Main Component
// ============================================================================

export function ObjectViewConfigurator({
  config,
  onChange,
  availableViewTypes = ['grid', 'kanban', 'calendar', 'gallery', 'timeline', 'map', 'gantt'],
  readOnly = false,
  className,
}: ObjectViewConfiguratorProps) {
  const update = useCallback(
    (partial: Partial<ViewConfig>) => {
      onChange({ ...config, ...partial });
    },
    [config, onChange]
  );

  const toggleColumn = useCallback(
    (name: string) => {
      update({
        columns: config.columns.map((c) =>
          c.name === name ? { ...c, visible: !c.visible } : c
        ),
      });
    },
    [config, update]
  );

  const moveColumn = useCallback(
    (name: string, direction: 'up' | 'down') => {
      const cols = [...config.columns];
      const idx = cols.findIndex((c) => c.name === name);
      if (idx < 0) return;
      const target = direction === 'up' ? idx - 1 : idx + 1;
      if (target < 0 || target >= cols.length) return;
      [cols[idx], cols[target]] = [cols[target], cols[idx]];
      update({ columns: cols });
    },
    [config, update]
  );

  const visibleCount = useMemo(
    () => config.columns.filter((c) => c.visible).length,
    [config.columns]
  );

  return (
    <div
      data-testid="object-view-configurator"
      className={cn('w-72 space-y-3 rounded-lg border border-gray-200 bg-white p-4', className)}
    >
      {/* View type switcher */}
      <Section
        title="View Type"
        icon={<LayoutGrid className="h-3.5 w-3.5 text-gray-500" />}
      >
        <div className="flex flex-wrap gap-1.5">
          {availableViewTypes.map((vt) => {
            const { label, Icon } = VIEW_TYPE_META[vt];
            return (
              <button
                key={vt}
                type="button"
                data-testid={`view-type-${vt}`}
                onClick={() => update({ viewType: vt })}
                disabled={readOnly}
                className={cn(
                  'inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium transition-colors',
                  config.viewType === vt
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-100',
                  readOnly && 'cursor-not-allowed opacity-50'
                )}
              >
                <Icon className="h-3 w-3" />
                {label}
              </button>
            );
          })}
        </div>
      </Section>

      {/* Columns */}
      <Section
        title={`Fields (${visibleCount}/${config.columns.length})`}
        icon={<Columns3 className="h-3.5 w-3.5 text-gray-500" />}
      >
        {config.columns.length === 0 ? (
          <p className="text-xs text-gray-400">No fields configured.</p>
        ) : (
          <ul className="space-y-0.5">
            {config.columns.map((col, idx) => (
              <li
                key={col.name}
                data-testid={`view-column-${col.name}`}
                className="flex items-center gap-1.5 rounded px-1.5 py-1 text-xs hover:bg-gray-50"
              >
                <button
                  type="button"
                  onClick={() => toggleColumn(col.name)}
                  disabled={readOnly}
                  className={cn(
                    'rounded p-0.5 transition-colors',
                    col.visible ? 'text-blue-500' : 'text-gray-300'
                  )}
                  aria-label={col.visible ? 'Hide field' : 'Show field'}
                >
                  {col.visible ? (
                    <Eye className="h-3 w-3" />
                  ) : (
                    <EyeOff className="h-3 w-3" />
                  )}
                </button>
                <span className="flex-1 truncate text-gray-700">{col.label}</span>
                <button
                  type="button"
                  onClick={() => moveColumn(col.name, 'up')}
                  disabled={readOnly || idx === 0}
                  className="rounded p-0.5 text-gray-400 hover:text-gray-700 disabled:opacity-30"
                  aria-label="Move up"
                >
                  <ChevronUp className="h-3 w-3" />
                </button>
                <button
                  type="button"
                  onClick={() => moveColumn(col.name, 'down')}
                  disabled={readOnly || idx === config.columns.length - 1}
                  className="rounded p-0.5 text-gray-400 hover:text-gray-700 disabled:opacity-30"
                  aria-label="Move down"
                >
                  <ChevronDown className="h-3 w-3" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </Section>

      {/* Toolbar Options */}
      <Section
        title="Toolbar"
        icon={<Filter className="h-3.5 w-3.5 text-gray-500" />}
      >
        <div className="space-y-2">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={config.showSearch}
              onChange={(e) => update({ showSearch: e.target.checked })}
              disabled={readOnly}
              data-testid="view-toggle-search"
              className="h-3.5 w-3.5 rounded border-gray-300"
            />
            <span className="text-xs text-gray-700">Show Search</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={config.showFilters}
              onChange={(e) => update({ showFilters: e.target.checked })}
              disabled={readOnly}
              data-testid="view-toggle-filters"
              className="h-3.5 w-3.5 rounded border-gray-300"
            />
            <span className="text-xs text-gray-700">Show Filters</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={config.showSort}
              onChange={(e) => update({ showSort: e.target.checked })}
              disabled={readOnly}
              data-testid="view-toggle-sort"
              className="h-3.5 w-3.5 rounded border-gray-300"
            />
            <span className="text-xs text-gray-700">Show Sort</span>
          </label>
        </div>
      </Section>

      {/* Appearance */}
      <Section
        title="Appearance"
        icon={<Settings2 className="h-3.5 w-3.5 text-gray-500" />}
        defaultOpen={false}
      >
        <div className="space-y-2">
          {/* Row Height */}
          <div className="space-y-1">
            <label className="text-[10px] font-medium text-gray-500">Row Height</label>
            <div className="flex gap-1">
              {ROW_HEIGHT_OPTIONS.map(({ value, label }) => (
                <button
                  key={value}
                  type="button"
                  data-testid={`view-row-height-${value}`}
                  onClick={() => update({ rowHeight: value })}
                  disabled={readOnly}
                  className={cn(
                    'flex-1 rounded px-2 py-1 text-[10px] font-medium transition-colors',
                    config.rowHeight === value
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Striped */}
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={config.striped}
              onChange={(e) => update({ striped: e.target.checked })}
              disabled={readOnly}
              data-testid="view-toggle-striped"
              className="h-3.5 w-3.5 rounded border-gray-300"
            />
            <span className="text-xs text-gray-700">Striped Rows</span>
          </label>

          {/* Bordered */}
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={config.bordered}
              onChange={(e) => update({ bordered: e.target.checked })}
              disabled={readOnly}
              data-testid="view-toggle-bordered"
              className="h-3.5 w-3.5 rounded border-gray-300"
            />
            <span className="text-xs text-gray-700">Bordered</span>
          </label>
        </div>
      </Section>
    </div>
  );
}

export default ObjectViewConfigurator;
