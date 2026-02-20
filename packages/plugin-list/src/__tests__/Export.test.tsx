/**
 * ObjectUI
 * Copyright (c) 2024-present ObjectStack Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ListView } from '../ListView';
import type { ListViewSchema } from '@object-ui/types';
import { SchemaRendererProvider } from '@object-ui/react';

// Mock URL.createObjectURL and revokeObjectURL
const mockCreateObjectURL = vi.fn().mockReturnValue('blob:test');
const mockRevokeObjectURL = vi.fn();
Object.defineProperty(URL, 'createObjectURL', { value: mockCreateObjectURL, writable: true });
Object.defineProperty(URL, 'revokeObjectURL', { value: mockRevokeObjectURL, writable: true });

const mockDataSource = {
  find: vi.fn().mockResolvedValue([]),
  findOne: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
  delete: vi.fn(),
};

const renderWithProvider = (component: React.ReactNode) => {
  return render(
    <SchemaRendererProvider dataSource={mockDataSource}>
      {component}
    </SchemaRendererProvider>
  );
};

describe('ListView Export', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render export button with configured formats', () => {
    const schema: ListViewSchema = {
      type: 'list-view',
      objectName: 'contacts',
      viewType: 'grid',
      fields: ['name', 'email'],
      exportOptions: {
        formats: ['csv', 'json'],
      },
    };

    renderWithProvider(<ListView schema={schema} />);
    const exportButton = screen.getByRole('button', { name: /export/i });
    expect(exportButton).toBeInTheDocument();
  });

  it('should handle export with complex object fields in CSV safely', async () => {
    const mockItems = [
      { _id: '1', name: 'Alice', tags: ['admin', 'user'], metadata: { role: 'lead' } },
      { _id: '2', name: 'Bob', tags: ['user'], metadata: null },
    ];
    mockDataSource.find.mockResolvedValue(mockItems);

    const schema: ListViewSchema = {
      type: 'list-view',
      objectName: 'contacts',
      viewType: 'grid',
      fields: ['name', 'tags', 'metadata'],
      exportOptions: {
        formats: ['csv'],
      },
    };

    renderWithProvider(<ListView schema={schema} dataSource={mockDataSource} />);

    // Wait for data to load
    await vi.waitFor(() => {
      expect(screen.getByTestId('record-count-bar')).toBeInTheDocument();
    });

    // Click export button
    const exportButton = screen.getByRole('button', { name: /export/i });
    fireEvent.click(exportButton);

    // Click CSV format
    const csvButton = screen.getByRole('button', { name: /export as csv/i });

    // Mock createElement and click
    const mockClick = vi.fn();
    const originalCreateElement = document.createElement.bind(document);
    vi.spyOn(document, 'createElement').mockImplementation((tag: string) => {
      const el = originalCreateElement(tag);
      if (tag === 'a') {
        el.click = mockClick;
      }
      return el;
    });

    fireEvent.click(csvButton);
    expect(mockCreateObjectURL).toHaveBeenCalled();

    // Verify the blob content includes safe serialization
    const blobArg = mockCreateObjectURL.mock.calls[0]?.[0];
    if (blobArg instanceof Blob) {
      const text = await blobArg.text();
      // Headers
      expect(text).toContain('name,tags,metadata');
      // Array should be serialized as semicolon-separated, not raw
      expect(text).toContain('admin; user');
      // Object should be JSON-serialized (CSV-escaped with doubled quotes)
      expect(text).toContain('{""role"":""lead""}');
    }
  });

  it('should handle export with JSON format', async () => {
    const mockItems = [
      { _id: '1', name: 'Alice', email: 'alice@test.com' },
    ];
    mockDataSource.find.mockResolvedValue(mockItems);

    const schema: ListViewSchema = {
      type: 'list-view',
      objectName: 'contacts',
      viewType: 'grid',
      fields: ['name', 'email'],
      exportOptions: {
        formats: ['json'],
      },
    };

    renderWithProvider(<ListView schema={schema} dataSource={mockDataSource} />);

    await vi.waitFor(() => {
      expect(screen.getByTestId('record-count-bar')).toBeInTheDocument();
    });

    const exportButton = screen.getByRole('button', { name: /export/i });
    fireEvent.click(exportButton);

    const jsonButton = screen.getByRole('button', { name: /export as json/i });

    const mockClick = vi.fn();
    const originalCreateElement = document.createElement.bind(document);
    vi.spyOn(document, 'createElement').mockImplementation((tag: string) => {
      const el = originalCreateElement(tag);
      if (tag === 'a') {
        el.click = mockClick;
      }
      return el;
    });

    fireEvent.click(jsonButton);
    expect(mockCreateObjectURL).toHaveBeenCalled();
  });
});
