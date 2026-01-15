/**
 * LayoutDesigner - Specialized designer for creating page layouts
 * 
 * This component provides a focused interface for designing page layouts with:
 * - Layout-specific components (grid, containers, cards)
 * - Responsive breakpoint controls
 * - Layout templates
 * - Spacing and alignment helpers
 */

import React, { useEffect } from 'react';
import { DesignerProvider } from '../context/DesignerContext';
import { Canvas } from './Canvas';
import { PropertyPanel } from './PropertyPanel';
import { FilteredComponentPalette } from './FilteredComponentPalette';
import { ComponentTree } from './ComponentTree';
import { useDesigner } from '../context/DesignerContext';
import type { SchemaNode } from '@object-ui/core';
import type { LayoutDesignerConfig } from '../types/designer-modes';

interface LayoutDesignerProps {
  initialSchema?: SchemaNode;
  onSchemaChange?: (schema: SchemaNode) => void;
  config?: Partial<LayoutDesignerConfig>;
}

// Layout-specific component categories
const LAYOUT_CATEGORIES = {
  'Containers': ['div', 'card', 'grid'],
  'Layout': ['stack', 'separator'],
  'Navigation': ['tabs', 'breadcrumb', 'menubar'],
  'Content': ['text', 'span', 'image', 'button'],
  'Data Display': ['table', 'badge', 'avatar']
};

// Allowed components for layout designer
const LAYOUT_COMPONENTS = [
  // Containers
  'div', 'card', 'grid',
  // Layout
  'stack', 'separator',
  // Navigation
  'tabs', 'breadcrumb', 'menubar', 'pagination',
  // Content
  'text', 'span', 'image', 'button',
  // Data display
  'table', 'badge', 'avatar'
];

export const LayoutDesignerContent: React.FC = () => {
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
      <div className="h-12 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50 flex items-center px-4">
        <h1 className="text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
          Page Layout Designer
        </h1>
        <div className="ml-4 text-xs text-gray-500">
          Design responsive page layouts and structures
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Layout Components & Component Tree */}
        <div className="w-64 md:w-72 flex-shrink-0 z-10 shadow-[1px_0_5px_rgba(0,0,0,0.03)] h-full flex flex-col border-r border-gray-200">
          {/* Component Palette */}
          <div className="flex-1 min-h-0 overflow-hidden">
            <FilteredComponentPalette 
              className="h-full"
              allowedComponents={LAYOUT_COMPONENTS}
              categories={LAYOUT_CATEGORIES}
              title="Layout Components"
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

export const LayoutDesigner: React.FC<LayoutDesignerProps> = ({ 
  initialSchema, 
  onSchemaChange,
  config 
}) => {
  // Default initial schema for page layouts
  const defaultLayoutSchema: SchemaNode = {
    type: 'div',
    className: 'h-full w-full flex flex-col',
    id: 'layout-root',
    body: []
  };

  return (
    <DesignerProvider 
      initialSchema={initialSchema || defaultLayoutSchema} 
      onSchemaChange={onSchemaChange}
    >
      <LayoutDesignerContent />
    </DesignerProvider>
  );
};
