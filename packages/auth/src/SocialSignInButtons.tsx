/**
 * ObjectUI
 * Copyright (c) 2024-present ObjectStack Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { useEffect, useState } from 'react';
import { useAuth } from './useAuth';
import type { AuthSocialProvider } from './types';

export interface SocialSignInButtonsProps {
  /** Sign-in vs sign-up changes the button label ("Continue with" vs "Sign up with") */
  mode?: 'sign-in' | 'sign-up';
  /** Where the provider should redirect after success. Defaults to current page. */
  callbackURL?: string;
  /** Where the provider should redirect on error. Defaults to current page. */
  errorCallbackURL?: string;
  /** Divider text shown between social buttons and the email form */
  dividerText?: string;
}

/**
 * Renders one button per enabled third-party provider returned by
 * `GET {authUrl}/config`. Clicking a button initiates an OAuth redirect via
 * better-auth (`signIn.social` or `signIn.oauth2`).
 *
 * Returns `null` while loading or when the server reports no providers.
 */
export function SocialSignInButtons({
  mode = 'sign-in',
  callbackURL,
  errorCallbackURL,
  dividerText = 'or continue with email',
}: SocialSignInButtonsProps) {
  const { getAuthConfig, signInWithProvider } = useAuth();
  const [providers, setProviders] = useState<AuthSocialProvider[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    // Wrap in Promise.resolve so synchronous throws (e.g. mock client without
    // getConfig) become rejections we can swallow rather than uncaught errors.
    Promise.resolve()
      .then(() => getAuthConfig())
      .then((config) => {
        if (cancelled) return;
        const list = config?.socialProviders ?? [];
        setProviders(list.filter((p) => p.enabled));
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        // Don't surface as a hard error — providers are an enhancement, not required.
        console.warn('[SocialSignInButtons] failed to load auth config', err);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [getAuthConfig]);

  if (loading || providers.length === 0) return null;

  const label = mode === 'sign-in' ? 'Continue with' : 'Sign up with';
  const defaultCallback =
    typeof window !== 'undefined' ? window.location.href : undefined;

  const onClick = async (provider: AuthSocialProvider) => {
    setError(null);
    try {
      await signInWithProvider(provider.id, {
        callbackURL: callbackURL ?? defaultCallback,
        errorCallbackURL: errorCallbackURL ?? callbackURL ?? defaultCallback,
        type: provider.type ?? 'social',
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
  };

  return (
    <div className="flex flex-col gap-2">
      {error && (
        <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive" role="alert">
          {error}
        </div>
      )}
      {providers.map((p) => (
        <button
          key={p.id}
          type="button"
          onClick={() => onClick(p)}
          className="inline-flex h-10 w-full items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
        >
          <span className="mr-2 flex h-4 w-4 items-center justify-center rounded-sm bg-muted text-[10px] font-bold uppercase">
            {p.id[0]}
          </span>
          {label} {p.name}
        </button>
      ))}
      <div className="relative my-1">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">{dividerText}</span>
        </div>
      </div>
    </div>
  );
}
