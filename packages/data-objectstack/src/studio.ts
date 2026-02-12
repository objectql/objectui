/**
 * ObjectUI
 * Copyright (c) 2024-present ObjectStack Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Studio module integration for @objectstack/spec v3.0.0
 * Provides visual designer schema improvements: canvas, property editors, theme builder.
 */

export interface StudioCanvasConfig {
  /** Canvas width */
  width: number;
  /** Canvas height */
  height: number;
  /** Background type */
  background: 'grid' | 'dots' | 'lines' | 'none';
  /** Grid size in pixels */
  gridSize: number;
  /** Snap to grid */
  snapToGrid: boolean;
  /** Zoom range */
  zoom: {
    min: number;
    max: number;
    step: number;
    current: number;
  };
  /** Pan offset */
  panOffset: { x: number; y: number };
  /** Show minimap */
  showMinimap: boolean;
  /** Minimap position */
  minimapPosition: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}

export interface StudioPropertyEditor {
  /** Property name */
  name: string;
  /** Display label */
  label: string;
  /** Editor type */
  type: 'text' | 'number' | 'boolean' | 'select' | 'color' | 'code' | 'expression';
  /** Default value */
  defaultValue?: unknown;
  /** Options for select type */
  options?: Array<{ label: string; value: string }>;
  /** Group/category */
  group?: string;
  /** Description */
  description?: string;
  /** Whether the property supports live preview */
  livePreview?: boolean;
}

export interface StudioThemeBuilderConfig {
  /** Available color palettes */
  palettes: StudioColorPalette[];
  /** Typography presets */
  typography: StudioTypographyPreset[];
  /** Spacing scale */
  spacing: number[];
  /** Border radius options */
  borderRadius: number[];
  /** Shadow presets */
  shadows: StudioShadowPreset[];
}

export interface StudioColorPalette {
  name: string;
  colors: Record<string, string>;
}

export interface StudioTypographyPreset {
  name: string;
  fontFamily: string;
  fontSize: Record<string, string>;
  fontWeight: Record<string, number>;
  lineHeight: Record<string, string>;
}

export interface StudioShadowPreset {
  name: string;
  value: string;
}

/**
 * Default canvas configuration for designers.
 */
export function createDefaultCanvasConfig(overrides?: Partial<StudioCanvasConfig>): StudioCanvasConfig {
  return {
    width: 1200,
    height: 800,
    background: 'grid',
    gridSize: 8,
    snapToGrid: true,
    zoom: {
      min: 0.25,
      max: 3,
      step: 0.1,
      current: 1,
    },
    panOffset: { x: 0, y: 0 },
    showMinimap: false,
    minimapPosition: 'bottom-right',
    ...overrides,
  };
}

/**
 * Snap a position to the grid.
 */
export function snapToGrid(x: number, y: number, gridSize: number): { x: number; y: number } {
  return {
    x: Math.round(x / gridSize) * gridSize,
    y: Math.round(y / gridSize) * gridSize,
  };
}

/**
 * Calculate auto-layout positions for a set of items.
 * Uses a simple grid-based layout algorithm.
 */
export function calculateAutoLayout(
  items: Array<{ id: string; width: number; height: number }>,
  canvasWidth: number,
  padding: number = 40,
  gap: number = 40,
): Array<{ id: string; x: number; y: number }> {
  const positions: Array<{ id: string; x: number; y: number }> = [];
  let currentX = padding;
  let currentY = padding;
  let rowMaxHeight = 0;

  for (const item of items) {
    // Wrap to next row if exceeds canvas width
    if (currentX + item.width + padding > canvasWidth) {
      currentX = padding;
      currentY += rowMaxHeight + gap;
      rowMaxHeight = 0;
    }

    positions.push({ id: item.id, x: currentX, y: currentY });
    currentX += item.width + gap;
    rowMaxHeight = Math.max(rowMaxHeight, item.height);
  }

  return positions;
}
