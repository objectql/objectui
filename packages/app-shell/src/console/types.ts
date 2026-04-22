/**
 * createConsole — public API types
 *
 * Defines the surface that third-party hosts use to assemble a console SPA
 * without touching apps/console internals.
 *
 * All slots are optional — `createConsole({})` is valid and falls back to the
 * default implementations shipped from `@object-ui/app-shell`.
 */

import type { ComponentType, ReactNode } from 'react';

export interface AuthPagesConfig {
  Login?: ComponentType;
  Register?: ComponentType;
  ForgotPassword?: ComponentType;
}

export interface RouteSlot {
  /** Layout wrapper for the route (renders children inside its chrome). */
  Layout?: ComponentType<{ children: ReactNode }>;
  /** Inner page rendered as the layout's child. */
  Page?: ComponentType;
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

  /** Auth pages — optional, defaults shipped from app-shell. */
  authPages?: AuthPagesConfig;
  /** Landing page rendered at /home — optional, default shipped from app-shell. */
  homePage?: RouteSlot;
  /** Organizations selector at /organizations — optional, default shipped from app-shell. */
  organizationsPage?: RouteSlot;

  /**
   * Inner app component rendered under /apps/:appName/*.
   * Optional — defaults to app-shell's DefaultAppContent which mounts the
   * standard ConsoleLayout + ObjectView/Dashboard/Page/Report routes.
   */
  AppContent?: ComponentType;

  /**
   * Route element rendered at /create-app (without an active app).
   * Hosts that don't ship an app-creation flow can omit this.
   */
  CreateAppRoute?: ComponentType;
}
