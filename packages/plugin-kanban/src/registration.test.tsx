import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeAll } from 'vitest';
import { ComponentRegistry } from '@object-ui/core';

// Mock dependencies
vi.mock('@object-ui/react', () => ({
  useSchemaContext: vi.fn(() => ({ dataSource: { type: 'mock-datasource' } })),
}));

// Mock the implementation
vi.mock('./ObjectKanban', () => ({
  ObjectKanban: ({ dataSource }: any) => (
    <div data-testid="kanban-mock">
        {dataSource ? `DataSource: ${dataSource.type}` : 'No DataSource'}
    </div>
  )
}));

describe('Plugin Kanban Registration', () => {
  beforeAll(async () => {
    // Import index to trigger registration
    await import('./index');
  });

  it('registers object-kanban component', () => {
    const config = ComponentRegistry.get('object-kanban');
    expect(config).toBeDefined();
    expect(config?.label).toBe('Object Kanban');
  });

  it('registered component passes dataSource from context', () => {
    const config = ComponentRegistry.get('object-kanban');
    const Renderer = config?.component as React.FC<any>;
    
    expect(Renderer).toBeDefined();

    render(<Renderer schema={{}} />);
    
    expect(screen.getByTestId('kanban-mock')).toHaveTextContent('DataSource: mock-datasource');
  });
});
