/**
 * ObjectUI
 * Copyright (c) 2024-present ObjectStack Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * DashboardEditor Component
 *
 * Visual editor for DashboardSchema — grid layout with widget selection,
 * property editing, and drag-based reordering. Supports KPI, Chart, Table,
 * and custom widget types from the spec.
 */

import React, { useState, useCallback } from 'react';
import type { DashboardSchema, DashboardWidgetSchema } from '@object-ui/types';
import {
  Plus,
  Trash2,
  GripVertical,
  ChevronUp,
  ChevronDown,
  BarChart3,
  LineChart,
  PieChart,
  TrendingUp,
  Table2,
  LayoutGrid,
  Settings2,
  X,
} from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: (string | undefined | false)[]) {
  return twMerge(clsx(inputs));
}

// ============================================================================
// Types
// ============================================================================

export interface DashboardEditorProps {
  /** Dashboard schema to edit */
  schema: DashboardSchema;
  /** Callback when schema changes */
  onChange: (schema: DashboardSchema) => void;
  /** Read-only mode */
  readOnly?: boolean;
  /** CSS class */
  className?: string;
}

// ============================================================================
// Constants
// ============================================================================

const WIDGET_TYPES = [
  { type: 'metric', label: 'KPI Metric', Icon: TrendingUp },
  { type: 'bar', label: 'Bar Chart', Icon: BarChart3 },
  { type: 'line', label: 'Line Chart', Icon: LineChart },
  { type: 'pie', label: 'Pie Chart', Icon: PieChart },
  { type: 'table', label: 'Table', Icon: Table2 },
  { type: 'grid', label: 'Grid', Icon: LayoutGrid },
];

let widgetCounter = 0;

function createWidgetId(): string {
  widgetCounter += 1;
  return `widget_${Date.now()}_${widgetCounter}`;
}

// ============================================================================
// Widget Card
// ============================================================================

interface WidgetCardProps {
  widget: DashboardWidgetSchema;
  index: number;
  total: number;
  selected: boolean;
  readOnly: boolean;
  onSelect: () => void;
  onRemove: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
}

function WidgetCard({
  widget,
  index,
  total,
  selected,
  readOnly,
  onSelect,
  onRemove,
  onMoveUp,
  onMoveDown,
}: WidgetCardProps) {
  const wType = widget.type || 'metric';
  const meta = WIDGET_TYPES.find((t) => t.type === wType) || WIDGET_TYPES[0];

  return (
    <div
      data-testid={`dashboard-widget-${widget.id}`}
      onClick={onSelect}
      className={cn(
        'group cursor-pointer rounded-lg border-2 p-3 transition-colors',
        selected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <GripVertical className="h-4 w-4 text-gray-300" />
          <meta.Icon className="h-4 w-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-800">
            {widget.title || `Widget ${index + 1}`}
          </span>
        </div>

        {!readOnly && (
          <div className="flex items-center gap-0.5 opacity-0 transition-opacity group-hover:opacity-100">
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onMoveUp(); }}
              disabled={index === 0}
              className="rounded p-0.5 text-gray-400 hover:text-gray-700 disabled:opacity-30"
              aria-label="Move up"
            >
              <ChevronUp className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onMoveDown(); }}
              disabled={index === total - 1}
              className="rounded p-0.5 text-gray-400 hover:text-gray-700 disabled:opacity-30"
              aria-label="Move down"
            >
              <ChevronDown className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onRemove(); }}
              className="rounded p-0.5 text-gray-400 hover:text-red-500"
              aria-label="Remove widget"
              data-testid={`dashboard-widget-remove-${widget.id}`}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        )}
      </div>

      <div className="mt-1.5 flex items-center gap-2">
        <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-gray-600">
          {meta.label}
        </span>
        {widget.object && (
          <span className="text-[10px] text-gray-400">
            {widget.object}
          </span>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// Widget Property Panel
// ============================================================================

interface WidgetPropertyPanelProps {
  widget: DashboardWidgetSchema;
  readOnly: boolean;
  onChange: (updates: Partial<DashboardWidgetSchema>) => void;
  onClose: () => void;
}

function WidgetPropertyPanel({
  widget,
  readOnly,
  onChange,
  onClose,
}: WidgetPropertyPanelProps) {
  return (
    <div
      data-testid="widget-property-panel"
      className="w-72 shrink-0 space-y-4 rounded-lg border border-gray-200 bg-white p-4"
    >
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold text-gray-800">Widget Properties</h4>
        <button
          type="button"
          onClick={onClose}
          className="rounded p-0.5 text-gray-400 hover:text-gray-600"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Title */}
      <div className="space-y-1">
        <label htmlFor="widget-title" className="text-xs font-medium text-gray-600">Title</label>
        <input
          id="widget-title"
          data-testid="widget-prop-title"
          type="text"
          value={widget.title ?? ''}
          onChange={(e) => onChange({ title: e.target.value })}
          disabled={readOnly}
          className="block w-full rounded-md border border-gray-300 px-2.5 py-1.5 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:bg-gray-50"
        />
      </div>

      {/* Type */}
      <div className="space-y-1">
        <label htmlFor="widget-type" className="text-xs font-medium text-gray-600">Type</label>
        <select
          id="widget-type"
          data-testid="widget-prop-type"
          value={widget.type ?? 'metric'}
          onChange={(e) => onChange({ type: e.target.value })}
          disabled={readOnly}
          className="block w-full rounded-md border border-gray-300 px-2.5 py-1.5 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:bg-gray-50"
        >
          {WIDGET_TYPES.map((t) => (
            <option key={t.type} value={t.type}>{t.label}</option>
          ))}
        </select>
      </div>

      {/* Data source */}
      <div className="space-y-1">
        <label htmlFor="widget-object" className="text-xs font-medium text-gray-600">Data Source (Object)</label>
        <input
          id="widget-object"
          data-testid="widget-prop-object"
          type="text"
          value={widget.object ?? ''}
          onChange={(e) => onChange({ object: e.target.value })}
          disabled={readOnly}
          placeholder="e.g. orders"
          className="block w-full rounded-md border border-gray-300 px-2.5 py-1.5 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:bg-gray-50"
        />
      </div>

      {/* Value field */}
      <div className="space-y-1">
        <label htmlFor="widget-value-field" className="text-xs font-medium text-gray-600">Value Field</label>
        <input
          id="widget-value-field"
          data-testid="widget-prop-value-field"
          type="text"
          value={widget.valueField ?? ''}
          onChange={(e) => onChange({ valueField: e.target.value })}
          disabled={readOnly}
          placeholder="e.g. amount"
          className="block w-full rounded-md border border-gray-300 px-2.5 py-1.5 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:bg-gray-50"
        />
      </div>

      {/* Aggregate */}
      <div className="space-y-1">
        <label htmlFor="widget-aggregate" className="text-xs font-medium text-gray-600">Aggregate</label>
        <select
          id="widget-aggregate"
          data-testid="widget-prop-aggregate"
          value={widget.aggregate ?? 'count'}
          onChange={(e) => onChange({ aggregate: e.target.value })}
          disabled={readOnly}
          className="block w-full rounded-md border border-gray-300 px-2.5 py-1.5 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:bg-gray-50"
        >
          <option value="count">Count</option>
          <option value="sum">Sum</option>
          <option value="avg">Average</option>
          <option value="min">Min</option>
          <option value="max">Max</option>
        </select>
      </div>

      {/* Color variant */}
      <div className="space-y-1">
        <label htmlFor="widget-color" className="text-xs font-medium text-gray-600">Color Variant</label>
        <select
          id="widget-color"
          data-testid="widget-prop-color"
          value={widget.colorVariant ?? 'default'}
          onChange={(e) => onChange({ colorVariant: e.target.value as DashboardWidgetSchema['colorVariant'] })}
          disabled={readOnly}
          className="block w-full rounded-md border border-gray-300 px-2.5 py-1.5 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:bg-gray-50"
        >
          <option value="default">Default</option>
          <option value="blue">Blue</option>
          <option value="teal">Teal</option>
          <option value="orange">Orange</option>
          <option value="purple">Purple</option>
          <option value="success">Success</option>
          <option value="warning">Warning</option>
          <option value="danger">Danger</option>
        </select>
      </div>
    </div>
  );
}

// ============================================================================
// Main Component
// ============================================================================

export function DashboardEditor({
  schema,
  onChange,
  readOnly = false,
  className,
}: DashboardEditorProps) {
  const [selectedWidgetId, setSelectedWidgetId] = useState<string | null>(null);

  const widgets = schema.widgets || [];
  const selectedWidget = widgets.find((w) => w.id === selectedWidgetId);

  const addWidget = useCallback(
    (type: string) => {
      const id = createWidgetId();
      const newWidget: DashboardWidgetSchema = {
        id,
        title: '',
        type,
        layout: {
          x: 0,
          y: widgets.length,
          w: schema.columns ?? 2,
          h: 1,
        },
      };
      onChange({ ...schema, widgets: [...widgets, newWidget] });
      setSelectedWidgetId(id);
    },
    [schema, widgets, onChange]
  );

  const removeWidget = useCallback(
    (id: string) => {
      onChange({ ...schema, widgets: widgets.filter((w) => w.id !== id) });
      if (selectedWidgetId === id) setSelectedWidgetId(null);
    },
    [schema, widgets, selectedWidgetId, onChange]
  );

  const moveWidget = useCallback(
    (id: string, direction: 'up' | 'down') => {
      const idx = widgets.findIndex((w) => w.id === id);
      if (idx < 0) return;
      const target = direction === 'up' ? idx - 1 : idx + 1;
      if (target < 0 || target >= widgets.length) return;
      const copy = [...widgets];
      [copy[idx], copy[target]] = [copy[target], copy[idx]];
      onChange({ ...schema, widgets: copy });
    },
    [schema, widgets, onChange]
  );

  const updateWidget = useCallback(
    (updates: Partial<DashboardWidgetSchema>) => {
      if (!selectedWidgetId) return;
      onChange({
        ...schema,
        widgets: widgets.map((w) =>
          w.id === selectedWidgetId ? { ...w, ...updates } : w
        ),
      });
    },
    [schema, widgets, selectedWidgetId, onChange]
  );

  return (
    <div
      data-testid="dashboard-editor"
      className={cn('flex gap-4', className)}
    >
      {/* Main area */}
      <div className="flex-1 space-y-4">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium text-gray-700">Add Widget:</span>
          {WIDGET_TYPES.map(({ type, label, Icon }) => (
            <button
              key={type}
              type="button"
              data-testid={`dashboard-add-${type}`}
              onClick={() => addWidget(type)}
              disabled={readOnly}
              className="inline-flex items-center gap-1.5 rounded-md border border-gray-200 px-2.5 py-1.5 text-xs font-medium text-gray-600 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Icon className="h-3.5 w-3.5" />
              {label}
            </button>
          ))}
        </div>

        {/* Widget grid */}
        {widgets.length === 0 ? (
          <div className="flex h-48 items-center justify-center rounded-lg border-2 border-dashed border-gray-200 text-sm text-gray-400">
            No widgets. Click a button above to add one.
          </div>
        ) : (
          <div
            className="grid gap-3"
            style={{ gridTemplateColumns: `repeat(${schema.columns ?? 2}, 1fr)` }}
          >
            {widgets.map((w, i) => (
              <WidgetCard
                key={w.id}
                widget={w}
                index={i}
                total={widgets.length}
                selected={w.id === selectedWidgetId}
                readOnly={readOnly}
                onSelect={() => setSelectedWidgetId(w.id ?? null)}
                onRemove={() => removeWidget(w.id!)}
                onMoveUp={() => moveWidget(w.id!, 'up')}
                onMoveDown={() => moveWidget(w.id!, 'down')}
              />
            ))}
          </div>
        )}
      </div>

      {/* Property panel */}
      {selectedWidget && (
        <WidgetPropertyPanel
          widget={selectedWidget}
          readOnly={readOnly}
          onChange={updateWidget}
          onClose={() => setSelectedWidgetId(null)}
        />
      )}
    </div>
  );
}

export default DashboardEditor;
