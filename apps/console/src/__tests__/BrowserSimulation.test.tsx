
import { describe, it, expect, vi, beforeAll } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import React from 'react';
import appConfig from '../../objectstack.config';

// -----------------------------------------------------------------------------
// SYSTEM INTEGRATION TEST
// -----------------------------------------------------------------------------
// This test simulates the exact browser runtime environment of the Console App.
// It verifies that the configuration loaded from 'kitchen-sink' is correctly
// processed by the router and the 'PageRenderer' component we just fixed.
// -----------------------------------------------------------------------------

// 1. Mock the DataSource to avoid real network calls
class MockDataSource {
    async retrieve() { return {}; }
    async find() { return []; }
}
const mockClient = {
    connect: vi.fn().mockResolvedValue(true)
};

// 2. Mock App Dependencies that are outside the scope of UI rendering
vi.mock('@objectstack/client', () => ({
    ObjectStackClient: vi.fn(() => mockClient)
}));
vi.mock('../dataSource', () => ({
    ObjectStackDataSource: vi.fn(() => new MockDataSource())
}));

// 3. Import Components under test
import { PageView } from '../components/PageView';

describe('System Integration: Help Page Rendering', () => {
    
    it('should successfully locate and render the "help_page" from kitchen-sink config', async () => {
        // A. Verify Configuration Integrity
        const helpPage = appConfig.pages?.find((p: any) => p.name === 'help_page');
        expect(helpPage).toBeDefined();

        // B. Simulate Browser Navigation
        // IMPORTANT: We must setup the Route path so :pageName param is captured
        render(
            <MemoryRouter initialEntries={['/page/help_page']}>
                 <Routes>
                    <Route path="/page/:pageName" element={<PageView />} />
                 </Routes>
            </MemoryRouter>
        );

        // C. Verify Visual Output
        await waitFor(() => {
            expect(screen.getByText(/Application Guide/i)).toBeInTheDocument();
        });

        expect(screen.getByText(/Welcome to the ObjectStack Console/i)).toBeInTheDocument();
        expect(screen.getByText(/Dynamic Object CRUD/i)).toBeInTheDocument();
    });
});
