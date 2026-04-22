/**
 * Replace these stub pages with your own implementations.
 *
 * Each page is plain React — they receive context (auth user, adapter,
 * metadata) via @object-ui/app-shell hooks if needed.
 */

import { type ReactNode } from 'react';
import { Link, useParams } from 'react-router-dom';

const wrap = (title: string, children: ReactNode) => (
  <div className="min-h-screen flex flex-col">
    <header className="border-b p-4 flex items-center justify-between">
      <strong>{title}</strong>
      <nav className="flex gap-4 text-sm">
        <Link to="/home">Home</Link>
        <Link to="/apps/demo">Demo App</Link>
      </nav>
    </header>
    <main className="flex-1 p-6">{children}</main>
  </div>
);

export const MyHomeLayout = ({ children }: { children: ReactNode }) =>
  wrap('Console Starter', children);

export const MyHomePage = () => (
  <div className="space-y-2">
    <h1 className="text-2xl font-bold">Welcome</h1>
    <p>Edit <code>src/pages.tsx</code> to plug in real screens.</p>
  </div>
);

export const MyOrganizationsLayout = ({ children }: { children: ReactNode }) =>
  wrap('Organizations', children);

export const MyOrganizationsPage = () => (
  <p>No organizations configured.</p>
);

export const MyLoginPage = () => (
  <div className="min-h-screen flex items-center justify-center">
    <p>Replace with your login form.</p>
  </div>
);

export const MyRegisterPage = () => (
  <div className="min-h-screen flex items-center justify-center">
    <p>Replace with your registration form.</p>
  </div>
);

export const MyForgotPasswordPage = () => (
  <div className="min-h-screen flex items-center justify-center">
    <p>Replace with your password-reset form.</p>
  </div>
);

export const MyAppContent = () => {
  const { appName } = useParams();
  return wrap(
    `App: ${appName ?? '(none)'}`,
    <div className="space-y-2">
      <p>Render your app's pages here.</p>
      <p className="text-sm text-muted-foreground">
        Tip: replace this with the real <code>AppContent</code> component from <code>apps/console</code>
        (or your own variant) once you wire an adapter.
      </p>
    </div>,
  );
};
