/**
 * ConnectionStatus
 *
 * Displays the current ObjectStack connection state in the header area.
 * Shows a subtle indicator when connected, and a prominent one when
 * reconnecting or in error state.
 */

import type { ConnectionState } from '../dataSource';
import { cn } from '@object-ui/components';
import { Wifi, WifiOff, Loader2 } from 'lucide-react';

interface ConnectionStatusProps {
  state: ConnectionState;
  className?: string;
}

const statusConfig: Record<ConnectionState, { label: string; color: string; icon: typeof Wifi }> = {
  connected: { label: 'Connected', color: 'text-green-500', icon: Wifi },
  connecting: { label: 'Connecting...', color: 'text-yellow-500', icon: Loader2 },
  reconnecting: { label: 'Reconnecting...', color: 'text-yellow-500', icon: Loader2 },
  disconnected: { label: 'Disconnected', color: 'text-muted-foreground', icon: WifiOff },
  error: { label: 'Connection Error', color: 'text-destructive', icon: WifiOff },
};

export function ConnectionStatus({ state, className }: ConnectionStatusProps) {
  const config = statusConfig[state];
  const Icon = config.icon;

  // Don't show anything when connected (clean UI)
  if (state === 'connected') return null;

  return (
    <div
      className={cn(
        'flex items-center gap-1.5 text-xs font-medium px-2 py-1 rounded-md',
        config.color,
        state === 'error' && 'bg-destructive/10',
        state === 'reconnecting' && 'bg-yellow-500/10',
        className
      )}
      title={config.label}
    >
      <Icon className={cn('h-3.5 w-3.5', (state === 'connecting' || state === 'reconnecting') && 'animate-spin')} />
      <span className="hidden sm:inline">{config.label}</span>
    </div>
  );
}
