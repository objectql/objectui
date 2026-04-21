/**
 * UnifiedSidebar
 *
 * Airtable-style contextual sidebar that dynamically switches between Home and App navigation.
 * Features:
 * - Persistent across all authenticated routes
 * - Context-aware navigation (Home vs App)
 * - Pinned bottom area (Settings, Help, User Profile)
 * - Smooth transitions between contexts
 * - Back to Home navigation from App context
 * - App switcher dropdown
 *
 * @module
 */

import * as React from 'react';
import { Link, useLocation } from 'react-router-dom';
import * as LucideIcons from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuAction,
  SidebarTrigger,
  useSidebar,
} from '@object-ui/components';
import {
  Clock,
  Star,
  StarOff,
  ChevronRight,
  Layers,
} from 'lucide-react';
import { NavigationRenderer } from '@object-ui/layout';
import type { NavigationItem } from '@object-ui/types';
import { useMetadata } from '@object-ui/app-shell';
import { useExpressionContext, evaluateVisibility } from '@object-ui/app-shell';
import { usePermissions } from '@object-ui/permissions';
import { useRecentItems } from '@object-ui/app-shell';
import { useFavorites } from '../hooks/useFavorites';
import { useNavPins } from '../hooks/useNavPins';
import { resolveI18nLabel } from '../utils';
import { useObjectTranslation, useObjectLabel } from '@object-ui/i18n';
// useObjectLabel provides appLabel/appDescription for convention-based
// i18n lookup — `{ns}.apps.{name}.label` resolves to the translated label
// loaded from /api/v1/i18n/translations/:locale.
import { useNavigationContext } from '../context/NavigationContext';

// ---------------------------------------------------------------------------
// useNavOrder – localStorage-persisted drag-and-drop reorder for nav items
// ---------------------------------------------------------------------------

function useNavOrder(appName: string) {
  const storageKey = `objectui-nav-order-${appName}`;

  const [orderMap, setOrderMap] = React.useState<Record<string, string[]>>(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (!raw) return {};
      const parsed: unknown = JSON.parse(raw);
      if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) return {};
      const result: Record<string, string[]> = {};
      for (const [k, v] of Object.entries(parsed as Record<string, unknown>)) {
        if (Array.isArray(v) && v.every((i: unknown) => typeof i === 'string')) {
          result[k] = v as string[];
        }
      }
      return result;
    } catch {
      return {};
    }
  });

  const persist = React.useCallback(
    (next: Record<string, string[]>) => {
      setOrderMap(next);
      try { localStorage.setItem(storageKey, JSON.stringify(next)); } catch { /* full */ }
    },
    [storageKey],
  );

  const applyOrder = React.useCallback(
    (items: NavigationItem[]): NavigationItem[] => {
      const saved = orderMap['__root__'];
      if (!saved) return items;
      const byId = new Map(items.map(i => [i.id, i]));
      const ordered: NavigationItem[] = [];
      for (const id of saved) {
        const item = byId.get(id);
        if (item) { ordered.push(item); byId.delete(id); }
      }
      byId.forEach(item => ordered.push(item));
      return ordered;
    },
    [orderMap],
  );

  const handleReorder = React.useCallback(
    (reorderedItems: NavigationItem[]) => {
      const ids = reorderedItems.map(i => i.id);
      persist({ ...orderMap, __root__: ids });
    },
    [orderMap, persist],
  );

  return { applyOrder, handleReorder };
}

/**
 * Resolve a Lucide icon component by name string.
 * Safely handles both exact names and kebab-case → PascalCase conversion.
 * The try/catch guards against strict module proxy environments (e.g. vitest mocks).
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

  // Try exact match first, then convert kebab-case / lowercase to PascalCase
  const pascalName = name
    .split(/[-_]/)
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');

  return lookup(name) ?? lookup(pascalName) ?? LucideIcons.Database;
}

interface UnifiedSidebarProps {
  /** When in app context, the active app name */
  activeAppName?: string;
  /** Callback when user switches apps */
  onAppChange?: (name: string) => void;
}

export function UnifiedSidebar({ activeAppName }: UnifiedSidebarProps) {
  const { isMobile } = useSidebar();
  const location = useLocation();
  const { t } = useObjectTranslation();
  const { objectLabel: resolveNavObjectLabel } = useObjectLabel();
  const { context, currentAppName } = useNavigationContext();

  // Swipe-from-left-edge gesture to open sidebar on mobile
  React.useEffect(() => {
    const EDGE_THRESHOLD = 30;
    const SWIPE_DISTANCE = 50;
    let touchStartX = 0;
    const handleTouchStart = (e: TouchEvent) => {
      touchStartX = e.touches[0].clientX;
    };
    const handleTouchEnd = (e: TouchEvent) => {
      const deltaX = e.changedTouches[0].clientX - touchStartX;
      if (touchStartX < EDGE_THRESHOLD && deltaX > SWIPE_DISTANCE && isMobile) {
        document.querySelector('[data-sidebar="trigger"]')?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      }
    };
    document.addEventListener('touchstart', handleTouchStart, { passive: true });
    document.addEventListener('touchend', handleTouchEnd, { passive: true });
    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isMobile]);

  const { recentItems } = useRecentItems();
  const { favorites, removeFavorite } = useFavorites();

  const { apps: metadataApps } = useMetadata();
  const apps = metadataApps || [];
  const activeApps = apps.filter((a: any) => a.active !== false);
  const activeApp = activeApps.find((a: any) => a.name === (activeAppName || currentAppName)) || activeApps[0];

  // Drag-reorder and pin persistence
  const { applyOrder, handleReorder } = useNavOrder(activeApp?.name || 'home');
  const { togglePin, applyPins } = useNavPins();

  // Area management
  const areas: any[] = activeApp?.areas || [];
  const [activeAreaId, setActiveAreaId] = React.useState<string | null>(
    () => areas.length > 0 ? areas[0].id : null,
  );

  React.useEffect(() => {
    if (areas.length > 0) {
      setActiveAreaId(prev => areas.some((a: any) => a.id === prev) ? prev : areas[0].id);
    } else {
      setActiveAreaId(null);
    }
  }, [activeApp?.name, areas.length]);

  // Resolve navigation items
  const activeArea = areas.find((a: any) => a.id === activeAreaId);
  const appNavigation: NavigationItem[] = activeArea?.navigation || activeApp?.navigation || [];

  // Home navigation items
  const homeNavigation: NavigationItem[] = React.useMemo(() => [
    { id: 'home-dashboard', label: t('home.nav', { defaultValue: 'Home' }), type: 'url' as const, url: '/home', icon: 'home' },
  ], [t]);

  // Determine which navigation to show based on context
  const navigationItems = context === 'home' ? homeNavigation : appNavigation;

  // Apply saved order and pin state
  const processedNavigation = React.useMemo(() => {
    const ordered = applyOrder(navigationItems);
    return applyPins(ordered);
  }, [navigationItems, applyOrder, applyPins]);

  // Recent section collapsed by default
  const [recentExpanded, setRecentExpanded] = React.useState(false);

  // Visibility evaluation
  const { evaluator } = useExpressionContext();
  const evalVis = React.useCallback(
    (expr: string | boolean | undefined) => evaluateVisibility(expr, evaluator),
    [evaluator],
  );

  // Permission check
  const { can } = usePermissions();
  const checkPerm = React.useCallback(
    (permissions: string[]) => permissions.every((perm: string) => {
      const parts = perm.split(':');
      const [object, action] = parts.length >= 2
        ? [parts[0], parts[1]]
        : [perm, 'read'];
      return can(object, action as any);
    }),
    [can],
  );

  const basePath = context === 'app' && activeApp ? `/apps/${activeApp.name}` : '';

  return (
    <>
    <Sidebar collapsible="icon" className="!top-14 !h-[calc(100svh-3.5rem)]">
      <SidebarContent className="pt-2">
        <div className="transition-opacity duration-200 ease-in-out">
          {context === 'app' && activeApp ? (
           <>
           {/* Area Switcher */}
           {areas.length > 1 && (
             <SidebarGroup>
               <SidebarGroupLabel className="flex items-center gap-1.5">
                 <Layers className="h-3.5 w-3.5" />
                 Area
               </SidebarGroupLabel>
               <SidebarGroupContent>
                 <SidebarMenu>
                   {areas.map((area: any) => {
                     const AreaIcon = getIcon(area.icon);
                     const isActiveArea = area.id === activeAreaId;
                     return (
                       <SidebarMenuItem key={area.id}>
                         <SidebarMenuButton
                           isActive={isActiveArea}
                           tooltip={area.label}
                           onClick={() => setActiveAreaId(area.id)}
                         >
                           <AreaIcon className="h-4 w-4" />
                           <span>{area.label}</span>
                         </SidebarMenuButton>
                       </SidebarMenuItem>
                     );
                   })}
                 </SidebarMenu>
               </SidebarGroupContent>
             </SidebarGroup>
           )}

           {/* App Navigation tree */}
           <NavigationRenderer
             items={processedNavigation}
             basePath={basePath}
             evaluateVisibility={evalVis}
             checkPermission={checkPerm}
             enablePinning
             onPinToggle={togglePin}
             enableReorder
             onReorder={handleReorder}
             resolveObjectLabel={(objectName, fallback) => resolveNavObjectLabel({ name: objectName, label: fallback })}
             t={t}
           />

           {/* Recent Items */}
           {recentItems.length > 0 && (
             <SidebarGroup>
               <SidebarGroupLabel
                 className="flex items-center gap-1.5 cursor-pointer select-none"
                 onClick={() => setRecentExpanded(prev => !prev)}
               >
                 <ChevronRight className={`h-3 w-3 transition-transform duration-150 ${recentExpanded ? 'rotate-90' : ''}`} />
                 <Clock className="h-3.5 w-3.5" />
                 Recent
               </SidebarGroupLabel>
               {recentExpanded && (
               <SidebarGroupContent>
                 <SidebarMenu>
                   {recentItems.slice(0, 5).map(item => (
                     <SidebarMenuItem key={item.id}>
                       <SidebarMenuButton asChild tooltip={item.label}>
                         <Link to={item.href}>
                           <span className="text-muted-foreground">
                             {item.type === 'dashboard' ? '📊' : item.type === 'report' ? '📈' : '📄'}
                           </span>
                           <span className="truncate">{item.label}</span>
                         </Link>
                       </SidebarMenuButton>
                     </SidebarMenuItem>
                   ))}
                 </SidebarMenu>
               </SidebarGroupContent>
               )}
             </SidebarGroup>
           )}

           {/* Favorites */}
           {favorites.length > 0 && (
             <SidebarGroup>
               <SidebarGroupLabel className="flex items-center gap-1.5">
                 <Star className="h-3.5 w-3.5" />
                 Favorites
               </SidebarGroupLabel>
               <SidebarGroupContent>
                 <SidebarMenu>
                   {favorites.slice(0, 8).map(item => (
                     <SidebarMenuItem key={item.id}>
                       <SidebarMenuButton asChild tooltip={item.label}>
                         <Link to={item.href}>
                           <span className="text-muted-foreground">
                             {item.type === 'dashboard' ? '📊' : item.type === 'report' ? '📈' : item.type === 'page' ? '📄' : '📋'}
                           </span>
                           <span className="truncate">{item.label}</span>
                         </Link>
                       </SidebarMenuButton>
                       <SidebarMenuAction
                         showOnHover
                         onClick={(e: any) => { e.stopPropagation(); removeFavorite(item.id); }}
                         aria-label={`Remove ${item.label} from favorites`}
                       >
                         <StarOff className="h-3 w-3" />
                       </SidebarMenuAction>
                     </SidebarMenuItem>
                   ))}
                 </SidebarMenu>
               </SidebarGroupContent>
             </SidebarGroup>
           )}
           </>
         ) : (
           /* Home Navigation */
           <>
           <SidebarGroup>
             <SidebarGroupContent>
               <SidebarMenu>
                 {homeNavigation.map((item) => {
                   const NavIcon = getIcon(item.icon);
                   const isActive = location.pathname === item.url;
                   return (
                     <SidebarMenuItem key={item.id}>
                       <SidebarMenuButton asChild tooltip={item.label as string} isActive={isActive}>
                         <Link to={item.url || '/home'}>
                           <NavIcon className="h-4 w-4" />
                           <span>{item.label as string}</span>
                         </Link>
                       </SidebarMenuButton>
                     </SidebarMenuItem>
                   );
                 })}
               </SidebarMenu>
             </SidebarGroupContent>
           </SidebarGroup>

           {/* Starred Apps */}
           {favorites.filter(f => f.type === 'object' || f.type === 'dashboard' || f.type === 'page').length > 0 && (
             <SidebarGroup>
               <SidebarGroupLabel className="flex items-center gap-1.5">
                 <Star className="h-3.5 w-3.5" />
                 Starred
               </SidebarGroupLabel>
               <SidebarGroupContent>
                 <SidebarMenu>
                   {favorites.filter(f => f.type === 'object' || f.type === 'dashboard' || f.type === 'page').slice(0, 8).map(item => (
                     <SidebarMenuItem key={item.id}>
                       <SidebarMenuButton asChild tooltip={item.label}>
                         <Link to={item.href}>
                           <span className="text-muted-foreground">
                             {item.type === 'dashboard' ? '📊' : item.type === 'page' ? '📄' : '📋'}
                           </span>
                           <span className="truncate">{item.label}</span>
                         </Link>
                       </SidebarMenuButton>
                       <SidebarMenuAction
                         showOnHover
                         onClick={(e: any) => { e.stopPropagation(); removeFavorite(item.id); }}
                         aria-label={`Remove ${item.label} from favorites`}
                       >
                         <StarOff className="h-3 w-3" />
                       </SidebarMenuAction>
                     </SidebarMenuItem>
                   ))}
                 </SidebarMenu>
               </SidebarGroupContent>
             </SidebarGroup>
           )}
           </>
         )}
        </div>
      </SidebarContent>

      <SidebarFooter className="border-t p-1">
        <SidebarTrigger className="w-full justify-start pl-2 group-data-[state=collapsed]:justify-center group-data-[state=collapsed]:pl-0" />
      </SidebarFooter>
    </Sidebar>
    {isMobile && context === 'app' && (
      <div className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around border-t bg-background/95 backdrop-blur-sm px-2 py-1 sm:hidden safe-area-bottom">
        {processedNavigation.filter((n: any) => n.type !== 'group').slice(0, 5).map((item: any) => {
          const NavIcon = getIcon(item.icon);
          let href = item.url || '#';
          if (item.type === 'object') {
            href = `${basePath}/${item.objectName}`;
            if (item.viewName) href += `/view/${item.viewName}`;
          }
          else if (item.type === 'dashboard') href = item.dashboardName ? `${basePath}/dashboard/${item.dashboardName}` : '#';
          else if (item.type === 'page') href = item.pageName ? `${basePath}/page/${item.pageName}` : '#';
          return (
            <Link key={item.id} to={href} className="flex flex-col items-center gap-0.5 px-2 py-1.5 text-muted-foreground hover:text-foreground transition-colors min-w-[44px] min-h-[44px] justify-center">
              <NavIcon className="h-5 w-5" />
              <span className="text-[10px] truncate max-w-[60px]">{resolveI18nLabel(item.label, t)}</span>
            </Link>
          );
        })}
      </div>
    )}
    </>
  );
}
