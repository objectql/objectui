/**
 * BooleanCellRenderer Checkbox Tests
 *
 * Tests for the Airtable-style checkbox boolean cell renderer.
 */
import { describe, it, expect } from 'vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BooleanCellRenderer } from '../index';

describe('BooleanCellRenderer', () => {
  it('should render a checked checkbox for true values', () => {
    render(
      <BooleanCellRenderer
        value={true}
        field={{ name: 'active', type: 'boolean' } as any}
      />
    );

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeInTheDocument();
    expect(checkbox).toHaveAttribute('data-state', 'checked');
  });

  it('should render an unchecked checkbox for false values (non-status field)', () => {
    render(
      <BooleanCellRenderer
        value={false}
        field={{ name: 'flagged', type: 'boolean' } as any}
      />
    );

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeInTheDocument();
    expect(checkbox).toHaveAttribute('data-state', 'unchecked');
  });

  it('should render warning badge for active=false', () => {
    const { container } = render(
      <BooleanCellRenderer
        value={false}
        field={{ name: 'active', type: 'boolean', label: 'Active' } as any}
      />
    );

    const badge = container.querySelector('[data-testid="boolean-warning-badge"]');
    expect(badge).toBeInTheDocument();
    expect(badge?.textContent).toContain('Off');
  });

  it('should render dash for null/undefined values', () => {
    render(
      <BooleanCellRenderer
        value={null}
        field={{ name: 'active', type: 'boolean' } as any}
      />
    );

    expect(screen.getByText('—')).toBeInTheDocument();
  });

  it('should render checkbox as disabled (non-interactive)', () => {
    render(
      <BooleanCellRenderer
        value={true}
        field={{ name: 'active', type: 'boolean' } as any}
      />
    );

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeDisabled();
  });
});
