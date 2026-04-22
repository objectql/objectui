/**
 * AppContent — inner SPA rendered under /apps/:appName/*.
 *
 * Owns the per-app shell: ConsoleLayout, CommandPalette, KeyboardShortcutsDialog,
 * route table for object/dashboard/report/page views, and the global ModalForm
 * used by ObjectView edit actions. The outer routing skeleton (BrowserRouter,
 * AuthGuard, AdapterProvider, MetadataProvider, theme/toaster, /home, /login,
 * /organizations) is provided by `createConsole` from @object-ui/app-shell.
 */

import { Routes, Route, Navigate, useNavigate, useLocation, useParams } from 'react-router-dom';
import { useState, useEffect, useCallback, lazy, Suspense, useMemo } from 'react';
import { ModalForm } from '@object-ui/plugin-form';
import { Empty, EmptyTitle, EmptyDescription, Button } from '@object-ui/components';
import { toast } from 'sonner';
import { SchemaRendererProvider, useActionRunner, useGlobalUndo } from '@object-ui/react';
import { useObjectTranslation, useObjectLabel } from '@object-ui/i18n';
import type { ConnectionState } from './dataSource';
import { useAuth } from '@object-ui/auth';
import {
  useMetadata,
  useAdapter,
  ExpressionProvider,
  evaluateVisibility,
  useRecentItems,
} from '@object-ui/app-shell';
import { ExpressionEvaluator } from '@object-ui/core';

// Components (eagerly loaded — always needed)
import { ConsoleLayout } from './components/ConsoleLayout';
import { CommandPalette } from './components/CommandPalette';
import { ErrorBoundary } from './components/ErrorBoundary';
import { LoadingScreen } from './components/LoadingScreen';
import { ObjectView } from './components/ObjectView';
import { KeyboardShortcutsDialog } from './components/KeyboardShortcutsDialog';
import { OnboardingWalkthrough } from './components/OnboardingWalkthrough';
import { NavigationSyncEffect } from './hooks/useNavigationSync';

// Route-based code splitting — lazy-load less-frequently-used routes
const RecordDetailView = lazy(() => import('./components/RecordDetailView').then(m => ({ default: m.RecordDetailView })));
const DashboardView = lazy(() => import('./components/DashboardView').then(m => ({ default: m.DashboardView })));
const PageView = lazy(() => import('./components/PageView').then(m => ({ default: m.PageView })));
const ReportView = lazy(() => import('./components/ReportView').then(m => ({ default: m.ReportView })));
const SearchResultsPage = lazy(() => import('./components/SearchResultsPage').then(m => ({ default: m.SearchResultsPage })));

// Designer pages — sourced from @object-ui/plugin-designer so third-party hosts
// can opt out by not registering these routes.
const CreateAppPage = lazy(() => import('@object-ui/plugin-designer').then(m => ({ default: m.CreateAppPage })));
const EditAppPage = lazy(() => import('@object-ui/plugin-designer').then(m => ({ default: m.EditAppPage })));
const PageDesignPage = lazy(() => import('@object-ui/plugin-designer').then(m => ({ default: m.PageDesignPage })));
const DashboardDesignPage = lazy(() => import('@object-ui/plugin-designer').then(m => ({ default: m.DashboardDesignPage })));

// System pages remaining in console (most legacy /system/* wrappers were
// removed; User/Role/Permission/Audit/Org are now contributed by framework
// plugins as Setup-app objects and resolved via /apps/setup/<object_name>.)
const SystemHubPage = lazy(() => import('./pages/system/SystemHubPage').then(m => ({ default: m.SystemHubPage })));
const AppManagementPage = lazy(() => import('./pages/system/AppManagementPage').then(m => ({ default: m.AppManagementPage })));
const ProfilePage = lazy(() => import('./pages/system/ProfilePage').then(m => ({ default: m.ProfilePage })));

// Legacy in-place metadata editor — kept until plugin-setup exposes equivalent
// editing UX. Set VITE_LEGACY_METADATA_EDITOR=true to mount the routes.
const ENABLE_LEGACY_METADATA_EDITOR = import.meta.env.VITE_LEGACY_METADATA_EDITOR === 'true';
const MetadataManagerPage = lazy(() => import('./legacy/MetadataManagerPage').then(m => ({ default: m.MetadataManagerPage })));
const MetadataDetailPage = lazy(() => import('./legacy/MetadataDetailPage').then(m => ({ default: m.MetadataDetailPage })));

export function AppContent() {
  const [connectionState, setConnectionState] = useState<ConnectionState>('disconnected');
  const { user } = useAuth();
  const dataSource = useAdapter();

  const navigate = useNavigate();
  const location = useLocation();
  const { appName } = useParams();
  const { apps, objects: allObjects, loading: metadataLoading, ensureType } = useMetadata();
  const { t } = useObjectTranslation();
  const { objectLabel } = useObjectLabel();

  // Preload the metadata buckets that the routes under /apps/:appName/* assume
  // are fully loaded by render time (the lazy MetadataProvider only eagerly
  // loads `app`).
  const [scopeMetaReady, setScopeMetaReady] = useState(!ensureType);
  useEffect(() => {
    if (!ensureType) {
      setScopeMetaReady(true);
      return;
    }
    let cancelled = false;
    Promise.all([
      ensureType('object'),
      ensureType('dashboard'),
      ensureType('report'),
      ensureType('page'),
    ]).finally(() => {
      if (!cancelled) setScopeMetaReady(true);
    });
    return () => { cancelled = true; };
  }, [ensureType]);

  const activeApps = apps.filter((a: any) => a.active !== false);
  const activeApp =
    apps.find((a: any) => a.name === appName) ||
    activeApps.find((a: any) => a.isDefault === true) ||
    activeApps[0];

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<any>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const { addRecentItem } = useRecentItems();

  const { execute: executeAction, runner } = useActionRunner();

  useGlobalUndo({
    dataSource: dataSource ?? undefined,
    onUndo: (op: any) => {
      toast.info(`Undo: ${op.description}`, { duration: 4000 });
      setRefreshKey(k => k + 1);
    },
    onRedo: (op: any) => {
      toast.info(`Redo: ${op.description}`, { duration: 3000 });
      setRefreshKey(k => k + 1);
    },
  });

  useEffect(() => {
    runner.registerHandler('crud_success', async (action: any) => {
      setIsDialogOpen(false);
      setRefreshKey(k => k + 1);
      toast.success(action.params?.message ?? 'Record saved successfully');
      return { success: true, reload: true };
    });

    runner.registerHandler('dialog_cancel', async () => {
      setIsDialogOpen(false);
      return { success: true };
    });
  }, [runner]);

  useEffect(() => {
    if (!dataSource) return;
    const unsub = dataSource.onConnectionStateChange((event: any) => {
      setConnectionState(event.state);
      if (event.error) console.error('[Console] Connection error:', event.error);
    });
    setConnectionState(dataSource.getConnectionState());
    return unsub;
  }, [dataSource]);

  const cleanParts = location.pathname.split('/').filter(Boolean);
  let objectNameFromPath = cleanParts[2];
  if (
    objectNameFromPath === 'view' ||
    objectNameFromPath === 'record' ||
    objectNameFromPath === 'page' ||
    objectNameFromPath === 'dashboard' ||
    objectNameFromPath === 'design'
  ) {
    objectNameFromPath = '';
  }

  const currentObjectDef = allObjects.find((o: any) => o.name === objectNameFromPath);

  const handleCrudSuccess = useCallback(() => {
    const label = currentObjectDef ? objectLabel(currentObjectDef as any) : t('common.record', { defaultValue: 'Record' });
    executeAction({
      type: 'crud_success',
      params: {
        message: editingRecord
          ? t('form.updateSuccess', { object: label, defaultValue: `${label} updated successfully` })
          : t('form.createSuccess', { object: label, defaultValue: `${label} created successfully` }),
      },
    });
  }, [executeAction, editingRecord, currentObjectDef, objectLabel, t]);

  const handleDialogCancel = useCallback(() => {
    executeAction({ type: 'dialog_cancel' });
  }, [executeAction]);

  // Track recent items on route change.
  useEffect(() => {
    if (!activeApp) return;
    const parts = location.pathname.split('/').filter(Boolean);
    let objName = parts[2];
    if (objName === 'view' || objName === 'record' || objName === 'page' || objName === 'dashboard' || objName === 'design') {
      objName = '';
    }
    const basePath = `/apps/${activeApp.name}`;
    if (objName) {
      const obj = allObjects.find((o: any) => o.name === objName);
      if (obj) {
        addRecentItem({
          id: `object:${obj.name}`,
          label: obj.label || obj.name,
          href: `${basePath}/${obj.name}`,
          type: 'object',
        });
      }
    } else if (parts[2] === 'dashboard' && parts[3]) {
      addRecentItem({
        id: `dashboard:${parts[3]}`,
        label: parts[3].replace(/[-_]/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase()),
        href: `${basePath}/dashboard/${parts[3]}`,
        type: 'dashboard',
      });
    } else if (parts[2] === 'report' && parts[3]) {
      addRecentItem({
        id: `report:${parts[3]}`,
        label: parts[3].replace(/[-_]/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase()),
        href: `${basePath}/report/${parts[3]}`,
        type: 'report',
      });
    }
  }, [location.pathname, addRecentItem]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleEdit = (record: any) => {
    setEditingRecord(record);
    setIsDialogOpen(true);
  };

  const handleAppChange = (newAppName: string) => {
    navigate(`/apps/${newAppName}`);
  };

  const expressionEvaluator = useMemo(
    () => new ExpressionEvaluator({
      user: user ? { name: user.name, email: user.email, role: user.role ?? 'user' } : {},
      app: activeApp || {},
      data: editingRecord || {},
    }),
    [user, activeApp, editingRecord],
  );

  if (!dataSource || metadataLoading || !scopeMetaReady) return <LoadingScreen />;

  const isCreateAppRoute = location.pathname.endsWith('/create-app');
  const isSystemRoute = location.pathname.includes('/system');

  if (!activeApp && !isCreateAppRoute && !isSystemRoute) return (
    <div className="h-screen flex items-center justify-center">
      <Empty>
        <EmptyTitle>No Apps Configured</EmptyTitle>
        <EmptyDescription>
          No applications have been registered. Create your first app or visit System Settings to configure your environment.
        </EmptyDescription>
        <div className="mt-4 flex flex-col sm:flex-row items-center gap-3">
          <Button onClick={() => navigate('/create-app')} data-testid="create-first-app-btn">
            Create Your First App
          </Button>
          <Button variant="outline" onClick={() => navigate('/apps/setup')} data-testid="go-to-settings-btn">
            System Settings
          </Button>
        </div>
      </Empty>
    </div>
  );

  if (!activeApp && (isCreateAppRoute || isSystemRoute)) {
    return (
      <Suspense fallback={<LoadingScreen />}>
        <Routes>
          <Route path="create-app" element={<CreateAppPage />} />
          <Route path="system" element={<SystemHubPage />} />
          <Route path="system/apps" element={<AppManagementPage />} />
          <Route path="system/profile" element={<ProfilePage />} />
          {ENABLE_LEGACY_METADATA_EDITOR && (
            <>
              <Route path="system/objects" element={<ObjectRedirect />} />
              <Route path="system/objects/:objectName" element={<ObjectRedirect />} />
              <Route path="system/metadata/:metadataType" element={<MetadataManagerPage />} />
              <Route path="system/metadata/:metadataType/:itemName" element={<MetadataDetailPage />} />
            </>
          )}
        </Routes>
      </Suspense>
    );
  }

  const expressionUser = user
    ? { name: user.name, email: user.email, role: user.role ?? 'user' }
    : { name: 'Anonymous', email: '', role: 'guest' };

  return (
    <ExpressionProvider user={expressionUser} app={activeApp} data={{}}>
      <NavigationSyncEffect />
      <ConsoleLayout
        activeAppName={activeApp.name}
        activeApp={activeApp}
        onAppChange={handleAppChange}
        objects={allObjects}
        connectionState={connectionState}
      >
        <CommandPalette
          apps={apps}
          activeApp={activeApp}
          objects={allObjects}
          onAppChange={handleAppChange}
        />
        <KeyboardShortcutsDialog />
        <OnboardingWalkthrough />
        <SchemaRendererProvider dataSource={dataSource || {}}>
          <ErrorBoundary>
            <Suspense fallback={<LoadingScreen />}>
              <Routes>
                <Route path="/" element={<Navigate to={findFirstRoute(activeApp.navigation || [])} replace />} />
                <Route path=":objectName" element={
                  <ObjectView dataSource={dataSource} objects={allObjects} onEdit={handleEdit} />
                } />
                <Route path=":objectName/view/:viewId" element={
                  <ObjectView dataSource={dataSource} objects={allObjects} onEdit={handleEdit} />
                } />
                <Route path=":objectName/record/:recordId" element={
                  <RecordDetailView key={refreshKey} dataSource={dataSource} objects={allObjects} onEdit={handleEdit} />
                } />
                <Route path="dashboard/:dashboardName" element={<DashboardView dataSource={dataSource} />} />
                <Route path="report/:reportName" element={<ReportView dataSource={dataSource} />} />
                <Route path="page/:pageName" element={<PageView />} />
                <Route path="design/page/:pageName" element={<PageDesignPage />} />
                <Route path="design/dashboard/:dashboardName" element={<DashboardDesignPage />} />
                <Route path="search" element={<SearchResultsPage />} />
                <Route path="create-app" element={<CreateAppPage />} />
                <Route path="edit-app/:editAppName" element={<EditAppPage />} />
                <Route path="system" element={<SystemHubPage />} />
                <Route path="system/apps" element={<AppManagementPage />} />
                <Route path="system/profile" element={<ProfilePage />} />
                {ENABLE_LEGACY_METADATA_EDITOR && (
                  <>
                    <Route path="system/objects" element={<ObjectRedirect />} />
                    <Route path="system/objects/:objectName" element={<ObjectRedirect />} />
                    <Route path="system/metadata/:metadataType" element={<MetadataManagerPage />} />
                    <Route path="system/metadata/:metadataType/:itemName" element={<MetadataDetailPage />} />
                  </>
                )}
              </Routes>
            </Suspense>
          </ErrorBoundary>
          {currentObjectDef && (
            <ModalForm
              key={editingRecord?.id || 'new'}
              schema={{
                type: 'object-form',
                formType: 'modal',
                objectName: currentObjectDef.name,
                mode: editingRecord ? 'edit' : 'create',
                recordId: editingRecord?.id,
                title: editingRecord
                  ? t('form.editTitle', { object: objectLabel(currentObjectDef as any) })
                  : t('form.createTitle', { object: objectLabel(currentObjectDef as any) }),
                description: editingRecord
                  ? t('form.editDescription', { object: objectLabel(currentObjectDef as any) })
                  : t('form.createDescription', { object: objectLabel(currentObjectDef as any) }),
                open: isDialogOpen,
                onOpenChange: setIsDialogOpen,
                layout: 'vertical',
                fields: currentObjectDef.fields
                  ? (Array.isArray(currentObjectDef.fields)
                      ? currentObjectDef.fields
                          .filter((f: any) => {
                            if (typeof f === 'string') return true;
                            return evaluateVisibility(f.visible, expressionEvaluator);
                          })
                          .map((f: any) => typeof f === 'string' ? f : f.name)
                      : Object.entries(currentObjectDef.fields)
                          .filter(([_, f]: [string, any]) => evaluateVisibility(f.visible, expressionEvaluator))
                          .map(([key]: [string, any]) => key))
                  : [],
                onSuccess: handleCrudSuccess,
                onCancel: handleDialogCancel,
                showSubmit: true,
                showCancel: true,
                submitText: t('form.saveRecord'),
                cancelText: t('common.cancel'),
              }}
              dataSource={dataSource}
            />
          )}
        </SchemaRendererProvider>
      </ConsoleLayout>
    </ExpressionProvider>
  );
}

function findFirstRoute(items: any[]): string {
  if (!items || items.length === 0) return '';
  for (const item of items) {
    if (item.type === 'object') return item.viewName ? `${item.objectName}/view/${item.viewName}` : `${item.objectName}`;
    if (item.type === 'page') return item.pageName ? `page/${item.pageName}` : '';
    if (item.type === 'dashboard') return item.dashboardName ? `dashboard/${item.dashboardName}` : '';
    if (item.type === 'url') continue;
    if (item.type === 'group' && item.children) {
      const childRoute = findFirstRoute(item.children);
      if (childRoute !== '') return childRoute;
    }
  }
  return '';
}

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
