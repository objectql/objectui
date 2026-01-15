/**
 * Designer mode types for specialized designers
 */

/**
 * Available designer modes
 * - 'form': Specialized form designer with validation and field management
 * - 'layout': Page layout designer with grid/flex helpers
 * - 'general': Full-featured general purpose designer
 */
export type DesignerMode = 'form' | 'layout' | 'general';

/**
 * Configuration for specialized designers
 */
export interface DesignerConfig {
  /**
   * Designer mode
   */
  mode: DesignerMode;
  
  /**
   * Allowed component types for this designer mode
   */
  allowedComponents?: string[];
  
  /**
   * Component categories to show in palette
   */
  categories?: string[];
  
  /**
   * Whether to show component tree
   * @default true
   */
  showComponentTree?: boolean;
  
  /**
   * Whether to show viewport controls
   * @default true
   */
  showViewportControls?: boolean;
  
  /**
   * Whether to show zoom controls
   * @default true
   */
  showZoomControls?: boolean;
  
  /**
   * Custom property panel fields
   */
  propertyFields?: string[];
}

/**
 * Form designer specific configuration
 */
export interface FormDesignerConfig extends DesignerConfig {
  mode: 'form';
  
  /**
   * Whether to show validation rules editor
   * @default true
   */
  showValidationRules?: boolean;
  
  /**
   * Whether to show form preview with data
   * @default true
   */
  showFormPreview?: boolean;
  
  /**
   * Available field types
   */
  fieldTypes?: string[];
}

/**
 * Layout designer specific configuration
 */
export interface LayoutDesignerConfig extends DesignerConfig {
  mode: 'layout';
  
  /**
   * Whether to show responsive breakpoint controls
   * @default true
   */
  showBreakpointControls?: boolean;
  
  /**
   * Whether to show layout templates
   * @default true
   */
  showLayoutTemplates?: boolean;
  
  /**
   * Available layout types
   */
  layoutTypes?: string[];
}
