import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeAll } from 'vitest';
import { ComponentRegistry } from '@object-ui/core';

// Mock dependencies
vi.mock('@object-ui/react', () => ({
  useSchemaContext: vi.fn(() => ({ dataSource: { type: 'mock-datasource' } })),
}));

vi.mock('./ObjectTimeline', () => ({
  ObjectTimeline: ({ dataSource }: any) => (
    <div data-testid="timeline-mock">
        {dataSource ? `DataSource: ${dataSource.type}` : 'No DataSource'}
    </div>
  )
}));

describe('Plugin Timeline Registration', () => {
  beforeAll(async () => {
    await import('./index');
  });

  it('registers object-timeline component', () => {
    const config = ComponentRegistry.get('object-timeline');
    expect(config).toBeDefined();
    expect(config?.label).toBe('Object Timeline');
  });

  it('registered component passes dataSource from context', () => {
    const config = ComponentRegistry.get('object-timeline');
    const Renderer = config?.component as React.FC<any>;
    
    render(<Renderer schema={{}} />);
    expect(screen.getByTestId('timeline-mock')).toHaveTextContent('DataSource: mock-datasource');
  });
});
