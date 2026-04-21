/**
 * @object-ui/app-shell
 *
 * Minimal Application Shell for ObjectUI
 * Framework-agnostic rendering engine for third-party integration
 */

// Components
export { AppShell } from './components/AppShell';
export { ObjectRenderer } from './components/ObjectRenderer';
export { DashboardRenderer } from './components/DashboardRenderer';
export { PageRenderer } from './components/PageRenderer';
export { FormRenderer } from './components/FormRenderer';

// Providers
export { AdapterProvider, useAdapter } from './providers/AdapterProvider';
export { MetadataProvider, useMetadata } from './providers/MetadataProvider';
export { ExpressionProvider, useExpressionContext, evaluateVisibility } from './providers/ExpressionProvider';

// Hooks
export { useObjectActions } from './hooks/useObjectActions';
export { useRecentItems } from './hooks/useRecentItems';

// Types
export type {
  AppShellProps,
  ObjectRendererProps,
  DashboardRendererProps,
  PageRendererProps,
  FormRendererProps,
} from './types';

export type {
  MetadataState,
  MetadataContextValue,
  MetadataTypeStatus,
} from './providers/MetadataProvider';

export type {
  ExpressionContextValue,
} from './providers/ExpressionProvider';

export type {
  RecentItem,
} from './hooks/useRecentItems';
