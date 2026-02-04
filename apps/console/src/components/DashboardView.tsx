/**
 * Dashboard View Component
 * Renders a dashboard based on the dashboardName parameter
 */

import { useParams } from 'react-router-dom';
import { DashboardRenderer } from '@object-ui/plugin-dashboard';
import { Empty, EmptyTitle, EmptyDescription } from '@object-ui/components';
import appConfig from '../../objectstack.config';

export function DashboardView() {
  const { dashboardName } = useParams<{ dashboardName: string }>();
  
  // Find dashboard definition in config
  // In a real implementation, this would fetch from the server
  const dashboard = appConfig.dashboards?.find((d: any) => d.name === dashboardName);

  if (!dashboard) {
    return (
      <div className="h-full flex items-center justify-center p-8">
         <Empty>
          <EmptyTitle>Dashboard Not Found</EmptyTitle>
          <EmptyDescription>The dashboard "{dashboardName}" could not be found.</EmptyDescription>
        </Empty>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">{dashboard.label || dashboard.name}</h1>
        {dashboard.description && (
          <p className="text-muted-foreground mt-2">{dashboard.description}</p>
        )}
      </div>
      <DashboardRenderer schema={dashboard} />
    </div>
  );
}
