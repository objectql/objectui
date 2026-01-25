/**
 * ObjectUI
 * Copyright (c) 2024-present ObjectStack Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * @object-ui/views
 * 
 * Core Object UI views package.
 * Provides seamless integration with ObjectQL backends through smart components
 * that automatically generate UI from ObjectQL object schemas.
 * 
 * @packageDocumentation
 */

import React from 'react';
import { ComponentRegistry } from '@object-ui/core';

export { ObjectGrid } from './ObjectGrid';
export type { ObjectGridProps } from './ObjectGrid';

export { ObjectForm } from './ObjectForm';
export type { ObjectFormProps } from './ObjectForm';

export { ObjectView } from './ObjectView';
export type { ObjectViewProps } from './ObjectView';

export { ObjectKanban } from './ObjectKanban';
export type { ObjectKanbanProps } from './ObjectKanban';

export { ObjectCalendar } from './ObjectCalendar';
export type { ObjectCalendarProps } from './ObjectCalendar';

export { ObjectGantt } from './ObjectGantt';
export type { ObjectGanttProps } from './ObjectGantt';

export { ObjectMap } from './ObjectMap';
export type { ObjectMapProps } from './ObjectMap';

// Export field renderers for customization
export {
  getCellRenderer,
  TextCellRenderer,
  NumberCellRenderer,
  CurrencyCellRenderer,
  PercentCellRenderer,
  BooleanCellRenderer,
  DateCellRenderer,
  DateTimeCellRenderer,
  SelectCellRenderer,
  EmailCellRenderer,
  UrlCellRenderer,
  PhoneCellRenderer,
  FileCellRenderer,
  ImageCellRenderer,
  LookupCellRenderer,
  FormulaCellRenderer,
  UserCellRenderer,
} from './field-renderers';
export type { CellRendererProps } from './field-renderers';

// Re-export related types from @object-ui/types
export type {
  ObjectGridSchema,
  ObjectFormSchema,
  ObjectViewSchema,
  ObjectQLComponentSchema,
} from '@object-ui/types';

// Import components for registration
import { ObjectGrid } from './ObjectGrid';
import { ObjectForm } from './ObjectForm';
import { ObjectView } from './ObjectView';
import { ObjectKanban } from './ObjectKanban';
import { ObjectCalendar } from './ObjectCalendar';
import { ObjectGantt } from './ObjectGantt';
import { ObjectMap } from './ObjectMap';

// Create renderer wrappers for ComponentRegistry
const ObjectGridRenderer: React.FC<{ schema: any }> = ({ schema }) => {
  // For now, render without dataSource since it requires ObjectQL setup
  // This allows the component to at least render in documentation
  return <ObjectGrid schema={schema} dataSource={null as any} />;
};

const ObjectFormRenderer: React.FC<{ schema: any }> = ({ schema }) => {
  return <ObjectForm schema={schema} dataSource={null as any} />;
};

const ObjectViewRenderer: React.FC<{ schema: any }> = ({ schema }) => {
  return <ObjectView schema={schema} dataSource={null as any} />;
};

const ObjectKanbanRenderer: React.FC<{ schema: any }> = ({ schema }) => {
  return <ObjectKanban schema={schema} dataSource={null as any} />;
};

const ObjectCalendarRenderer: React.FC<{ schema: any }> = ({ schema }) => {
  return <ObjectCalendar schema={schema} dataSource={null as any} />;
};

const ObjectGanttRenderer: React.FC<{ schema: any }> = ({ schema }) => {
  return <ObjectGantt schema={schema} dataSource={null as any} />;
};

const ObjectMapRenderer: React.FC<{ schema: any }> = ({ schema }) => {
  return <ObjectMap schema={schema} dataSource={null as any} />;
};

// Register components with ComponentRegistry
ComponentRegistry.register('object-grid', ObjectGridRenderer, {
  label: 'Object Grid',
  category: 'plugin',
  inputs: [
    { name: 'objectName', type: 'string', label: 'Object Name', required: true },
    { name: 'columns', type: 'array', label: 'Columns' },
    { name: 'searchable', type: 'boolean', label: 'Searchable', defaultValue: true },
    { name: 'selectable', type: 'boolean', label: 'Selectable', defaultValue: false },
    { name: 'editable', type: 'boolean', label: 'Editable (Grid Mode)', defaultValue: false },
    { name: 'keyboardNavigation', type: 'boolean', label: 'Keyboard Navigation', defaultValue: true },
    { name: 'frozenColumns', type: 'number', label: 'Frozen Columns', defaultValue: 0 },
    { name: 'resizableColumns', type: 'boolean', label: 'Resizable Columns', defaultValue: false },
  ],
});

ComponentRegistry.register('object-form', ObjectFormRenderer, {
  label: 'Object Form',
  category: 'plugin',
  inputs: [
    { name: 'objectName', type: 'string', label: 'Object Name', required: true },
    { name: 'fields', type: 'array', label: 'Fields' },
    { name: 'mode', type: 'enum', label: 'Mode', enum: ['create', 'edit'], defaultValue: 'create' },
  ],
});

ComponentRegistry.register('object-view', ObjectViewRenderer, {
  label: 'Object View',
  category: 'plugin',
  inputs: [
    { name: 'objectName', type: 'string', label: 'Object Name', required: true },
    { name: 'fields', type: 'array', label: 'Fields' },
    { name: 'layout', type: 'enum', label: 'Layout', enum: ['vertical', 'horizontal'], defaultValue: 'vertical' },
  ],
});

ComponentRegistry.register('object-kanban', ObjectKanbanRenderer, {
  label: 'Object Kanban',
  category: 'plugin',
  inputs: [
    { name: 'objectName', type: 'string', label: 'Object Name', required: true },
    { name: 'kanban', type: 'object', label: 'Kanban Config', description: 'groupByField, columns, summarizeField' },
  ],
});

ComponentRegistry.register('object-calendar', ObjectCalendarRenderer, {
  label: 'Object Calendar',
  category: 'plugin',
  inputs: [
    { name: 'objectName', type: 'string', label: 'Object Name', required: true },
    { name: 'calendar', type: 'object', label: 'Calendar Config', description: 'startDateField, endDateField, titleField, colorField' },
  ],
});

ComponentRegistry.register('object-gantt', ObjectGanttRenderer, {
  label: 'Object Gantt',
  category: 'plugin',
  inputs: [
    { name: 'objectName', type: 'string', label: 'Object Name', required: true },
    { name: 'gantt', type: 'object', label: 'Gantt Config', description: 'startDateField, endDateField, titleField, progressField, dependenciesField' },
  ],
});

ComponentRegistry.register('object-map', ObjectMapRenderer, {
  label: 'Object Map',
  category: 'plugin',
  inputs: [
    { name: 'objectName', type: 'string', label: 'Object Name', required: true },
    { name: 'map', type: 'object', label: 'Map Config', description: 'latitudeField, longitudeField, titleField' },
  ],
});

// Export for manual use
export const objectComponents = {
  'object-grid': ObjectGridRenderer,
  'object-form': ObjectFormRenderer,
  'object-view': ObjectViewRenderer,
  'object-kanban': ObjectKanbanRenderer,
  'object-calendar': ObjectCalendarRenderer,
  'object-gantt': ObjectGanttRenderer,
  'object-map': ObjectMapRenderer,
};
