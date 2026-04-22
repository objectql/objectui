/**
 * createConsole — public API types
 *
 * Defines the surface that third-party hosts use to assemble a console SPA
 * without touching apps/console internals.
 */

import type { ComponentType, ReactNode } from 'react';

export interface AuthPagesConfig {
  Login: ComponentType;
  Register: ComponentType;
  ForgotPassword: ComponentType;
}

export interface RouteSlot {
  /** Layout wrapper for the route (renders children inside its chrome). */
  Layout: ComponentType<{ children: ReactNode }>;
  /** Inner page rendered as the layout's child. */
  Page: ComponentType;
}

export interface ConsoleConfig {
  /** BrowserRouter basename. Defaults to BASE_URL or '/'. */
  basename?: string;
  /** Auth provider URL (passed through to ConditionalAuthWrapper). */
  authUrl?: string;
  /** Default theme — 'light' | 'dark' | 'system'. */
  defaultTheme?: 'light' | 'dark' | 'system';
  /** localStorage key used to persist theme. */
  themeStorageKey?: string;

  /** Auth pages — required so unauthenticated users can sign in. */
  authPages: AuthPagesConfig;
  /** Landing page rendered at /home. */
  homePage: RouteSlot;
  /** Organizations selector at /organizations (multi-tenant gate). */
  organizationsPage: RouteSlot;

  /**
   * Inner app component rendered under /apps/:appName/*.
   * Receives no props — it should consume context (useAuth, useAdapter, ...) itself.
   */
  AppContent: ComponentType;

  /**
   * Route element rendered at /create-app (without an active app).
   * Hosts that don't ship an app-creation flow can omit this.
   */
  CreateAppRoute?: ComponentType;
}
