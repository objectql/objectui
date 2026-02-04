/**
 * Page View Component
 * Renders a custom page based on the pageName parameter
 */

import { useParams, useSearchParams } from 'react-router-dom';
import { SchemaRenderer } from '@object-ui/react';
import { Empty, EmptyTitle, EmptyDescription } from '@object-ui/components';
import appConfig from '../../objectstack.config';

export function PageView() {
  const { pageName } = useParams<{ pageName: string }>();
  const [searchParams] = useSearchParams();
  
  // Find page definition in config
  // In a real implementation, this would fetch from the server
  const page = appConfig.pages?.find((p: any) => p.name === pageName);

  if (!page) {
    return (
      <div className="h-full flex items-center justify-center p-8">
        <Empty>
          <EmptyTitle>Page Not Found</EmptyTitle>
          <EmptyDescription>The page "{pageName}" could not be found.</EmptyDescription>
        </Empty>
      </div>
    );
  }

  // Convert URL search params to an object for the page context
  const params = Object.fromEntries(searchParams.entries());

  return (
    <SchemaRenderer 
      schema={{
        type: 'page',
        ...page,
        // Pass URL params to page context if needed
        context: { ...page.context, params }
      }} 
    />
  );
}
