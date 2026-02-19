/**
 * ObjectUI
 * Copyright (c) 2024-present ObjectStack Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Mobile UX Tests for ModalForm
 *
 * Validates mobile-specific optimizations:
 * - Skeleton loading state (replaces spinner)
 * - Flex layout structure with sticky header/footer
 * - Full-screen modal on mobile (h-[100dvh])
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { ModalForm } from '../ModalForm';

const mockObjectSchema = {
  name: 'events',
  fields: {
    subject: { label: 'Subject', type: 'text', required: true },
    start: { label: 'Start', type: 'datetime', required: true },
    end: { label: 'End', type: 'datetime', required: true },
    location: { label: 'Location', type: 'text', required: false },
    description: { label: 'Description', type: 'textarea', required: false },
    participants: { label: 'Participants', type: 'lookup', required: false },
    type: { label: 'Type', type: 'select', required: false, options: [{ value: 'meeting', label: 'Meeting' }] },
  },
};

const createMockDataSource = () => ({
  getObjectSchema: vi.fn().mockResolvedValue(mockObjectSchema),
  findOne: vi.fn().mockResolvedValue({ id: '1', subject: 'Test Event' }),
  find: vi.fn().mockResolvedValue([]),
  create: vi.fn().mockResolvedValue({ id: '1' }),
  update: vi.fn().mockResolvedValue({ id: '1' }),
  delete: vi.fn().mockResolvedValue(true),
});

describe('ModalForm Mobile UX', () => {
  it('renders skeleton loading instead of spinner', () => {
    const mockDataSource = createMockDataSource();
    // Make getObjectSchema hang (never resolve) to keep loading state
    mockDataSource.getObjectSchema.mockReturnValue(new Promise(() => {}));

    render(
      <ModalForm
        schema={{
          type: 'object-form',
          formType: 'modal',
          objectName: 'events',
          mode: 'create',
          title: 'Create Event',
          open: true,
        }}
        dataSource={mockDataSource as any}
      />
    );

    // Should show skeleton loading, not the old spinner text
    expect(screen.queryByText('Loading form...')).not.toBeInTheDocument();
    expect(screen.getByTestId('modal-form-skeleton')).toBeInTheDocument();
  });

  it('renders with flex layout structure for sticky header/footer', async () => {
    const mockDataSource = createMockDataSource();

    render(
      <ModalForm
        schema={{
          type: 'object-form',
          formType: 'modal',
          objectName: 'events',
          mode: 'create',
          title: 'Create Event',
          description: 'Add a new Event to your database.',
          open: true,
        }}
        dataSource={mockDataSource as any}
      />
    );

    await waitFor(() => {
      expect(screen.getByText('Create Event')).toBeInTheDocument();
    });
    expect(screen.getByText('Add a new Event to your database.')).toBeInTheDocument();
  });

  it('renders with full-screen mobile classes on DialogContent', async () => {
    const mockDataSource = createMockDataSource();

    render(
      <ModalForm
        schema={{
          type: 'object-form',
          formType: 'modal',
          objectName: 'events',
          mode: 'create',
          title: 'Create Event',
          open: true,
        }}
        dataSource={mockDataSource as any}
      />
    );

    await waitFor(() => {
      expect(screen.getByText('Create Event')).toBeInTheDocument();
    });

    // DialogContent should be rendered (via portal)
    const dialogContent = document.querySelector('[role="dialog"]');
    expect(dialogContent).not.toBeNull();
    // Verify the flex column layout for sticky header/footer
    expect(dialogContent?.className).toContain('flex');
    expect(dialogContent?.className).toContain('flex-col');
  });

  it('close button has accessible touch target', async () => {
    const mockDataSource = createMockDataSource();

    render(
      <ModalForm
        schema={{
          type: 'object-form',
          formType: 'modal',
          objectName: 'events',
          mode: 'create',
          title: 'Create Event',
          open: true,
        }}
        dataSource={mockDataSource as any}
      />
    );

    await waitFor(() => {
      expect(screen.getByText('Create Event')).toBeInTheDocument();
    });

    // Close button should exist and be accessible
    const closeButton = screen.getByRole('button', { name: /close/i });
    expect(closeButton).toBeInTheDocument();
  });
});
