/**
 * ObjectUI
 * Copyright (c) 2024-present ObjectStack Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ObjectGallery } from '../ObjectGallery';

// Mock useDataScope, useSchemaContext, and useNavigationOverlay
const mockHandleClick = vi.fn();
const mockNavigationOverlay = {
  isOverlay: false,
  handleClick: mockHandleClick,
  selectedRecord: null,
  isOpen: false,
  close: vi.fn(),
  setIsOpen: vi.fn(),
  mode: 'page' as const,
  width: undefined,
  view: undefined,
  open: vi.fn(),
};

vi.mock('@object-ui/react', () => ({
  useDataScope: () => undefined,
  useSchemaContext: () => ({ dataSource: undefined }),
  useNavigationOverlay: () => mockNavigationOverlay,
}));

vi.mock('@object-ui/components', () => ({
  cn: (...args: any[]) => args.filter(Boolean).join(' '),
  Card: ({ children, onClick, ...props }: any) => (
    <div data-testid="gallery-card" onClick={onClick} {...props}>{children}</div>
  ),
  CardContent: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  NavigationOverlay: ({ children, selectedRecord }: any) => (
    selectedRecord ? <div data-testid="navigation-overlay">{children(selectedRecord)}</div> : null
  ),
}));

vi.mock('@object-ui/core', () => ({
  ComponentRegistry: { register: vi.fn() },
}));

const mockItems = [
  { id: '1', name: 'Item 1', image: 'https://example.com/1.jpg' },
  { id: '2', name: 'Item 2', image: 'https://example.com/2.jpg' },
];

describe('ObjectGallery', () => {
  it('renders gallery items', () => {
    const schema = { objectName: 'products' };
    render(<ObjectGallery schema={schema} data={mockItems} />);
    expect(screen.getByText('Item 1')).toBeInTheDocument();
    expect(screen.getByText('Item 2')).toBeInTheDocument();
  });

  it('calls navigation.handleClick on card click', () => {
    const schema = {
      objectName: 'products',
      navigation: { mode: 'drawer' as const },
    };
    render(<ObjectGallery schema={schema} data={mockItems} />);

    const cards = screen.getAllByTestId('gallery-card');
    fireEvent.click(cards[0]);

    expect(mockHandleClick).toHaveBeenCalledWith(mockItems[0]);
  });

  it('renders with cursor-pointer when navigation is configured', () => {
    const schema = {
      objectName: 'products',
      navigation: { mode: 'drawer' as const },
    };
    render(<ObjectGallery schema={schema} data={mockItems} />);

    const cards = screen.getAllByTestId('gallery-card');
    expect(cards.length).toBe(2);
  });

  it('renders with cursor-pointer when onCardClick is provided', () => {
    const onCardClick = vi.fn();
    const schema = { objectName: 'products' };
    render(<ObjectGallery schema={schema} data={mockItems} onCardClick={onCardClick} />);

    const cards = screen.getAllByTestId('gallery-card');
    fireEvent.click(cards[0]);

    expect(mockHandleClick).toHaveBeenCalled();
  });
});
