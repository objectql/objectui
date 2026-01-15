import React, { useState } from 'react';
import { useDesigner } from '../context/DesignerContext';
import { 
  Undo, 
  Redo, 
  Download, 
  Upload,
  Monitor,
  Tablet,
  Smartphone,
  Save,
  Layout,
  Copy,
  Check,
  Ruler,
  Palette
} from 'lucide-react';
import { cn } from '@object-ui/components';

interface PageLayoutToolbarProps {
  className?: string;
}

type ViewportSize = 'desktop' | 'tablet' | 'mobile';

/**
 * PageLayoutToolbar Component
 * Toolbar specifically designed for page layout designer with responsive preview controls
 */
export const PageLayoutToolbar: React.FC<PageLayoutToolbarProps> = ({ className }) => {
  const { undo, redo, canUndo, canRedo, schema, viewportMode, setViewportMode } = useDesigner();
  const [copied, setCopied] = useState(false);
  const [showGrid, setShowGrid] = useState(false);

  const handleExportJSON = () => {
    const json = JSON.stringify(schema, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'page-layout-schema.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportJSON = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const json = JSON.parse(e.target?.result as string);
            // TODO: Validate and load schema
            console.log('Imported schema:', json);
          } catch (err) {
            console.error('Failed to parse JSON:', err);
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const handleCopyJSON = () => {
    const json = JSON.stringify(schema, null, 2);
    navigator.clipboard.writeText(json);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={cn(
      "flex items-center justify-between px-4 py-2 border-b border-gray-200 bg-white shadow-sm",
      className
    )}>
      {/* Left Section - Title */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg">
          <Layout className="w-4 h-4 text-blue-600" />
          <span className="text-sm font-semibold text-gray-900">Page Layout Designer</span>
        </div>
      </div>

      {/* Center Section - Viewport Controls */}
      <div className="flex items-center gap-2">
        {/* Undo/Redo */}
        <div className="flex items-center gap-1 px-2 py-1 bg-gray-50 rounded-lg mr-4">
          <button
            onClick={undo}
            disabled={!canUndo}
            className={cn(
              "p-1.5 rounded hover:bg-white transition-colors",
              canUndo ? "text-gray-700 hover:text-blue-600" : "text-gray-300 cursor-not-allowed"
            )}
            title="Undo (Ctrl+Z)"
          >
            <Undo className="w-4 h-4" />
          </button>
          <button
            onClick={redo}
            disabled={!canRedo}
            className={cn(
              "p-1.5 rounded hover:bg-white transition-colors",
              canRedo ? "text-gray-700 hover:text-blue-600" : "text-gray-300 cursor-not-allowed"
            )}
            title="Redo (Ctrl+Y)"
          >
            <Redo className="w-4 h-4" />
          </button>
        </div>

        {/* Viewport Size Toggle */}
        <div className="flex items-center gap-1 px-2 py-1 bg-gray-50 rounded-lg">
          <button
            onClick={() => setViewportMode('desktop')}
            className={cn(
              "p-2 rounded transition-colors",
              viewportMode === 'desktop' 
                ? "bg-blue-100 text-blue-700" 
                : "text-gray-600 hover:bg-white hover:text-blue-600"
            )}
            title="Desktop View (1024px)"
          >
            <Monitor className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewportMode('tablet')}
            className={cn(
              "p-2 rounded transition-colors",
              viewportMode === 'tablet' 
                ? "bg-blue-100 text-blue-700" 
                : "text-gray-600 hover:bg-white hover:text-blue-600"
            )}
            title="Tablet View (768px)"
          >
            <Tablet className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewportMode('mobile')}
            className={cn(
              "p-2 rounded transition-colors",
              viewportMode === 'mobile' 
                ? "bg-blue-100 text-blue-700" 
                : "text-gray-600 hover:bg-white hover:text-blue-600"
            )}
            title="Mobile View (375px)"
          >
            <Smartphone className="w-4 h-4" />
          </button>
        </div>

        {/* Grid Toggle */}
        <button
          onClick={() => setShowGrid(!showGrid)}
          className={cn(
            "flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors",
            showGrid 
              ? "bg-blue-100 text-blue-700 hover:bg-blue-200" 
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          )}
          title="Toggle grid overlay"
        >
          <Ruler className="w-4 h-4" />
          <span className="hidden md:inline">Grid</span>
        </button>
      </div>

      {/* Right Section - Export/Import */}
      <div className="flex items-center gap-2">
        <button
          onClick={handleCopyJSON}
          className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors"
          title="Copy JSON to clipboard"
        >
          {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
          <span className="hidden md:inline">{copied ? 'Copied!' : 'Copy'}</span>
        </button>

        <button
          onClick={handleImportJSON}
          className="p-2 hover:bg-gray-100 rounded-lg text-gray-700 transition-colors"
          title="Import JSON"
        >
          <Upload className="w-4 h-4" />
        </button>

        <button
          onClick={handleExportJSON}
          className="p-2 hover:bg-gray-100 rounded-lg text-gray-700 transition-colors"
          title="Export JSON"
        >
          <Download className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
