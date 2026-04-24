/**
 * App — top-level console assembly.
 *
 * Owns the full routing tree: import the building blocks from
 * @object-ui/app-shell and wire them together with JSX. To customise the
 * console, edit this file — don't look for a config object.
 */

import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import {
  ConsoleShell,
  ConnectedShell,
  AuthenticatedRoute,
  RootRedirect,
  SystemRedirect,
  LoadingFallback,
  ThemeProvider,
  ConsoleToaster,
  ConditionalAuthWrapper,
  DefaultLoginPage,
  DefaultRegisterPage,
  DefaultForgotPasswordPage,
  DefaultHomeLayout,
  DefaultHomePage,
  DefaultOrganizationsLayout,
  DefaultOrganizationsPage,
  DefaultOrganizationLayout,
  DefaultMembersPage,
  DefaultInvitationsPage,
  DefaultSettingsPage,
  DefaultAcceptInvitationPage,
} from '@object-ui/app-shell';
import { PreviewBanner } from '@object-ui/auth';

import { AppContent } from './AppContent';

const CreateAppPage = lazy(() => import('@object-ui/plugin-designer').then(m => ({ default: m.CreateAppPage })));

const BASENAME = import.meta.env.BASE_URL?.replace(/\/$/, '') || '/';
const AUTH_URL = `${import.meta.env.VITE_SERVER_URL || ''}/api/v1/auth`;

export function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="object-ui-theme">
      <ConsoleToaster position="bottom-right" />
      <ConditionalAuthWrapper authUrl={AUTH_URL}>
        <PreviewBanner />
        <BrowserRouter basename={BASENAME}>
          <ConsoleShell>
            <Routes>
              <Route path="/login" element={<DefaultLoginPage />} />
              <Route path="/register" element={<DefaultRegisterPage />} />
              <Route path="/forgot-password" element={<DefaultForgotPasswordPage />} />
              <Route path="/home" element={
                <AuthenticatedRoute>
                  <DefaultHomeLayout><DefaultHomePage /></DefaultHomeLayout>
                </AuthenticatedRoute>
              } />
              <Route path="/organizations" element={
                <AuthenticatedRoute requireOrganization={false}>
                  <DefaultOrganizationsLayout><DefaultOrganizationsPage /></DefaultOrganizationsLayout>
                </AuthenticatedRoute>
              } />
              <Route path="/organizations/:slug" element={
                <AuthenticatedRoute requireOrganization={false}>
                  <DefaultOrganizationLayout />
                </AuthenticatedRoute>
              }>
                <Route index element={<Navigate to="members" replace />} />
                <Route path="members" element={<DefaultMembersPage />} />
                <Route path="invitations" element={<DefaultInvitationsPage />} />
                <Route path="settings" element={<DefaultSettingsPage />} />
              </Route>
              <Route path="/accept-invitation/:invitationId" element={<DefaultAcceptInvitationPage />} />
              <Route path="/system/*" element={<SystemRedirect />} />
              <Route path="/create-app" element={
                <AuthenticatedRoute requireOrganization={false}>
                  <Suspense fallback={<LoadingFallback />}><CreateAppPage /></Suspense>
                </AuthenticatedRoute>
              } />
              <Route path="/apps/:appName/*" element={
                <AuthenticatedRoute>
                  <AppContent />
                </AuthenticatedRoute>
              } />
              <Route path="/" element={<ConnectedShell><RootRedirect /></ConnectedShell>} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </ConsoleShell>
        </BrowserRouter>
      </ConditionalAuthWrapper>
    </ThemeProvider>
  );
}

// Re-export AppContent so tests/extenders that import { AppContent } from './App'
// keep working.
export { AppContent } from './AppContent';
