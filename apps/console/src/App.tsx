/**
 * App — top-level console assembly.
 *
 * Wires the routing factory `createConsole` from @object-ui/app-shell into the
 * console-specific provider stack (theme, toaster, conditional auth wrapper,
 * navigation/favorites contexts). Third-party hosts can replicate this file
 * with their own auth pages, home page, organization selector, and AppContent
 * implementation.
 */

import { lazy } from 'react';
import {
  createConsole,
  ThemeProvider,
  ConsoleToaster,
  ConditionalAuthWrapper,
  NavigationProvider,
  FavoritesProvider,
} from '@object-ui/app-shell';
import { PreviewBanner } from '@object-ui/auth';

import { AppContent } from './AppContent';

const CreateAppPage = lazy(() => import('@object-ui/plugin-designer').then(m => ({ default: m.CreateAppPage })));

const ConsoleApp = createConsole({
  basename: import.meta.env.BASE_URL?.replace(/\/$/, '') || '/',
  AppContent,
  CreateAppRoute: CreateAppPage,
});

export function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="object-ui-theme">
      <ConsoleToaster position="bottom-right" />
      <ConditionalAuthWrapper authUrl={`${import.meta.env.VITE_SERVER_URL || ''}/api/v1/auth`}>
        <PreviewBanner />
        <NavigationProvider>
          <FavoritesProvider>
            <ConsoleApp />
          </FavoritesProvider>
        </NavigationProvider>
      </ConditionalAuthWrapper>
    </ThemeProvider>
  );
}

// Re-export AppContent so tests/extenders that import { AppContent } from './App'
// keep working.
export { AppContent } from './AppContent';
