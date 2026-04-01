/**
 * Tests for HomeLayout — lightweight nav shell for /home.
 * Validates: layout rendering, user avatar, navigation links.
 *
 * Note: Radix DropdownMenu portal rendering is limited in jsdom,
 * so we test the trigger and visible elements rather than dropdown contents.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import { HomeLayout } from '../pages/home/HomeLayout';

// --- Mocks ---

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<any>();
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const mockSignOut = vi.fn();
vi.mock('@object-ui/auth', () => ({
  useAuth: () => ({
    user: { name: 'Alice Dev', email: 'alice@test.com', image: null },
    signOut: mockSignOut,
    isAuthenticated: true,
  }),
  getUserInitials: (u: any) => {
    if (!u?.name) return 'U';
    return u.name.split(' ').map((s: string) => s[0]).join('').toUpperCase().slice(0, 2);
  },
}));

vi.mock('@object-ui/i18n', () => ({
  useObjectTranslation: () => ({
    t: (_key: string, opts?: any) => opts?.defaultValue ?? _key,
    language: 'en',
    changeLanguage: vi.fn(),
    direction: 'ltr',
    i18n: {},
  }),
}));

// Mock @object-ui/components to keep most components
vi.mock('@object-ui/components', async (importOriginal) => {
  const actual = await importOriginal<any>();
  return {
    ...actual,
    TooltipProvider: ({ children }: any) => <div>{children}</div>,
  };
});

describe('HomeLayout', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderLayout = (children: React.ReactNode = <div>Page Content</div>) => {
    return render(
      <MemoryRouter initialEntries={['/home']}>
        <HomeLayout>{children}</HomeLayout>
      </MemoryRouter>,
    );
  };

  it('renders the layout shell with data-testid', () => {
    renderLayout();
    expect(screen.getByTestId('home-layout')).toBeInTheDocument();
  });

  it('renders the Home branding button in the top bar', () => {
    renderLayout();
    const brand = screen.getByTestId('home-layout-brand');
    expect(brand).toBeInTheDocument();
    expect(brand).toHaveTextContent('Home');
  });

  it('renders children inside the layout', () => {
    renderLayout(<div data-testid="child-content">Hello World</div>);
    expect(screen.getByTestId('child-content')).toBeInTheDocument();
  });

  it('renders user avatar with initials fallback', () => {
    renderLayout();
    // The avatar trigger should show user initials "AD" (Alice Dev)
    expect(screen.getByTestId('home-layout-user-trigger')).toBeInTheDocument();
    expect(screen.getByText('AD')).toBeInTheDocument();
  });

  it('renders Settings button in the top bar', () => {
    renderLayout();
    expect(screen.getByTestId('home-layout-settings-btn')).toBeInTheDocument();
  });

  it('navigates to /system when Settings button is clicked', () => {
    renderLayout();
    fireEvent.click(screen.getByTestId('home-layout-settings-btn'));
    expect(mockNavigate).toHaveBeenCalledWith('/system');
  });

  it('navigates to /home when brand button is clicked', () => {
    renderLayout();
    fireEvent.click(screen.getByTestId('home-layout-brand'));
    expect(mockNavigate).toHaveBeenCalledWith('/home');
  });

  it('renders sticky header element', () => {
    renderLayout();
    const header = screen.getByTestId('home-layout').querySelector('header');
    expect(header).toBeInTheDocument();
    expect(header?.className).toContain('sticky');
  });

  it('renders user menu trigger as a round button', () => {
    renderLayout();
    const trigger = screen.getByTestId('home-layout-user-trigger');
    expect(trigger.className).toContain('rounded-full');
  });
});
