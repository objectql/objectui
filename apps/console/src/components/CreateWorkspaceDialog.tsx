/**
 * CreateWorkspaceDialog
 *
 * Dialog for creating a new workspace (organization).
 * Auto-generates a slug from the name.
 *
 * @module
 */

import { useState, useCallback, useEffect } from 'react';
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
} from '@object-ui/components';
import { useAuth } from '@object-ui/auth';
import type { AuthOrganization } from '@object-ui/auth';
import { useObjectTranslation } from '@object-ui/i18n';
import { Loader2 } from 'lucide-react';

/** Convert a display name to a URL-friendly slug */
function nameToSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s_-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 48);
}

interface CreateWorkspaceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated?: (org: AuthOrganization) => void;
}

export function CreateWorkspaceDialog({
  open,
  onOpenChange,
  onCreated,
}: CreateWorkspaceDialogProps) {
  const { t } = useObjectTranslation();
  const { createOrganization } = useAuth();

  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Auto-generate slug from name (unless manually edited)
  useEffect(() => {
    if (!slugManuallyEdited) {
      setSlug(nameToSlug(name));
    }
  }, [name, slugManuallyEdited]);

  // Reset form when dialog opens
  useEffect(() => {
    if (open) {
      setName('');
      setSlug('');
      setSlugManuallyEdited(false);
      setError(null);
    }
  }, [open]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!name.trim() || !slug.trim()) return;

      setIsSubmitting(true);
      setError(null);

      try {
        const org = await createOrganization({ name: name.trim(), slug: slug.trim() });
        onCreated?.(org);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to create workspace');
      } finally {
        setIsSubmitting(false);
      }
    },
    [name, slug, createOrganization, onCreated],
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]" data-testid="create-workspace-dialog">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>
              {t('workspace.createTitle', { defaultValue: 'Create a workspace' })}
            </DialogTitle>
            <DialogDescription>
              {t('workspace.createDescription', {
                defaultValue: 'A workspace is a shared space for your team to collaborate.',
              })}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="workspace-name">
                {t('workspace.nameLabel', { defaultValue: 'Workspace name' })}
              </Label>
              <Input
                id="workspace-name"
                placeholder={t('workspace.namePlaceholder', { defaultValue: 'e.g., Acme Inc' })}
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoFocus
                data-testid="workspace-name-input"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="workspace-slug">
                {t('workspace.slugLabel', { defaultValue: 'URL slug' })}
              </Label>
              <Input
                id="workspace-slug"
                placeholder="acme-inc"
                value={slug}
                onChange={(e) => {
                  setSlug(e.target.value);
                  setSlugManuallyEdited(true);
                }}
                data-testid="workspace-slug-input"
              />
              <p className="text-xs text-muted-foreground">
                {t('workspace.slugHint', { defaultValue: 'Used in URLs. Only lowercase letters, numbers, and hyphens.' })}
              </p>
            </div>

            {error && (
              <p className="text-sm text-destructive" data-testid="workspace-create-error">
                {error}
              </p>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              {t('common.cancel', { defaultValue: 'Cancel' })}
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !name.trim() || !slug.trim()}
              data-testid="workspace-create-submit"
            >
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {t('workspace.createButton', { defaultValue: 'Create workspace' })}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
