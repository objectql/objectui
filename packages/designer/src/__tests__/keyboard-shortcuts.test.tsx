import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { DesignerProvider, useDesigner } from '../context/DesignerContext';
import { SchemaNode } from '@object-ui/core';
import React from 'react';

// Test component to access designer context
const TestComponent = () => {
  const { 
    schema, 
    selectedNodeId, 
    setSelectedNodeId,
    copyNode,
    cutNode,
    duplicateNode,
    pasteNode,
    moveNodeUp,
    moveNodeDown,
    canPaste
  } = useDesigner();
  
  return (
    <div>
      <div data-testid="schema">{JSON.stringify(schema)}</div>
      <div data-testid="selected">{selectedNodeId || 'none'}</div>
      <div data-testid="can-paste">{canPaste ? 'yes' : 'no'}</div>
      <button onClick={() => setSelectedNodeId('child-1')} data-testid="select-child-1">Select Child 1</button>
      <button onClick={() => copyNode('child-1')} data-testid="copy">Copy</button>
      <button onClick={() => cutNode('child-1')} data-testid="cut">Cut</button>
      <button onClick={() => duplicateNode('child-1')} data-testid="duplicate">Duplicate</button>
      <button onClick={() => pasteNode('root')} data-testid="paste">Paste</button>
      <button onClick={() => moveNodeUp('child-2')} data-testid="move-up">Move Up</button>
      <button onClick={() => moveNodeDown('child-1')} data-testid="move-down">Move Down</button>
    </div>
  );
};

describe('Keyboard Shortcuts and Navigation', () => {
  const initialSchema: SchemaNode = {
    type: 'div',
    id: 'root',
    body: [
      { type: 'text', id: 'child-1', content: 'First' },
      { type: 'text', id: 'child-2', content: 'Second' },
      { type: 'text', id: 'child-3', content: 'Third' }
    ]
  };

  beforeEach(() => {
    // Reset any global state if needed
  });

  it('should copy a node', () => {
    const { getByTestId } = render(
      <DesignerProvider initialSchema={initialSchema}>
        <TestComponent />
      </DesignerProvider>
    );

    expect(getByTestId('can-paste').textContent).toBe('no');
    
    fireEvent.click(getByTestId('copy'));
    
    expect(getByTestId('can-paste').textContent).toBe('yes');
  });

  it('should cut a node and allow paste', () => {
    const { getByTestId } = render(
      <DesignerProvider initialSchema={initialSchema}>
        <TestComponent />
      </DesignerProvider>
    );

    expect(getByTestId('can-paste').textContent).toBe('no');
    
    fireEvent.click(getByTestId('cut'));
    
    // Should be able to paste after cut
    expect(getByTestId('can-paste').textContent).toBe('yes');
    
    // The schema should have the node removed
    const schema = JSON.parse(getByTestId('schema').textContent || '{}');
    expect(schema.body).toHaveLength(2); // One node was cut
  });

  it('should duplicate a node', () => {
    const { getByTestId } = render(
      <DesignerProvider initialSchema={initialSchema}>
        <TestComponent />
      </DesignerProvider>
    );

    const initialBody = JSON.parse(getByTestId('schema').textContent || '{}').body;
    const initialLength = initialBody.length;

    fireEvent.click(getByTestId('duplicate'));
    
    // Schema should have an extra node
    const schema = JSON.parse(getByTestId('schema').textContent || '{}');
    expect(schema.body.length).toBe(initialLength + 1);
  });

  it('should paste a copied node', () => {
    const { getByTestId } = render(
      <DesignerProvider initialSchema={initialSchema}>
        <TestComponent />
      </DesignerProvider>
    );

    fireEvent.click(getByTestId('copy'));
    fireEvent.click(getByTestId('paste'));
    
    // Schema should have an extra node
    const schema = JSON.parse(getByTestId('schema').textContent || '{}');
    expect(schema.body.length).toBeGreaterThan(3);
  });

  it('should move a node up', () => {
    const { getByTestId } = render(
      <DesignerProvider initialSchema={initialSchema}>
        <TestComponent />
      </DesignerProvider>
    );

    fireEvent.click(getByTestId('move-up'));
    
    const schema = JSON.parse(getByTestId('schema').textContent || '{}');
    // child-2 should now be at index 0 after moving up
    expect(schema.body[0].id).toBe('child-2');
  });

  it('should move a node down', () => {
    const { getByTestId } = render(
      <DesignerProvider initialSchema={initialSchema}>
        <TestComponent />
      </DesignerProvider>
    );

    fireEvent.click(getByTestId('move-down'));
    
    const schema = JSON.parse(getByTestId('schema').textContent || '{}');
    // child-1 should now be at index 1 after moving down
    expect(schema.body[1].id).toBe('child-1');
  });
});
