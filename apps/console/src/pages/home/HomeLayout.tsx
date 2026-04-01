/**
 * HomeLayout
 *
 * Lightweight layout shell for the Home Dashboard (`/home`).
 * Provides a consistent navigation frame (header bar with Home branding
 * and user menu) so the page is not rendered "bare" and can be extended
 * in the future with notifications, global guide, or unified theming.
 *
 * @module
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useObjectTranslation } from '@object-ui/i18n';
import { useAuth, getUserInitials } from '@object-ui/auth';
import {
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
import { Settings, LogOut, User, Home } from 'lucide-react';

interface HomeLayoutProps {
  children: React.ReactNode;
}

export function HomeLayout({ children }: HomeLayoutProps) {
  const navigate = useNavigate();
  const { t } = useObjectTranslation();
  const { user, signOut } = useAuth();

  return (
    <div className="min-h-screen bg-background" data-testid="home-layout">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-30 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-14 items-center justify-between px-6">
          {/* Left — Branding / Home link */}
          <button
            type="button"
            onClick={() => navigate('/home')}
            className="flex items-center gap-2 font-semibold tracking-tight hover:opacity-80"
            data-testid="home-layout-brand"
          >
            <Home className="h-5 w-5" />
            <span>{t('home.title', { defaultValue: 'Home' })}</span>
          </button>

          {/* Right — Settings + User Menu */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/system')}
              data-testid="home-layout-settings-btn"
            >
              <Settings className="mr-2 h-4 w-4" />
              {t('common.settings', { defaultValue: 'Settings' })}
            </Button>

            {/* User Menu Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full" data-testid="home-layout-user-trigger">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.image ?? undefined} alt={user?.name ?? 'User'} />
                    <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                      {getUserInitials(user)}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user?.name ?? 'User'}</p>
                    <p className="text-xs leading-none text-muted-foreground">{user?.email ?? ''}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem onClick={() => navigate('/profile')} data-testid="home-layout-user-profile">
                    <User className="mr-2 h-4 w-4" />
                    {t('common.profile', { defaultValue: 'Profile' })}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/system')} data-testid="home-layout-user-settings">
                    <Settings className="mr-2 h-4 w-4" />
                    {t('common.settings', { defaultValue: 'Settings' })}
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive"
                  onClick={() => signOut()}
                  data-testid="home-layout-user-signout"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  {t('common.signOut', { defaultValue: 'Sign Out' })}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Page Content */}
      {children}
    </div>
  );
}
