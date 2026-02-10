/**
 * KeyboardShortcutsDialog
 *
 * A dialog listing all available keyboard shortcuts, triggered by pressing "?".
 * @module
 */

import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@object-ui/components';

interface ShortcutEntry {
  keys: string[];
  description: string;
}

interface ShortcutGroup {
  title: string;
  shortcuts: ShortcutEntry[];
}

const shortcutGroups: ShortcutGroup[] = [
  {
    title: 'General',
    shortcuts: [
      { keys: ['⌘', 'K'], description: 'Open command palette' },
      { keys: ['?'], description: 'Show keyboard shortcuts' },
      { keys: ['Esc'], description: 'Close dialog / panel' },
    ],
  },
  {
    title: 'Navigation',
    shortcuts: [
      { keys: ['B'], description: 'Toggle sidebar' },
      { keys: ['⌘', '/'], description: 'Focus search' },
    ],
  },
  {
    title: 'Data Views',
    shortcuts: [
      { keys: ['N'], description: 'Create new record' },
      { keys: ['R'], description: 'Refresh data' },
      { keys: ['⌘', 'E'], description: 'Edit selected record' },
    ],
  },
  {
    title: 'Preferences',
    shortcuts: [
      { keys: ['⌘', 'D'], description: 'Toggle dark mode' },
    ],
  },
];

export function KeyboardShortcutsDialog() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      // Only trigger when not in an input/textarea/contenteditable
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        return;
      }

      if (e.key === '?' && !e.metaKey && !e.ctrlKey && !e.altKey) {
        e.preventDefault();
        setOpen(prev => !prev);
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-lg max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Keyboard Shortcuts</DialogTitle>
          <DialogDescription>
            Quick reference for all available keyboard shortcuts.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6 pt-2">
          {shortcutGroups.map(group => (
            <div key={group.title}>
              <h3 className="text-sm font-medium text-muted-foreground mb-3">
                {group.title}
              </h3>
              <div className="space-y-2">
                {group.shortcuts.map((shortcut, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between py-1.5"
                  >
                    <span className="text-sm">{shortcut.description}</span>
                    <div className="flex items-center gap-1">
                      {shortcut.keys.map((key, kidx) => (
                        <kbd
                          key={kidx}
                          className="inline-flex h-6 min-w-[24px] items-center justify-center rounded border bg-muted px-1.5 text-xs font-medium text-muted-foreground"
                        >
                          {key}
                        </kbd>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
