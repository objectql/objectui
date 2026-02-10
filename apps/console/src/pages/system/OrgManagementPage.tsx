/**
 * Organization Management Page
 *
 * Displays a list of organizations with member management.
 * Reuses the plugin-grid for data display.
 */

import { useAuth } from '@object-ui/auth';
import { Button, Card, CardContent, Badge } from '@object-ui/components';
import { Plus, Building2 } from 'lucide-react';
import { systemObjects } from './systemObjects';

const orgObject = systemObjects.find((o) => o.name === 'sys_org')!;

export function OrgManagementPage() {
  const { user: currentUser } = useAuth();
  const isAdmin = currentUser?.role === 'admin';

  return (
    <div className="flex flex-col gap-4 sm:gap-6 p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="bg-primary/10 p-2 rounded-md shrink-0">
            <Building2 className="h-5 w-5 text-primary" />
          </div>
          <div className="min-w-0">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Organization Management</h1>
            <p className="text-sm text-muted-foreground mt-0.5">Manage organizations and their members</p>
          </div>
        </div>
        {isAdmin && (
          <Button size="sm" className="shrink-0 gap-2">
            <Plus className="h-4 w-4" />
            Add Organization
          </Button>
        )}
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  {orgObject.views[0].columns.map((col) => {
                    const field = orgObject.fields.find((f) => f.name === col);
                    return (
                      <th key={col} className="h-10 px-3 sm:px-4 text-left font-medium text-muted-foreground whitespace-nowrap">
                        {field?.label ?? col}
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="p-4 sm:p-6 text-center text-sm text-muted-foreground" colSpan={orgObject.views[0].columns.length}>
                    <div className="flex flex-col items-center gap-2 py-4">
                      <Building2 className="h-8 w-8 text-muted-foreground/50" />
                      <p>Connect to ObjectStack server to load organizations.</p>
                      <Badge variant="secondary" className="text-xs">plugin-grid powered</Badge>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
