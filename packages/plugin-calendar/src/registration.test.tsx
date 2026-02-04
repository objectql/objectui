import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeAll } from 'vitest';
import { ComponentRegistry } from '@object-ui/core';

// Mock dependencies
vi.mock('@object-ui/react', () => ({
  useSchemaContext: vi.fn(() => ({ dataSource: { type: 'mock-datasource' } })),
}));

// Mock the implementation
vi.mock('./ObjectCalendar', () => ({
  ObjectCalendar: ({ dataSource }: any) => (
    <div data-testid="calendar-mock">
        {dataSource ? `DataSource: ${dataSource.type}` : 'No DataSource'}
    </div>
  )
}));

describe('Plugin Calendar Registration', () => {
  beforeAll(async () => {
    // Import index to trigger registration
    await import('./index');
  });

  it('registers object-calendar component', () => {
    const config = ComponentRegistry.get('object-calendar');
    expect(config).toBeDefined();
    // Label might be 'Object Calendar' - checking existence mostly
  });

  it('registered component passes dataSource from context', () => {
    const config = ComponentRegistry.get('object-calendar');
    const Renderer = config?.component as React.FC<any>;
    
    expect(Renderer).toBeDefined();

    render(<Renderer schema={{}} />);
    
    expect(screen.getByTestId('calendar-mock')).toHaveTextContent('DataSource: mock-datasource');
  });
});
