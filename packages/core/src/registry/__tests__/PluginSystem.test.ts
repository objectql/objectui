/**
 * ObjectUI
 * Copyright (c) 2024-present ObjectStack Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { PluginSystem, type PluginDefinition } from '../PluginSystem';
import { Registry } from '../Registry';

describe('PluginSystem', () => {
  let pluginSystem: PluginSystem;
  let registry: Registry;

  beforeEach(() => {
    pluginSystem = new PluginSystem();
    registry = new Registry();
  });

  it('should load a simple plugin', async () => {
    const plugin: PluginDefinition = {
      name: 'test-plugin',
      version: '1.0.0',
      register: (reg) => {
        reg.register('test', () => 'test');
      }
    };

    await pluginSystem.loadPlugin(plugin);
    
    expect(pluginSystem.isLoaded('test-plugin')).toBe(true);
    expect(pluginSystem.getLoadedPlugins()).toContain('test-plugin');
  });

  it('should execute onLoad lifecycle hook', async () => {
    const onLoad = vi.fn();
    const plugin: PluginDefinition = {
      name: 'test-plugin',
      version: '1.0.0',
      register: () => {},
      onLoad
    };

    await pluginSystem.loadPlugin(plugin);
    
    expect(onLoad).toHaveBeenCalledTimes(1);
  });

  it('should execute async onLoad lifecycle hook', async () => {
    const onLoad = vi.fn().mockResolvedValue(undefined);
    const plugin: PluginDefinition = {
      name: 'test-plugin',
      version: '1.0.0',
      register: () => {},
      onLoad
    };

    await pluginSystem.loadPlugin(plugin);
    
    expect(onLoad).toHaveBeenCalledTimes(1);
  });

  it('should not load plugin twice', async () => {
    const onLoad = vi.fn();
    const plugin: PluginDefinition = {
      name: 'test-plugin',
      version: '1.0.0',
      register: () => {},
      onLoad
    };

    await pluginSystem.loadPlugin(plugin);
    await pluginSystem.loadPlugin(plugin);
    
    expect(onLoad).toHaveBeenCalledTimes(1);
  });

  it('should check dependencies before loading', async () => {
    const plugin: PluginDefinition = {
      name: 'dependent-plugin',
      version: '1.0.0',
      dependencies: ['base-plugin'],
      register: () => {}
    };

    await expect(pluginSystem.loadPlugin(plugin)).rejects.toThrow(
      'Missing dependency: base-plugin required by dependent-plugin'
    );
  });

  it('should load plugins with dependencies in correct order', async () => {
    const basePlugin: PluginDefinition = {
      name: 'base-plugin',
      version: '1.0.0',
      register: () => {}
    };

    const dependentPlugin: PluginDefinition = {
      name: 'dependent-plugin',
      version: '1.0.0',
      dependencies: ['base-plugin'],
      register: () => {}
    };

    await pluginSystem.loadPlugin(basePlugin);
    await pluginSystem.loadPlugin(dependentPlugin);
    
    expect(pluginSystem.isLoaded('base-plugin')).toBe(true);
    expect(pluginSystem.isLoaded('dependent-plugin')).toBe(true);
  });

  it('should unload a plugin', async () => {
    const onUnload = vi.fn();
    const plugin: PluginDefinition = {
      name: 'test-plugin',
      version: '1.0.0',
      register: () => {},
      onUnload
    };

    await pluginSystem.loadPlugin(plugin);
    expect(pluginSystem.isLoaded('test-plugin')).toBe(true);
    
    await pluginSystem.unloadPlugin('test-plugin');
    
    expect(pluginSystem.isLoaded('test-plugin')).toBe(false);
    expect(onUnload).toHaveBeenCalledTimes(1);
  });

  it('should prevent unloading plugin with dependents', async () => {
    const basePlugin: PluginDefinition = {
      name: 'base-plugin',
      version: '1.0.0',
      register: () => {}
    };

    const dependentPlugin: PluginDefinition = {
      name: 'dependent-plugin',
      version: '1.0.0',
      dependencies: ['base-plugin'],
      register: () => {}
    };

    await pluginSystem.loadPlugin(basePlugin);
    await pluginSystem.loadPlugin(dependentPlugin);
    
    await expect(pluginSystem.unloadPlugin('base-plugin')).rejects.toThrow(
      'Cannot unload plugin "base-plugin" - plugin "dependent-plugin" depends on it'
    );
  });

  it('should throw error when unloading non-existent plugin', async () => {
    await expect(pluginSystem.unloadPlugin('non-existent')).rejects.toThrow(
      'Plugin "non-existent" is not loaded'
    );
  });

  it('should get plugin definition', async () => {
    const plugin: PluginDefinition = {
      name: 'test-plugin',
      version: '1.0.0',
      register: () => {}
    };

    await pluginSystem.loadPlugin(plugin);
    
    const retrieved = pluginSystem.getPlugin('test-plugin');
    expect(retrieved).toBe(plugin);
  });

  it('should get all plugins', async () => {
    const plugin1: PluginDefinition = {
      name: 'plugin-1',
      version: '1.0.0',
      register: () => {}
    };

    const plugin2: PluginDefinition = {
      name: 'plugin-2',
      version: '1.0.0',
      register: () => {}
    };

    await pluginSystem.loadPlugin(plugin1);
    await pluginSystem.loadPlugin(plugin2);
    
    const allPlugins = pluginSystem.getAllPlugins();
    expect(allPlugins).toHaveLength(2);
    expect(allPlugins).toContain(plugin1);
    expect(allPlugins).toContain(plugin2);
  });
});
