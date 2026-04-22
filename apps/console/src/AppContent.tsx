/**
 * AppContent — console-specific thin wrapper around DefaultAppContent.
 *
 * The full inner-SPA shell (ConsoleLayout, CommandPalette, ObjectView etc.)
 * lives in @object-ui/app-shell as DefaultAppContent. This wrapper only
 * injects console-specific system routes (SystemHub / AppManagement /
 * Profile) plus the optional legacy metadata editor — third-party hosts
 * that don't need those routes use DefaultAppContent directly.
 */

import { lazy, Suspense } from 'react';
import { Route, useParams, useLocation, Navigate } from 'react-router-dom';
import { DefaultAppContent, LoadingScreen } from '@object-ui/app-shell';

const SystemHubPage = lazy(() => import('./pages/system/SystemHubPage').then(m => ({ default: m.SystemHubPage })));
const AppManagementPage = lazy(() => import('./pages/system/AppManagementPage').then(m => ({ default: m.AppManagementPage })));
const ProfilePage = lazy(() => import('./pages/system/ProfilePage').then(m => ({ default: m.ProfilePage })));

const ENABLE_LEGACY_METADATA_EDITOR = import.meta.env.VITE_LEGACY_METADATA_EDITOR === 'true';
const MetadataManagerPage = lazy(() => import('./legacy/MetadataManagerPage').then(m => ({ default: m.MetadataManagerPage })));
const MetadataDetailPage = lazy(() => import('./legacy/MetadataDetailPage').then(m => ({ default: m.MetadataDetailPage })));

/**
 * Forwards legacy `system/objects/:objectName` URLs to the canonical
 * `system/metadata/object/<name>` location preserving the active-app prefix.
 */
function ObjectRedirect() {
  const { objectName } = useParams<{ objectName?: string }>();
  const location = useLocation();
  const prefix = location.pathname.replace(/\/objects(\/.*)?$/, '');
  const target = objectName
    ? `${prefix}/metadata/object/${objectName}`
    : `${prefix}/metadata/object`;
  return <Navigate to={target} replace />;
}

const systemRoutes = (
  <>
    <Route path="system" element={<Suspense fallback={<LoadingScreen />}><SystemHubPage /></Suspense>} />
    <Route path="system/apps" element={<Suspense fallback={<LoadingScreen />}><AppManagementPage /></Suspense>} />
    <Route path="system/profile" element={<Suspense fallback={<LoadingScreen />}><ProfilePage /></Suspense>} />
    {ENABLE_LEGACY_METADATA_EDITOR && (
      <>
        <Route path="system/objects" element={<ObjectRedirect />} />
        <Route path="system/objects/:objectName" element={<ObjectRedirect />} />
        <Route path="system/metadata/:metadataType" element={<Suspense fallback={<LoadingScreen />}><MetadataManagerPage /></Suspense>} />
        <Route path="system/metadata/:metadataType/:itemName" element={<Suspense fallback={<LoadingScreen />}><MetadataDetailPage /></Suspense>} />
      </>
    )}
  </>
);

export function AppContent() {
  return <DefaultAppContent extraRoutes={systemRoutes} extraRoutesNoApp={systemRoutes} />;
}
