/**
 * ObjectUI
 * Copyright (c) 2024-present ObjectStack Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import * as React from 'react';
import {
  cn,
  Button,
  Badge,
  Input,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@object-ui/components';
import { Share2, Copy, Check } from 'lucide-react';

export interface SharedViewLinkProps {
  /** The object name used in the share URL path */
  objectName: string;
  /** Optional view identifier; defaults to "default" */
  viewId?: string;
  /** Base URL for the shareable link (defaults to window.location.origin) */
  baseUrl?: string;
  /** Callback fired after a share URL is generated */
  onShare?: (shareUrl: string) => void;
  className?: string;
}

function generateToken(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  // Fallback for environments without crypto.randomUUID
  if (typeof crypto !== 'undefined' && typeof crypto.getRandomValues === 'function') {
    const bytes = new Uint8Array(16);
    crypto.getRandomValues(bytes);
    return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
  }
  return Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2);
}

function buildShareUrl(baseUrl: string, objectName: string, viewId: string, token: string): string {
  return `${baseUrl}/share/${objectName}/${viewId}?mode=readonly&token=${token}`;
}

export const SharedViewLink: React.FC<SharedViewLinkProps> = ({
  objectName,
  viewId = 'default',
  baseUrl,
  onShare,
  className,
}) => {
  const [shareUrl, setShareUrl] = React.useState<string | null>(null);
  const [copied, setCopied] = React.useState(false);
  const [open, setOpen] = React.useState(false);

  const resolvedBaseUrl = baseUrl ?? (typeof window !== 'undefined' ? window.location.origin : '');

  const handleGenerateLink = React.useCallback(() => {
    const token = generateToken();
    const url = buildShareUrl(resolvedBaseUrl, objectName, viewId, token);
    setShareUrl(url);
    setCopied(false);
    onShare?.(url);
  }, [resolvedBaseUrl, objectName, viewId, onShare]);

  const handleCopy = React.useCallback(async () => {
    if (!shareUrl) return;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for environments without clipboard API
      const textarea = document.createElement('textarea');
      textarea.value = shareUrl;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [shareUrl]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className={cn('gap-2', className)}>
          <Share2 className="h-4 w-4" />
          Share
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96 space-y-4" align="end">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium">Share View</h4>
            <Badge variant="secondary" className="text-xs">
              Read-only
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground">
            Generate a public link to share this view. Recipients can view data without logging in.
          </p>
        </div>

        {!shareUrl ? (
          <Button onClick={handleGenerateLink} className="w-full gap-2" size="sm">
            <Share2 className="h-4 w-4" />
            Generate Link
          </Button>
        ) : (
          <div className="flex items-center gap-2">
            <Input
              value={shareUrl}
              readOnly
              className="h-8 text-xs"
              onClick={(e) => (e.target as HTMLInputElement).select()}
            />
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopy}
              className="shrink-0 gap-1"
            >
              {copied ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
};
