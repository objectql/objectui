/**
 * Default pages used by the starter.
 *
 * These wire @object-ui/auth's <LoginForm/>, <RegisterForm/>, and
 * <ForgotPasswordForm/> so that out-of-the-box the starter actually
 * authenticates against the backend pointed to by VITE_SERVER_URL.
 *
 * Replace any of these with your own implementations to customise the
 * console.
 */

import { type ReactNode } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  LoginForm,
  RegisterForm,
  ForgotPasswordForm,
  type AuthLinkComponentProps,
} from '@object-ui/auth';

const RouterLink = ({ href, className, children }: AuthLinkComponentProps) => (
  <Link to={href} className={className}>
    {children}
  </Link>
);

const wrap = (title: string, children: ReactNode) => (
  <div className="min-h-screen flex flex-col bg-background text-foreground">
    <header className="border-b p-4 flex items-center justify-between">
      <strong>{title}</strong>
      <nav className="flex gap-4 text-sm">
        <Link to="/home">Home</Link>
        <Link to="/organizations">Orgs</Link>
        <Link to="/apps/demo">Demo App</Link>
      </nav>
    </header>
    <main className="flex-1 p-6">{children}</main>
  </div>
);

const authLayout = (children: ReactNode) => (
  <div className="min-h-screen flex items-center justify-center bg-muted/40 p-6">
    <div className="w-full max-w-md rounded-lg border bg-card p-6 shadow-sm">
      {children}
    </div>
  </div>
);

export const MyHomeLayout = ({ children }: { children: ReactNode }) =>
  wrap('Console Starter', children);

export const MyHomePage = () => (
  <div className="space-y-2">
    <h1 className="text-2xl font-bold">Welcome</h1>
    <p>
      Edit <code>src/pages.tsx</code> and <code>src/App.tsx</code> to customise
      this starter.
    </p>
  </div>
);

export const MyOrganizationsLayout = ({ children }: { children: ReactNode }) =>
  wrap('Organizations', children);

export const MyOrganizationsPage = () => <p>No organizations configured.</p>;

export function MyLoginPage() {
  const navigate = useNavigate();
  return authLayout(
    <LoginForm
      onSuccess={() => navigate('/')}
      registerUrl="/register"
      forgotPasswordUrl="/forgot-password"
      title="Sign in"
      description="Enter your credentials to access the console."
      linkComponent={RouterLink}
    />,
  );
}

export function MyRegisterPage() {
  const navigate = useNavigate();
  return authLayout(
    <RegisterForm
      onSuccess={() => navigate('/')}
      loginUrl="/login"
      title="Create account"
      linkComponent={RouterLink}
    />,
  );
}

export function MyForgotPasswordPage() {
  return authLayout(
    <ForgotPasswordForm
      loginUrl="/login"
      title="Reset password"
      linkComponent={RouterLink}
    />,
  );
}

export const MyAppContent = () => {
  const { appName } = useParams();
  return wrap(
    `App: ${appName ?? '(none)'}`,
    <div className="space-y-2">
      <p>Render your app's pages here.</p>
      <p className="text-sm text-muted-foreground">
        Replace <code>MyAppContent</code> with the real <code>AppContent</code>
        component (or your own variant) once you wire an adapter.
      </p>
    </div>,
  );
};
