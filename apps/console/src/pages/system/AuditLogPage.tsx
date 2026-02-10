/**
 * Audit Log Page
 *
 * Read-only grid displaying system audit logs.
 * Shows user actions, resources, timestamps, and details.
 */

import { Card, CardContent, Badge } from '@object-ui/components';
import { ScrollText } from 'lucide-react';
import { systemObjects } from './systemObjects';

const auditObject = systemObjects.find((o) => o.name === 'sys_audit_log')!;

export function AuditLogPage() {
  return (
    <div className="flex flex-col gap-4 sm:gap-6 p-4 sm:p-6">
      <div className="flex items-center gap-3 min-w-0">
        <div className="bg-primary/10 p-2 rounded-md shrink-0">
          <ScrollText className="h-5 w-5 text-primary" />
        </div>
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Audit Log</h1>
          <p className="text-sm text-muted-foreground mt-0.5">View system activity and user actions</p>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  {auditObject.views[0].columns.map((col) => {
                    const field = auditObject.fields.find((f) => f.name === col);
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
                  <td className="p-4 sm:p-6 text-center text-sm text-muted-foreground" colSpan={auditObject.views[0].columns.length}>
                    <div className="flex flex-col items-center gap-2 py-4">
                      <ScrollText className="h-8 w-8 text-muted-foreground/50" />
                      <p>Connect to ObjectStack server to load audit logs.</p>
                      <Badge variant="secondary" className="text-xs">Read-only</Badge>
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
