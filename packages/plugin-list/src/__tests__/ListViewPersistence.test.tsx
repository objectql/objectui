/**
 * ObjectUI -- Persistence Tests
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ListView } from '../ListView';
import type { ListViewSchema } from '@object-ui/types';
import { SchemaRendererProvider } from '@object-ui/react';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => { store[key] = value; },
    clear: () => { store = {}; },
    removeItem: (key: string) => { delete store[key]; },
  };
})();

const mockDataSource = {
  find: vi.fn().mockResolvedValue([]),
  findOne: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
  delete: vi.fn(),
};

const renderWithProvider = (component: React.ReactNode) => {
  return render(
    <SchemaRendererProvider dataSource={mockDataSource}>
      {component}
    </SchemaRendererProvider>
  );
};

Object.defineProperty(window, 'localStorage', { value: localStorageMock });

describe('ListView Persistence', () => {
  beforeEach(() => {
    localStorageMock.clear();
    vi.clearAllMocks();
  });

  it('should use unique storage key when schema.id is provided', () => {
    const schema: ListViewSchema = {
      type: 'list-view',
      id: 'my-custom-view',
      objectName: 'tasks',
      viewType: 'grid', // Start with grid
    };

    renderWithProvider(<ListView schema={schema} />);
    
    // Simulate changing to list view
    const listButton = screen.getByLabelText('List'); 
    fireEvent.click(listButton);
    
    // Check scoped storage key
    const expectedKey = 'listview-tasks-my-custom-view-view';
    expect(localStorageMock.getItem(expectedKey)).toBe('list');
    
    // Check fallback key is NOT set
    expect(localStorageMock.getItem('listview-tasks-view')).toBeNull();
  });

  it('should not conflict with other views of the same object', () => {
     // Setup: View A (Global/Default) prefers Grid
     localStorageMock.setItem('listview-tasks-view', 'grid');
     
     // Setup: View B (Special) prefers List
     // We define View B with valid options for Kanban to force it to render the button just in case,
     // but we will test switching between Grid/List.
     
     const viewB_Schema: ListViewSchema = {
        type: 'list-view',
        id: 'special-view',
        objectName: 'tasks',
        viewType: 'list' // Default to List
     };

     renderWithProvider(<ListView schema={viewB_Schema} />);
     
     // Should use the schema default 'list' (since no storage exists for THIS view id)
     // It should NOT use 'grid' from the global/default view.
     
     const listButton = screen.getByLabelText('List');
     expect(listButton.getAttribute('data-state')).toBe('on');
     
     const gridButton = screen.getByLabelText('Grid');
     expect(gridButton.getAttribute('data-state')).toBe('off');
  });
  
  it('should switch correctly when storage has a value for THIS view', () => {
      // Setup: This specific view was previously set to 'list'
      localStorageMock.setItem('listview-tasks-my-board-view', 'list');
      
      const schema: ListViewSchema = {
          type: 'list-view',
          id: 'my-board',
          objectName: 'tasks',
          viewType: 'grid' // Default in schema is grid
      };
      
      renderWithProvider(<ListView schema={schema} />);
      
      // Should respect storage ('list') over schema ('grid')
      const listButton = screen.getByLabelText('List');
      expect(listButton.getAttribute('data-state')).toBe('on');
  });
});
