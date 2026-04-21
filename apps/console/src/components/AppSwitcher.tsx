/**
 * AppSwitcher
 *
 * Application switcher component for the top bar. Displays the current app
 * with a dropdown menu to switch between available apps.
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
  Button,
} from '@object-ui/components';
import { ChevronsUpDown, Database } from 'lucide-react';
import { useMetadata } from '../context/MetadataProvider';
import { resolveI18nLabel } from '../utils';
import { useObjectTranslation, useObjectLabel } from '@object-ui/i18n';

/**
 * Resolve a Lucide icon component by name string.
 */
function getIcon(name?: string): React.ComponentType<any> {
  if (!name) return LucideIcons.Database;

  const lookup = (key: string): React.ComponentType<any> | undefined => {
    try {
      const icon = (LucideIcons as Record<string, unknown>)[key];
      return typeof icon === 'function' ? (icon as React.ComponentType<any>) : undefined;
    } catch {
      return undefined;
    }
  };

  // Try exact match first, then convert kebab-case / lowercase to PascalCase
  const pascalName = name
    .split(/[-_]/)
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');

  return lookup(name) ?? lookup(pascalName) ?? LucideIcons.Database;
}

export interface AppSwitcherProps {
  /** Current active app name */
  activeAppName: string;
  /** Callback when user switches apps */
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

  const logo = activeApp?.branding?.logo;
  const primaryColor = activeApp?.branding?.primaryColor;
  const appLabelText = appLabel({ name: activeApp.name, label: resolveI18nLabel(activeApp.label, t) });

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex items-center gap-2 h-9 px-2 hover:bg-accent"
        >
          <div
            className="flex aspect-square size-6 items-center justify-center rounded-md bg-primary text-primary-foreground"
            style={primaryColor ? { backgroundColor: primaryColor } : undefined}
          >
            {logo ? (
              <img src={logo} alt={appLabelText} className="size-4 object-contain" />
            ) : (
              React.createElement(getIcon(activeApp.icon), { className: "size-3" })
            )}
          </div>
          <span className="font-semibold text-sm hidden sm:inline-block">{appLabelText}</span>
          <ChevronsUpDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-56"
        align="start"
        sideOffset={8}
      >
        <DropdownMenuLabel className="text-xs text-muted-foreground">
          Switch Application
        </DropdownMenuLabel>
        {activeApps.map((app: any) => (
          <DropdownMenuItem
            key={app.name}
            onClick={() => onAppChange(app.name)}
            className="gap-2 p-2"
          >
            <div className="flex size-6 items-center justify-center rounded-sm border">
              {app.icon ? React.createElement(getIcon(app.icon), { className: "size-3" }) : <Database className="size-3" />}
            </div>
            {appLabel({ name: app.name, label: resolveI18nLabel(app.label, t) })}
            {activeApp.name === app.name && <span className="ml-auto text-xs">✓</span>}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
