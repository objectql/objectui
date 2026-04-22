/**
 * Minimal third-party console template.
 *
 * Customise by:
 *   - Replacing MyAppContent / MyHomePage / Auth pages with your own
 *   - Pointing the BrowserRouter basename at your deployment
 *   - Wrapping <ConsoleApp/> with your theme/toaster providers as needed
 *
 * The shell (auth gate, /home, /organizations, /apps/:appName/* routing,
 * adapter + metadata providers) is fully owned by createConsole. Edit no
 * package internals — extend through the config object below.
 */

import { createConsole } from '@object-ui/app-shell';
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
  return <ConsoleApp />;
}
