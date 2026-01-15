/**
 * FormDesigner - Specialized designer for creating object forms
 * 
 * This component provides a focused interface for designing forms with:
 * - Form-specific components (inputs, selects, checkboxes, etc.)
 * - Validation rule editor
 * - Form layout options
 * - Field property configuration
 */

import React, { useEffect } from 'react';
import { DesignerProvider } from '../context/DesignerContext';
import { Canvas } from './Canvas';
import { PropertyPanel } from './PropertyPanel';
import { FilteredComponentPalette } from './FilteredComponentPalette';
import { ComponentTree } from './ComponentTree';
import { useDesigner } from '../context/DesignerContext';
import type { SchemaNode } from '@object-ui/core';
import type { FormDesignerConfig } from '../types/designer-modes';

interface FormDesignerProps {
  initialSchema?: SchemaNode;
  onSchemaChange?: (schema: SchemaNode) => void;
  config?: Partial<FormDesignerConfig>;
}

// Form-specific component categories
const FORM_CATEGORIES = {
  'Form Fields': ['input', 'textarea', 'select', 'checkbox', 'switch', 'label'],
  'Form Actions': ['button'],
  'Form Layout': ['card', 'stack', 'grid', 'separator'],
  'Data Display': ['text', 'badge']
};

// Allowed components for form designer
const FORM_COMPONENTS = [
  // Form fields
  'input', 'textarea', 'select', 'checkbox', 'switch', 'label',
  // Actions
  'button',
  // Layout
  'div', 'card', 'stack', 'grid', 'separator',
  // Display
  'text', 'span', 'badge'
];

export const FormDesignerContent: React.FC = () => {
  const { 
    undo, 
    redo, 
    copyNode,
    cutNode,
    duplicateNode,
    pasteNode, 
    removeNode, 
    selectedNodeId, 
    canUndo, 
    canRedo
  } = useDesigner();
  
  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check if we're in an editable element
      const target = e.target as HTMLElement;
      const isEditing = 
        target.tagName === 'INPUT' || 
        target.tagName === 'TEXTAREA' || 
        target.tagName === 'SELECT' ||
        target.isContentEditable;

      // Undo: Ctrl+Z / Cmd+Z
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey && canUndo) {
        e.preventDefault();
        undo();
      }
      // Redo: Ctrl+Y / Cmd+Shift+Z
      else if (((e.ctrlKey || e.metaKey) && e.key === 'y') || ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'z')) {
        if (canRedo) {
          e.preventDefault();
          redo();
        }
      }
      // Copy: Ctrl+C / Cmd+C (only when not editing)
      else if ((e.ctrlKey || e.metaKey) && e.key === 'c' && !isEditing && selectedNodeId) {
        e.preventDefault();
        copyNode(selectedNodeId);
      }
      // Cut: Ctrl+X / Cmd+X (only when not editing)
      else if ((e.ctrlKey || e.metaKey) && e.key === 'x' && !isEditing && selectedNodeId) {
        e.preventDefault();
        cutNode(selectedNodeId);
      }
      // Paste: Ctrl+V / Cmd+V (only when not editing)
      else if ((e.ctrlKey || e.metaKey) && e.key === 'v' && !isEditing) {
        e.preventDefault();
        pasteNode(selectedNodeId);
      }
      // Duplicate: Ctrl+D / Cmd+D (only when not editing)
      else if ((e.ctrlKey || e.metaKey) && e.key === 'd' && !isEditing && selectedNodeId) {
        e.preventDefault();
        duplicateNode(selectedNodeId);
      }
      // Delete: Delete / Backspace (only when not editing)
      else if ((e.key === 'Delete' || e.key === 'Backspace') && !isEditing && selectedNodeId) {
        e.preventDefault();
        removeNode(selectedNodeId);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo, copyNode, cutNode, duplicateNode, pasteNode, removeNode, selectedNodeId, canUndo, canRedo]);

  return (
    <div className="h-full flex flex-col bg-white text-gray-900 font-sans">
      {/* Header */}
      <div className="h-12 border-b border-gray-200 bg-gradient-to-r from-emerald-50 to-teal-50 flex items-center px-4">
        <h1 className="text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600">
          Form Designer
        </h1>
        <div className="ml-4 text-xs text-gray-500">
          Design forms with validation and field layouts
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Form Fields & Component Tree */}
        <div className="w-64 md:w-72 flex-shrink-0 z-10 shadow-[1px_0_5px_rgba(0,0,0,0.03)] h-full flex flex-col border-r border-gray-200">
          {/* Component Palette */}
          <div className="flex-1 min-h-0 overflow-hidden">
            <FilteredComponentPalette 
              className="h-full"
              allowedComponents={FORM_COMPONENTS}
              categories={FORM_CATEGORIES}
              title="Form Components"
            />
          </div>
          
          {/* Component Tree */}
          <div className="h-64 border-t border-gray-200 overflow-hidden">
            <ComponentTree className="h-full" />
          </div>
        </div>
        
        {/* Main Canvas Area */}
        <div className="flex-1 relative bg-gradient-to-br from-gray-50 to-gray-100 z-0 min-w-0">
           <Canvas className="h-full w-full" />
        </div>
        
        {/* Right Sidebar - Property Panel */}
        <div className="w-72 md:w-80 flex-shrink-0 z-10 shadow-[-1px_0_5px_rgba(0,0,0,0.03)] h-full">
           <PropertyPanel className="h-full border-l-0 shadow-none border-l custom-scrollbar" />
        </div>
      </div>
    </div>
  );
};

export const FormDesigner: React.FC<FormDesignerProps> = ({ 
  initialSchema, 
  onSchemaChange,
  config 
}) => {
  // Default initial schema for forms
  const defaultFormSchema: SchemaNode = {
    type: 'div',
    className: 'w-full max-w-2xl mx-auto p-8',
    id: 'form-root',
    body: [
      {
        type: 'card',
        title: 'New Form',
        className: 'w-full',
        body: []
      }
    ]
  };

  return (
    <DesignerProvider 
      initialSchema={initialSchema || defaultFormSchema} 
      onSchemaChange={onSchemaChange}
    >
      <FormDesignerContent />
    </DesignerProvider>
  );
};
