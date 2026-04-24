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
export { MetadataProvider, useMetadata, useMetadataItem } from './providers/MetadataProvider';
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

// Console building blocks — compose these in your App.tsx to build the console
// routing tree. See apps/console-starter/src/App.tsx for a minimal example.
export {
  ConsoleShell,
  ConnectedShell,
  RequireOrganization,
  AuthenticatedRoute,
  RootRedirect,
  SystemRedirect,
  LoadingFallback,
} from './console/ConsoleShell';

// Layout chrome
export {
  ConsoleLayout,
  AppHeader,
  AppSidebar,
  UnifiedSidebar,
  AppSwitcher,
  ConnectionStatus,
  ActivityFeed,
  LocaleSwitcher,
  ModeToggle,
  AuthPageLayout,
} from './layout';
export type { ActivityItem } from './layout';

// Top-level chrome (dialogs, providers, error boundaries)
export {
  CommandPalette,
  KeyboardShortcutsDialog,
  OnboardingWalkthrough,
  ConditionalAuthWrapper,
  ConsoleToaster,
  ErrorBoundary,
  LoadingScreen,
  ThemeProvider,
  useTheme,
} from './chrome';

// Standard inner-SPA views
export {
  ObjectView,
  RecordDetailView,
  DashboardView,
  PageView,
  ReportView,
  SearchResultsPage,
  ViewConfigPanel,
} from './views';

// Hooks
export {
  useFavorites,
  useMetadataService,
  useNavPins,
  useNavigationSync,
  NavigationSyncEffect,
  addNavigationItem,
  removeNavigationItems,
  renameNavigationItems,
  navigationEqual,
  generateNavId,
  useResponsiveSidebar,
} from './hooks';
export type { FavoriteItem } from './hooks';

// Context providers
export { NavigationProvider, useNavigationContext, FavoritesProvider } from './context';

// Default page implementations (consumers can partial-override slots)
export { AppContent as DefaultAppContent } from './console/AppContent';
export { LoginPage as DefaultLoginPage } from './console/auth/LoginPage';
export { RegisterPage as DefaultRegisterPage } from './console/auth/RegisterPage';
export { ForgotPasswordPage as DefaultForgotPasswordPage } from './console/auth/ForgotPasswordPage';
export { HomeLayout as DefaultHomeLayout, HomeLayout } from './console/home/HomeLayout';
export { HomePage as DefaultHomePage, HomePage } from './console/home/HomePage';
export { OrganizationsLayout as DefaultOrganizationsLayout } from './console/organizations/OrganizationsLayout';
export { OrganizationsPage as DefaultOrganizationsPage } from './console/organizations/OrganizationsPage';

export { OrganizationLayout as DefaultOrganizationLayout } from './console/organizations/manage/OrganizationLayout';
export { MembersPage as DefaultMembersPage } from './console/organizations/manage/MembersPage';
export { InvitationsPage as DefaultInvitationsPage } from './console/organizations/manage/InvitationsPage';
export { SettingsPage as DefaultSettingsPage } from './console/organizations/manage/SettingsPage';
export { AcceptInvitationPage as DefaultAcceptInvitationPage } from './console/organizations/manage/AcceptInvitationPage';
