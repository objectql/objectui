/**
 * PageDesignPage
 *
 * Console page that wraps the PageCanvasEditor for editing page schemas.
 *
 * Route: /design/page/:pageName
 */

import { useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageCanvasEditor } from '@object-ui/plugin-designer';
import type { PageSchema } from '@object-ui/types';
import { toast } from 'sonner';
import { useAdapter } from '../context/AdapterProvider';
import { useMetadata } from '../context/MetadataProvider';
import { ArrowLeft } from 'lucide-react';

export function PageDesignPage() {
  const navigate = useNavigate();
  const { pageName } = useParams<{ pageName: string }>();
  const dataSource = useAdapter();
  const { pages } = useMetadata();

  const page = pages?.find((p: any) => p.name === pageName);

  const [schema, setSchema] = useState<PageSchema>(
    () => (page as PageSchema) || { type: 'page', name: pageName, title: pageName, children: [] },
  );

  const handleChange = useCallback(
    async (updated: PageSchema) => {
      setSchema(updated);
      try {
        if (dataSource) {
          await dataSource.update('sys_page', pageName!, updated);
        }
      } catch {
        // Save errors are non-blocking; user can retry via export
      }
    },
    [dataSource, pageName],
  );

  const handleExport = useCallback(
    (exported: PageSchema) => {
      const blob = new Blob([JSON.stringify(exported, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${pageName || 'page'}.json`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success('Page schema exported');
    },
    [pageName],
  );

  const handleImport = useCallback(
    (imported: PageSchema) => {
      toast.success('Page schema imported');
      handleChange(imported);
    },
    [handleChange],
  );

  if (!page) {
    return (
      <div className="h-full flex items-center justify-center text-muted-foreground">
        Page &quot;{pageName}&quot; not found
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col" data-testid="page-design-page">
      <div className="flex items-center gap-3 border-b px-4 py-3 sm:px-6">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="rounded p-1.5 text-muted-foreground hover:text-foreground"
          aria-label="Go back"
          data-testid="page-design-back"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <h1 className="text-lg font-semibold tracking-tight truncate">
          Edit Page: {(page as any).label || (page as any).title || pageName}
        </h1>
      </div>
      <div className="flex-1 overflow-auto p-4 sm:p-6">
        <PageCanvasEditor
          schema={schema}
          onChange={handleChange}
          onExport={handleExport}
          onImport={handleImport}
        />
      </div>
    </div>
  );
}
