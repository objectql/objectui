/**
 * AppTopNav
 *
 * v0-style top navigation bar for application pages (/apps/:appName/*).
 * Contains app logo, horizontal navigation menu items, search, and user controls.
 *
 * Layout:
 *   [App Icon + Name ▼] [Nav Items...] [Search] [Activity | Help] [Theme | Locale] [User]
 *
 * @module
 */

import * as React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import * as LucideIcons from 'lucide-react';
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
  Button,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuGroup,
  Separator,
  cn,
} from '@object-ui/components';
import {
  Search,
  HelpCircle,
  LogOut,
  Settings,
  User as UserIcon,
  ChevronsUpDown,
  Database,
  Home,
  ChevronDown,
} from 'lucide-react';
import { useAuth, getUserInitials } from '@object-ui/auth';
import { useObjectTranslation, useObjectLabel } from '@object-ui/i18n';
import { ModeToggle } from './mode-toggle';
import { LocaleSwitcher } from './LocaleSwitcher';
import { ActivityFeed, type ActivityItem } from './ActivityFeed';
import { resolveI18nLabel } from '../utils';
import { useMetadata } from '../context/MetadataProvider';
import { useExpressionContext, evaluateVisibility } from '../context/ExpressionProvider';
import { usePermissions } from '@object-ui/permissions';
import type { NavigationItem } from '@object-ui/types';

/**
 * Resolve a Lucide icon component by name string.
 */
function getIcon(name?: string): React.ComponentType<any> {
  if (!name) return LucideIcons.Database;

  const lookup = (key: string): React.ComponentType<any> | undefined => {
    try {
      const icon = (LucideIcons as Record<string, unknown>)[key];
      return typeof icon === 'function' ? (icon as React.ComponentType<any>) : undefined;
    } catch {
      return undefined;
    }
  };

  const pascalName = name
    .split(/[-_]/)
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');

  return lookup(name) ?? lookup(pascalName) ?? LucideIcons.Database;
}

interface AppTopNavProps {
  /** Current active app */
  activeApp: any;
  /** Callback when user switches apps */
  onAppChange?: (name: string) => void;
  /** Optional activity feed items */
  activities?: ActivityItem[];
}

/** Opens the global command palette */
function openCommandPalette() {
  document.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true }));
}

export function AppTopNav({ activeApp, onAppChange, activities }: AppTopNavProps) {
  const { t } = useObjectTranslation();
  const { appLabel, objectLabel: resolveNavObjectLabel } = useObjectLabel();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { apps: metadataApps } = useMetadata();

  const apps = metadataApps || [];
  const activeApps = apps.filter((a: any) => a.active !== false);

  // Get navigation items from the active app
  const areas: any[] = activeApp?.areas || [];
  const activeArea = areas.length > 0 ? areas[0] : null;
  const appNavigation: NavigationItem[] = activeArea?.navigation || activeApp?.navigation || [];

  // Visibility and permission checks
  const { evaluator } = useExpressionContext();
  const { can } = usePermissions();

  const evalVis = React.useCallback(
    (expr: string | boolean | undefined) => evaluateVisibility(expr, evaluator),
    [evaluator]
  );

  const checkPerm = React.useCallback(
    (permissions: string[]) =>
      permissions.every((perm: string) => {
        const parts = perm.split(':');
        const [object, action] = parts.length >= 2 ? [parts[0], parts[1]] : [perm, 'read'];
        return can(object, action as any);
      }),
    [can]
  );

  // Filter visible and permitted navigation items
  const visibleNavItems = appNavigation.filter((item: NavigationItem) => {
    if (item.visible !== undefined && !evalVis(item.visible)) return false;
    if (item.permissions && !checkPerm(item.permissions)) return false;
    return true;
  });

  const basePath = `/apps/${activeApp.name}`;
  const logo = activeApp?.branding?.logo;
  const primaryColor = activeApp?.branding?.primaryColor;

  // Helper to generate navigation href
  const getNavHref = (item: NavigationItem): string => {
    if (item.type === 'url' && item.url) return item.url;
    if (item.type === 'object') {
      const href = `${basePath}/${item.objectName}`;
      return item.viewName ? `${href}/view/${item.viewName}` : href;
    }
    if (item.type === 'dashboard') return item.dashboardName ? `${basePath}/dashboard/${item.dashboardName}` : '#';
    if (item.type === 'page') return item.pageName ? `${basePath}/page/${item.pageName}` : '#';
    if (item.type === 'report') return item.reportName ? `${basePath}/report/${item.reportName}` : '#';
    return '#';
  };

  // Check if navigation item is active
  const isNavItemActive = (item: NavigationItem): boolean => {
    const href = getNavHref(item);
    if (href === '#') return false;
    return location.pathname === href || location.pathname.startsWith(`${href}/`);
  };

  return (
    <header
      className="sticky top-0 z-40 w-full shrink-0 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 shadow-[0_1px_0_rgba(0,0,0,0.04)]"
      data-testid="app-top-nav"
    >
      <div className="flex h-12 w-full items-center gap-2 px-3 sm:px-4 md:px-6">
        {/* App Switcher */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className="flex items-center gap-2 shrink-0 rounded-md px-1.5 py-1 hover:bg-accent/50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              data-testid="app-switcher-trigger"
            >
              <div
                className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-primary-foreground"
                style={primaryColor ? { backgroundColor: primaryColor } : undefined}
              >
                {logo ? (
                  <img
                    src={logo}
                    alt={appLabel({ name: activeApp.name, label: resolveI18nLabel(activeApp.label, t) })}
                    className="h-5 w-5 object-contain"
                  />
                ) : (
                  React.createElement(getIcon(activeApp.icon), { className: 'h-4 w-4' })
                )}
              </div>
              <span className="hidden sm:inline text-sm font-semibold tracking-tight max-w-[120px] truncate">
                {appLabel({ name: activeApp.name, label: resolveI18nLabel(activeApp.label, t) })}
              </span>
              <ChevronsUpDown className="hidden sm:block h-4 w-4 text-muted-foreground" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56">
            <DropdownMenuLabel className="text-xs text-muted-foreground">
              Switch Application
            </DropdownMenuLabel>
            {activeApps.map((app: any) => (
              <DropdownMenuItem
                key={app.name}
                onClick={() => onAppChange?.(app.name)}
                className="gap-2 p-2"
              >
                <div className="flex size-6 items-center justify-center rounded-sm border">
                  {app.icon ? (
                    React.createElement(getIcon(app.icon), { className: 'size-3' })
                  ) : (
                    <Database className="size-3" />
                  )}
                </div>
                {appLabel({ name: app.name, label: resolveI18nLabel(app.label, t) })}
                {activeApp.name === app.name && <span className="ml-auto text-xs">✓</span>}
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="gap-2 p-2" onClick={() => navigate('/home')}>
              <div className="flex size-6 items-center justify-center rounded-md border bg-background">
                <Home className="size-4" />
              </div>
              <div className="font-medium text-muted-foreground">Back to Home</div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Separator orientation="vertical" className="h-5 mx-1" />

        {/* Primary Navigation - Desktop */}
        <nav className="hidden lg:flex items-center gap-1 flex-1 min-w-0">
          {visibleNavItems.slice(0, 6).map((item) => {
            const NavIcon = getIcon(item.icon);
            const href = getNavHref(item);
            const isActive = isNavItemActive(item);
            const label = resolveI18nLabel(item.label, t);

            if (item.type === 'group' && item.children) {
              return (
                <DropdownMenu key={item.id}>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className={cn(
                        'h-8 px-3 text-sm font-medium gap-1',
                        isActive && 'bg-accent text-accent-foreground'
                      )}
                    >
                      <NavIcon className="h-4 w-4" />
                      <span>{label}</span>
                      <ChevronDown className="h-3 w-3 opacity-50" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    {item.children
                      .filter((child: NavigationItem) => {
                        if (child.visible !== undefined && !evalVis(child.visible)) return false;
                        if (child.permissions && !checkPerm(child.permissions)) return false;
                        return true;
                      })
                      .map((child: NavigationItem) => {
                        const ChildIcon = getIcon(child.icon);
                        const childHref = getNavHref(child);
                        const childLabel = resolveI18nLabel(child.label, t);
                        return (
                          <DropdownMenuItem key={child.id} asChild>
                            <Link to={childHref} className="gap-2">
                              <ChildIcon className="h-4 w-4" />
                              {childLabel}
                            </Link>
                          </DropdownMenuItem>
                        );
                      })}
                  </DropdownMenuContent>
                </DropdownMenu>
              );
            }

            return (
              <Button
                key={item.id}
                variant="ghost"
                size="sm"
                asChild
                className={cn(
                  'h-8 px-3 text-sm font-medium',
                  isActive && 'bg-accent text-accent-foreground'
                )}
              >
                <Link to={href}>
                  <NavIcon className="h-4 w-4 mr-1.5" />
                  <span>{label}</span>
                </Link>
              </Button>
            );
          })}
        </nav>

        {/* Mobile Navigation - Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="lg:hidden h-8 px-2">
              <span className="text-sm font-medium">Menu</span>
              <ChevronDown className="ml-1 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56">
            {visibleNavItems.map((item) => {
              const NavIcon = getIcon(item.icon);
              const href = getNavHref(item);
              const label = resolveI18nLabel(item.label, t);

              if (item.type === 'group' && item.children) {
                return (
                  <div key={item.id}>
                    <DropdownMenuLabel className="flex items-center gap-2">
                      <NavIcon className="h-4 w-4" />
                      {label}
                    </DropdownMenuLabel>
                    {item.children
                      .filter((child: NavigationItem) => {
                        if (child.visible !== undefined && !evalVis(child.visible)) return false;
                        if (child.permissions && !checkPerm(child.permissions)) return false;
                        return true;
                      })
                      .map((child: NavigationItem) => {
                        const ChildIcon = getIcon(child.icon);
                        const childHref = getNavHref(child);
                        const childLabel = resolveI18nLabel(child.label, t);
                        return (
                          <DropdownMenuItem key={child.id} asChild className="pl-8">
                            <Link to={childHref} className="gap-2">
                              <ChildIcon className="h-4 w-4" />
                              {childLabel}
                            </Link>
                          </DropdownMenuItem>
                        );
                      })}
                  </div>
                );
              }

              return (
                <DropdownMenuItem key={item.id} asChild>
                  <Link to={href} className="gap-2">
                    <NavIcon className="h-4 w-4" />
                    {label}
                  </Link>
                </DropdownMenuItem>
              );
            })}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Search */}
        <button
          onClick={openCommandPalette}
          className="hidden lg:flex relative items-center gap-2 ml-auto w-72 xl:w-96 h-8 px-3 text-sm rounded-md border bg-muted/40 text-muted-foreground hover:bg-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          data-testid="app-search-trigger"
        >
          <Search className="h-4 w-4 shrink-0" />
          <span className="flex-1 text-left truncate">
            {t('console.searchRich', {
              defaultValue: 'Search apps, objects, records…',
            })}
          </span>
          <kbd className="pointer-events-none inline-flex h-5 items-center gap-0.5 rounded border bg-background px-1.5 text-[10px] font-medium text-muted-foreground">
            <span className="text-xs">⌘</span>K
          </kbd>
        </button>

        {/* Trailing icon cluster */}
        <div className="ml-auto lg:ml-2 flex items-center gap-0.5 sm:gap-1 shrink-0">
          {/* Search — mobile/tablet */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden h-8 w-8 shrink-0"
            onClick={openCommandPalette}
            aria-label={t('console.search', { defaultValue: 'Search...' })}
          >
            <Search className="h-4 w-4" />
          </Button>

          {/* Activity */}
          <div className="hidden sm:flex shrink-0 relative">
            <ActivityFeed activities={activities ?? []} />
          </div>

          {/* Help */}
          <Button
            variant="ghost"
            size="icon"
            asChild
            className="h-8 w-8 hidden md:inline-flex shrink-0"
            aria-label={t('sidebar.helpTooltip', {
              defaultValue: 'Help & Documentation',
            })}
          >
            <a
              href="https://docs.objectstack.ai"
              target="_blank"
              rel="noopener noreferrer"
            >
              <HelpCircle className="h-4 w-4" />
            </a>
          </Button>

          <Separator orientation="vertical" className="hidden sm:block mx-0.5 h-5" />

          {/* Theme + Locale */}
          <div className="hidden sm:flex shrink-0">
            <ModeToggle />
          </div>
          <div className="hidden sm:flex shrink-0">
            <LocaleSwitcher />
          </div>

          <Separator orientation="vertical" className="hidden sm:block mx-0.5 h-5" />

          {/* User profile */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className="flex items-center gap-2 rounded-md px-1.5 py-1 hover:bg-accent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                data-testid="app-user-menu-trigger"
              >
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage
                    src={user?.image ?? '/avatars/user.jpg'}
                    alt={user?.name ?? 'User'}
                  />
                  <AvatarFallback className="rounded-lg bg-primary text-primary-foreground text-xs">
                    {getUserInitials(user)}
                  </AvatarFallback>
                </Avatar>
                <ChevronsUpDown className="hidden md:block h-4 w-4 text-muted-foreground" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" sideOffset={4} className="w-56">
              <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage
                      src={user?.image ?? '/avatars/user.jpg'}
                      alt={user?.name ?? 'User'}
                    />
                    <AvatarFallback className="rounded-lg bg-primary text-primary-foreground">
                      {getUserInitials(user)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">
                      {user?.name ?? 'User'}
                    </span>
                    <span className="truncate text-xs text-muted-foreground">
                      {user?.email ?? ''}
                    </span>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem onClick={() => navigate('/apps/setup/system/profile')}>
                  <UserIcon className="mr-2 h-4 w-4" />
                  {t('user.profile', { defaultValue: 'Profile' })}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/apps/setup')}>
                  <Settings className="mr-2 h-4 w-4" />
                  {t('sidebar.settings', { defaultValue: 'Settings' })}
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onClick={() => signOut()}
              >
                <LogOut className="mr-2 h-4 w-4" />
                {t('user.logout', { defaultValue: 'Log out' })}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
