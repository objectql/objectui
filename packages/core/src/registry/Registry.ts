/**
 * ObjectUI
 * Copyright (c) 2024-present ObjectStack Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { SchemaNode } from '../types';

export type ComponentRenderer<T = any> = T;

export type ComponentInput = {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'enum' | 'array' | 'object' | 'color' | 'date' | 'code' | 'file' | 'slot';
  label?: string;
  defaultValue?: any;
  required?: boolean;
  enum?: string[] | { label: string; value: any }[];
  description?: string;
  advanced?: boolean;
  inputType?: string;
};

export type ComponentMeta = {
  label?: string; // Display name in designer
  icon?: string; // Icon name or svg string
  category?: string; // Grouping category
  namespace?: string; // Component namespace (e.g., 'ui', 'field', 'plugin-grid')
  inputs?: ComponentInput[];
  defaultProps?: Record<string, any>; // Default props when dropped
  defaultChildren?: SchemaNode[]; // Default children when dropped
  examples?: Record<string, any>; // Example configurations
  isContainer?: boolean; // Whether the component can have children
  resizable?: boolean; // Whether the component can be resized in the designer
  resizeConstraints?: {
    width?: boolean;
    height?: boolean;
    minWidth?: number;
    maxWidth?: number;
    minHeight?: number;
    maxHeight?: number;
  };
};

export type ComponentConfig<T = any> = ComponentMeta & {
  type: string;
  component: ComponentRenderer<T>;
};

export class Registry<T = any> {
  private components = new Map<string, ComponentConfig<T>>();

  register(type: string, component: ComponentRenderer<T>, meta?: ComponentMeta) {
    // Construct the full type with namespace if provided
    const namespace = meta?.namespace;
    const fullType = namespace ? `${namespace}:${type}` : type;
    
    // Warn if overwriting an existing registration
    if (this.components.has(fullType)) {
      // console.warn(`Component type "${fullType}" is already registered. Overwriting.`);
    }

    // Deprecation warning for non-namespaced registrations
    // (only for new registrations, not for backward compatibility lookups)
    if (!namespace && typeof console !== 'undefined' && console.warn) {
      console.warn(
        `[ObjectUI] Registering component "${type}" without a namespace is deprecated. ` +
        `Please provide a namespace via the meta.namespace option. ` +
        `Example: ComponentRegistry.register('${type}', component, { namespace: 'ui' })`
      );
    }
    
    this.components.set(fullType, {
      type: fullType,
      component,
      ...meta
    });
  }

  get(type: string, namespace?: string): ComponentRenderer<T> | undefined {
    // First try with namespace if provided
    if (namespace) {
      const namespacedType = `${namespace}:${type}`;
      const component = this.components.get(namespacedType)?.component;
      if (component) {
        return component;
      }
    }
    
    // Fallback to non-namespaced lookup for backward compatibility
    return this.components.get(type)?.component;
  }

  getConfig(type: string, namespace?: string): ComponentConfig<T> | undefined {
    // First try with namespace if provided
    if (namespace) {
      const namespacedType = `${namespace}:${type}`;
      const config = this.components.get(namespacedType);
      if (config) {
        return config;
      }
    }
    
    // Fallback to non-namespaced lookup for backward compatibility
    return this.components.get(type);
  }

  has(type: string, namespace?: string): boolean {
    // First try with namespace if provided
    if (namespace) {
      const namespacedType = `${namespace}:${type}`;
      if (this.components.has(namespacedType)) {
        return true;
      }
    }
    
    // Fallback to non-namespaced lookup for backward compatibility
    return this.components.has(type);
  }
  
  getAllTypes(): string[] {
    return Array.from(this.components.keys());
  }

  getAllConfigs(): ComponentConfig<T>[] {
    return Array.from(this.components.values());
  }
}

export const ComponentRegistry = new Registry<any>();
