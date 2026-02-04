import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeAll } from 'vitest';
import { ComponentRegistry } from '@object-ui/core';

// Mock dependencies
vi.mock('@object-ui/react', () => ({
  useSchemaContext: vi.fn(() => ({ dataSource: { type: 'mock-datasource' } })),
}));

vi.mock('./ObjectGantt', () => ({
  ObjectGantt: ({ dataSource }: any) => (
    <div data-testid="gantt-mock">
        {dataSource ? `DataSource: ${dataSource.type}` : 'No DataSource'}
    </div>
  )
}));

describe('Plugin Gantt Registration', () => {
  beforeAll(async () => {
    await import('./index');
  });

  it('registers object-gantt component', () => {
    const config = ComponentRegistry.get('object-gantt');
    expect(config).toBeDefined();
    expect(config?.label).toBe('Object Gantt');
  });

  it('registered component passes dataSource from context', () => {
    const config = ComponentRegistry.get('object-gantt');
    const Renderer = config?.component as React.FC<any>;
    
    render(<Renderer schema={{}} />);
    expect(screen.getByTestId('gantt-mock')).toHaveTextContent('DataSource: mock-datasource');
  });
});
