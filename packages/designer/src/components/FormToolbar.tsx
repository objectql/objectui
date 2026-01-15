import React, { useState } from 'react';
import { useDesigner } from '../context/DesignerContext';
import { 
  Undo, 
  Redo, 
  Download, 
  Upload, 
  Play,
  Save,
  FileJson,
  Copy,
  Check,
  Eye,
  EyeOff,
  Settings
} from 'lucide-react';
import { cn } from '@object-ui/components';

interface FormToolbarProps {
  className?: string;
}

/**
 * FormToolbar Component
 * Toolbar specifically designed for form designer with form-specific actions
 */
export const FormToolbar: React.FC<FormToolbarProps> = ({ className }) => {
  const { undo, redo, canUndo, canRedo, schema } = useDesigner();
  const [copied, setCopied] = useState(false);
  const [showValidation, setShowValidation] = useState(true);

  const handleExportJSON = () => {
    const json = JSON.stringify(schema, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'form-schema.json';
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

  const handlePreviewForm = () => {
    // TODO: Open preview modal
    console.log('Preview form');
  };

  return (
    <div className={cn(
      "flex items-center justify-between px-4 py-2 border-b border-gray-200 bg-white shadow-sm",
      className
    )}>
      {/* Left Section - Title */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg">
          <FileJson className="w-4 h-4 text-indigo-600" />
          <span className="text-sm font-semibold text-gray-900">Form Designer</span>
        </div>
      </div>

      {/* Center Section - Actions */}
      <div className="flex items-center gap-2">
        {/* Undo/Redo */}
        <div className="flex items-center gap-1 px-2 py-1 bg-gray-50 rounded-lg">
          <button
            onClick={undo}
            disabled={!canUndo}
            className={cn(
              "p-1.5 rounded hover:bg-white transition-colors",
              canUndo ? "text-gray-700 hover:text-indigo-600" : "text-gray-300 cursor-not-allowed"
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
              canRedo ? "text-gray-700 hover:text-indigo-600" : "text-gray-300 cursor-not-allowed"
            )}
            title="Redo (Ctrl+Y)"
          >
            <Redo className="w-4 h-4" />
          </button>
        </div>

        {/* Validation Toggle */}
        <button
          onClick={() => setShowValidation(!showValidation)}
          className={cn(
            "flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors",
            showValidation 
              ? "bg-indigo-100 text-indigo-700 hover:bg-indigo-200" 
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          )}
          title="Toggle validation display"
        >
          {showValidation ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
          <span className="hidden md:inline">Validation</span>
        </button>

        {/* Preview */}
        <button
          onClick={handlePreviewForm}
          className="flex items-center gap-2 px-3 py-1.5 bg-green-100 text-green-700 hover:bg-green-200 rounded-lg text-sm font-medium transition-colors"
          title="Preview form"
        >
          <Play className="w-4 h-4" />
          <span className="hidden md:inline">Preview</span>
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
