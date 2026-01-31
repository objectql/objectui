/**
 * ObjectUI
 * Copyright (c) 2024-present ObjectStack Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { Registry } from '../Registry';

describe('Registry', () => {
  let registry: Registry;
  let consoleWarnSpy: any;

  beforeEach(() => {
    registry = new Registry();
    consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleWarnSpy.mockRestore();
  });

  describe('Basic Registration', () => {
    it('should register a component without namespace', () => {
      const component = () => 'test';
      registry.register('button', component);
      
      expect(registry.has('button')).toBe(true);
      expect(registry.get('button')).toBe(component);
    });

    it('should warn when registering without namespace', () => {
      const component = () => 'test';
      registry.register('button', component);
      
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        expect.stringContaining('Registering component "button" without a namespace is deprecated')
      );
    });

    it('should register a component with namespace', () => {
      const component = () => 'test';
      registry.register('button', component, { namespace: 'ui' });
      
      expect(registry.has('button', 'ui')).toBe(true);
      expect(registry.get('button', 'ui')).toBe(component);
    });

    it('should not warn when registering with namespace', () => {
      const component = () => 'test';
      registry.register('button', component, { namespace: 'ui' });
      
      expect(consoleWarnSpy).not.toHaveBeenCalled();
    });
  });

  describe('Namespaced Registration', () => {
    it('should register components with the same name in different namespaces', () => {
      const gridComponent1 = () => 'grid1';
      const gridComponent2 = () => 'grid2';
      
      registry.register('grid', gridComponent1, { namespace: 'plugin-grid' });
      registry.register('grid', gridComponent2, { namespace: 'plugin-aggrid' });
      
      expect(registry.get('grid', 'plugin-grid')).toBe(gridComponent1);
      expect(registry.get('grid', 'plugin-aggrid')).toBe(gridComponent2);
    });

    it('should store full type as namespace:type', () => {
      const component = () => 'test';
      registry.register('button', component, { namespace: 'ui' });
      
      const config = registry.getConfig('button', 'ui');
      expect(config?.type).toBe('ui:button');
    });

    it('should preserve namespace in component config', () => {
      const component = () => 'test';
      registry.register('button', component, { 
        namespace: 'ui',
        label: 'Button',
        category: 'form'
      });
      
      const config = registry.getConfig('button', 'ui');
      expect(config?.namespace).toBe('ui');
      expect(config?.label).toBe('Button');
      expect(config?.category).toBe('form');
    });
  });

  describe('Namespace Lookup with Fallback', () => {
    it('should fallback to non-namespaced component when namespace lookup fails', () => {
      const component = () => 'test';
      registry.register('button', component);
      
      // Should find it even when looking with a namespace
      expect(registry.get('button', 'ui')).toBe(component);
    });

    it('should prefer namespaced component over non-namespaced', () => {
      const component1 = () => 'non-namespaced';
      const component2 = () => 'namespaced';
      
      registry.register('button', component1);
      registry.register('button', component2, { namespace: 'ui' });
      
      // When searching with namespace, should get namespaced version
      expect(registry.get('button', 'ui')).toBe(component2);
      
      // When searching without namespace, should get non-namespaced version
      expect(registry.get('button')).toBe(component1);
    });

    it('should return undefined when component not found in any namespace', () => {
      expect(registry.get('nonexistent', 'ui')).toBeUndefined();
      expect(registry.get('nonexistent')).toBeUndefined();
    });
  });

  describe('has() method', () => {
    it('should check existence with namespace', () => {
      const component = () => 'test';
      registry.register('button', component, { namespace: 'ui' });
      
      expect(registry.has('button', 'ui')).toBe(true);
      expect(registry.has('button', 'other')).toBe(false);
    });

    it('should fallback to non-namespaced check', () => {
      const component = () => 'test';
      registry.register('button', component);
      
      expect(registry.has('button')).toBe(true);
      expect(registry.has('button', 'ui')).toBe(true); // fallback
    });
  });

  describe('getConfig() method', () => {
    it('should get config with namespace', () => {
      const component = () => 'test';
      registry.register('button', component, { 
        namespace: 'ui',
        label: 'Button' 
      });
      
      const config = registry.getConfig('button', 'ui');
      expect(config).toBeDefined();
      expect(config?.component).toBe(component);
      expect(config?.label).toBe('Button');
    });

    it('should fallback to non-namespaced config', () => {
      const component = () => 'test';
      registry.register('button', component, { label: 'Button' });
      
      const config = registry.getConfig('button', 'ui');
      expect(config).toBeDefined();
      expect(config?.component).toBe(component);
    });
  });

  describe('getAllTypes() and getAllConfigs()', () => {
    it('should return all registered types including namespaced ones', () => {
      registry.register('button', () => 'b1');
      registry.register('input', () => 'i1', { namespace: 'ui' });
      registry.register('grid', () => 'g1', { namespace: 'plugin-grid' });
      
      const types = registry.getAllTypes();
      expect(types).toContain('button');
      expect(types).toContain('ui:input');
      expect(types).toContain('plugin-grid:grid');
      expect(types).toHaveLength(3);
    });

    it('should return all configs', () => {
      registry.register('button', () => 'b1', { label: 'Button' });
      registry.register('input', () => 'i1', { 
        namespace: 'ui',
        label: 'Input' 
      });
      
      const configs = registry.getAllConfigs();
      expect(configs).toHaveLength(2);
      expect(configs.map(c => c.type)).toContain('button');
      expect(configs.map(c => c.type)).toContain('ui:input');
    });
  });

  describe('Conflict Prevention', () => {
    it('should allow same type name in different namespaces', () => {
      const grid1 = () => 'grid-plugin-1';
      const grid2 = () => 'grid-plugin-2';
      const grid3 = () => 'aggrid-plugin';
      
      registry.register('grid', grid1, { namespace: 'plugin-grid' });
      registry.register('grid', grid2, { namespace: 'plugin-view' });
      registry.register('grid', grid3, { namespace: 'plugin-aggrid' });
      
      expect(registry.get('grid', 'plugin-grid')).toBe(grid1);
      expect(registry.get('grid', 'plugin-view')).toBe(grid2);
      expect(registry.get('grid', 'plugin-aggrid')).toBe(grid3);
    });

    it('should handle complex namespace names', () => {
      const component = () => 'test';
      registry.register('table', component, { namespace: 'plugin-advanced-grid' });
      
      expect(registry.get('table', 'plugin-advanced-grid')).toBe(component);
      expect(registry.getConfig('table', 'plugin-advanced-grid')?.type).toBe('plugin-advanced-grid:table');
    });
  });

  describe('Backward Compatibility', () => {
    it('should maintain compatibility with existing non-namespaced code', () => {
      const component = () => 'test';
      
      // Old-style registration
      registry.register('button', component);
      
      // Old-style retrieval should still work
      expect(registry.get('button')).toBe(component);
      expect(registry.has('button')).toBe(true);
      expect(registry.getConfig('button')).toBeDefined();
    });

    it('should support mixed namespaced and non-namespaced registrations', () => {
      const oldButton = () => 'old';
      const newButton = () => 'new';
      
      registry.register('button-old', oldButton);
      registry.register('button-new', newButton, { namespace: 'ui' });
      
      expect(registry.get('button-old')).toBe(oldButton);
      expect(registry.get('button-new', 'ui')).toBe(newButton);
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty namespace string', () => {
      const component = () => 'test';
      registry.register('button', component, { namespace: '' });
      
      // Empty namespace should be treated as no namespace
      expect(registry.get('button')).toBe(component);
    });

    it('should handle namespace with special characters', () => {
      const component = () => 'test';
      registry.register('button', component, { namespace: 'plugin-my-custom' });
      
      expect(registry.get('button', 'plugin-my-custom')).toBe(component);
    });

    it('should handle undefined meta', () => {
      const component = () => 'test';
      registry.register('button', component, undefined);
      
      expect(registry.get('button')).toBe(component);
    });
  });
});
