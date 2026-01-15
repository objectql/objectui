/**
 * Server-side Design Storage
 * 
 * This module provides centralized storage for designs on the server.
 * Currently uses in-memory storage for simplicity.
 * 
 * TODO: Replace with persistent storage (e.g., Vercel KV, database)
 */

import type { Design } from './designStorage';

// In-memory storage maps (shared across all API routes)
const designs = new Map<string, Design>();
const sharedDesigns = new Map<string, Design>();

export const serverStorage = {
  // Design operations
  getAllDesigns(): Design[] {
    return Array.from(designs.values());
  },

  getDesign(id: string): Design | null {
    return designs.get(id) || null;
  },

  createDesign(design: Design): Design {
    designs.set(design.id, design);
    return design;
  },

  updateDesign(id: string, updates: Partial<Design>): Design | null {
    const existing = designs.get(id);
    if (!existing) return null;

    const updated = {
      ...existing,
      ...updates,
      id: existing.id, // Preserve ID
      createdAt: existing.createdAt, // Preserve creation date
      updatedAt: new Date().toISOString(),
    };

    designs.set(id, updated);
    return updated;
  },

  deleteDesign(id: string): boolean {
    return designs.delete(id);
  },

  // Shared design operations
  shareDesign(id: string, shareId: string): boolean {
    const design = designs.get(id);
    if (!design) return false;

    sharedDesigns.set(shareId, design);
    return true;
  },

  getSharedDesign(shareId: string): Design | null {
    return sharedDesigns.get(shareId) || null;
  },

  // Utility
  clearAll(): void {
    designs.clear();
    sharedDesigns.clear();
  },
};
