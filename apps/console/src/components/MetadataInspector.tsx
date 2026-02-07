/**
 * MetadataInspector
 *
 * Shared debug panel that shows raw JSON metadata for any view.
 * Used across ObjectView, DashboardView, PageView, ReportView, and RecordDetailView.
 */

import { useState } from 'react';
import { Button } from '@object-ui/components';
import { Code2 } from 'lucide-react';

interface MetadataSection {
  title: string;
  data: any;
}

interface MetadataInspectorProps {
  /** Sections of metadata to display */
  sections: MetadataSection[];
  /** Whether the panel is open */
  open: boolean;
  /** Toggle callback */
  onToggle: () => void;
}

/**
 * Toggle button for the metadata inspector.
 * Place this in your header/toolbar area.
 */
export function MetadataToggle({ open, onToggle, className }: { open: boolean; onToggle: () => void; className?: string }) {
  return (
    <Button
      size="sm"
      variant={open ? 'secondary' : 'outline'}
      onClick={onToggle}
      className={`shadow-none gap-2 ${className || ''}`}
      title="Toggle Metadata Inspector"
    >
      <Code2 className="h-4 w-4" />
      <span className="hidden lg:inline">Metadata</span>
    </Button>
  );
}

/**
 * The side panel that renders JSON metadata sections.
 */
export function MetadataPanel({ sections, open }: Omit<MetadataInspectorProps, 'onToggle'>) {
  if (!open) return null;

  return (
    <div className="w-100 border-l bg-muted/30 p-0 overflow-hidden flex flex-col shrink-0 shadow-xl z-20 transition-all">
      <div className="p-3 border-b bg-muted/50 font-semibold text-sm flex items-center justify-between">
        <span>Metadata Inspector</span>
        <span className="text-xs text-muted-foreground">JSON Protocol</span>
      </div>
      <div className="flex-1 overflow-auto p-4 space-y-6">
        {sections.map((section, index) => (
          <div key={index}>
            <h4 className="text-xs font-bold uppercase text-muted-foreground mb-2">
              {section.title}
            </h4>
            <div className="relative rounded-md border bg-slate-950 text-slate-50 overflow-hidden">
              <pre className="text-xs p-3 overflow-auto max-h-200">
                {JSON.stringify(section.data, null, 2)}
              </pre>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Hook to manage MetadataInspector open/close state.
 */
export function useMetadataInspector() {
  const [showDebug, setShowDebug] = useState(false);
  return {
    showDebug,
    toggleDebug: () => setShowDebug(prev => !prev),
  };
}
