/**
 * ObjectUI
 * Copyright (c) 2024-present ObjectStack Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { describe, it, expect } from 'vitest';
import { DataScopeManager } from '../DataScopeManager';

describe('DataScopeManager', () => {
  describe('Scope Registration', () => {
    it('should register and retrieve a scope', () => {
      const manager = new DataScopeManager();
      manager.registerScope('contacts', { data: [{ name: 'Alice' }] });
      const scope = manager.getScope('contacts');
      expect(scope).toBeDefined();
      expect(scope?.data).toEqual([{ name: 'Alice' }]);
    });

    it('should return undefined for unregistered scope', () => {
      const manager = new DataScopeManager();
      expect(manager.getScope('unknown')).toBeUndefined();
    });

    it('should remove a scope', () => {
      const manager = new DataScopeManager();
      manager.registerScope('test', { data: [] });
      expect(manager.getScope('test')).toBeDefined();
      manager.removeScope('test');
      expect(manager.getScope('test')).toBeUndefined();
    });

    it('should list scope names', () => {
      const manager = new DataScopeManager();
      manager.registerScope('a', { data: [] });
      manager.registerScope('b', { data: [] });
      expect(manager.getScopeNames()).toEqual(['a', 'b']);
    });

    it('should clear all scopes', () => {
      const manager = new DataScopeManager();
      manager.registerScope('a', { data: [] });
      manager.registerScope('b', { data: [] });
      manager.clear();
      expect(manager.getScopeNames()).toEqual([]);
    });
  });

  describe('Scope Configuration', () => {
    it('should register scope with config', () => {
      const manager = new DataScopeManager();
      manager.registerScopeWithConfig('test', {
        data: [1, 2, 3],
        readOnly: true,
        filters: [{ field: 'status', operator: 'eq', value: 'active' }],
      });

      expect(manager.getScope('test')?.data).toEqual([1, 2, 3]);
      expect(manager.isReadOnly('test')).toBe(true);
      expect(manager.getFilters('test')).toHaveLength(1);
    });

    it('should throw when updating read-only scope', () => {
      const manager = new DataScopeManager();
      manager.registerScopeWithConfig('readonly', { readOnly: true });
      expect(() => manager.updateScopeData('readonly', [1])).toThrow('Cannot update read-only scope');
    });
  });

  describe('Row-Level Filtering', () => {
    it('should apply eq filter', () => {
      const manager = new DataScopeManager();
      manager.registerScope('test', { data: [] });
      manager.setFilters('test', [{ field: 'status', operator: 'eq', value: 'active' }]);

      const result = manager.applyFilters('test', [
        { id: 1, status: 'active' },
        { id: 2, status: 'inactive' },
        { id: 3, status: 'active' },
      ]);

      expect(result).toHaveLength(2);
      expect(result[0].id).toBe(1);
      expect(result[1].id).toBe(3);
    });

    it('should apply gt filter', () => {
      const manager = new DataScopeManager();
      manager.registerScope('test', { data: [] });
      manager.setFilters('test', [{ field: 'age', operator: 'gt', value: 18 }]);

      const result = manager.applyFilters('test', [
        { name: 'A', age: 15 },
        { name: 'B', age: 25 },
        { name: 'C', age: 18 },
      ]);

      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('B');
    });

    it('should apply in filter', () => {
      const manager = new DataScopeManager();
      manager.registerScope('test', { data: [] });
      manager.setFilters('test', [{ field: 'role', operator: 'in', value: ['admin', 'editor'] }]);

      const result = manager.applyFilters('test', [
        { name: 'A', role: 'admin' },
        { name: 'B', role: 'viewer' },
        { name: 'C', role: 'editor' },
      ]);

      expect(result).toHaveLength(2);
    });

    it('should apply contains filter', () => {
      const manager = new DataScopeManager();
      manager.registerScope('test', { data: [] });
      manager.setFilters('test', [{ field: 'name', operator: 'contains', value: 'ob' }]);

      const result = manager.applyFilters('test', [
        { name: 'Bob' },
        { name: 'Alice' },
        { name: 'Robert' },
      ]);

      expect(result).toHaveLength(2);
    });

    it('should apply multiple filters (AND logic)', () => {
      const manager = new DataScopeManager();
      manager.registerScope('test', { data: [] });
      manager.setFilters('test', [
        { field: 'status', operator: 'eq', value: 'active' },
        { field: 'age', operator: 'gte', value: 18 },
      ]);

      const result = manager.applyFilters('test', [
        { status: 'active', age: 25 },
        { status: 'inactive', age: 25 },
        { status: 'active', age: 15 },
      ]);

      expect(result).toHaveLength(1);
      expect(result[0].age).toBe(25);
    });

    it('should return all data when no filters set', () => {
      const manager = new DataScopeManager();
      manager.registerScope('test', { data: [] });
      const data = [{ a: 1 }, { a: 2 }];
      expect(manager.applyFilters('test', data)).toEqual(data);
    });
  });

  describe('Scope Updates', () => {
    it('should update scope data', () => {
      const manager = new DataScopeManager();
      manager.registerScope('test', { data: [] });
      manager.updateScopeData('test', [1, 2, 3]);
      expect(manager.getScope('test')?.data).toEqual([1, 2, 3]);
    });

    it('should update loading state', () => {
      const manager = new DataScopeManager();
      manager.registerScope('test', { data: [], loading: false });
      manager.updateScopeLoading('test', true);
      expect(manager.getScope('test')?.loading).toBe(true);
    });

    it('should update error state', () => {
      const manager = new DataScopeManager();
      manager.registerScope('test', { data: [] });
      manager.updateScopeError('test', new Error('fail'));
      expect(manager.getScope('test')?.error).toBeDefined();
    });
  });

  describe('Change Listeners', () => {
    it('should notify listeners on scope registration', () => {
      const manager = new DataScopeManager();
      let notified = false;
      manager.onScopeChange('test', () => { notified = true; });
      manager.registerScope('test', { data: [] });
      expect(notified).toBe(true);
    });

    it('should notify listeners on data update', () => {
      const manager = new DataScopeManager();
      manager.registerScope('test', { data: [] });
      let newData: any;
      manager.onScopeChange('test', (scope) => { newData = scope.data; });
      manager.updateScopeData('test', [1, 2]);
      expect(newData).toEqual([1, 2]);
    });

    it('should allow unsubscribing', () => {
      const manager = new DataScopeManager();
      manager.registerScope('test', { data: [] });
      let count = 0;
      const unsub = manager.onScopeChange('test', () => { count++; });
      manager.updateScopeData('test', [1]);
      expect(count).toBe(1);
      unsub();
      manager.updateScopeData('test', [2]);
      expect(count).toBe(1);
    });
  });
});
