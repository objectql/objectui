/**
 * HomeLayout
 *
 * Home (workspace) landing layout. Uses the unified `AppHeader` top bar in
 * `home` variant so that `/home` shares chrome with the rest of the console;
 * deliberately omits the sidebar.
 *
 * @module
 */

import React, { useEffect } from 'react';
import { useNavigationContext } from '../../context/NavigationContext';
import { AppHeader } from '../../layout/AppHeader';

interface HomeLayoutProps {
  children: React.ReactNode;
}

export function HomeLayout({ children }: HomeLayoutProps) {
  const { setContext } = useNavigationContext();

  useEffect(() => {
    setContext('home');
  }, [setContext]);

  return (
    <div className="flex min-h-svh w-full flex-col bg-background" data-testid="home-layout">
      <header className="sticky top-0 z-30 flex h-14 w-full shrink-0 items-center gap-2 border-b bg-background px-2 sm:px-4">
        <AppHeader variant="home" />
      </header>
      <main className="flex-1 min-w-0 overflow-auto">
        {children}
      </main>
    </div>
  );
}
