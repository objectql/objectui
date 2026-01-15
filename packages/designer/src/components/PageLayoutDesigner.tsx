import React, { useEffect } from 'react';
import { DesignerProvider } from '../context/DesignerContext';
import { Canvas } from './Canvas';
import { PropertyPanel } from './PropertyPanel';
import { useDesigner } from '../context/DesignerContext';
import type { SchemaNode } from '@object-ui/core';
import { PageLayoutComponentPalette } from './PageLayoutComponentPalette';
import { PageLayoutToolbar } from './PageLayoutToolbar';

interface PageLayoutDesignerProps {
  initialSchema?: SchemaNode;
  onSchemaChange?: (schema: SchemaNode) => void;
}

/**
 * PageLayoutDesigner Content Component
 * Handles keyboard shortcuts and layout for page layout designer
 */
export const PageLayoutDesignerContent: React.FC = () => {
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
      <PageLayoutToolbar />
      
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Page Layout Component Palette */}
        <div className="w-64 md:w-72 flex-shrink-0 z-10 shadow-[1px_0_5px_rgba(0,0,0,0.03)] h-full">
          <PageLayoutComponentPalette className="h-full border-r-0" />
        </div>
        
        {/* Main Canvas Area */}
        <div className="flex-1 relative bg-gray-100 z-0 min-w-0">
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

/**
 * PageLayoutDesigner Component
 * A specialized designer focused on creating page layouts with sections, headers, footers, and grids
 * 
 * @example
 * ```tsx
 * import { PageLayoutDesigner } from '@object-ui/designer';
 * 
 * function App() {
 *   const [schema, setSchema] = useState({
 *     type: 'div',
 *     className: 'min-h-screen',
 *     body: []
 *   });
 *   
 *   return (
 *     <PageLayoutDesigner 
 *       initialSchema={schema} 
 *       onSchemaChange={setSchema}
 *     />
 *   );
 * }
 * ```
 */
export const PageLayoutDesigner: React.FC<PageLayoutDesignerProps> = ({ initialSchema, onSchemaChange }) => {
  // Default page layout schema if none provided
  const defaultSchema: SchemaNode = initialSchema || {
    type: 'div',
    id: 'page-root',
    className: 'min-h-screen bg-white',
    body: []
  };

  return (
    <DesignerProvider initialSchema={defaultSchema} onSchemaChange={onSchemaChange}>
      <PageLayoutDesignerContent />
    </DesignerProvider>
  );
};
