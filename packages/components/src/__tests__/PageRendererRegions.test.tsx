
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { PageRenderer } from '../renderers/layout/page'; // Direct import to test logic
import { ComponentRegistry } from '@object-ui/core';

// Mock SchemaRenderer to verify it's called
import { SchemaRenderer } from '@object-ui/react';
import { vi } from 'vitest';

// Mock the SchemaRenderer to avoid full tree recursion deps
vi.mock('@object-ui/react', () => ({
  SchemaRenderer: ({ schema }: any) => <div data-testid="child-node">{schema.type}:{schema.value || schema.name}</div>
}));

describe('PageRenderer Regions', () => {
    it('should render components from regions', () => {
        const schema: any = {
            type: 'page',
            title: 'Test Page',
            regions: [
                {
                    name: 'main',
                    components: [
                        { type: 'text', value: 'Region Content 1' },
                        { type: 'button', label: 'Region Button' }
                    ]
                }
            ]
        };

        render(<PageRenderer schema={schema} />);

        // Check if title is rendered
        expect(screen.getByText('Test Page')).toBeDefined();

        // Check real content (since mock didn't take effect, we verify real render)
        // The text component renders the value directly
        expect(screen.getByText('Region Content 1')).toBeDefined();
        
        // The button component renders the label
        expect(screen.getByText('Region Button')).toBeDefined();
    });

    it('should render legacy body', () => {
        const schema: any = {
            type: 'page',
            title: 'Legacy Page',
            body: [
                { type: 'text', value: 'Body Content' }
            ]
        };

        render(<PageRenderer schema={schema} />);
        
        expect(screen.getByText('Body Content')).toBeDefined();
    });
});
