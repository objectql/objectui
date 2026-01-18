/**
 * ObjectUI
 * Copyright (c) 2024-present ObjectStack Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import { DesignerProvider } from '../context/DesignerContext';
import { LeftSidebar } from './LeftSidebar';
import { Canvas } from './Canvas';
import { PropertyPanel } from './PropertyPanel';
import { useDesigner } from '../context/DesignerContext';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';
import type { SchemaNode } from '@object-ui/core';

interface GeneralDesignerProps {
  initialSchema?: SchemaNode;
  onSchemaChange?: (schema: SchemaNode) => void;
}


export const GeneralDesignerContent: React.FC = () => {
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
  
  // Use shared keyboard shortcuts hook
  useKeyboardShortcuts({
    undo,
    redo,
    copyNode,
    cutNode,
    duplicateNode,
    pasteNode,
    removeNode,
    selectedNodeId,
    canUndo,
    canRedo,
  });

  return (
    <div className="h-full flex flex-col bg-white text-gray-900 font-sans">
      {/* Header */}
      <div className="h-12 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-pink-50 flex items-center px-4">
        <h1 className="text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
          General Designer
        </h1>
        <div className="ml-4 text-xs text-gray-500">
          Full-featured designer for any UI component
        </div>
      </div>
      
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Combined Component Palette and Tree */}
        {/* Responsive: w-72 on desktop, w-64 on tablet (md:), hidden on mobile with toggle option */}
        <div className="w-64 md:w-72 flex-shrink-0 z-10 shadow-[1px_0_5px_rgba(0,0,0,0.03)] h-full">
           <LeftSidebar className="h-full border-r-0" />
        </div>
        
        {/* Main Canvas Area */}
        <div className="flex-1 relative bg-gray-100 z-0 min-w-0">
           <Canvas className="h-full w-full" />
        </div>
        
        {/* Right Sidebar - Property Panel */}
        {/* Responsive: w-80 on desktop, w-72 on tablet (md:), can be toggled on small tablets */}
        <div className="w-72 md:w-80 flex-shrink-0 z-10 shadow-[-1px_0_5px_rgba(0,0,0,0.03)] h-full">
           <PropertyPanel className="h-full border-l-0 shadow-none border-l custom-scrollbar" />
        </div>
      </div>
    </div>
  );
};

export const GeneralDesigner: React.FC<GeneralDesignerProps> = ({ initialSchema, onSchemaChange }) => {
  return (
    <DesignerProvider initialSchema={initialSchema} onSchemaChange={onSchemaChange}>
      <GeneralDesignerContent />
    </DesignerProvider>
  );
};
