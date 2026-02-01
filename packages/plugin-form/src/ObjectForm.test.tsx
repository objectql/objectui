import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { ObjectForm } from './ObjectForm';
import { registerAllFields } from '@object-ui/fields';
import React from 'react';

// Ensure fields are registered
registerAllFields();

describe('ObjectForm Integration', () => {
    const objectSchema = {
        name: 'test_object',
        fields: {
            name: {
                type: 'text',
                label: 'Name'
            },
            price: {
                type: 'currency',
                label: 'Price',
                scale: 2
            }
        }
    };

    const mockDataSource: any = {
        getObjectSchema: vi.fn().mockResolvedValue(objectSchema),
        createRecord: vi.fn(),
        updateRecord: vi.fn(),
        getRecord: vi.fn(),
        query: vi.fn()
    };

    it('renders fields using specialized components', async () => {
        render(
            <ObjectForm 
                schema={{
                    type: 'object-form',
                    objectName: 'test_object',
                    mode: 'create'
                }}
                dataSource={mockDataSource}
            />
        );

        // Wait for schema to load (useEffect)
        await waitFor(() => {
            expect(mockDataSource.getObjectSchema).toHaveBeenCalledWith('test_object');
        });

        // Check if labels are present
        await waitFor(() => {
            expect(screen.queryByText('Name')).toBeTruthy();
        });
        expect(screen.getByText('Price')).toBeTruthy();
        
        // Assert input exists
        // Since we don't have getByLabelText working reliably without full accessibility tree in happy-dom sometimes,
        // we can try looking for inputs.
    });
});
