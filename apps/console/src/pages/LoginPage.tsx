/**
 * Login Page for ObjectStack Console
 */

import { useNavigate, Link } from 'react-router-dom';
import { LoginForm, type AuthLinkComponentProps } from '@object-ui/auth';
import { useObjectTranslation } from '@object-ui/i18n';
import { AuthPageLayout } from '../components/AuthPageLayout';

const RouterLink = ({ href, className, children }: AuthLinkComponentProps) => (
  <Link to={href} className={className}>{children}</Link>
);

export function LoginPage() {
  const navigate = useNavigate();
  const { t } = useObjectTranslation();

  return (
    <AuthPageLayout>
      <LoginForm
        onSuccess={() => navigate('/')}
        registerUrl="/register"
        forgotPasswordUrl="/forgot-password"
        title={t('auth.login.title')}
        description={t('auth.login.description')}
        linkComponent={RouterLink}
        labels={{
          emailLabel: t('auth.login.emailLabel'),
          emailPlaceholder: t('auth.login.emailPlaceholder'),
          passwordLabel: t('auth.login.passwordLabel'),
          passwordPlaceholder: t('auth.login.passwordPlaceholder'),
          forgotPasswordText: t('auth.login.forgotPasswordText'),
          submitButton: t('auth.login.submitButton'),
          submittingButton: t('auth.login.submittingButton'),
          noAccountText: t('auth.login.noAccountText'),
          signUpText: t('auth.login.signUpText'),
        }}
      />
    </AuthPageLayout>
  );
}
