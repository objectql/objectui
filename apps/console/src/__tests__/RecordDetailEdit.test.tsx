/**
 * RecordDetailView — recordId handling tests
 *
 * Validates that the URL-based recordId is passed through as-is to the
 * findOne API and onEdit callback. The navigation code puts the actual
 * record._id into the URL, so no prefix stripping is needed.
 *
 * Related: objectstack-ai/objectui — "Record not found" bug
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { RecordDetailView } from '../components/RecordDetailView';
import type { DataSource } from '@object-ui/types';

// ─── Mocks ───────────────────────────────────────────────────────────────────

function createMockDataSource(): DataSource {
  return {
    async getObjectSchema() {
      return {
        name: 'contact',
        label: 'Contact',
        fields: {
          name: { name: 'name', label: 'Name', type: 'text' },
          email: { name: 'email', label: 'Email', type: 'email' },
        },
      };
    },
    findOne: vi.fn().mockResolvedValue({ id: 'contact-1772350253615-4', name: 'Alice' }),
    find: vi.fn().mockResolvedValue({ data: [] }),
    create: vi.fn().mockResolvedValue({ id: '1' }),
    update: vi.fn().mockResolvedValue({ id: '1' }),
    delete: vi.fn().mockResolvedValue(true),
  } as any;
}

const mockObjects = [
  {
    name: 'contact',
    label: 'Contact',
    fields: {
      name: { name: 'name', label: 'Name', type: 'text' },
      email: { name: 'email', label: 'Email', type: 'email' },
    },
  },
];

function renderDetailView(
  urlRecordId: string,
  objectName: string,
  onEdit: (record: any) => void,
  ds?: DataSource,
) {
  const dataSource = ds ?? createMockDataSource();
  return render(
    <MemoryRouter initialEntries={[`/${objectName}/record/${urlRecordId}`]}>
      <Routes>
        <Route
          path="/:objectName/record/:recordId"
          element={
            <RecordDetailView
              dataSource={dataSource}
              objects={mockObjects}
              onEdit={onEdit}
            />
          }
        />
      </Routes>
    </MemoryRouter>,
  );
}

// ─── Tests ───────────────────────────────────────────────────────────────────

describe('RecordDetailView — recordId handling', () => {
  it('passes URL recordId as-is to findOne (with objectName prefix)', async () => {
    const onEdit = vi.fn();
    const ds = createMockDataSource();

    renderDetailView('contact-1772350253615-4', 'contact', onEdit, ds);

    // Wait for the detail view to load (primaryField "name" renders as heading)
    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Alice');
    });

    // findOne should be called with the FULL URL recordId (no stripping)
    expect(ds.findOne).toHaveBeenCalledWith('contact', 'contact-1772350253615-4');

    // Click the Edit button
    const editButton = await screen.findByRole('button', { name: /edit/i });
    await userEvent.click(editButton);

    // The onEdit callback should receive the FULL recordId
    expect(onEdit).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 'contact-1772350253615-4',
        _id: 'contact-1772350253615-4',
      }),
    );
  });

  it('passes recordId as-is when no objectName prefix', async () => {
    const onEdit = vi.fn();
    const ds = createMockDataSource();

    renderDetailView('plain-id-12345', 'contact', onEdit, ds);

    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Alice');
    });

    // findOne should be called with the original ID unchanged
    expect(ds.findOne).toHaveBeenCalledWith('contact', 'plain-id-12345');

    const editButton = await screen.findByRole('button', { name: /edit/i });
    await userEvent.click(editButton);

    // Should pass the original recordId unchanged
    expect(onEdit).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 'plain-id-12345',
        _id: 'plain-id-12345',
      }),
    );
  });
});
