/**
 * ObjectUI
 * Copyright (c) 2024-present ObjectStack Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * ObjectView Component
 * 
 * A complete object management interface that combines ObjectGrid and ObjectForm
 * with optional ViewSwitcher, FilterUI, and SortUI controls.
 * Provides list view with integrated search, filters, and create/edit operations.
 */

import React, { useEffect, useState, useCallback, useMemo } from 'react';
import type {
  ObjectViewSchema,
  ObjectGridSchema,
  ObjectFormSchema,
  ListViewSchema,
  DataSource,
  ViewSwitcherSchema,
  FilterUISchema,
  SortUISchema,
  ViewType,
} from '@object-ui/types';
import { ObjectGrid } from '@object-ui/plugin-grid';
import { ObjectForm } from '@object-ui/plugin-form';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  Button,
  Input,
} from '@object-ui/components';
import { Plus, Search, RefreshCw } from 'lucide-react';
import { ViewSwitcher } from './ViewSwitcher';
import { FilterUI } from './FilterUI';
import { SortUI } from './SortUI';

export interface ObjectViewProps {
  /**
   * The schema configuration for the view
   */
  schema: ObjectViewSchema;
  
  /**
   * Data source (ObjectQL or ObjectStack adapter).
   * If not provided, falls back to SchemaRendererProvider context.
   */
  dataSource: DataSource;
  
  /**
   * Additional CSS class
   */
  className?: string;

  /**
   * Views available for the ViewSwitcher.
   * Each view defines a type (grid, kanban, calendar, etc.) and display columns/config.
   * If not provided, only the default grid view is shown.
   */
  views?: Array<{
    id: string;
    label: string;
    type: ViewType;
    columns?: string[];
    sort?: Array<{ field: string; direction: 'asc' | 'desc' }>;
    filter?: any[];
    [key: string]: any;
  }>;

  /**
   * The currently active view ID.
   * Used for controlled ViewSwitcher state.
   */
  activeViewId?: string;

  /**
   * Callback when the active view changes
   */
  onViewChange?: (viewId: string) => void;

  /**
   * Callback when a row is clicked (for record detail navigation)
   */
  onRowClick?: (record: Record<string, unknown>) => void;

  /**
   * Callback when edit is triggered on a record
   */
  onEdit?: (record: Record<string, unknown>) => void;

  /**
   * Render a custom ListView implementation for multi-view support.
   * When provided, this replaces the default ObjectGrid for the content area.
   * The function receives the computed ListViewSchema and interaction props.
   */
  renderListView?: (props: {
    schema: ListViewSchema;
    dataSource: DataSource;
    onEdit?: (record: Record<string, unknown>) => void;
    onRowClick?: (record: Record<string, unknown>) => void;
    className?: string;
  }) => React.ReactNode;

  /**
   * Toolbar addon: extra elements to render in the toolbar (e.g., MetadataToggle)
   */
  toolbarAddon?: React.ReactNode;
}

type FormMode = 'create' | 'edit' | 'view';

/**
 * ObjectView Component
 * 
 * Renders a complete object management interface with table and forms.
 * Supports ViewSwitcher, FilterUI, and SortUI for rich data exploration.
 * 
 * @example Basic usage (grid only)
 * ```tsx
 * <ObjectView
 *   schema={{
 *     type: 'object-view',
 *     objectName: 'users',
 *     layout: 'drawer',
 *     showSearch: true,
 *     showFilters: true
 *   }}
 *   dataSource={dataSource}
 * />
 * ```
 * 
 * @example Multi-view with ViewSwitcher
 * ```tsx
 * <ObjectView
 *   schema={schema}
 *   dataSource={dataSource}
 *   views={[
 *     { id: 'all', label: 'All', type: 'grid', columns: ['name', 'email'] },
 *     { id: 'board', label: 'Board', type: 'kanban', groupBy: 'status' },
 *   ]}
 *   activeViewId="all"
 *   onViewChange={setActiveViewId}
 * />
 * ```
 */
export const ObjectView: React.FC<ObjectViewProps> = ({
  schema,
  dataSource,
  className,
  views,
  activeViewId,
  onViewChange,
  onRowClick,
  onEdit: onEditProp,
  renderListView,
  toolbarAddon,
}) => {
  const [objectSchema, setObjectSchema] = useState<Record<string, unknown> | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<FormMode>('create');
  const [selectedRecord, setSelectedRecord] = useState<Record<string, unknown> | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);

  // Filter & Sort state
  const [filterValues, setFilterValues] = useState<Record<string, any>>({});
  const [sortConfig, setSortConfig] = useState<Array<{ field: string; direction: 'asc' | 'desc' }>>([]);

  // Multi-view state: determine active view
  const hasMultiView = views && views.length > 0;
  const currentActiveViewId = activeViewId || views?.[0]?.id;
  const activeView = views?.find(v => v.id === currentActiveViewId) || views?.[0];

  // Fetch object schema from ObjectQL/ObjectStack
  useEffect(() => {
    const fetchObjectSchema = async () => {
      try {
        const schemaData = await dataSource.getObjectSchema(schema.objectName);
        setObjectSchema(schemaData);
      } catch (err) {
        console.error('Failed to fetch object schema:', err);
      }
    };

    if (schema.objectName && dataSource) {
      fetchObjectSchema();
    }
  }, [schema.objectName, dataSource]);

  // Determine layout mode
  const layout = schema.layout || 'drawer';
  
  // Determine enabled operations
  const operations = schema.operations || schema.table?.operations || {
    create: true,
    read: true,
    update: true,
    delete: true,
  };

  // Handle create action
  const handleCreate = useCallback(() => {
    if (layout === 'page' && schema.onNavigate) {
      schema.onNavigate('new', 'edit');
    } else {
      setFormMode('create');
      setSelectedRecord(null);
      setIsFormOpen(true);
    }
  }, [layout, schema]);

  // Handle edit action
  const handleEdit = useCallback((record: Record<string, unknown>) => {
    if (onEditProp) {
      onEditProp(record);
      return;
    }
    if (layout === 'page' && schema.onNavigate) {
      const recordId = record._id || record.id;
      schema.onNavigate(recordId as string | number, 'edit');
    } else {
      setFormMode('edit');
      setSelectedRecord(record);
      setIsFormOpen(true);
    }
  }, [layout, schema, onEditProp]);

  // Handle view action
  const handleView = useCallback((record: Record<string, unknown>) => {
    if (layout === 'page' && schema.onNavigate) {
      const recordId = record._id || record.id;
      schema.onNavigate(recordId as string | number, 'view');
    } else {
      setFormMode('view');
      setSelectedRecord(record);
      setIsFormOpen(true);
    }
  }, [layout, schema]);

  // Handle row click
  const handleRowClick = useCallback((record: Record<string, unknown>) => {
    if (onRowClick) {
      onRowClick(record);
    } else if (operations.read !== false) {
      handleView(record);
    }
  }, [operations.read, handleView, onRowClick]);

  // Handle delete action
  const handleDelete = useCallback((_record: Record<string, unknown>) => {
    setRefreshKey(prev => prev + 1);
  }, []);

  // Handle bulk delete action
  const handleBulkDelete = useCallback((_records: Record<string, unknown>[]) => {
    setRefreshKey(prev => prev + 1);
  }, []);

  // Handle form submission
  const handleFormSuccess = useCallback(() => {
    setIsFormOpen(false);
    setSelectedRecord(null);
    setRefreshKey(prev => prev + 1);
  }, []);

  // Handle form cancellation
  const handleFormCancel = useCallback(() => {
    setIsFormOpen(false);
    setSelectedRecord(null);
  }, []);

  // Handle refresh
  const handleRefresh = useCallback(() => {
    setRefreshKey(prev => prev + 1);
  }, []);

  // --- ViewSwitcher schema ---
  const viewSwitcherSchema: ViewSwitcherSchema | null = useMemo(() => {
    if (!hasMultiView || !views || views.length <= 1) return null;
    return {
      type: 'view-switcher' as const,
      variant: 'tabs',
      position: 'top',
      persistPreference: true,
      storageKey: `view-pref-${schema.objectName}`,
      defaultView: (activeView?.type || 'grid') as ViewType,
      activeView: (activeView?.type || 'grid') as ViewType,
      views: views.map(v => ({
        type: v.type as ViewType,
        label: v.label,
        icon: v.type === 'kanban' ? 'kanban' :
              v.type === 'calendar' ? 'calendar' :
              v.type === 'chart' ? 'bar-chart' :
              v.type === 'map' ? 'map' :
              'table',
      })),
    };
  }, [hasMultiView, views, activeView, schema.objectName]);

  // Handle view type change from ViewSwitcher → map back to view ID
  const handleViewTypeChange = useCallback((viewType: ViewType) => {
    if (!views) return;
    const matched = views.find(v => v.type === viewType);
    if (matched && onViewChange) {
      onViewChange(matched.id);
    }
  }, [views, onViewChange]);

  // --- FilterUI schema (auto-generated from objectSchema or fields) ---
  const filterSchema: FilterUISchema | null = useMemo(() => {
    if (schema.showFilters === false) return null;
    const fields = (objectSchema as any)?.fields || {};
    const filterableFields = Object.entries(fields)
      .filter(([, f]: [string, any]) => !f.hidden)
      .slice(0, 8)
      .map(([key, f]: [string, any]) => {
        const fieldType = f.type || 'text';
        let filterType: 'text' | 'number' | 'select' | 'date' | 'boolean' = 'text';
        let options: Array<{ label: string; value: any }> | undefined;

        if (fieldType === 'number' || fieldType === 'currency' || fieldType === 'percent') {
          filterType = 'number';
        } else if (fieldType === 'boolean' || fieldType === 'toggle') {
          filterType = 'boolean';
        } else if (fieldType === 'date' || fieldType === 'datetime') {
          filterType = 'date';
        } else if (fieldType === 'select' || f.options) {
          filterType = 'select';
          options = (f.options || []).map((o: any) =>
            typeof o === 'string' ? { label: o, value: o } : { label: o.label, value: o.value },
          );
        }
        return { field: key, label: f.label || key, type: filterType, placeholder: `Filter ${f.label || key}...`, ...(options ? { options } : {}) };
      });

    if (filterableFields.length === 0) return null;

    return {
      type: 'filter-ui' as const,
      layout: 'popover' as const,
      showClear: true,
      showApply: true,
      filters: filterableFields,
      values: filterValues,
    };
  }, [schema.showFilters, objectSchema, filterValues]);

  // --- SortUI schema ---
  const sortSchema: SortUISchema | null = useMemo(() => {
    const fields = (objectSchema as any)?.fields || {};
    const sortableFields = Object.entries(fields)
      .filter(([, f]: [string, any]) => !f.hidden)
      .slice(0, 10)
      .map(([key, f]: [string, any]) => ({ field: key, label: f.label || key }));

    if (sortableFields.length === 0) return null;

    return {
      type: 'sort-ui' as const,
      variant: 'dropdown' as const,
      multiple: false,
      fields: sortableFields,
      sort: sortConfig,
    };
  }, [objectSchema, sortConfig]);

  // Build grid schema (default content renderer)
  const gridSchema: ObjectGridSchema = {
    type: 'object-grid',
    objectName: schema.objectName,
    title: schema.table?.title,
    description: schema.table?.description,
    fields: schema.table?.fields,
    columns: schema.table?.columns,
    operations: {
      ...operations,
      create: false, // Create is handled by the view's create button
    },
    defaultFilters: schema.table?.defaultFilters,
    defaultSort: schema.table?.defaultSort,
    pageSize: schema.table?.pageSize,
    selectable: schema.table?.selectable,
    className: schema.table?.className,
  };

  // Build form schema
  const buildFormSchema = (): ObjectFormSchema => {
    const recordId = selectedRecord ? (selectedRecord._id || selectedRecord.id) as string | number | undefined : undefined;
    
    return {
      type: 'object-form',
      objectName: schema.objectName,
      mode: formMode,
      recordId,
      title: schema.form?.title,
      description: schema.form?.description,
      fields: schema.form?.fields,
      customFields: schema.form?.customFields,
      groups: schema.form?.groups,
      layout: schema.form?.layout,
      columns: schema.form?.columns,
      showSubmit: schema.form?.showSubmit,
      submitText: schema.form?.submitText,
      showCancel: schema.form?.showCancel,
      cancelText: schema.form?.cancelText,
      showReset: schema.form?.showReset,
      initialValues: schema.form?.initialValues,
      readOnly: schema.form?.readOnly || formMode === 'view',
      className: schema.form?.className,
      onSuccess: handleFormSuccess,
      onCancel: handleFormCancel,
    };
  };

  // Get form title based on mode
  const getFormTitle = (): string => {
    if (schema.form?.title) return schema.form.title;
    const objectLabel = (objectSchema?.label as string) || schema.objectName;
    switch (formMode) {
      case 'create': return `Create ${objectLabel}`;
      case 'edit': return `Edit ${objectLabel}`;
      case 'view': return `View ${objectLabel}`;
      default: return objectLabel;
    }
  };

  // Render the form in a drawer
  const renderDrawerForm = () => (
    <Drawer open={isFormOpen} onOpenChange={setIsFormOpen} direction="right">
      <DrawerContent className="w-full sm:max-w-2xl">
        <DrawerHeader>
          <DrawerTitle>{getFormTitle()}</DrawerTitle>
          {schema.form?.description && (
            <DrawerDescription>{schema.form.description}</DrawerDescription>
          )}
        </DrawerHeader>
        <div className="flex-1 overflow-y-auto px-4 pb-4">
          <ObjectForm schema={buildFormSchema()} dataSource={dataSource} />
        </div>
      </DrawerContent>
    </Drawer>
  );

  // Render the form in a modal
  const renderModalForm = () => (
    <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{getFormTitle()}</DialogTitle>
          {schema.form?.description && (
            <DialogDescription>{schema.form.description}</DialogDescription>
          )}
        </DialogHeader>
        <ObjectForm schema={buildFormSchema()} dataSource={dataSource} />
      </DialogContent>
    </Dialog>
  );

  // Compute merged filters for the list
  const mergedFilters = useMemo(() => {
    const hasUserFilters = Object.keys(filterValues).some(k => filterValues[k] !== undefined && filterValues[k] !== '' && filterValues[k] !== null);
    if (hasUserFilters) {
      return Object.entries(filterValues)
        .filter(([, v]) => v !== undefined && v !== '' && v !== null)
        .map(([field, value]) => ({ field, operator: 'equals' as const, value }));
    }
    return activeView?.filter ?? schema.table?.defaultFilters;
  }, [filterValues, activeView, schema.table?.defaultFilters]);

  const mergedSort = useMemo(() => {
    return sortConfig.length > 0 ? sortConfig : activeView?.sort ?? schema.table?.defaultSort;
  }, [sortConfig, activeView, schema.table?.defaultSort]);

  // --- Content renderer ---
  const renderContent = () => {
    const key = `${schema.objectName}-${activeView?.id || 'default'}-${refreshKey}`;

    // If a custom renderListView is provided and we have multi-view, use it
    if (renderListView && hasMultiView && activeView) {
      const listViewSchema: ListViewSchema = {
        type: 'list-view',
        id: activeView.id,
        objectName: schema.objectName,
        viewType: activeView.type,
        fields: activeView.columns,
        filters: mergedFilters,
        sort: mergedSort,
        options: activeView, // Pass all view-specific options
      };

      return renderListView({
        schema: listViewSchema,
        dataSource,
        onEdit: handleEdit,
        onRowClick: handleRowClick,
        className: 'h-full',
      });
    }

    // Default: use ObjectGrid
    return (
      <ObjectGrid
        key={key}
        schema={gridSchema}
        dataSource={dataSource}
        onRowClick={handleRowClick}
        onEdit={operations.update !== false ? handleEdit : undefined}
        onDelete={operations.delete !== false ? handleDelete : undefined}
        onBulkDelete={operations.delete !== false ? handleBulkDelete : undefined}
      />
    );
  };

  // Render toolbar
  const renderToolbar = () => {
    const showSearchBox = schema.showSearch !== false;
    const showCreateButton = schema.showCreate !== false && operations.create !== false;
    const showRefreshButton = schema.showRefresh !== false;
    
    return (
      <div className="flex flex-col gap-3">
        {/* Main toolbar row */}
        <div className="flex items-center justify-between gap-4">
          {/* Left side: Search */}
          <div className="flex-1 max-w-md">
            {showSearchBox && (
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder={`Search ${(objectSchema?.label as string) || schema.objectName}...`}
                  value={searchQuery}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            )}
          </div>

          {/* Right side: Actions */}
          <div className="flex items-center gap-2">
            {filterSchema && (
              <FilterUI schema={filterSchema} onChange={setFilterValues} />
            )}
            {sortSchema && (
              <SortUI schema={sortSchema} onChange={setSortConfig} />
            )}
            {showRefreshButton && (
              <Button variant="outline" size="sm" onClick={handleRefresh}>
                <RefreshCw className="h-4 w-4" />
              </Button>
            )}
            {toolbarAddon}
            {showCreateButton && (
              <Button size="sm" onClick={handleCreate}>
                <Plus className="h-4 w-4" />
                Create
              </Button>
            )}
          </div>
        </div>

        {/* ViewSwitcher row (if multi-view) */}
        {viewSwitcherSchema && (
          <ViewSwitcher
            schema={viewSwitcherSchema}
            onViewChange={handleViewTypeChange}
            className="overflow-x-auto"
          />
        )}
      </div>
    );
  };

  return (
    <div className={className}>
      {/* Title and description */}
      {(schema.title || schema.description) && (
        <div className="mb-4">
          {schema.title && (
            <h2 className="text-2xl font-bold tracking-tight">{schema.title}</h2>
          )}
          {schema.description && (
            <p className="text-muted-foreground mt-1">{schema.description}</p>
          )}
        </div>
      )}

      {/* Toolbar */}
      <div className="mb-4">
        {renderToolbar()}
      </div>

      {/* Content */}
      {renderContent()}

      {/* Form (drawer or modal) */}
      {layout === 'drawer' && renderDrawerForm()}
      {layout === 'modal' && renderModalForm()}
    </div>
  );
};
