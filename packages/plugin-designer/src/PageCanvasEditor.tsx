/**
 * ObjectUI
 * Copyright (c) 2024-present ObjectStack Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * PageCanvasEditor Component
 *
 * WYSIWYG canvas editor for PageSchema. Allows adding and arranging
 * components (Grid, Kanban, Gallery, Calendar, Dashboard, etc.) via
 * a component palette and property panel.
 */

import React, { useState, useCallback } from 'react';
import type { PageSchema } from '@object-ui/types';
import {
  Plus,
  Trash2,
  GripVertical,
  ChevronUp,
  ChevronDown,
  LayoutGrid,
  Kanban,
  CalendarDays,
  GalleryHorizontalEnd,
  BarChart3,
  FileText,
  Settings2,
  X,
  Table2,
} from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: (string | undefined | false)[]) {
  return twMerge(clsx(inputs));
}

// ============================================================================
// Types
// ============================================================================

export interface PageCanvasEditorProps {
  /** Page schema to edit */
  schema: PageSchema;
  /** Callback when schema changes */
  onChange: (schema: PageSchema) => void;
  /** Read-only mode */
  readOnly?: boolean;
  /** CSS class */
  className?: string;
}

/** Simplified component entry for the canvas */
export interface CanvasComponent {
  id: string;
  type: string;
  label: string;
  props?: Record<string, unknown>;
}

// ============================================================================
// Constants
// ============================================================================

const COMPONENT_PALETTE = [
  { type: 'grid', label: 'Data Grid', Icon: Table2 },
  { type: 'kanban', label: 'Kanban Board', Icon: Kanban },
  { type: 'calendar', label: 'Calendar', Icon: CalendarDays },
  { type: 'gallery', label: 'Gallery', Icon: GalleryHorizontalEnd },
  { type: 'dashboard', label: 'Dashboard', Icon: BarChart3 },
  { type: 'form', label: 'Form', Icon: FileText },
  { type: 'layout-grid', label: 'Grid Layout', Icon: LayoutGrid },
];

let canvasCounter = 0;

function createComponentId(): string {
  canvasCounter += 1;
  return `component_${canvasCounter}`;
}

// ============================================================================
// Component Card
// ============================================================================

interface ComponentCardProps {
  component: CanvasComponent;
  index: number;
  total: number;
  selected: boolean;
  readOnly: boolean;
  onSelect: () => void;
  onRemove: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
}

function ComponentCard({
  component,
  index,
  total,
  selected,
  readOnly,
  onSelect,
  onRemove,
  onMoveUp,
  onMoveDown,
}: ComponentCardProps) {
  const meta = COMPONENT_PALETTE.find((p) => p.type === component.type) || COMPONENT_PALETTE[0];

  return (
    <div
      data-testid={`canvas-component-${component.id}`}
      onClick={onSelect}
      className={cn(
        'group flex cursor-pointer items-center gap-3 rounded-lg border-2 px-3 py-3 transition-colors',
        selected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
      )}
    >
      <GripVertical className="h-4 w-4 shrink-0 cursor-grab text-gray-300" />
      <meta.Icon className="h-5 w-5 shrink-0 text-gray-500" />
      <div className="flex-1">
        <span className="text-sm font-medium text-gray-800">{component.label}</span>
        <span className="ml-2 text-[10px] text-gray-400">{meta.label}</span>
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
            aria-label="Remove component"
            data-testid={`canvas-component-remove-${component.id}`}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// Component Property Panel
// ============================================================================

interface ComponentPropertyPanelProps {
  component: CanvasComponent;
  readOnly: boolean;
  onChange: (updates: Partial<CanvasComponent>) => void;
  onClose: () => void;
}

function ComponentPropertyPanel({
  component,
  readOnly,
  onChange,
  onClose,
}: ComponentPropertyPanelProps) {
  return (
    <div
      data-testid="component-property-panel"
      className="w-64 shrink-0 space-y-4 rounded-lg border border-gray-200 bg-white p-4"
    >
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold text-gray-800">Component Properties</h4>
        <button
          type="button"
          onClick={onClose}
          className="rounded p-0.5 text-gray-400 hover:text-gray-600"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Label */}
      <div className="space-y-1">
        <label htmlFor="component-label" className="text-xs font-medium text-gray-600">Label</label>
        <input
          id="component-label"
          data-testid="component-prop-label"
          type="text"
          value={component.label}
          onChange={(e) => onChange({ label: e.target.value })}
          disabled={readOnly}
          className="block w-full rounded-md border border-gray-300 px-2.5 py-1.5 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:bg-gray-50"
        />
      </div>

      {/* Type (read-only) */}
      <div className="space-y-1">
        <label className="text-xs font-medium text-gray-600">Type</label>
        <div className="rounded-md bg-gray-50 px-2.5 py-1.5 text-sm text-gray-600">
          {COMPONENT_PALETTE.find((p) => p.type === component.type)?.label ?? component.type}
        </div>
      </div>

      {/* ID (read-only) */}
      <div className="space-y-1">
        <label className="text-xs font-medium text-gray-600">ID</label>
        <div className="rounded-md bg-gray-50 px-2.5 py-1.5 text-xs font-mono text-gray-500">
          {component.id}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Main Component
// ============================================================================

export function PageCanvasEditor({
  schema,
  onChange,
  readOnly = false,
  className,
}: PageCanvasEditorProps) {
  const [components, setComponents] = useState<CanvasComponent[]>(() => {
    const children = schema.children
      ? Array.isArray(schema.children) ? schema.children : [schema.children]
      : [];
    return children.map((child: any, i: number) => ({
      id: child.id || `existing_${i}`,
      type: child.type || 'grid',
      label: child.title || child.label || `Component ${i + 1}`,
      props: child,
    }));
  });
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selectedComponent = components.find((c) => c.id === selectedId);

  const syncSchema = useCallback(
    (updated: CanvasComponent[]) => {
      setComponents(updated);
      onChange({
        ...schema,
        children: updated.map((c) => ({
          type: c.type,
          id: c.id,
          title: c.label,
          ...c.props,
        })) as any,
      });
    },
    [schema, onChange]
  );

  const addComponent = useCallback(
    (type: string) => {
      const id = createComponentId();
      const meta = COMPONENT_PALETTE.find((p) => p.type === type);
      const newComp: CanvasComponent = {
        id,
        type,
        label: meta?.label || type,
      };
      const updated = [...components, newComp];
      syncSchema(updated);
      setSelectedId(id);
    },
    [components, syncSchema]
  );

  const removeComponent = useCallback(
    (id: string) => {
      const updated = components.filter((c) => c.id !== id);
      syncSchema(updated);
      if (selectedId === id) setSelectedId(null);
    },
    [components, selectedId, syncSchema]
  );

  const moveComponent = useCallback(
    (id: string, direction: 'up' | 'down') => {
      const idx = components.findIndex((c) => c.id === id);
      if (idx < 0) return;
      const target = direction === 'up' ? idx - 1 : idx + 1;
      if (target < 0 || target >= components.length) return;
      const copy = [...components];
      [copy[idx], copy[target]] = [copy[target], copy[idx]];
      syncSchema(copy);
    },
    [components, syncSchema]
  );

  const updateComponent = useCallback(
    (updates: Partial<CanvasComponent>) => {
      if (!selectedId) return;
      const updated = components.map((c) =>
        c.id === selectedId ? { ...c, ...updates } : c
      );
      syncSchema(updated);
    },
    [components, selectedId, syncSchema]
  );

  return (
    <div data-testid="page-canvas-editor" className={cn('flex gap-4', className)}>
      {/* Component palette & canvas */}
      <div className="flex-1 space-y-4">
        {/* Palette */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium text-gray-700">Add:</span>
          {COMPONENT_PALETTE.map(({ type, label, Icon }) => (
            <button
              key={type}
              type="button"
              data-testid={`canvas-add-${type}`}
              onClick={() => addComponent(type)}
              disabled={readOnly}
              className="inline-flex items-center gap-1.5 rounded-md border border-gray-200 px-2.5 py-1.5 text-xs font-medium text-gray-600 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Icon className="h-3.5 w-3.5" />
              {label}
            </button>
          ))}
        </div>

        {/* Canvas (component list) */}
        {components.length === 0 ? (
          <div className="flex h-48 items-center justify-center rounded-lg border-2 border-dashed border-gray-200 text-sm text-gray-400">
            Empty page. Click a button above to add a component.
          </div>
        ) : (
          <div className="space-y-2">
            {components.map((comp, i) => (
              <ComponentCard
                key={comp.id}
                component={comp}
                index={i}
                total={components.length}
                selected={comp.id === selectedId}
                readOnly={readOnly}
                onSelect={() => setSelectedId(comp.id)}
                onRemove={() => removeComponent(comp.id)}
                onMoveUp={() => moveComponent(comp.id, 'up')}
                onMoveDown={() => moveComponent(comp.id, 'down')}
              />
            ))}
          </div>
        )}
      </div>

      {/* Property panel */}
      {selectedComponent && (
        <ComponentPropertyPanel
          component={selectedComponent}
          readOnly={readOnly}
          onChange={updateComponent}
          onClose={() => setSelectedId(null)}
        />
      )}
    </div>
  );
}

export default PageCanvasEditor;
