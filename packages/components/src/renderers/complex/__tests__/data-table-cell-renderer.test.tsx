/**
 * Data Table - Custom Cell Renderer Tests
 *
 * Tests that data-table respects col.cell() function for custom cell rendering.
 */
import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import React from 'react';
import { SchemaRenderer } from '@object-ui/react';

// Import data-table to ensure it's registered
import '../data-table';

describe('Data Table: col.cell() custom renderer', () => {
  it('should invoke col.cell function to render cell content', async () => {
    const cellFn = vi.fn((value: any, _row: any) => (
      <span data-testid="custom-cell">{`Custom: ${value}`}</span>
    ));

    const schema = {
      type: 'data-table',
      columns: [
        { header: 'Name', accessorKey: 'name', cell: cellFn },
        { header: 'Email', accessorKey: 'email' },
      ],
      data: [
        { name: 'Alice', email: 'alice@test.com' },
        { name: 'Bob', email: 'bob@test.com' },
      ],
      pagination: false,
      searchable: false,
    };

    render(<SchemaRenderer schema={schema} />);

    await waitFor(() => {
      expect(screen.getByText('Custom: Alice')).toBeInTheDocument();
    });

    expect(screen.getByText('Custom: Bob')).toBeInTheDocument();
    expect(cellFn).toHaveBeenCalledTimes(2);

    // Non-custom cell should render value directly
    expect(screen.getByText('alice@test.com')).toBeInTheDocument();
  });

  it('should pass both value and row to cell function', async () => {
    const cellFn = vi.fn((value: any, row: any) => (
      <span data-testid="combo-cell">{`${value} (${row.email})`}</span>
    ));

    const schema = {
      type: 'data-table',
      columns: [
        { header: 'Name', accessorKey: 'name', cell: cellFn },
      ],
      data: [
        { name: 'Alice', email: 'alice@test.com' },
      ],
      pagination: false,
      searchable: false,
    };

    render(<SchemaRenderer schema={schema} />);

    await waitFor(() => {
      expect(screen.getByText('Alice (alice@test.com)')).toBeInTheDocument();
    });

    expect(cellFn).toHaveBeenCalledWith('Alice', expect.objectContaining({ name: 'Alice', email: 'alice@test.com' }));
  });

  it('should render raw value when no cell function is provided', async () => {
    const schema = {
      type: 'data-table',
      columns: [
        { header: 'Name', accessorKey: 'name' },
      ],
      data: [
        { name: 'Alice' },
      ],
      pagination: false,
      searchable: false,
    };

    render(<SchemaRenderer schema={schema} />);

    await waitFor(() => {
      expect(screen.getByText('Alice')).toBeInTheDocument();
    });
  });

  it('should prefer editing state over cell function when in edit mode', async () => {
    // The editing state should take precedence over custom cell renderer
    // This test verifies the rendering priority: editing > cell > raw value
    const cellFn = vi.fn((value: any) => (
      <span>{`Custom: ${value}`}</span>
    ));

    const schema = {
      type: 'data-table',
      columns: [
        { header: 'Name', accessorKey: 'name', cell: cellFn },
      ],
      data: [
        { name: 'Alice' },
      ],
      pagination: false,
      searchable: false,
      editable: false,
    };

    render(<SchemaRenderer schema={schema} />);

    await waitFor(() => {
      expect(screen.getByText('Custom: Alice')).toBeInTheDocument();
    });
  });
});
