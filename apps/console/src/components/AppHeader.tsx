/**
 * AppHeader
 *
 * Supabase-style top bar: [Logo] / [App ▾] / [Object ▾]  ···  [actions]
 * @module
 */

import { useLocation, useParams, Link } from 'react-router-dom';
import {
  SidebarTrigger,
  Button,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuGroup,
  Avatar,
  AvatarImage,
  AvatarFallback,
} from '@object-ui/components';
import {
  Search,
  HelpCircle,
  ChevronDown,
  Settings,
  LogOut,
  ChevronsUpDown,
  User as UserIcon,
  Boxes,
} from 'lucide-react';

import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOffline } from '@object-ui/react';
import { PresenceAvatars, type PresenceUser } from '@object-ui/collaboration';
import { ModeToggle } from './mode-toggle';
import { LocaleSwitcher } from './LocaleSwitcher';
import { ConnectionStatus } from './ConnectionStatus';
import { ActivityFeed, type ActivityItem } from './ActivityFeed';
import { AppSwitcher } from './AppSwitcher';
import type { ConnectionState } from '../dataSource';
import { useAdapter } from '../context/AdapterProvider';
import { useObjectTranslation, useObjectLabel } from '@object-ui/i18n';
import type { BreadcrumbItem as BreadcrumbItemType } from '@object-ui/types';
import { useAuth, getUserInitials } from '@object-ui/auth';
import { useMetadata } from '../context/MetadataProvider';
import { useNavigationContext } from '../context/NavigationContext';

function humanizeSlug(slug: string): string {
  return slug.replace(/[-_]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

/** Muted `/` separator between path segments */
function PathSep() {
  return (
    <span className="select-none text-muted-foreground/40 mx-1.5 text-base font-light" aria-hidden>
      /
    </span>
  );
}


const FALLBACK_PRESENCE_USERS: PresenceUser[] = [
  { userId: 'u1', userName: 'Alice Chen', color: '#3498db', status: 'active', lastActivity: new Date().toISOString() },
  { userId: 'u2', userName: 'Bob Smith', color: '#2ecc71', status: 'idle', lastActivity: new Date().toISOString() },
  { userId: 'u3', userName: 'Carol Li', color: '#e74c3c', status: 'active', lastActivity: new Date().toISOString() },
];

export function AppHeader({
  appName,
  objects,
  connectionState,
  presenceUsers,
  activities,
  activeAppName,
  onAppChange,
}: {
  appName: string;
  objects: any[];
  connectionState?: ConnectionState;
  presenceUsers?: PresenceUser[];
  activities?: ActivityItem[];
  activeAppName?: string;
  onAppChange?: (name: string) => void;
}) {
  const location = useLocation();
  const params = useParams();
  const navigate = useNavigate();
  const { isOnline } = useOffline();
  const { user, signOut } = useAuth();
  const dataSource = useAdapter();
  const { t } = useObjectTranslation();
  const { objectLabel } = useObjectLabel();
  const { apps: metadataApps } = useMetadata();
  const { currentAppName } = useNavigationContext();

  const [apiPresenceUsers, setApiPresenceUsers] = useState<PresenceUser[] | null>(null);
  const [apiActivities, setApiActivities] = useState<ActivityItem[] | null>(null);

  const fetchPresenceAndActivities = useCallback(async () => {
    if (!dataSource) return;
    try {
      const [presenceResult, activityResult] = await Promise.all([
        dataSource.find('sys_presence').catch(() => ({ data: [] })),
        dataSource.find('sys_activity', { $orderby: { timestamp: 'desc' }, $top: 20 }).catch(() => ({ data: [] })),
      ]);
      if (presenceResult.data?.length) {
        const users = (presenceResult.data as Record<string, unknown>[]).filter(
          (u): u is PresenceUser & Record<string, unknown> => typeof u.userId === 'string'
        );
        if (users.length) setApiPresenceUsers(users);
      }
      if (activityResult.data?.length) {
        const items = (activityResult.data as Record<string, unknown>[]).filter(
          (a): a is ActivityItem & Record<string, unknown> => typeof a.type === 'string'
        );
        if (items.length) setApiActivities(items);
      }
    } catch { /* fallback below */ }
  }, [dataSource]);

  useEffect(() => { fetchPresenceAndActivities(); }, [fetchPresenceAndActivities]);

  const activeUsers = presenceUsers ?? apiPresenceUsers ?? FALLBACK_PRESENCE_USERS;
  const activeActivities = activities ?? apiActivities ?? [];

  // Build path segments
  const pathParts = location.pathname.split('/').filter(Boolean);
  const appNameFromRoute = params.appName || pathParts[1];
  const routeType = pathParts[2];
  const baseHref = `/apps/${appNameFromRoute}`;

  // Filter objects to only those belonging to the current app via its navigation
  const appNameKey = activeAppName || currentAppName || appNameFromRoute;
  const currentApp = (metadataApps || []).find((a: any) => a.name === appNameKey);
  const appNavObjectNames = new Set<string>();
  const collectNavObjects = (items: any[]) => {
    for (const item of items || []) {
      if (item.type === 'object' && item.objectName) appNavObjectNames.add(item.objectName);
      if (item.children) collectNavObjects(item.children);
    }
  };
  collectNavObjects(currentApp?.navigation || []);
  for (const area of currentApp?.areas || []) collectNavObjects(area.navigation || []);
  const appObjects = appNavObjectNames.size > 0
    ? objects.filter((o: any) => appNavObjectNames.has(o.name))
    : objects.filter((o: any) => !o.name.startsWith('sys_') && !o.name.startsWith('auth_'));

  const objectSiblings = appObjects.map((o: any) => ({
    label: objectLabel(o),
    href: `${baseHref}/${o.name}`,
  }));

  // Segments after the app (index 1+)
  const extraSegments: BreadcrumbItemType[] = [];

  if (routeType === 'dashboard') {
    extraSegments.push({ label: t('console.breadcrumb.dashboards'), href: baseHref });
    if (pathParts[3]) extraSegments.push({ label: humanizeSlug(pathParts[3]) });
  } else if (routeType === 'page') {
    extraSegments.push({ label: t('console.breadcrumb.pages'), href: baseHref });
    if (pathParts[3]) extraSegments.push({ label: humanizeSlug(pathParts[3]) });
  } else if (routeType === 'report') {
    extraSegments.push({ label: t('console.breadcrumb.reports'), href: baseHref });
    if (pathParts[3]) extraSegments.push({ label: humanizeSlug(pathParts[3]) });
  } else if (routeType === 'system') {
    extraSegments.push({ label: t('console.breadcrumb.system') });
    if (pathParts[3]) extraSegments.push({ label: humanizeSlug(pathParts[3]) });
  } else if (routeType) {
    const currentObject = objects.find((o: any) => o.name === routeType);
    if (currentObject) {
      extraSegments.push({
        label: objectLabel(currentObject),
        href: `${baseHref}/${routeType}`,
        siblings: objectSiblings,
      });
      if (pathParts[3] === 'record' && pathParts[4]) {
        const shortId = pathParts[4].length > 12 ? `${pathParts[4].slice(0, 8)}…` : pathParts[4];
        extraSegments.push({ label: `#${shortId}` });
      } else if (pathParts[3] === 'view' && pathParts[4]) {
        extraSegments.push({ label: humanizeSlug(pathParts[4]) });
      }
    }
  }

  const lastSegmentLabel = extraSegments[extraSegments.length - 1]?.label || appName;

  return (
    <div className="flex items-center justify-between w-full h-full">
      {/* ── LEFT: Logo / App / Object path ── */}
      <div className="flex items-center min-w-0 flex-1">
        {/* Platform logo — links to home */}
        <Link
          to="/home"
          className="flex items-center justify-center h-7 w-7 shrink-0 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
          title="ObjectStack"
        >
          <Boxes className="h-4 w-4" />
        </Link>

        {/* Mobile sidebar trigger */}
        <SidebarTrigger className="md:hidden shrink-0 ml-1" />

        {/* App dropdown */}
        {activeAppName && onAppChange ? (
          <>
            <PathSep />
            <AppSwitcher activeAppName={activeAppName} onAppChange={onAppChange} />
          </>
        ) : (
          <>
            <PathSep />
            <span className="text-sm font-medium text-foreground/80 px-1.5">{appName}</span>
          </>
        )}

        {/* Extra path segments */}
        {extraSegments.map((seg, i) => {
          const isLast = i === extraSegments.length - 1;
          return (
            <span key={i} className="hidden sm:flex items-center min-w-0">
              <PathSep />
              {seg.siblings && seg.siblings.length > 1 ? (
                <DropdownMenu>
                  <DropdownMenuTrigger className={`flex items-center gap-1 rounded-md px-1.5 py-1 text-sm font-medium transition-colors outline-none hover:bg-accent hover:text-foreground ${!isLast ? 'text-foreground/60' : 'text-foreground/80'}`}>
                    {seg.label}
                    <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" sideOffset={8} className="w-56 max-h-72 overflow-y-auto">
                    <DropdownMenuLabel className="text-xs text-muted-foreground font-normal">
                      Switch Object
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {seg.siblings.map((sibling) => (
                      <DropdownMenuItem key={sibling.href} asChild>
                        <Link to={sibling.href} className="w-full">{sibling.label}</Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : seg.href ? (
                <Link
                  to={seg.href}
                  className={`rounded-md px-1.5 py-1 text-sm font-medium transition-colors hover:bg-accent hover:text-foreground truncate max-w-[160px] ${isLast ? 'text-foreground/80' : 'text-foreground/60'}`}
                >
                  {seg.label}
                </Link>
              ) : (
                <span className={`px-1.5 py-1 text-sm font-medium truncate max-w-[160px] ${isLast ? 'text-foreground/80' : 'text-foreground/60'}`}>
                  {seg.label}
                </span>
              )}
            </span>
          );
        })}

        {/* Mobile: current page label */}
        <span className="text-sm font-medium sm:hidden truncate min-w-0 ml-1">
          {lastSegmentLabel}
        </span>
      </div>

      {/* ── RIGHT: actions ── */}
      <div className="flex items-center gap-0.5 sm:gap-1 shrink-0">
        {/* Offline indicator */}
        {!isOnline && (
          <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 text-xs font-medium">
            <span className="h-2 w-2 rounded-full bg-yellow-500 animate-pulse" />
            Offline
          </div>
        )}

        {/* Connection Status */}
        {connectionState && <ConnectionStatus state={connectionState} />}

        {/* Presence Avatars */}
        {activeUsers.length > 0 && (
          <div className="hidden md:flex items-center shrink-0" title="Users currently online">
            <PresenceAvatars users={activeUsers} size="sm" maxVisible={3} showStatus />
          </div>
        )}

        {/* Search — desktop */}
        <button
          onClick={() => document.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true }))}
          className="hidden lg:flex relative items-center gap-2 w-48 xl:w-64 h-8 px-3 text-sm rounded-md border bg-muted/50 text-muted-foreground hover:bg-muted transition-colors"
        >
          <Search className="h-3.5 w-3.5 shrink-0" />
          <span className="flex-1 text-left text-xs">Search...</span>
          <kbd className="pointer-events-none inline-flex h-5 items-center gap-0.5 rounded border bg-background px-1.5 text-[10px] font-medium text-muted-foreground">
            <span className="text-xs">⌘</span>K
          </kbd>
        </button>

        {/* Search — mobile/tablet */}
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden h-8 w-8 shrink-0"
          onClick={() => document.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true }))}
        >
          <Search className="h-4 w-4" />
        </Button>

        {/* Activity Feed */}
        <div className="hidden sm:flex shrink-0">
          <ActivityFeed activities={activeActivities} />
        </div>

        {/* Help */}
        <Button variant="ghost" size="icon" className="h-8 w-8 hidden md:flex shrink-0" asChild>
          <a href="https://docs.objectstack.ai" target="_blank" rel="noopener noreferrer">
            <HelpCircle className="h-4 w-4" />
          </a>
        </Button>

        {/* Theme toggle */}
        <div className="hidden sm:flex shrink-0">
          <ModeToggle />
        </div>

        {/* Language switcher */}
        <div className="hidden sm:flex shrink-0">
          <LocaleSwitcher />
        </div>

        {/* User Profile */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 gap-1.5 px-1.5 shrink-0">
              <Avatar className="h-6 w-6 rounded-md">
                <AvatarImage src={user?.image ?? '/avatars/user.jpg'} alt={user?.name ?? 'User'} />
                <AvatarFallback className="rounded-md bg-primary text-primary-foreground text-xs">
                  {getUserInitials(user)}
                </AvatarFallback>
              </Avatar>
              <span className="hidden md:inline text-sm font-medium max-w-[100px] truncate">{user?.name ?? 'User'}</span>
              <ChevronsUpDown className="h-3.5 w-3.5 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="min-w-56 rounded-lg" sideOffset={4}>
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-2 py-2">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={user?.image ?? '/avatars/user.jpg'} alt={user?.name ?? 'User'} />
                  <AvatarFallback className="rounded-lg bg-primary text-primary-foreground">
                    {getUserInitials(user)}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{user?.name ?? 'User'}</span>
                  <span className="truncate text-xs text-muted-foreground">{user?.email ?? ''}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => navigate('/apps/setup/system/profile')}>
                <UserIcon className="mr-2 h-4 w-4" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/apps/setup')}>
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => signOut()}>
              <LogOut className="mr-2 h-4 w-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
