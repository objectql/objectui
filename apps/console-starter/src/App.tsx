/**
 * Minimal third-party console template.
 *
 * Wraps createConsole() with the auth provider + toaster so that login,
 * registration, and password-reset work out of the box against the backend
 * pointed to by VITE_SERVER_URL.
 *
 * Customise by:
 *   - Replacing pages in ./pages with your own
 *   - Adding a real AppContent that renders your business screens
 *   - Wiring your own theme/branding around <ConsoleApp/>
 *
 * The shell (auth gate, /home, /organizations, /apps/:appName/* routing,
 * adapter + metadata providers) is fully owned by createConsole. Extend
 * through the config object below — no package internals to fork.
 */

import { createConsole } from '@object-ui/app-shell';
import { AuthProvider } from '@object-ui/auth';
import { Toaster } from 'sonner';
import {
  MyAppContent,
  MyHomeLayout,
  MyHomePage,
  MyOrganizationsLayout,
  MyOrganizationsPage,
  MyLoginPage,
  MyRegisterPage,
  MyForgotPasswordPage,
} from './pages';

const SERVER_URL = import.meta.env.VITE_SERVER_URL || '';
const AUTH_URL = `${SERVER_URL}/api/v1/auth`;

const ConsoleApp = createConsole({
  basename: '/',
  authPages: {
    Login: MyLoginPage,
    Register: MyRegisterPage,
    ForgotPassword: MyForgotPasswordPage,
  },
  homePage: { Layout: MyHomeLayout, Page: MyHomePage },
  organizationsPage: { Layout: MyOrganizationsLayout, Page: MyOrganizationsPage },
  AppContent: MyAppContent,
});

export function App() {
  return (
    <AuthProvider authUrl={AUTH_URL}>
      <Toaster position="bottom-right" />
      <ConsoleApp />
    </AuthProvider>
  );
}
