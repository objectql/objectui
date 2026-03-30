/**
 * ObjectUI
 * Copyright (c) 2024-present ObjectStack Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ObjectManager } from '../ObjectManager';
import type { ObjectDefinition } from '@object-ui/types';

const MOCK_OBJECTS: ObjectDefinition[] = [
  {
    id: 'obj-1',
    name: 'accounts',
    label: 'Accounts',
    pluralLabel: 'Accounts',
    description: 'Customer accounts',
    icon: 'Building',
    group: 'Custom Objects',
    sortOrder: 1,
    isSystem: false,
    enabled: true,
    fieldCount: 12,
    relationships: [
      { relatedObject: 'contacts', type: 'one-to-many', label: 'Contacts' },
    ],
  },
  {
    id: 'obj-2',
    name: 'contacts',
    label: 'Contacts',
    group: 'Custom Objects',
    sortOrder: 2,
    isSystem: false,
    enabled: true,
    fieldCount: 8,
  },
  {
    id: 'obj-3',
    name: 'users',
    label: 'Users',
    group: 'System Objects',
    isSystem: true,
    enabled: true,
    fieldCount: 5,
  },
];

describe('ObjectManager', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ============================
  // Rendering
  // ============================
  describe('Rendering', () => {
    it('should render the object manager', () => {
      const onObjectsChange = vi.fn();
      render(<ObjectManager objects={MOCK_OBJECTS} onObjectsChange={onObjectsChange} />);
      expect(screen.getByTestId('object-manager')).toBeDefined();
    });

    it('should render object items', () => {
      const onObjectsChange = vi.fn();
      render(<ObjectManager objects={MOCK_OBJECTS} onObjectsChange={onObjectsChange} />);
      expect(screen.getByTestId('object-item-obj-1')).toBeDefined();
      expect(screen.getByTestId('object-item-obj-2')).toBeDefined();
      expect(screen.getByTestId('object-item-obj-3')).toBeDefined();
    });

    it('should render add button', () => {
      const onObjectsChange = vi.fn();
      render(<ObjectManager objects={MOCK_OBJECTS} onObjectsChange={onObjectsChange} />);
      expect(screen.getByTestId('object-manager-add')).toBeDefined();
    });

    it('should render search input', () => {
      const onObjectsChange = vi.fn();
      render(<ObjectManager objects={MOCK_OBJECTS} onObjectsChange={onObjectsChange} />);
      expect(screen.getByTestId('object-manager-search')).toBeDefined();
    });

    it('should show empty message when no objects', () => {
      const onObjectsChange = vi.fn();
      render(<ObjectManager objects={[]} onObjectsChange={onObjectsChange} />);
      expect(screen.getByTestId('object-manager-empty')).toBeDefined();
    });

    it('should display system badge for system objects', () => {
      const onObjectsChange = vi.fn();
      render(<ObjectManager objects={MOCK_OBJECTS} onObjectsChange={onObjectsChange} />);
      // System badge text should exist
      const badges = screen.getAllByText('System');
      expect(badges.length).toBeGreaterThan(0);
    });
  });

  // ============================
  // Adding Objects
  // ============================
  describe('Adding Objects', () => {
    it('should add a new object on button click', () => {
      const onObjectsChange = vi.fn();
      render(<ObjectManager objects={MOCK_OBJECTS} onObjectsChange={onObjectsChange} />);
      fireEvent.click(screen.getByTestId('object-manager-add'));
      expect(onObjectsChange).toHaveBeenCalledWith(
        expect.arrayContaining([
          ...MOCK_OBJECTS,
          expect.objectContaining({ label: expect.stringContaining('New Object') }),
        ])
      );
    });
  });

  // ============================
  // Selecting Objects
  // ============================
  describe('Selecting Objects', () => {
    it('should call onSelectObject when clicking an object', () => {
      const onObjectsChange = vi.fn();
      const onSelectObject = vi.fn();
      render(
        <ObjectManager
          objects={MOCK_OBJECTS}
          onObjectsChange={onObjectsChange}
          onSelectObject={onSelectObject}
        />
      );
      fireEvent.click(screen.getByTestId('object-select-obj-1'));
      expect(onSelectObject).toHaveBeenCalledWith(MOCK_OBJECTS[0]);
    });
  });

  // ============================
  // Editing Objects
  // ============================
  describe('Editing Objects', () => {
    it('should toggle inline editor on edit button click', () => {
      const onObjectsChange = vi.fn();
      render(<ObjectManager objects={MOCK_OBJECTS} onObjectsChange={onObjectsChange} />);
      fireEvent.click(screen.getByTestId('object-edit-obj-1'));
      expect(screen.getByTestId('object-editor')).toBeDefined();
    });

    it('should close inline editor on second edit click', () => {
      const onObjectsChange = vi.fn();
      render(<ObjectManager objects={MOCK_OBJECTS} onObjectsChange={onObjectsChange} />);
      fireEvent.click(screen.getByTestId('object-edit-obj-1'));
      expect(screen.getByTestId('object-editor')).toBeDefined();
      fireEvent.click(screen.getByTestId('object-edit-obj-1'));
      expect(screen.queryByTestId('object-editor')).toBeNull();
    });
  });

  // ============================
  // Search
  // ============================
  describe('Search', () => {
    it('should filter objects by search query', () => {
      const onObjectsChange = vi.fn();
      render(<ObjectManager objects={MOCK_OBJECTS} onObjectsChange={onObjectsChange} />);
      fireEvent.change(screen.getByTestId('object-manager-search'), {
        target: { value: 'account' },
      });
      expect(screen.getByTestId('object-item-obj-1')).toBeDefined();
      expect(screen.queryByTestId('object-item-obj-2')).toBeNull();
    });
  });

  // ============================
  // System Objects Visibility
  // ============================
  describe('System Objects Visibility', () => {
    it('should hide system objects when showSystemObjects is false', () => {
      const onObjectsChange = vi.fn();
      render(
        <ObjectManager
          objects={MOCK_OBJECTS}
          onObjectsChange={onObjectsChange}
          showSystemObjects={false}
        />
      );
      expect(screen.queryByTestId('object-item-obj-3')).toBeNull();
    });

    it('should show system objects by default', () => {
      const onObjectsChange = vi.fn();
      render(<ObjectManager objects={MOCK_OBJECTS} onObjectsChange={onObjectsChange} />);
      expect(screen.getByTestId('object-item-obj-3')).toBeDefined();
    });
  });

  // ============================
  // Read-only Mode
  // ============================
  describe('Read-only Mode', () => {
    it('should hide add button in read-only mode', () => {
      const onObjectsChange = vi.fn();
      render(
        <ObjectManager objects={MOCK_OBJECTS} onObjectsChange={onObjectsChange} readOnly />
      );
      expect(screen.queryByTestId('object-manager-add')).toBeNull();
    });

    it('should disable edit buttons in read-only mode', () => {
      const onObjectsChange = vi.fn();
      render(
        <ObjectManager objects={MOCK_OBJECTS} onObjectsChange={onObjectsChange} readOnly />
      );
      expect(
        (screen.getByTestId('object-edit-obj-1') as HTMLButtonElement).disabled
      ).toBe(true);
    });

    it('should not show delete button for system objects', () => {
      const onObjectsChange = vi.fn();
      render(<ObjectManager objects={MOCK_OBJECTS} onObjectsChange={onObjectsChange} />);
      expect(screen.queryByTestId('object-delete-obj-3')).toBeNull();
    });
  });

  // ============================
  // Deleting Objects
  // ============================
  describe('Deleting Objects', () => {
    it('should not allow deleting system objects (no delete button)', () => {
      const onObjectsChange = vi.fn();
      render(<ObjectManager objects={MOCK_OBJECTS} onObjectsChange={onObjectsChange} />);
      // System object should not have delete button
      expect(screen.queryByTestId('object-delete-obj-3')).toBeNull();
    });

    it('should show delete button for custom objects', () => {
      const onObjectsChange = vi.fn();
      render(<ObjectManager objects={MOCK_OBJECTS} onObjectsChange={onObjectsChange} />);
      expect(screen.getByTestId('object-delete-obj-1')).toBeDefined();
    });
  });
});
