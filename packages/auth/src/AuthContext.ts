/**
 * ObjectUI
 * Copyright (c) 2024-present ObjectStack Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { createContext } from 'react';
import type { AuthUser, AuthSession, PreviewModeOptions, AuthOrganization, AuthOrganizationMember, AuthInvitation, AuthPublicConfig, SignInWithProviderOptions } from './types';

export interface AuthContextValue {
  /** Current authenticated user */
  user: AuthUser | null;
  /** Current session information */
  session: AuthSession | null;
  /** Whether the user is authenticated */
  isAuthenticated: boolean;
  /** Whether auth state is loading */
  isLoading: boolean;
  /** Authentication error */
  error: Error | null;
  /** Whether the app is running in preview mode */
  isPreviewMode: boolean;
  /** Preview mode configuration (only set when isPreviewMode is true) */
  previewMode: PreviewModeOptions | null;
  /** Sign in with email and password */
  signIn: (email: string, password: string) => Promise<void>;
  /** Sign up with name, email, and password */
  signUp: (name: string, email: string, password: string) => Promise<void>;
  /** Sign out the current user */
  signOut: () => Promise<void>;
  /** Update user profile */
  updateUser: (data: Partial<AuthUser>) => Promise<void>;
  /** Request password reset */
  forgotPassword: (email: string) => Promise<void>;
  /** Reset password with token */
  resetPassword: (token: string, newPassword: string) => Promise<void>;
  /** Fetch the public auth configuration (providers, features) */
  getAuthConfig: () => Promise<AuthPublicConfig>;
  /** Initiate sign-in with a third-party provider (Google, GitHub, OIDC, etc.) */
  signInWithProvider: (providerId: string, options?: SignInWithProviderOptions) => Promise<void>;

  // --- Organization / Workspace ---

  /** All organizations the user belongs to */
  organizations: AuthOrganization[];
  /** Currently active organization */
  activeOrganization: AuthOrganization | null;
  /** Whether organizations are loading */
  isOrganizationsLoading: boolean;
  /** Switch the active organization (workspace) */
  switchOrganization: (orgId: string) => Promise<void>;
  /** Create a new organization */
  createOrganization: (data: { name: string; slug: string; logo?: string }) => Promise<AuthOrganization>;
  /** Refresh the organizations list */
  refreshOrganizations: () => Promise<void>;
  /** Update organization details (owner/admin) */
  updateOrganization: (orgId: string, data: Partial<Pick<AuthOrganization, 'name' | 'slug' | 'logo' | 'metadata'>>) => Promise<AuthOrganization>;
  /** Delete an organization (owner) */
  deleteOrganization: (orgId: string) => Promise<void>;
  /** Current user leaves the given organization */
  leaveOrganization: (orgId: string) => Promise<void>;

  // --- Members ---

  /** List members of an organization */
  getMembers: (orgId: string) => Promise<AuthOrganizationMember[]>;
  /** Invite a user by email */
  inviteMember: (data: { organizationId: string; email: string; role: string }) => Promise<AuthInvitation>;
  /** Remove a member by id */
  removeMember: (data: { organizationId: string; memberIdOrUserId: string }) => Promise<void>;
  /** Update a member's role */
  updateMemberRole: (data: { organizationId: string; memberId: string; role: string }) => Promise<void>;

  // --- Invitations ---

  /** List pending invitations for an organization */
  listInvitations: (orgId: string) => Promise<AuthInvitation[]>;
  /** Cancel an invitation */
  cancelInvitation: (invitationId: string) => Promise<void>;
  /** Get invitation details by id */
  getInvitation: (invitationId: string) => Promise<AuthInvitation>;
  /** Accept an invitation as the current user */
  acceptInvitation: (invitationId: string) => Promise<void>;
  /** Reject an invitation as the current user */
  rejectInvitation: (invitationId: string) => Promise<void>;
  /** List invitations addressed to the current user */
  listUserInvitations: () => Promise<AuthInvitation[]>;
}

export const AuthCtx = createContext<AuthContextValue | null>(null);
AuthCtx.displayName = 'AuthContext';
