/**
 * AppSwitcher
 *
 * Supabase-style application switcher for the top bar.
 * Renders as: [App Name] [ChevronDown] — minimal ghost trigger, no icon box.
 * @module
 */

import * as React from 'react';
import * as LucideIcons from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@object-ui/components';
import { ChevronDown, Check } from 'lucide-react';
import { useMetadata } from '../providers/MetadataProvider';
import { resolveI18nLabel } from '../utils';
import { useObjectTranslation, useObjectLabel } from '@object-ui/i18n';

function getIcon(name?: string): React.ComponentType<any> {
  if (!name) return LucideIcons.Database;
  const lookup = (key: string) => {
    try {
      const icon = (LucideIcons as Record<string, unknown>)[key];
      return typeof icon === 'function' ? (icon as React.ComponentType<any>) : undefined;
    } catch { return undefined; }
  };
  const pascalName = name.split(/[-_]/).map(p => p.charAt(0).toUpperCase() + p.slice(1)).join('');
  return lookup(name) ?? lookup(pascalName) ?? LucideIcons.Database;
}

export interface AppSwitcherProps {
  activeAppName: string;
  onAppChange: (name: string) => void;
}

export function AppSwitcher({ activeAppName, onAppChange }: AppSwitcherProps) {
  const { apps: metadataApps } = useMetadata();
  const { t } = useObjectTranslation();
  const { appLabel } = useObjectLabel();

  const apps = metadataApps || [];
  const activeApps = apps.filter((a: any) => a.active !== false);
  const activeApp = activeApps.find((a: any) => a.name === activeAppName) || activeApps[0];

  if (!activeApp) return null;

  const appLabelText = appLabel({ name: activeApp.name, label: resolveI18nLabel(activeApp.label, t) });

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-1 rounded-md px-1.5 py-1 text-sm font-medium text-foreground/80 hover:bg-accent hover:text-foreground transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring">
          {appLabelText}
          <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" sideOffset={8} className="w-60">
        <DropdownMenuLabel className="text-xs text-muted-foreground font-normal">
          Switch Application
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {activeApps.map((app: any) => {
          const AppIcon = getIcon(app.icon);
          const label = appLabel({ name: app.name, label: resolveI18nLabel(app.label, t) });
          const isActive = activeApp.name === app.name;
          return (
            <DropdownMenuItem
              key={app.name}
              onClick={() => onAppChange(app.name)}
              className="flex items-center gap-2.5 py-2"
            >
              <div className="flex size-5 shrink-0 items-center justify-center rounded border bg-muted text-muted-foreground">
                <AppIcon className="size-3" />
              </div>
              <span className="flex-1 truncate">{label}</span>
              {isActive && <Check className="size-3.5 text-primary shrink-0" />}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
