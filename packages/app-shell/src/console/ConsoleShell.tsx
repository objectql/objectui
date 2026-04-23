/**
 * Console building blocks — composable JSX elements that consumers assemble in
 * their own App.tsx to build the console routing tree.
 *
 * Previously this module exported a `createConsole(config)` factory that hid the
 * routing tree behind a config object. In practice every real project wants to
 * edit the routes directly (add /billing, tweak AuthGuard behaviour, reorder
 * providers), so we now export the pieces and let consumers write ~40 lines of
 * JSX in App.tsx. See apps/console-starter/src/App.tsx for a minimal example,
 * apps/console/src/App.tsx for one with custom system routes + CreateApp.
 */

import { Suspense, type ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthGuard, useAuth } from '@object-ui/auth';
import { AdapterProvider, useAdapter } from '../providers/AdapterProvider';
import { MetadataProvider, useMetadata } from '../providers/MetadataProvider';
import { NavigationProvider } from '../context/NavigationContext';
import { FavoritesProvider } from '../context/FavoritesProvider';

export function LoadingFallback() {
  return (
    <div className="h-screen flex items-center justify-center text-sm text-muted-foreground">
      Loading…
    </div>
  );
}

/**
 * ConsoleShell — top-level provider stack shared by every console route.
 * Wraps children in NavigationProvider + FavoritesProvider + Suspense so lazy
 * route components get a default loading fallback.
 *
 * Place this inside a <BrowserRouter> and around your <Routes>:
 *
 *   <BrowserRouter>
 *     <ConsoleShell>
 *       <Routes>...</Routes>
 *     </ConsoleShell>
 *   </BrowserRouter>
 */
export function ConsoleShell({ children }: { children: ReactNode }) {
  return (
    <NavigationProvider>
      <FavoritesProvider>
        <Suspense fallback={<LoadingFallback />}>{children}</Suspense>
      </FavoritesProvider>
    </NavigationProvider>
  );
}

/**
 * ConnectedShell — mounts the data layer (AdapterProvider + MetadataProvider).
 * Use this around any route element that needs metadata access, i.e. anything
 * rendering objects / dashboards / pages.
 */
export function ConnectedShell({ children }: { children: ReactNode }) {
  return (
    <AdapterProvider>
      <ConnectedShellInner>{children}</ConnectedShellInner>
    </AdapterProvider>
  );
}

function ConnectedShellInner({ children }: { children: ReactNode }) {
  const adapter = useAdapter();
  if (!adapter) return <LoadingFallback />;
  return <MetadataProvider adapter={adapter}>{children}</MetadataProvider>;
}

/**
 * RequireOrganization — redirects to /organizations when the multi-tenant
 * feature is enabled (user has orgs but no active one). Single-tenant
 * deployments (empty organizations list) render through.
 */
export function RequireOrganization({ children }: { children: ReactNode }) {
  const { activeOrganization, organizations, isOrganizationsLoading } = useAuth();
  if (isOrganizationsLoading) return <LoadingFallback />;
  const orgList = organizations ?? [];
  const orgFeatureEnabled = orgList.length > 0 || !!activeOrganization;
  if (orgFeatureEnabled && !activeOrganization) return <Navigate to="/organizations" replace />;
  return <>{children}</>;
}

/**
 * AuthenticatedRoute — convenience wrapper composing AuthGuard + ConnectedShell
 * (+ optional RequireOrganization). Covers the common case for protected
 * routes. For bespoke needs, compose the primitives directly.
 */
export function AuthenticatedRoute({
  children,
  requireOrganization = true,
  loginPath = '/login',
}: {
  children: ReactNode;
  requireOrganization?: boolean;
  loginPath?: string;
}) {
  return (
    <AuthGuard fallback={<Navigate to={loginPath} />} loadingFallback={<LoadingFallback />}>
      <ConnectedShell>
        {requireOrganization ? <RequireOrganization>{children}</RequireOrganization> : children}
      </ConnectedShell>
    </AuthGuard>
  );
}

/**
 * RootRedirect — element for <Route path="/" />. Waits for metadata to load
 * then sends the user to /home.
 */
export function RootRedirect() {
  const { loading } = useMetadata();
  if (loading) return <LoadingFallback />;
  return <Navigate to="/home" replace />;
}

/**
 * SystemRedirect — forwards legacy /system/* URLs to the canonical
 * /apps/setup/* location so bookmarks keep working. Suffix is preserved.
 */
export function SystemRedirect() {
  const location = useLocation();
  const suffix = location.pathname.replace(/^\/system/, '');
  const target = suffix ? `/apps/setup/system${suffix}` : '/apps/setup';
  return <Navigate to={`${target}${location.search}${location.hash}`} replace />;
}
