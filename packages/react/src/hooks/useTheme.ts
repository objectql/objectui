/**
 * ObjectUI
 * Copyright (c) 2024-present ObjectStack Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { createContext, useContext } from 'react';
import type { Theme, ThemeMode } from '@object-ui/types';

/**
 * Theme context value for component-level theme access.
 */
export interface ThemeContextValue {
  /** Current active theme */
  theme: Theme | null;
  /** Current theme mode */
  mode: ThemeMode;
  /** Set the theme mode */
  setMode: (mode: ThemeMode) => void;
  /** Set a new theme */
  setTheme: (theme: Theme) => void;
  /** Get a resolved CSS variable value */
  getCssVar: (name: string) => string;
}

const defaultThemeContext: ThemeContextValue = {
  theme: null,
  mode: 'auto',
  setMode: () => {},
  setTheme: () => {},
  getCssVar: (name: string) => {
    if (typeof document !== 'undefined') {
      return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    }
    return '';
  },
};

export const ThemeContext = createContext<ThemeContextValue>(defaultThemeContext);

ThemeContext.displayName = 'ThemeContext';

/**
 * Hook for component-level theme access.
 *
 * Provides the current theme, mode, and utility functions
 * for reading and modifying theme state.
 *
 * @example
 * ```tsx
 * const { theme, mode, setMode, getCssVar } = useTheme();
 * const primaryColor = getCssVar('--primary');
 * ```
 */
export function useTheme(): ThemeContextValue {
  return useContext(ThemeContext);
}
