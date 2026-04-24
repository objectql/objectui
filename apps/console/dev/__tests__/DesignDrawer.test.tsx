/**
 * DesignDrawer Tests
 *
 * Tests the right-side drawer visual editing panel with real-time preview.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { PageView } from '@object-ui/app-shell';

// Mock @object-ui/app-shell (MetadataProvider + AdapterProvider)
const { mockUpdate } = vi.hoisted(() => ({ mockUpdate: vi.fn().mockResolvedValue({}) }));
vi.mock('@object-ui/app-shell', async () => {
  const actual = await vi.importActual<typeof import('@object-ui/app-shell')>('@object-ui/app-shell');
  return {
    ...actual,
    useMetadata: () => ({
      apps: [],
      objects: [],
      dashboards: [],
      reports: [],
      pages: [
        {
          name: 'test-page',
          type: 'page',
          title: 'Test Page',
          children: [
            { type: 'text', value: 'Original Content' },
          ],
        },
      ],
      loading: false,
      error: null,
      refresh: vi.fn(),
    }),
    useAdapter: () => ({
      update: mockUpdate,
      create: vi.fn().mockResolvedValue({}),
    }),
  };
});

// Mock SchemaRenderer to show current schema for preview verification
vi.mock('@object-ui/react', async () => {
  const actual = await vi.importActual<typeof import('@object-ui/react')>('@object-ui/react');
  return {
    ...actual,
    SchemaRenderer: ({ schema }: { schema: any }) => (
      <div data-testid="schema-renderer">
        Rendered {schema.type}: {schema.name || 'unnamed'}
        {schema.children?.[0]?.value}
      </div>
    ),
    useMetadata: () => ({
      apps: [],
      objects: [],
      dashboards: [],
      reports: [],
      pages: [
        {
          name: 'test-page',
          type: 'page',
          title: 'Test Page',
          children: [{ type: 'text', value: 'Original Content' }],
        },
      ],
      loading: false,
      error: null,
      refresh: vi.fn(),
    }),
    useAdapter: () => ({
      update: mockUpdate,
      create: vi.fn().mockResolvedValue({}),
    }),
  };
});

// Mock plugin-designer
vi.mock('@object-ui/plugin-designer', () => ({
  PageCanvasEditor: ({ schema, onChange }: any) => (
    <div data-testid="page-canvas-editor">
      <span>Editor: {schema.title || schema.name}</span>
      <button
        data-testid="editor-change"
        onClick={() =>
          onChange({
            ...schema,
            title: 'Updated Title',
            children: [{ type: 'text', value: 'Updated Content' }],
          })
        }
      >
        Make Change
      </button>
    </div>
  ),
}));

// Mock sonner toast
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

// Mock Radix Dialog portal to render inline for testing
vi.mock('@radix-ui/react-dialog', async () => {
  const actual = await vi.importActual('@radix-ui/react-dialog');
  return {
    ...(actual as Record<string, unknown>),
    Portal: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  };
});

beforeEach(() => {
  mockUpdate.mockClear();
});

const renderPageView = () =>
  render(
    <MemoryRouter initialEntries={['/page/test-page']}>
      <Routes>
        <Route path="/page/:pageName" element={<PageView />} />
      </Routes>
    </MemoryRouter>,
  );

describe('DesignDrawer — Right-Side Editor Panel', () => {
  it('should render the edit button', () => {
    renderPageView();
    expect(screen.getByTestId('page-edit-button')).toBeInTheDocument();
  });

  it('should open design drawer when edit button is clicked', async () => {
    renderPageView();

    await act(async () => {
      fireEvent.click(screen.getByTestId('page-edit-button'));
    });

    // Drawer should be visible
    expect(screen.getByTestId('design-drawer')).toBeInTheDocument();
  });

  it('should display the editor inside the drawer', async () => {
    renderPageView();

    await act(async () => {
      fireEvent.click(screen.getByTestId('page-edit-button'));
    });

    // Editor should be rendered inside the drawer
    expect(screen.getByTestId('page-canvas-editor')).toBeInTheDocument();
    expect(screen.getByText(/Editor: Test Page/)).toBeInTheDocument();
  });

  it('should update preview in real-time when editor makes changes', async () => {
    renderPageView();

    // Open the drawer
    await act(async () => {
      fireEvent.click(screen.getByTestId('page-edit-button'));
    });

    // Verify original content is shown
    expect(screen.getByTestId('schema-renderer')).toHaveTextContent('Original Content');

    // Make a change in the editor
    await act(async () => {
      fireEvent.click(screen.getByTestId('editor-change'));
    });

    // Preview should reflect the updated content
    expect(screen.getByTestId('schema-renderer')).toHaveTextContent('Updated Content');
  });

  it('should auto-save changes via dataSource.update', async () => {
    renderPageView();

    await act(async () => {
      fireEvent.click(screen.getByTestId('page-edit-button'));
    });

    await act(async () => {
      fireEvent.click(screen.getByTestId('editor-change'));
    });

    // Should call dataSource.update with the updated schema
    expect(mockUpdate).toHaveBeenCalledWith(
      'sys_page',
      'test-page',
      expect.objectContaining({ title: 'Updated Title' }),
    );
  });

  it('should save via Ctrl+S keyboard shortcut when drawer is open', async () => {
    renderPageView();

    await act(async () => {
      fireEvent.click(screen.getByTestId('page-edit-button'));
    });

    await act(async () => {
      fireEvent.keyDown(window, { key: 's', ctrlKey: true });
    });

    expect(mockUpdate).toHaveBeenCalledWith(
      'sys_page',
      'test-page',
      expect.objectContaining({ type: 'page' }),
    );
  });

  it('should not navigate away when edit button is clicked', () => {
    renderPageView();

    fireEvent.click(screen.getByTestId('page-edit-button'));

    // Main renderer should still be visible (no navigation)
    expect(screen.getByTestId('schema-renderer')).toBeInTheDocument();
  });
});
