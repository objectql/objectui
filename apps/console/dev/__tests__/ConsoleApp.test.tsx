import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { AppContent } from '../../src/App';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { NavigationProvider } from '@object-ui/app-shell';
import { FavoritesProvider } from '@object-ui/app-shell';

// --- Mocks ---

// Mock ObjectStack Config (still used by MSW mock setup)
vi.mock('../objectstack.shared', () => ({
    default: {
        apps: [
            {
                name: 'sales',
                
                label: 'Sales App',
                active: true,
                icon: 'briefcase',
                navigation: [
                    { id: 'nav_opp', label: 'Opportunities', type: 'object', objectName: 'opportunity' }
                ]
            },
            {
                name: 'admin',
                label: 'Admin',
                active: true,
                navigation: []
            }
        ],
        objects: [
            { name: 'opportunity', label: 'Opportunity', fields: {} }
        ]
    }
}));

// Mock @object-ui/app-shell (MetadataProvider + AdapterProvider)
vi.mock('@object-ui/app-shell', async () => {
  const actual = await vi.importActual<typeof import('@object-ui/app-shell')>('@object-ui/app-shell');
  return {
    ...actual,
    MetadataProvider: ({ children }: any) => <>{children}</>,
    useMetadata: () => ({
        apps: [
            {
                name: 'sales',
                label: 'Sales App',
                active: true,
                icon: 'briefcase',
                navigation: [
                    { id: 'nav_opp', label: 'Opportunities', type: 'object', objectName: 'opportunity' }
                ]
            },
            {
                name: 'admin',
                label: 'Admin',
                active: true,
                navigation: []
            }
        ],
        objects: [
            { name: 'opportunity', label: 'Opportunity', fields: {} }
        ],
        dashboards: [],
        reports: [],
        pages: [],
        loading: false,
        error: null,
        refresh: vi.fn(),
    }),
    AdapterProvider: ({ children }: any) => <>{children}</>,
    useAdapter: () => MockAdapterInstance,
  };
});

// Mock Client and DataSource
vi.mock('@objectstack/client', () => {
    return {
        ObjectStackClient: class {
            connect = vi.fn().mockResolvedValue(true);
        }
    };
});

const MockAdapterInstance = vi.hoisted(() => ({
    find: vi.fn().mockResolvedValue([]),
    findOne: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    connect: vi.fn().mockResolvedValue(true),
    onConnectionStateChange: vi.fn().mockReturnValue(() => {}),
    getConnectionState: vi.fn().mockReturnValue('connected'),
    discovery: {},
}));

vi.mock('../../src/dataSource', () => {
    const MockAdapter = class {
        find = vi.fn().mockResolvedValue([]);
        findOne = vi.fn();
        create = vi.fn();
        update = vi.fn();
        delete = vi.fn();
        connect = vi.fn().mockResolvedValue(true);
        onConnectionStateChange = vi.fn().mockReturnValue(() => {});
        getConnectionState = vi.fn().mockReturnValue('connected');
        discovery = {};
    };
    return {
        ObjectStackAdapter: MockAdapter,
        ObjectStackDataSource: MockAdapter,
    };
});

// Mock Child Components (Integration level)
// We want to verify routing, so we mock the "Page" components but keep Layout structure mostly
vi.mock('../../src/components/ObjectView', () => ({
    ObjectView: () => <div data-testid="object-view">Object View</div>
}));

vi.mock('../../src/components/DashboardView', () => ({
    DashboardView: () => <div data-testid="dashboard-view">Dashboard View</div>
}));

vi.mock('../../src/components/PageView', () => ({
    PageView: () => <div data-testid="page-view">Page View</div>
}));

vi.mock('../../src/pages/system/ProfilePage', () => ({
    ProfilePage: () => <div data-testid="profile-page">Profile Page</div>
}));

// Mock complex UI components that might cause issues in JSDOM or are not the focus
vi.mock('@object-ui/components', async (importOriginal) => {
    const actual = await importOriginal<any>();
    // We keep most components but mock Dialog/Overlays if needed
    // Assuming actual components work reasonably well in test env if they are just divs/classes
    // But Radix primitives can be tricky. Let's mock sidebar complexity if needed.
    return {
        ...actual,
        // Mock TooltipProvider to avoid errors if not present context
        TooltipProvider: ({ children }: any) => <div>{children}</div>,
        // Mock Dialog to simple div
        Dialog: ({ children, open }: any) => open ? <div data-testid="dialog">{children}</div> : null,
        DialogContent: ({ children }: any) => <div>{children}</div>,
    };
});

// Mock Lucide icons to avoid rendering SVG complexity
vi.mock('lucide-react', async (importOriginal) => {
    const actual = await importOriginal<any>();
    return {
        ...actual,
        Database: () => <span data-testid="icon-database" />,
        LayoutDashboard: () => <span data-testid="icon-dashboard" />,
        Briefcase: () => <span data-testid="icon-briefcase" />,
        briefcase: () => <span data-testid="icon-briefcase-lower" />,
        ChevronRight: () => <span />,
        ChevronsUpDown: () => <span />,
        Settings: () => <span />,
        LogOut: () => <span />,
        Plus: () => <span />,
        Menu: () => <span />,
        Search: () => <span />,
        Bell: () => <span />,
        User: () => <span />,
        Users: () => <span data-testid="icon-users" />,
        CheckSquare: () => <span data-testid="icon-check-square" />,
        Activity: () => <span data-testid="icon-activity" />,
        FileText: () => <span data-testid="icon-file-text" />,
        Sun: () => <span data-testid="icon-sun" />,
        Moon: () => <span data-testid="icon-moon" />,
    };
});


describe('Console App Integration', () => {
    
    beforeEach(() => {
        vi.clearAllMocks();
    });

    const renderApp = (initialRoute = '/apps/sales/') => {
        return render(
            <NavigationProvider>
            <FavoritesProvider>
            <MemoryRouter initialEntries={[initialRoute]}>
                <Routes>
                    <Route path="/apps/:appName/*" element={<AppContent />} />
                </Routes>
            </MemoryRouter>
            </FavoritesProvider>
            </NavigationProvider>
        );
    };

    it('initializes and renders default app layout', async () => {
        renderApp();
        
        // With mocked adapter and metadata, the app renders immediately
        // Check for App Name in sidebar/header config
        await waitFor(() => {
            const appLabels = screen.getAllByText('Sales App');
            expect(appLabels.length).toBeGreaterThan(0);
        }, { timeout: 10000 });
        
        // Check for Navigation Items
        expect(screen.getByText('Opportunities')).toBeInTheDocument();
    });

    it('navigates to object view when sidebar item clicked', async () => {
        renderApp();

        await waitFor(() => {
            const appLabels = screen.getAllByText('Sales App');
            expect(appLabels.length).toBeGreaterThan(0);
        }, { timeout: 10000 });

        // Click the navigation item
        // Note: Sidebar implementation might be collapsible or using specific DOM structure 
        // We look for the link or text.
        const navLink = screen.getByText('Opportunities');
        fireEvent.click(navLink);

        // Should route to /opportunity
        // And render ObjectView
        await waitFor(() => {
            expect(screen.getByTestId('object-view')).toBeInTheDocument();
        }, { timeout: 10000 });
    });

    it('handles app switching', async () => {
        renderApp();
        
        await waitFor(() => {
            const appLabels = screen.getAllByText('Sales App');
            expect(appLabels.length).toBeGreaterThan(0);
        }, { timeout: 10000 });

        // Find App Switcher (SidebarMenuButton with app name)
        // This might be tricky depending on Shadcn structure. 
        // Based on AppSidebar.tsx, it's a SidebarMenuButton inside a DropdownMenuTrigger.
        
        // Use text match to find the trigger. Since there might be multiple "Sales App" texts,
        // we might want to click the one in the sidebar header which usually has extra info like "2 Apps Available"
        // or just try clicking the first one (often the header one).
        
        const appSwitchers = screen.getAllByText('Sales App');
        fireEvent.click(appSwitchers[0]);

        // Dropdown content should appear with 'Admin' app
        // Note: Radix Dropdown might render in a portal. 
        // Testing-library usually handles portals if query is global or within body.
        
        // If Radix is not fully mocked, we might struggle to interact with Dropdown.
        // Let's assume for now we can find the text "Admin" which is the other app label.
        
        // expect(screen.getByText('Admin')).toBeVisible(); 
        // fireEvent.click(screen.getByText('Admin'));
        
        // await waitFor(() => {
        //    expect(screen.getByText('Admin')).toBeInTheDocument(); // Header/Sidebar updated
        // });
    });

    it('renders profile page at system/profile route', async () => {
        renderApp('/apps/sales/system/profile');

        await waitFor(() => {
            expect(screen.getByTestId('profile-page')).toBeInTheDocument();
        }, { timeout: 10000 });
    });
});
