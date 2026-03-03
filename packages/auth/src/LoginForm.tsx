/**
 * ObjectUI
 * Copyright (c) 2024-present ObjectStack Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { useState } from 'react';
import { useAuth } from './useAuth';
import type { AuthLinkComponentProps } from './types';

/** Translatable labels for the LoginForm */
export interface LoginFormLabels {
  emailLabel?: string;
  emailPlaceholder?: string;
  passwordLabel?: string;
  passwordPlaceholder?: string;
  forgotPasswordText?: string;
  submitButton?: string;
  submittingButton?: string;
  noAccountText?: string;
  signUpText?: string;
}

export interface LoginFormProps {
  /** Callback on successful login */
  onSuccess?: () => void;
  /** Callback on login error */
  onError?: (error: Error) => void;
  /** Link to registration page */
  registerUrl?: string;
  /** Link to forgot password page */
  forgotPasswordUrl?: string;
  /** Custom title */
  title?: string;
  /** Custom description */
  description?: string;
  /** Custom link component for SPA navigation (e.g. React Router's Link) */
  linkComponent?: React.ComponentType<AuthLinkComponentProps>;
  /** Override default labels for i18n */
  labels?: LoginFormLabels;
}

const DefaultLink = ({ href, className, children }: AuthLinkComponentProps) => (
  <a href={href} className={className}>{children}</a>
);

/**
 * Login form component with email/password authentication.
 * Uses Tailwind CSS utility classes for styling.
 *
 * @example
 * ```tsx
 * <LoginForm
 *   onSuccess={() => navigate('/dashboard')}
 *   registerUrl="/register"
 *   forgotPasswordUrl="/forgot-password"
 * />
 * ```
 */
export function LoginForm({
  onSuccess,
  onError,
  registerUrl = '/register',
  forgotPasswordUrl = '/forgot-password',
  title = 'Sign in to your account',
  description = 'Enter your email and password to continue',
  linkComponent: LinkComp = DefaultLink,
  labels = {},
}: LoginFormProps) {
  const { signIn, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const l = {
    emailLabel: labels.emailLabel ?? 'Email',
    emailPlaceholder: labels.emailPlaceholder ?? 'name@example.com',
    passwordLabel: labels.passwordLabel ?? 'Password',
    passwordPlaceholder: labels.passwordPlaceholder ?? 'Enter your password',
    forgotPasswordText: labels.forgotPasswordText ?? 'Forgot password?',
    submitButton: labels.submitButton ?? 'Sign In',
    submittingButton: labels.submittingButton ?? 'Signing in...',
    noAccountText: labels.noAccountText ?? "Don't have an account?",
    signUpText: labels.signUpText ?? 'Sign up',
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      await signIn(email, password);
      onSuccess?.();
    } catch (err) {
      const authError = err instanceof Error ? err : new Error(String(err));
      setError(authError.message);
      onError?.(authError);
    }
  };

  return (
    <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[380px]">
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive" role="alert">
            {error}
          </div>
        )}

        <div className="space-y-2">
          <label htmlFor="login-email" className="text-sm font-medium leading-none">
            {l.emailLabel}
          </label>
          <input
            id="login-email"
            type="email"
            placeholder={l.emailPlaceholder}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            disabled={isLoading}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label htmlFor="login-password" className="text-sm font-medium leading-none">
              {l.passwordLabel}
            </label>
            {forgotPasswordUrl && (
              <LinkComp
                href={forgotPasswordUrl}
                className="text-sm text-primary underline-offset-4 hover:underline"
              >
                {l.forgotPasswordText}
              </LinkComp>
            )}
          </div>
          <input
            id="login-password"
            type="password"
            placeholder={l.passwordPlaceholder}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
            disabled={isLoading}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="inline-flex h-10 w-full items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
        >
          {isLoading ? l.submittingButton : l.submitButton}
        </button>
      </form>

      {registerUrl && (
        <p className="px-8 text-center text-sm text-muted-foreground">
          {l.noAccountText}{' '}
          <LinkComp href={registerUrl} className="text-primary underline-offset-4 hover:underline">
            {l.signUpText}
          </LinkComp>
        </p>
      )}
    </div>
  );
}
