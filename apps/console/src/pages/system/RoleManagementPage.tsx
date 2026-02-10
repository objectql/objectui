/**
 * Role Management Page
 *
 * Displays roles with permission assignment matrix.
 * Reuses the plugin-grid for data display.
 */

import { useAuth } from '@object-ui/auth';
import { systemObjects } from './systemObjects';

const roleObject = systemObjects.find((o) => o.name === 'sys_role')!;

export function RoleManagementPage() {
  const { user: currentUser } = useAuth();
  const isAdmin = currentUser?.role === 'admin';

  return (
    <div className="flex flex-col gap-4 sm:gap-6 p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Role Management</h1>
          <p className="text-sm text-muted-foreground mt-1">Define roles and assign permissions</p>
        </div>
        {isAdmin && (
          <button
            type="button"
            className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 shrink-0"
          >
            Add Role
          </button>
        )}
      </div>

      <div className="rounded-md border overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              {roleObject.views[0].columns.map((col) => {
                const field = roleObject.fields.find((f) => f.name === col);
                return (
                  <th key={col} className="h-10 px-3 sm:px-4 text-left font-medium text-muted-foreground whitespace-nowrap">
                    {field?.label ?? col}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            <tr className="border-b">
              <td className="p-3 sm:p-4 text-sm text-muted-foreground" colSpan={roleObject.views[0].columns.length}>
                Connect to ObjectStack server to load roles. In production, this page uses plugin-grid with a permission assignment matrix.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
