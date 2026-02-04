import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeAll } from 'vitest';
import { ComponentRegistry } from '@object-ui/core';

// Mock dependencies
vi.mock('@object-ui/react', () => ({
  useSchemaContext: vi.fn(() => ({ dataSource: { type: 'mock-datasource' } })),
}));

vi.mock('./ObjectGrid', () => ({
  ObjectGrid: ({ dataSource }: any) => (
    <div data-testid="grid-mock">
        {dataSource ? `DataSource: ${dataSource.type}` : 'No DataSource'}
    </div>
  )
}));

describe('Plugin Grid Registration', () => {
  beforeAll(async () => {
    await import('./index');
  });

  it('registers object-grid component', () => {
    const config = ComponentRegistry.get('object-grid');
    expect(config).toBeDefined();
    expect(config?.label).toBe('Object Grid');
  });

  it('registered component passes dataSource from context', () => {
    const config = ComponentRegistry.get('object-grid');
    const Renderer = config?.component as React.FC<any>;
    
    render(<Renderer schema={{}} />);
    expect(screen.getByTestId('grid-mock')).toHaveTextContent('DataSource: mock-datasource');
  });
});
