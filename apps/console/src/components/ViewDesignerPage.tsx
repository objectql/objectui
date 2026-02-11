/**
 * ViewDesignerPage
 *
 * Console page that wraps the ViewDesigner component for creating
 * and editing list views for a given object.
 *
 * Routes:
 *   - /:objectName/views/new      → Create new view
 *   - /:objectName/views/:viewId  → Edit existing view
 */

import { useMemo, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ViewDesigner } from '@object-ui/plugin-designer';
import type { ViewDesignerConfig } from '@object-ui/plugin-designer';
import { toast } from 'sonner';

export function ViewDesignerPage({ objects }: { objects: any[] }) {
  const navigate = useNavigate();
  const { objectName, viewId } = useParams();

  const objectDef = objects.find((o: any) => o.name === objectName);

  // Build available fields from object definition
  const availableFields = useMemo(() => {
    if (!objectDef?.fields) return [];
    const fields = objectDef.fields;
    if (Array.isArray(fields)) {
      return fields.map((f: any) =>
        typeof f === 'string'
          ? { name: f, label: f, type: 'text' }
          : { name: f.name, label: f.label || f.name, type: f.type || 'text' },
      );
    }
    return Object.entries(fields).map(([name, def]: [string, any]) => ({
      name,
      label: def.label || name,
      type: def.type || 'text',
    }));
  }, [objectDef]);

  // Resolve existing view for editing
  const existingView = useMemo(() => {
    if (!viewId || viewId === 'new' || !objectDef?.list_views) return null;
    return objectDef.list_views[viewId] || null;
  }, [viewId, objectDef]);

  const handleSave = useCallback(
    (config: ViewDesignerConfig) => {
      // In a real implementation this would persist the view config.
      // For now, log and show toast.
      console.log('[ViewDesigner] Save view config:', config);
      toast.success(
        existingView
          ? `View "${config.viewLabel}" updated`
          : `View "${config.viewLabel}" created`,
      );
      navigate(-1);
    },
    [existingView, navigate],
  );

  const handleCancel = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  if (!objectDef) {
    return (
      <div className="h-full flex items-center justify-center text-muted-foreground">
        Object &quot;{objectName}&quot; not found
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <ViewDesigner
        objectName={objectDef.name}
        viewId={viewId === 'new' ? undefined : viewId}
        viewLabel={existingView?.label ?? ''}
        viewType={existingView?.type ?? 'grid'}
        columns={
          existingView?.columns
            ? existingView.columns.map((c: string, i: number) => ({
                field: c,
                label: availableFields.find((f: any) => f.name === c)?.label ?? c,
                visible: true,
                order: i,
              }))
            : []
        }
        filters={existingView?.filter ?? []}
        sort={
          existingView?.sort?.map((s: any) => ({
            field: s.field,
            direction: s.order || s.direction || 'asc',
          })) ?? []
        }
        availableFields={availableFields}
        options={existingView?.options ?? {}}
        onSave={handleSave}
        onCancel={handleCancel}
        className="flex-1"
      />
    </div>
  );
}
