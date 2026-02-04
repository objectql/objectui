import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeAll } from 'vitest';
import { ComponentRegistry } from '@object-ui/core';

// Mock dependencies
vi.mock('@object-ui/react', () => ({
  useSchemaContext: vi.fn(() => ({ dataSource: { type: 'mock-datasource' } })),
}));

vi.mock('./ObjectMap', () => ({
  ObjectMap: ({ dataSource }: any) => (
    <div data-testid="map-mock">
        {dataSource ? `DataSource: ${dataSource.type}` : 'No DataSource'}
    </div>
  )
}));

describe('Plugin Map Registration', () => {
  beforeAll(async () => {
    // Import index to trigger registration
    await import('./index');
  });

  it('registers object-map component', () => {
    const config = ComponentRegistry.get('object-map');
    expect(config).toBeDefined();
    expect(config?.label).toBe('Object Map');
  });

  it('registered component passes dataSource from context', () => {
    const config = ComponentRegistry.get('object-map');
    const Renderer = config?.component as React.FC<any>;
    
    expect(Renderer).toBeDefined();

    render(<Renderer schema={{}} />);
    
    expect(screen.getByTestId('map-mock')).toHaveTextContent('DataSource: mock-datasource');
  });
});
