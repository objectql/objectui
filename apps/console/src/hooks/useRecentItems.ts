/**
 * useRecentItems
 *
 * Tracks recently visited items (objects, dashboards, pages) with
 * localStorage persistence. Exposes helpers to add and retrieve items.
 * @module
 */

import { useState, useCallback, useEffect } from 'react';

export interface RecentItem {
  /** Unique key, e.g. "object:contact" or "dashboard:sales_overview" */
  id: string;
  label: string;
  href: string;
  type: 'object' | 'dashboard' | 'page' | 'report' | 'record';
  /** ISO timestamp of last visit */
  visitedAt: string;
}

const STORAGE_KEY = 'objectui-recent-items';
const MAX_RECENT = 8;

function loadRecent(): RecentItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveRecent(items: RecentItem[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // Storage full — silently ignore
  }
}

export function useRecentItems() {
  const [recentItems, setRecentItems] = useState<RecentItem[]>(loadRecent);

  // Sync from storage on mount
  useEffect(() => {
    setRecentItems(loadRecent());
  }, []);

  const addRecentItem = useCallback(
    (item: Omit<RecentItem, 'visitedAt'>) => {
      setRecentItems(prev => {
        const filtered = prev.filter(r => r.id !== item.id);
        const updated = [
          { ...item, visitedAt: new Date().toISOString() },
          ...filtered,
        ].slice(0, MAX_RECENT);
        saveRecent(updated);
        return updated;
      });
    },
    [],
  );

  const clearRecentItems = useCallback(() => {
    setRecentItems([]);
    saveRecent([]);
  }, []);

  return { recentItems, addRecentItem, clearRecentItems };
}
