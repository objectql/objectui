/**
 * Custom hook for handling keyboard shortcuts in designer components
 */
import { useEffect } from 'react';

interface UseKeyboardShortcutsOptions {
  undo: () => void;
  redo: () => void;
  copyNode: (id: string) => void;
  cutNode: (id: string) => void;
  duplicateNode: (id: string) => void;
  pasteNode: (parentId: string | null) => void;
  removeNode: (id: string) => void;
  selectedNodeId: string | null;
  canUndo: boolean;
  canRedo: boolean;
}

/**
 * Hook that sets up keyboard shortcuts for designer operations
 * Handles Undo/Redo, Copy/Cut/Paste, Duplicate, and Delete
 */
export const useKeyboardShortcuts = ({
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
}: UseKeyboardShortcutsOptions) => {
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
};
