/**
 * createConsole — factory that assembles the console SPA shell.
 *
 * The factory owns the outer routing skeleton (BrowserRouter + AuthGuard +
 * AdapterProvider/MetadataProvider via ConnectedShell + standard /home,
 * /organizations, /login routes). All rendering and chrome above the inner
 * AppContent is parameterised through the ConsoleConfig contract so that
 * third-party hosts can plug in their own auth pages, home page, organizations
 * selector, branding, etc., without forking apps/console.
 */

import { Suspense, type ReactNode, type ComponentType } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthGuard, useAuth } from '@object-ui/auth';
import { AdapterProvider, useAdapter } from '../providers/AdapterProvider';
import { MetadataProvider, useMetadata } from '../providers/MetadataProvider';
import type { ConsoleConfig } from './types';

/**
 * Generic loading fallback. Hosts that want a branded loader can wrap createConsole
 * and provide their own Suspense boundary above the returned component.
 */
function DefaultLoadingFallback() {
  return (
    <div className="h-screen flex items-center justify-center text-sm text-muted-foreground">
      Loading…
    </div>
  );
}

function ConnectedShell({ children }: { children: ReactNode }) {
  return (
    <AdapterProvider>
      <ConnectedShellInner>{children}</ConnectedShellInner>
    </AdapterProvider>
  );
}

function ConnectedShellInner({ children }: { children: ReactNode }) {
  const adapter = useAdapter();
  if (!adapter) return <DefaultLoadingFallback />;
  return <MetadataProvider adapter={adapter}>{children}</MetadataProvider>;
}

/**
 * RequireOrganization — redirects to /organizations when the multi-tenant
 * feature is enabled (i.e. the user has any orgs but no active one).
 * Single-tenant deployments (organizations list empty) render straight through.
 */
function RequireOrganization({ children }: { children: ReactNode }) {
  const { activeOrganization, organizations, isOrganizationsLoading } = useAuth();
  if (isOrganizationsLoading) return <DefaultLoadingFallback />;
  const orgList = organizations ?? [];
  const orgFeatureEnabled = orgList.length > 0 || !!activeOrganization;
  if (orgFeatureEnabled && !activeOrganization) return <Navigate to="/organizations" replace />;
  return <>{children}</>;
}

function RootRedirect() {
  const { loading } = useMetadata();
  if (loading) return <DefaultLoadingFallback />;
  return <Navigate to="/home" replace />;
}

/**
 * Forwards legacy /system/* URLs to the canonical /apps/setup/* location so
 * bookmarks and external links keep working after the system pages collapse
 * into the Setup app. Suffix is preserved.
 */
function SystemRedirect() {
  const location = useLocation();
  const suffix = location.pathname.replace(/^\/system/, '');
  const target = suffix ? `/apps/setup/system${suffix}` : '/apps/setup';
  return <Navigate to={`${target}${location.search}${location.hash}`} replace />;
}

interface MountConditionalAuthProps {
  authUrl?: string;
  children: ReactNode;
}

/**
 * Lightweight pass-through when no authUrl is provided — keeps the same JSX
 * tree shape as ConditionalAuthWrapper so consumer code doesn't branch.
 */
function NoopAuthWrapper({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

/**
 * createConsole — returns a top-level <App/> component wired to the supplied
 * config. Themes/toaster/auth wrapper/navigation context must be provided by
 * the caller wrapping the result, so this factory stays free of console-private
 * dependencies (theme-provider, ConsoleToaster, ConditionalAuthWrapper, etc.).
 */
export function createConsole(config: ConsoleConfig): ComponentType {
  const {
    basename = '/',
    authPages: { Login, Register, ForgotPassword },
    homePage: { Layout: HomeLayout, Page: HomePage },
    organizationsPage: { Layout: OrgsLayout, Page: OrgsPage },
    AppContent,
    CreateAppRoute,
  } = config;

  return function ConsoleApp() {
    return (
      <BrowserRouter basename={basename}>
        <Suspense fallback={<DefaultLoadingFallback />}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/home" element={
              <AuthGuard fallback={<Navigate to="/login" />} loadingFallback={<DefaultLoadingFallback />}>
                <ConnectedShell>
                  <RequireOrganization>
                    <Suspense fallback={<DefaultLoadingFallback />}>
                      <HomeLayout>
                        <HomePage />
                      </HomeLayout>
                    </Suspense>
                  </RequireOrganization>
                </ConnectedShell>
              </AuthGuard>
            } />
            <Route path="/organizations" element={
              <AuthGuard fallback={<Navigate to="/login" />} loadingFallback={<DefaultLoadingFallback />}>
                <ConnectedShell>
                  <Suspense fallback={<DefaultLoadingFallback />}>
                    <OrgsLayout>
                      <OrgsPage />
                    </OrgsLayout>
                  </Suspense>
                </ConnectedShell>
              </AuthGuard>
            } />
            <Route path="/system/*" element={<SystemRedirect />} />
            {CreateAppRoute && (
              <Route path="/create-app" element={
                <AuthGuard fallback={<Navigate to="/login" />} loadingFallback={<DefaultLoadingFallback />}>
                  <ConnectedShell>
                    <Suspense fallback={<DefaultLoadingFallback />}>
                      <CreateAppRoute />
                    </Suspense>
                  </ConnectedShell>
                </AuthGuard>
              } />
            )}
            <Route path="/apps/:appName/*" element={
              <AuthGuard fallback={<Navigate to="/login" />} loadingFallback={<DefaultLoadingFallback />}>
                <ConnectedShell>
                  <RequireOrganization>
                    <AppContent />
                  </RequireOrganization>
                </ConnectedShell>
              </AuthGuard>
            } />
            <Route path="/" element={
              <ConnectedShell>
                <RootRedirect />
              </ConnectedShell>
            } />
          </Routes>
        </Suspense>
      </BrowserRouter>
    );
  };
}

export type { MountConditionalAuthProps };
