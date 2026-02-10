/**
 * Forgot Password Page for ObjectStack Console
 */

import { ForgotPasswordForm } from '@object-ui/auth';

export function ForgotPasswordPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-8">
      <ForgotPasswordForm loginUrl="/login" />
    </div>
  );
}
