/**
 * InviteMemberDialog
 *
 * Invites a new member to an organization. After creation, switches to a
 * "share link" view so operators can copy the accept-invitation URL when no
 * mailer is configured server-side.
 */

import { useCallback, useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Button,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@object-ui/components';
import { useAuth } from '@object-ui/auth';
import type { AuthInvitation } from '@object-ui/auth';
import { useObjectTranslation } from '@object-ui/i18n';
import { Loader2, Copy, Check } from 'lucide-react';
import { toast } from 'sonner';

type Role = 'owner' | 'admin' | 'member';

interface InviteMemberDialogProps {
  organizationId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onInvited?: (invitation: AuthInvitation) => void;
}

function buildAcceptUrl(invitationId: string): string {
  const base = (import.meta as any).env?.BASE_URL ?? '/';
  const normalized = base.endsWith('/') ? base : `${base}/`;
  return `${window.location.origin}${normalized}accept-invitation/${invitationId}`;
}

export function InviteMemberDialog({
  organizationId,
  open,
  onOpenChange,
  onInvited,
}: InviteMemberDialogProps) {
  const { t } = useObjectTranslation();
  const { inviteMember } = useAuth();

  const [email, setEmail] = useState('');
  const [role, setRole] = useState<Role>('member');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [createdInvitation, setCreatedInvitation] = useState<AuthInvitation | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (open) {
      setEmail('');
      setRole('member');
      setError(null);
      setCreatedInvitation(null);
      setCopied(false);
    }
  }, [open]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!email.trim()) return;
      setIsSubmitting(true);
      setError(null);
      try {
        const inv = await inviteMember({
          organizationId,
          email: email.trim(),
          role,
        });
        setCreatedInvitation(inv);
        onInvited?.(inv);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to invite member');
      } finally {
        setIsSubmitting(false);
      }
    },
    [email, role, organizationId, inviteMember, onInvited],
  );

  const handleCopy = useCallback(async () => {
    if (!createdInvitation) return;
    const url = buildAcceptUrl(createdInvitation.id);
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success(t('organization.invitations.linkCopied', { defaultValue: 'Invitation link copied' }));
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error(t('organization.invitations.copyFailed', { defaultValue: 'Failed to copy link' }));
    }
  }, [createdInvitation, t]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px]" data-testid="invite-member-dialog">
        {createdInvitation ? (
          <>
            <DialogHeader>
              <DialogTitle>
                {t('organization.invitations.sentTitle', { defaultValue: 'Invitation created' })}
              </DialogTitle>
              <DialogDescription>
                {t('organization.invitations.sentDescription', {
                  defaultValue: 'Share the link below with the invitee. They will need to sign in to accept.',
                })}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-3 py-4">
              <Label>{t('organization.invitations.linkLabel', { defaultValue: 'Accept link' })}</Label>
              <div className="flex items-center gap-2">
                <Input
                  readOnly
                  value={buildAcceptUrl(createdInvitation.id)}
                  className="font-mono text-xs"
                  onFocus={(e) => e.currentTarget.select()}
                />
                <Button type="button" variant="outline" size="icon" onClick={handleCopy} aria-label="Copy">
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                {t('organization.invitations.invitedAs', {
                  defaultValue: '{{email}} invited as {{role}}',
                  email: createdInvitation.email,
                  role: createdInvitation.role,
                })}
              </p>
            </div>
            <DialogFooter>
              <Button onClick={() => onOpenChange(false)}>
                {t('common.done', { defaultValue: 'Done' })}
              </Button>
            </DialogFooter>
          </>
        ) : (
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>
                {t('organization.invitations.inviteTitle', { defaultValue: 'Invite a member' })}
              </DialogTitle>
              <DialogDescription>
                {t('organization.invitations.inviteDescription', {
                  defaultValue: 'They will receive an invitation to join this organization.',
                })}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="invite-email">
                  {t('organization.invitations.emailLabel', { defaultValue: 'Email' })}
                </Label>
                <Input
                  id="invite-email"
                  type="email"
                  required
                  placeholder="user@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoFocus
                  data-testid="invite-email-input"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="invite-role">
                  {t('organization.invitations.roleLabel', { defaultValue: 'Role' })}
                </Label>
                <Select value={role} onValueChange={(v) => setRole(v as Role)}>
                  <SelectTrigger id="invite-role" data-testid="invite-role-select">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="member">
                      {t('organization.roles.member', { defaultValue: 'Member' })}
                    </SelectItem>
                    <SelectItem value="admin">
                      {t('organization.roles.admin', { defaultValue: 'Admin' })}
                    </SelectItem>
                    <SelectItem value="owner">
                      {t('organization.roles.owner', { defaultValue: 'Owner' })}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {error && (
                <p className="text-sm text-destructive" data-testid="invite-error">{error}</p>
              )}
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
                {t('common.cancel', { defaultValue: 'Cancel' })}
              </Button>
              <Button type="submit" disabled={isSubmitting || !email.trim()} data-testid="invite-submit">
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {t('organization.invitations.sendInvite', { defaultValue: 'Send invite' })}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
