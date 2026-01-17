
import { describe, it, expect } from 'vitest';
import { kanbanComponents } from '@object-ui/plugin-kanban';
import { chartComponents } from '@object-ui/plugin-charts';
import { ComponentRegistry } from '@object-ui/core';

describe('Plugin Integration Protocol', () => {
  describe('Kanban Plugin', () => {
    it('should export components object for manual registration', () => {
      expect(kanbanComponents).toBeDefined();
      expect(kanbanComponents.kanban).toBeDefined();
    });

    it('should contain valid React component', () => {
      const Component = kanbanComponents.kanban;
      expect(typeof Component).toBe('function'); // React components are functions
    });
  });

  describe('Charts Plugin', () => {
    it('should export component objects for manual registration', () => {
      expect(chartComponents).toBeDefined();
      expect(chartComponents['bar-chart']).toBeDefined();
      expect(chartComponents['chart']).toBeDefined();
    });

    it('should export correctly named "bar-chart" key matching schema usage', () => {
      // Critical check for the bug we fixed (type mismatch)
      expect(Object.keys(chartComponents)).toContain('bar-chart');
      expect(chartComponents['bar-chart']).toBeDefined();
    });
  });

  describe('Manual Registration Simulation', () => {
    it('should successfully register kanban via manual components', () => {
      // Clear registry to simulate clean state
      // Note: In a real app we wouldn't clear, but here we want to prove registration works
      
      // Act: Manually register
      if (kanbanComponents?.kanban) {
         ComponentRegistry.register('test-kanban-manual', kanbanComponents.kanban);
      }

      // Assert
      expect(ComponentRegistry.get('test-kanban-manual')).toBeDefined();
    });
    
     it('should successfully register bar-chart via manual components', () => {
      if (chartComponents?.['bar-chart']) {
         ComponentRegistry.register('test-bar-chart-manual', chartComponents['bar-chart']);
      }

      expect(ComponentRegistry.get('test-bar-chart-manual')).toBeDefined();
    });
  });
});
