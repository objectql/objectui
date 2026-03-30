/**
 * ObjectUI
 * Copyright (c) 2024-present ObjectStack Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { FieldDesigner } from '../FieldDesigner';
import type { DesignerFieldDefinition } from '@object-ui/types';

const MOCK_FIELDS: DesignerFieldDefinition[] = [
  {
    id: 'fld-1',
    name: 'name',
    label: 'Name',
    type: 'text',
    group: 'Basic Info',
    sortOrder: 1,
    required: true,
    isSystem: false,
  },
  {
    id: 'fld-2',
    name: 'email',
    label: 'Email',
    type: 'email',
    group: 'Basic Info',
    sortOrder: 2,
    required: true,
    unique: true,
    isSystem: false,
  },
  {
    id: 'fld-3',
    name: 'status',
    label: 'Status',
    type: 'select',
    group: 'Details',
    sortOrder: 1,
    options: [
      { label: 'Active', value: 'active', color: 'green' },
      { label: 'Inactive', value: 'inactive', color: 'gray' },
    ],
    isSystem: false,
  },
  {
    id: 'fld-4',
    name: 'id',
    label: 'ID',
    type: 'text',
    isSystem: true,
    externalId: true,
  },
  {
    id: 'fld-5',
    name: 'notes',
    label: 'Notes',
    type: 'textarea',
    hidden: true,
    trackHistory: true,
    isSystem: false,
  },
];

describe('FieldDesigner', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ============================
  // Rendering
  // ============================
  describe('Rendering', () => {
    it('should render the field designer', () => {
      const onFieldsChange = vi.fn();
      render(
        <FieldDesigner objectName="accounts" fields={MOCK_FIELDS} onFieldsChange={onFieldsChange} />
      );
      expect(screen.getByTestId('field-designer')).toBeDefined();
    });

    it('should render field items', () => {
      const onFieldsChange = vi.fn();
      render(
        <FieldDesigner objectName="accounts" fields={MOCK_FIELDS} onFieldsChange={onFieldsChange} />
      );
      expect(screen.getByTestId('field-item-fld-1')).toBeDefined();
      expect(screen.getByTestId('field-item-fld-2')).toBeDefined();
      expect(screen.getByTestId('field-item-fld-3')).toBeDefined();
    });

    it('should render add button', () => {
      const onFieldsChange = vi.fn();
      render(
        <FieldDesigner objectName="accounts" fields={MOCK_FIELDS} onFieldsChange={onFieldsChange} />
      );
      expect(screen.getByTestId('field-designer-add')).toBeDefined();
    });

    it('should render search input', () => {
      const onFieldsChange = vi.fn();
      render(
        <FieldDesigner objectName="accounts" fields={MOCK_FIELDS} onFieldsChange={onFieldsChange} />
      );
      expect(screen.getByTestId('field-designer-search')).toBeDefined();
    });

    it('should render type filter dropdown', () => {
      const onFieldsChange = vi.fn();
      render(
        <FieldDesigner objectName="accounts" fields={MOCK_FIELDS} onFieldsChange={onFieldsChange} />
      );
      expect(screen.getByTestId('field-designer-type-filter')).toBeDefined();
    });

    it('should show empty message when no fields', () => {
      const onFieldsChange = vi.fn();
      render(
        <FieldDesigner objectName="accounts" fields={[]} onFieldsChange={onFieldsChange} />
      );
      expect(screen.getByTestId('field-designer-empty')).toBeDefined();
    });

    it('should display object name in header', () => {
      const onFieldsChange = vi.fn();
      render(
        <FieldDesigner objectName="accounts" fields={MOCK_FIELDS} onFieldsChange={onFieldsChange} />
      );
      expect(screen.getByText('— accounts')).toBeDefined();
    });

    it('should display system badge for system fields', () => {
      const onFieldsChange = vi.fn();
      render(
        <FieldDesigner objectName="accounts" fields={MOCK_FIELDS} onFieldsChange={onFieldsChange} />
      );
      const badges = screen.getAllByText('System');
      expect(badges.length).toBeGreaterThan(0);
    });

    it('should display required indicator for required fields', () => {
      const onFieldsChange = vi.fn();
      render(
        <FieldDesigner objectName="accounts" fields={MOCK_FIELDS} onFieldsChange={onFieldsChange} />
      );
      // Required fields show an asterisk
      const asterisks = screen.getAllByText('*');
      expect(asterisks.length).toBeGreaterThanOrEqual(2); // name & email are required
    });
  });

  // ============================
  // Adding Fields
  // ============================
  describe('Adding Fields', () => {
    it('should add a new field on button click', () => {
      const onFieldsChange = vi.fn();
      render(
        <FieldDesigner objectName="accounts" fields={MOCK_FIELDS} onFieldsChange={onFieldsChange} />
      );
      fireEvent.click(screen.getByTestId('field-designer-add'));
      expect(onFieldsChange).toHaveBeenCalledWith(
        expect.arrayContaining([
          ...MOCK_FIELDS,
          expect.objectContaining({ type: 'text', label: expect.stringContaining('New Field') }),
        ])
      );
    });
  });

  // ============================
  // Search & Filter
  // ============================
  describe('Search & Filter', () => {
    it('should filter fields by search query', () => {
      const onFieldsChange = vi.fn();
      render(
        <FieldDesigner objectName="accounts" fields={MOCK_FIELDS} onFieldsChange={onFieldsChange} />
      );
      fireEvent.change(screen.getByTestId('field-designer-search'), {
        target: { value: 'email' },
      });
      expect(screen.getByTestId('field-item-fld-2')).toBeDefined();
      expect(screen.queryByTestId('field-item-fld-1')).toBeNull();
    });

    it('should filter fields by type', () => {
      const onFieldsChange = vi.fn();
      render(
        <FieldDesigner objectName="accounts" fields={MOCK_FIELDS} onFieldsChange={onFieldsChange} />
      );
      fireEvent.change(screen.getByTestId('field-designer-type-filter'), {
        target: { value: 'select' },
      });
      expect(screen.getByTestId('field-item-fld-3')).toBeDefined();
      expect(screen.queryByTestId('field-item-fld-1')).toBeNull();
    });
  });

  // ============================
  // Editing Fields
  // ============================
  describe('Editing Fields', () => {
    it('should toggle inline editor on edit button click', () => {
      const onFieldsChange = vi.fn();
      render(
        <FieldDesigner objectName="accounts" fields={MOCK_FIELDS} onFieldsChange={onFieldsChange} />
      );
      fireEvent.click(screen.getByTestId('field-edit-fld-1'));
      expect(screen.getByTestId('field-editor')).toBeDefined();
    });

    it('should close inline editor on second edit click', () => {
      const onFieldsChange = vi.fn();
      render(
        <FieldDesigner objectName="accounts" fields={MOCK_FIELDS} onFieldsChange={onFieldsChange} />
      );
      fireEvent.click(screen.getByTestId('field-edit-fld-1'));
      expect(screen.getByTestId('field-editor')).toBeDefined();
      fireEvent.click(screen.getByTestId('field-edit-fld-1'));
      expect(screen.queryByTestId('field-editor')).toBeNull();
    });

    it('should show field type selector in editor', () => {
      const onFieldsChange = vi.fn();
      render(
        <FieldDesigner objectName="accounts" fields={MOCK_FIELDS} onFieldsChange={onFieldsChange} />
      );
      fireEvent.click(screen.getByTestId('field-edit-fld-1'));
      expect(screen.getByTestId('field-editor-type')).toBeDefined();
    });

    it('should show boolean toggles in editor', () => {
      const onFieldsChange = vi.fn();
      render(
        <FieldDesigner objectName="accounts" fields={MOCK_FIELDS} onFieldsChange={onFieldsChange} />
      );
      fireEvent.click(screen.getByTestId('field-edit-fld-1'));
      expect(screen.getByTestId('field-editor-required')).toBeDefined();
      expect(screen.getByTestId('field-editor-unique')).toBeDefined();
      expect(screen.getByTestId('field-editor-readonly')).toBeDefined();
      expect(screen.getByTestId('field-editor-hidden')).toBeDefined();
      expect(screen.getByTestId('field-editor-indexed')).toBeDefined();
      expect(screen.getByTestId('field-editor-external-id')).toBeDefined();
      expect(screen.getByTestId('field-editor-track-history')).toBeDefined();
    });
  });

  // ============================
  // Read-only Mode
  // ============================
  describe('Read-only Mode', () => {
    it('should hide add button in read-only mode', () => {
      const onFieldsChange = vi.fn();
      render(
        <FieldDesigner
          objectName="accounts"
          fields={MOCK_FIELDS}
          onFieldsChange={onFieldsChange}
          readOnly
        />
      );
      expect(screen.queryByTestId('field-designer-add')).toBeNull();
    });

    it('should disable edit buttons in read-only mode', () => {
      const onFieldsChange = vi.fn();
      render(
        <FieldDesigner
          objectName="accounts"
          fields={MOCK_FIELDS}
          onFieldsChange={onFieldsChange}
          readOnly
        />
      );
      expect(
        (screen.getByTestId('field-edit-fld-1') as HTMLButtonElement).disabled
      ).toBe(true);
    });
  });

  // ============================
  // Deleting Fields
  // ============================
  describe('Deleting Fields', () => {
    it('should not show delete button for system fields', () => {
      const onFieldsChange = vi.fn();
      render(
        <FieldDesigner objectName="accounts" fields={MOCK_FIELDS} onFieldsChange={onFieldsChange} />
      );
      expect(screen.queryByTestId('field-delete-fld-4')).toBeNull();
    });

    it('should show delete button for custom fields', () => {
      const onFieldsChange = vi.fn();
      render(
        <FieldDesigner objectName="accounts" fields={MOCK_FIELDS} onFieldsChange={onFieldsChange} />
      );
      expect(screen.getByTestId('field-delete-fld-1')).toBeDefined();
    });
  });

  // ============================
  // Select Field Options
  // ============================
  describe('Select Field Options', () => {
    it('should show options editor for select fields', () => {
      const onFieldsChange = vi.fn();
      render(
        <FieldDesigner objectName="accounts" fields={MOCK_FIELDS} onFieldsChange={onFieldsChange} />
      );
      // Open the select field editor (fld-3 is a select type)
      fireEvent.click(screen.getByTestId('field-edit-fld-3'));
      expect(screen.getByTestId('field-option-0')).toBeDefined();
      expect(screen.getByTestId('field-option-1')).toBeDefined();
    });

    it('should show add option button for select fields', () => {
      const onFieldsChange = vi.fn();
      render(
        <FieldDesigner objectName="accounts" fields={MOCK_FIELDS} onFieldsChange={onFieldsChange} />
      );
      fireEvent.click(screen.getByTestId('field-edit-fld-3'));
      expect(screen.getByTestId('field-editor-add-option')).toBeDefined();
    });
  });
});
