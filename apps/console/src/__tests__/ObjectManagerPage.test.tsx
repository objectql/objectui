/**
 * ObjectManagerPage tests
 *
 * Tests for the system administration Object Manager page that integrates
 * ObjectManager and FieldDesigner from @object-ui/plugin-designer.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { ObjectManagerPage } from '../pages/system/ObjectManagerPage';

// Mock MetadataProvider
vi.mock('../context/MetadataProvider', () => ({
  useMetadata: () => ({
    objects: [
      {
        name: 'account',
        label: 'Accounts',
        icon: 'Building',
        description: 'Customer accounts',
        fields: [
          { name: 'id', type: 'text', label: 'ID', readonly: true },
          { name: 'name', type: 'text', label: 'Account Name', required: true },
          { name: 'email', type: 'email', label: 'Email' },
          { name: 'status', type: 'select', label: 'Status', options: ['active', 'inactive'] },
        ],
        relationships: [
          { object: 'contact', type: 'one-to-many', name: 'contacts' },
        ],
      },
      {
        name: 'contact',
        label: 'Contacts',
        icon: 'Users',
        fields: [
          { name: 'id', type: 'text', label: 'ID', readonly: true },
          { name: 'name', type: 'text', label: 'Name', required: true },
        ],
      },
      {
        name: 'sys_user',
        label: 'Users',
        icon: 'Users',
        fields: [
          { name: 'id', type: 'text', label: 'ID', readonly: true },
          { name: 'name', type: 'text', label: 'Name', required: true },
          { name: 'email', type: 'email', label: 'Email', required: true },
        ],
      },
    ],
    refresh: vi.fn(),
  }),
}));

// Mock sonner toast
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

function renderPage(route = '/system/objects') {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <Routes>
        <Route path="/system/objects" element={<ObjectManagerPage />} />
        <Route path="/apps/:appName/system/objects" element={<ObjectManagerPage />} />
      </Routes>
    </MemoryRouter>
  );
}

describe('ObjectManagerPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render the page with Object Manager title', () => {
      renderPage();
      const titles = screen.getAllByText('Object Manager');
      expect(titles.length).toBeGreaterThanOrEqual(1);
      expect(screen.getByText('Manage object definitions and field configurations')).toBeDefined();
    });

    it('should render the page container', () => {
      renderPage();
      expect(screen.getByTestId('object-manager-page')).toBeDefined();
    });

    it('should render the ObjectManager component with objects from metadata', () => {
      renderPage();
      expect(screen.getByTestId('object-manager')).toBeDefined();
    });

    it('should display metadata objects in the list', () => {
      renderPage();
      // The object labels should appear in the list
      expect(screen.getByText('Accounts')).toBeDefined();
      expect(screen.getByText('Contacts')).toBeDefined();
    });
  });

  describe('Object Selection & Field Designer', () => {
    it('should show FieldDesigner when an object is selected', async () => {
      renderPage();

      // Find and click an object to select it
      const accountButtons = screen.getAllByText('Accounts');
      // Click the clickable object name button (not the section header)
      const selectButton = accountButtons.find(
        (el) => el.closest('[data-testid^="object-select-"]')
      );
      if (selectButton) {
        fireEvent.click(selectButton);
      }

      await waitFor(() => {
        expect(screen.getByTestId('field-designer')).toBeDefined();
      });
    });

    it('should show back button when a field designer is active', async () => {
      renderPage();

      const accountButtons = screen.getAllByText('Accounts');
      const selectButton = accountButtons.find(
        (el) => el.closest('[data-testid^="object-select-"]')
      );
      if (selectButton) {
        fireEvent.click(selectButton);
      }

      await waitFor(() => {
        expect(screen.getByTestId('back-to-objects')).toBeDefined();
      });
    });

    it('should return to object list when back button is clicked', async () => {
      renderPage();

      // Select an object
      const accountButtons = screen.getAllByText('Accounts');
      const selectButton = accountButtons.find(
        (el) => el.closest('[data-testid^="object-select-"]')
      );
      if (selectButton) {
        fireEvent.click(selectButton);
      }

      await waitFor(() => {
        expect(screen.getByTestId('back-to-objects')).toBeDefined();
      });

      // Click back
      fireEvent.click(screen.getByTestId('back-to-objects'));

      await waitFor(() => {
        expect(screen.getByTestId('object-manager')).toBeDefined();
      });
    });
  });
});
