/**
 * MetadataFormDialog Tests
 *
 * Tests for the generic create/edit dialog driven by the metadata type
 * registry's `formFields` configuration.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MetadataFormDialog } from '../components/MetadataFormDialog';

beforeEach(() => {
  vi.clearAllMocks();
});

describe('MetadataFormDialog', () => {
  const defaultProps = {
    open: true,
    onOpenChange: vi.fn(),
    mode: 'create' as const,
    typeLabel: 'Dashboard',
    onSubmit: vi.fn().mockResolvedValue(undefined),
  };

  describe('create mode', () => {
    it('should render dialog with create title', () => {
      render(<MetadataFormDialog {...defaultProps} />);
      expect(screen.getByText('New Dashboard')).toBeInTheDocument();
    });

    it('should render default form fields when no formFields provided', () => {
      render(<MetadataFormDialog {...defaultProps} />);
      expect(screen.getByTestId('metadata-field-name')).toBeInTheDocument();
      expect(screen.getByTestId('metadata-field-label')).toBeInTheDocument();
      expect(screen.getByTestId('metadata-field-description')).toBeInTheDocument();
    });

    it('should render custom form fields from formFields prop', () => {
      const formFields = [
        { key: 'name', label: 'Name', required: true },
        { key: 'title', label: 'Title', required: false },
      ];
      render(<MetadataFormDialog {...defaultProps} formFields={formFields} />);
      expect(screen.getByTestId('metadata-field-name')).toBeInTheDocument();
      expect(screen.getByTestId('metadata-field-title')).toBeInTheDocument();
      expect(screen.queryByTestId('metadata-field-description')).not.toBeInTheDocument();
    });

    it('should show Create button text', () => {
      render(<MetadataFormDialog {...defaultProps} />);
      expect(screen.getByTestId('metadata-form-submit-btn')).toHaveTextContent('Create');
    });

    it('should disable submit when required fields are empty', () => {
      render(<MetadataFormDialog {...defaultProps} />);
      expect(screen.getByTestId('metadata-form-submit-btn')).toBeDisabled();
    });

    it('should enable submit when required fields are filled', () => {
      render(<MetadataFormDialog {...defaultProps} />);
      fireEvent.change(screen.getByTestId('metadata-field-name'), {
        target: { value: 'my_dash' },
      });
      fireEvent.change(screen.getByTestId('metadata-field-label'), {
        target: { value: 'My Dash' },
      });
      expect(screen.getByTestId('metadata-form-submit-btn')).not.toBeDisabled();
    });

    it('should call onSubmit with form values when submitted', async () => {
      const mockSubmit = vi.fn().mockResolvedValue(undefined);
      render(<MetadataFormDialog {...defaultProps} onSubmit={mockSubmit} />);

      fireEvent.change(screen.getByTestId('metadata-field-name'), {
        target: { value: 'my_dash' },
      });
      fireEvent.change(screen.getByTestId('metadata-field-label'), {
        target: { value: 'My Dashboard' },
      });
      fireEvent.click(screen.getByTestId('metadata-form-submit-btn'));

      await waitFor(() => {
        expect(mockSubmit).toHaveBeenCalledWith(
          expect.objectContaining({
            name: 'my_dash',
            label: 'My Dashboard',
          }),
        );
      });
    });

    it('should call onOpenChange(false) after successful submit', async () => {
      const mockOpenChange = vi.fn();
      render(
        <MetadataFormDialog
          {...defaultProps}
          onOpenChange={mockOpenChange}
        />,
      );

      fireEvent.change(screen.getByTestId('metadata-field-name'), {
        target: { value: 'test' },
      });
      fireEvent.change(screen.getByTestId('metadata-field-label'), {
        target: { value: 'Test' },
      });
      fireEvent.click(screen.getByTestId('metadata-form-submit-btn'));

      await waitFor(() => {
        expect(mockOpenChange).toHaveBeenCalledWith(false);
      });
    });

    it('should close dialog when Cancel is clicked', () => {
      const mockOpenChange = vi.fn();
      render(
        <MetadataFormDialog
          {...defaultProps}
          onOpenChange={mockOpenChange}
        />,
      );
      fireEvent.click(screen.getByTestId('metadata-form-cancel-btn'));
      expect(mockOpenChange).toHaveBeenCalledWith(false);
    });
  });

  describe('edit mode', () => {
    const editProps = {
      ...defaultProps,
      mode: 'edit' as const,
      initialValues: { name: 'existing_dash', label: 'Existing Dashboard', description: 'Old desc' },
    };

    it('should render dialog with edit title', () => {
      render(<MetadataFormDialog {...editProps} />);
      expect(screen.getByText('Edit Dashboard')).toBeInTheDocument();
    });

    it('should show Save button text', () => {
      render(<MetadataFormDialog {...editProps} />);
      expect(screen.getByTestId('metadata-form-submit-btn')).toHaveTextContent('Save');
    });

    it('should pre-fill form fields with initial values', () => {
      render(<MetadataFormDialog {...editProps} />);
      expect(screen.getByTestId('metadata-field-name')).toHaveValue('existing_dash');
      expect(screen.getByTestId('metadata-field-label')).toHaveValue('Existing Dashboard');
      expect(screen.getByTestId('metadata-field-description')).toHaveValue('Old desc');
    });

    it('should disable fields with disabledOnEdit in edit mode', () => {
      const formFields = [
        { key: 'name', label: 'Name', required: true, disabledOnEdit: true },
        { key: 'label', label: 'Label', required: true },
      ];
      render(
        <MetadataFormDialog
          {...editProps}
          formFields={formFields}
        />,
      );
      expect(screen.getByTestId('metadata-field-name')).toBeDisabled();
      expect(screen.getByTestId('metadata-field-label')).not.toBeDisabled();
    });
  });

  describe('textarea fields', () => {
    it('should render textarea for fields with type textarea', () => {
      const formFields = [
        { key: 'name', label: 'Name', required: true },
        { key: 'description', label: 'Description', type: 'textarea' as const },
      ];
      render(<MetadataFormDialog {...defaultProps} formFields={formFields} />);
      const desc = screen.getByTestId('metadata-field-description');
      expect(desc.tagName).toBe('TEXTAREA');
    });
  });

  describe('when dialog is closed', () => {
    it('should not render dialog content when open is false', () => {
      render(<MetadataFormDialog {...defaultProps} open={false} />);
      expect(screen.queryByTestId('metadata-form-dialog')).not.toBeInTheDocument();
    });
  });
});
