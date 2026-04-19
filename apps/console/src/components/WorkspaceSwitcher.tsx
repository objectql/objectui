/**
 * WorkspaceSwitcher
 *
 * Airtable-style workspace (organization) switcher for the sidebar header.
 * Displays the current workspace and a dropdown to switch between workspaces
 * or create a new one.
 *
 * @module
 */

import { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  Avatar,
  AvatarImage,
  AvatarFallback,
} from '@object-ui/components';
import { ChevronsUpDown, Plus, Check } from 'lucide-react';
import { useAuth } from '@object-ui/auth';
import type { AuthOrganization } from '@object-ui/auth';
import { CreateWorkspaceDialog } from './CreateWorkspaceDialog';
import { useObjectTranslation } from '@object-ui/i18n';

function getOrgInitials(name: string): string {
  return name
    .split(/[\s_-]+/)
    .map(w => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

interface WorkspaceSwitcherProps {
  /** Callback when workspace is switched (e.g., to reinitialize adapter) */
  onWorkspaceChange?: (org: AuthOrganization) => void;
}

export function WorkspaceSwitcher({ onWorkspaceChange }: WorkspaceSwitcherProps) {
  const { t } = useObjectTranslation();
  const {
    organizations,
    activeOrganization,
    isOrganizationsLoading,
    switchOrganization,
  } = useAuth();
  const orgList = organizations ?? [];

  const [isOpen, setIsOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isSwitching, setSwitching] = useState(false);

  // Don't render if no organizations available (server may not have org plugin)
  if (!isOrganizationsLoading && orgList.length === 0 && !activeOrganization) {
    return null;
  }

  const handleSwitch = async (org: AuthOrganization) => {
    if (org.id === activeOrganization?.id) {
      setIsOpen(false);
      return;
    }
    setSwitching(true);
    try {
      await switchOrganization(org.id);
      onWorkspaceChange?.(org);
      setIsOpen(false);
    } catch (err) {
      console.error('[WorkspaceSwitcher] Failed to switch:', err);
    } finally {
      setSwitching(false);
    }
  };

  const handleCreate = () => {
    setIsOpen(false);
    setIsCreateOpen(true);
  };

  const displayName = activeOrganization?.name || t('workspace.default', { defaultValue: 'My Workspace' });
  const displayLogo = activeOrganization?.logo;

  return (
    <>
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <button
            className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm hover:bg-accent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
            disabled={isSwitching}
            data-testid="workspace-switcher-trigger"
          >
            <Avatar className="h-6 w-6 rounded-md">
              {displayLogo && <AvatarImage src={displayLogo} alt={displayName} />}
              <AvatarFallback className="rounded-md text-[10px] font-medium bg-primary/10 text-primary">
                {getOrgInitials(displayName)}
              </AvatarFallback>
            </Avatar>
            <span className="flex-1 truncate font-medium">{displayName}</span>
            <ChevronsUpDown className="h-4 w-4 shrink-0 text-muted-foreground" />
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="start" className="w-64" sideOffset={4}>
          <DropdownMenuLabel className="text-xs text-muted-foreground font-normal">
            {t('workspace.label', { defaultValue: 'Workspaces' })}
          </DropdownMenuLabel>

          {orgList.map((org) => (
            <DropdownMenuItem
              key={org.id}
              onClick={() => handleSwitch(org)}
              className="flex items-center gap-2 cursor-pointer"
              data-testid={`workspace-option-${org.slug}`}
            >
              <Avatar className="h-5 w-5 rounded-md">
                {org.logo && <AvatarImage src={org.logo} alt={org.name} />}
                <AvatarFallback className="rounded-md text-[9px] font-medium bg-primary/10 text-primary">
                  {getOrgInitials(org.name)}
                </AvatarFallback>
              </Avatar>
              <span className="flex-1 truncate">{org.name}</span>
              {org.id === activeOrganization?.id && (
                <Check className="h-4 w-4 text-primary" />
              )}
            </DropdownMenuItem>
          ))}

          <DropdownMenuSeparator />

          <DropdownMenuItem onClick={handleCreate} className="cursor-pointer">
            <Plus className="mr-2 h-4 w-4" />
            {t('workspace.create', { defaultValue: 'Create workspace' })}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <CreateWorkspaceDialog
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        onCreated={(org) => {
          onWorkspaceChange?.(org);
          setIsCreateOpen(false);
        }}
      />
    </>
  );
}
