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
import { createConsole } from '@object-ui/app-shell';
import { PreviewBanner } from '@object-ui/auth';

import { ThemeProvider } from './components/theme-provider';
import { ConsoleToaster } from './components/ConsoleToaster';
import { ConditionalAuthWrapper } from './components/ConditionalAuthWrapper';
import { NavigationProvider } from './context/NavigationContext';
import { FavoritesProvider } from './context/FavoritesProvider';

import { AppContent } from './AppContent';

const LoginPage = lazy(() => import('./pages/LoginPage').then(m => ({ default: m.LoginPage })));
const RegisterPage = lazy(() => import('./pages/RegisterPage').then(m => ({ default: m.RegisterPage })));
const ForgotPasswordPage = lazy(() => import('./pages/ForgotPasswordPage').then(m => ({ default: m.ForgotPasswordPage })));

const HomePage = lazy(() => import('./pages/home/HomePage').then(m => ({ default: m.HomePage })));
const HomeLayout = lazy(() => import('./pages/home/HomeLayout').then(m => ({ default: m.HomeLayout })));

const OrganizationsPage = lazy(() => import('./pages/organizations/OrganizationsPage').then(m => ({ default: m.OrganizationsPage })));
const OrganizationsLayout = lazy(() => import('./pages/organizations/OrganizationsLayout').then(m => ({ default: m.OrganizationsLayout })));

const CreateAppPage = lazy(() => import('@object-ui/plugin-designer').then(m => ({ default: m.CreateAppPage })));

const ConsoleApp = createConsole({
  basename: import.meta.env.BASE_URL?.replace(/\/$/, '') || '/',
  authPages: { Login: LoginPage, Register: RegisterPage, ForgotPassword: ForgotPasswordPage },
  homePage: { Layout: HomeLayout, Page: HomePage },
  organizationsPage: { Layout: OrganizationsLayout, Page: OrganizationsPage },
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
