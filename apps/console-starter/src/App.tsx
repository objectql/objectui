/**
 * Minimal third-party console template.
 *
 * `createConsole({})` is enough — every slot (auth pages, home, organizations,
 * AppContent) defaults to the implementation shipped from @object-ui/app-shell,
 * so this starter renders a fully functional console out of the box against
 * the backend at VITE_SERVER_URL.
 *
 * To customise: pass any of `authPages`, `homePage`, `organizationsPage`, or
 * `AppContent` overrides into `createConsole(...)`. See
 * @object-ui/app-shell/src/console/types.ts for the full surface.
 */

import { createConsole } from '@object-ui/app-shell';
import { AuthProvider } from '@object-ui/auth';
import { Toaster } from 'sonner';

const SERVER_URL = import.meta.env.VITE_SERVER_URL || '';
const AUTH_URL = `${SERVER_URL}/api/v1/auth`;

const ConsoleApp = createConsole({ basename: '/' });

export function App() {
  return (
    <AuthProvider authUrl={AUTH_URL}>
      <Toaster position="bottom-right" />
      <ConsoleApp />
    </AuthProvider>
  );
}
