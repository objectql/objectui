// Main Designer Component (General Purpose)
export { Designer, DesignerContent } from './components/Designer';

// Specialized Designers
export { FormDesigner, FormDesignerContent } from './components/FormDesigner';
export { PageLayoutDesigner, PageLayoutDesignerContent } from './components/PageLayoutDesigner';

// Context and Hooks
export { DesignerProvider, useDesigner } from './context/DesignerContext';
export type { DesignerContextValue, ViewportMode, ResizingState } from './context/DesignerContext';

// Individual Components (for custom layouts)
export { Canvas } from './components/Canvas';
export { ComponentPalette } from './components/ComponentPalette';
export { FormComponentPalette } from './components/FormComponentPalette';
export { PageLayoutComponentPalette } from './components/PageLayoutComponentPalette';
export { PropertyPanel } from './components/PropertyPanel';
export { Toolbar } from './components/Toolbar';
export { FormToolbar } from './components/FormToolbar';
export { PageLayoutToolbar } from './components/PageLayoutToolbar';
export { ComponentTree } from './components/ComponentTree';
export { ContextMenu } from './components/ContextMenu';
export { LeftSidebar } from './components/LeftSidebar';
export { ResizeHandle, ResizeHandles } from './components/ResizeHandle';
export type { ResizeDirection } from './components/ResizeHandle';
export { KeyboardShortcutsHelp } from './components/KeyboardShortcutsHelp';

export const name = '@object-ui/designer';
export const version = '0.1.0';
