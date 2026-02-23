/**
 * Page View Component
 * Renders a custom page based on the pageName parameter
 */

import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { SchemaRenderer } from '@object-ui/react';
import { Empty, EmptyTitle, EmptyDescription } from '@object-ui/components';
import { FileText, Pencil } from 'lucide-react';
import { MetadataToggle, MetadataPanel, useMetadataInspector } from './MetadataInspector';
import { useMetadata } from '../context/MetadataProvider';

export function PageView() {
  const { pageName } = useParams<{ pageName: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { showDebug, toggleDebug } = useMetadataInspector();
  
  // Find page definition from API-driven metadata
  const { pages } = useMetadata();
  const page = pages?.find((p: any) => p.name === pageName);

  if (!page) {
    return (
      <div className="h-full flex items-center justify-center p-8">
        <Empty>
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
            <FileText className="h-6 w-6 text-muted-foreground" />
          </div>
          <EmptyTitle>Page Not Found</EmptyTitle>
          <EmptyDescription>
            The page &quot;{pageName}&quot; could not be found.
            It may have been removed or renamed.
          </EmptyDescription>
        </Empty>
      </div>
    );
  }

  // Convert URL search params to an object for the page context
  const params = Object.fromEntries(searchParams.entries());

  return (
    <div className="flex flex-row h-full w-full overflow-hidden relative">
        <div className="flex-1 overflow-auto h-full relative group">
             <div className={`absolute top-1.5 sm:top-2 right-1.5 sm:right-2 z-50 flex items-center gap-1.5 transition-opacity ${showDebug ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                 <button
                   type="button"
                   onClick={() => navigate(`../design/page/${pageName}`)}
                   className="inline-flex items-center gap-1.5 rounded-md border border-input bg-background px-2.5 py-1.5 text-xs font-medium text-muted-foreground shadow-sm hover:bg-accent hover:text-accent-foreground"
                   data-testid="page-edit-button"
                 >
                   <Pencil className="h-3.5 w-3.5" />
                   Edit
                 </button>
                 <MetadataToggle open={showDebug} onToggle={toggleDebug} />
             </div>
             <SchemaRenderer 
                schema={{
                    ...page,
                    type: (page as any).type || 'page',
                    context: { ...(page as any).context, params }
                }} 
             />
        </div>
        <MetadataPanel
            open={showDebug}
            sections={[{ title: 'Page Configuration', data: page }]}
        />
    </div>
  );
}
