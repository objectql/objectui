/**
 * HomeTopNav
 *
 * Top navigation bar for the Home (workspace) landing page.
 *
 * Rationale: The Home page deliberately uses a horizontal top-menu layout
 * (instead of the left sidebar used by individual applications) so users can
 * visually distinguish the workspace landing page from in-app routes. The
 * left sidebar is reserved for `/apps/:appName/*` where rich, contextual
 * navigation is needed.
 *
 * Layout:
 * - Left:    Workspace switcher (organization) + "Home" link
 * - Right:   Search (⌘K), Activity feed, Help, Theme, Locale, User profile
 *
 * @module
 */

import { Link, useNavigate } from 'react-router-dom';
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
} from '@object-ui/components';
import { Home, Search, HelpCircle, LogOut, Settings, User as UserIcon, ChevronsUpDown } from 'lucide-react';
import { useAuth, getUserInitials } from '@object-ui/auth';
import { useObjectTranslation } from '@object-ui/i18n';
import { WorkspaceSwitcher } from '../../components/WorkspaceSwitcher';
import { ModeToggle } from '../../components/mode-toggle';
import { LocaleSwitcher } from '../../components/LocaleSwitcher';
import { ActivityFeed, type ActivityItem } from '../../components/ActivityFeed';

interface HomeTopNavProps {
  /** Optional activity feed items. When omitted an empty feed is rendered. */
  activities?: ActivityItem[];
}

/**
 * Opens the global command palette via the same keyboard shortcut the
 * `CommandPalette` component listens for. This keeps the search UX
 * consistent with the in-app `AppHeader`.
 */
function openCommandPalette() {
  document.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true }));
}

export function HomeTopNav({ activities }: HomeTopNavProps) {
  const { t } = useObjectTranslation();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  return (
    <header
      className="sticky top-0 z-40 flex h-14 sm:h-16 w-full shrink-0 items-center gap-2 border-b bg-background px-3 sm:px-4 md:px-6"
      data-testid="home-top-nav"
    >
      {/* Left: Workspace switcher + primary Home link */}
      <div className="flex items-center gap-2 min-w-0">
        <div className="w-56 max-w-[14rem] shrink-0">
          <WorkspaceSwitcher
            onWorkspaceChange={() => {
              // Reload so adapter / permissions re-initialize with the new
              // tenant context, matching the sidebar's prior behavior.
              window.location.href = `${window.location.origin}/console/home`;
            }}
          />
        </div>

        <nav className="hidden md:flex items-center gap-1 pl-1" aria-label={t('home.nav', { defaultValue: 'Home' })}>
          <Link
            to="/home"
            className="inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium text-foreground bg-accent/50 hover:bg-accent transition-colors"
            data-testid="home-nav-home"
          >
            <Home className="h-4 w-4" />
            <span>{t('home.nav', { defaultValue: 'Home' })}</span>
          </Link>
        </nav>
      </div>

      {/* Right: actions */}
      <div className="ml-auto flex items-center gap-0.5 sm:gap-1 md:gap-2 shrink-0">
        {/* Search — Desktop */}
        <button
          onClick={openCommandPalette}
          className="hidden lg:flex relative items-center gap-2 w-50 xl:w-70 h-8 px-3 text-sm rounded-md border bg-muted/50 text-muted-foreground hover:bg-muted transition-colors"
          data-testid="home-search-trigger"
        >
          <Search className="h-4 w-4" />
          <span className="flex-1 text-left">{t('console.search', { defaultValue: 'Search...' })}</span>
          <kbd className="pointer-events-none inline-flex h-5 items-center gap-0.5 rounded border bg-muted px-1.5 text-[10px] font-medium text-muted-foreground">
            <span className="text-xs">⌘</span>K
          </kbd>
        </button>

        {/* Search — Mobile / Tablet */}
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden h-8 w-8 shrink-0"
          onClick={openCommandPalette}
          aria-label={t('console.search', { defaultValue: 'Search...' })}
        >
          <Search className="h-4 w-4" />
        </Button>

        {/* Activity feed */}
        <div className="hidden sm:flex shrink-0 relative">
          <ActivityFeed activities={activities ?? []} />
        </div>

        {/* Help */}
        <Button
          variant="ghost"
          size="icon"
          asChild
          className="h-8 w-8 hidden md:inline-flex shrink-0"
          aria-label={t('sidebar.helpTooltip', { defaultValue: 'Help & Documentation' })}
        >
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

        {/* User profile dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className="flex items-center gap-2 rounded-md px-1.5 py-1 hover:bg-accent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              data-testid="home-user-menu-trigger"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={user?.image ?? '/avatars/user.jpg'} alt={user?.name ?? 'User'} />
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
    </header>
  );
}
