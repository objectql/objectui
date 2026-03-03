/**
 * Register Page for ObjectStack Console
 */

import { useNavigate, Link } from 'react-router-dom';
import { RegisterForm, type AuthLinkComponentProps } from '@object-ui/auth';
import { useObjectTranslation } from '@object-ui/i18n';
import { AuthPageLayout } from '../components/AuthPageLayout';

const RouterLink = ({ href, className, children }: AuthLinkComponentProps) => (
  <Link to={href} className={className}>{children}</Link>
);

export function RegisterPage() {
  const navigate = useNavigate();
  const { t } = useObjectTranslation();

  return (
    <AuthPageLayout>
      <RegisterForm
        onSuccess={() => navigate('/')}
        loginUrl="/login"
        title={t('auth.register.title')}
        description={t('auth.register.description')}
        linkComponent={RouterLink}
        labels={{
          nameLabel: t('auth.register.nameLabel'),
          namePlaceholder: t('auth.register.namePlaceholder'),
          emailLabel: t('auth.register.emailLabel'),
          emailPlaceholder: t('auth.register.emailPlaceholder'),
          passwordLabel: t('auth.register.passwordLabel'),
          passwordPlaceholder: t('auth.register.passwordPlaceholder'),
          confirmPasswordLabel: t('auth.register.confirmPasswordLabel'),
          confirmPasswordPlaceholder: t('auth.register.confirmPasswordPlaceholder'),
          passwordMismatchError: t('auth.register.passwordMismatchError'),
          passwordTooShortError: t('auth.register.passwordTooShortError'),
          submitButton: t('auth.register.submitButton'),
          submittingButton: t('auth.register.submittingButton'),
          hasAccountText: t('auth.register.hasAccountText'),
          signInText: t('auth.register.signInText'),
        }}
      />
    </AuthPageLayout>
  );
}
