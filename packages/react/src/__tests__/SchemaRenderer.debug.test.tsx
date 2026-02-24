/**
 * ObjectUI
 * Copyright (c) 2024-present ObjectStack Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render } from '@testing-library/react';
import React from 'react';
import { ComponentRegistry } from '@object-ui/core';
import { SchemaRenderer } from '../SchemaRenderer';
import { SchemaRendererProvider } from '../context/SchemaRendererContext';

// Suppress console.warn from deprecated namespace registration
const originalWarn = console.warn;
beforeEach(() => {
  console.warn = vi.fn();
});
afterEach(() => {
  console.warn = originalWarn;
});

// A simple test component that passes all props through to a div
const TestDiv: React.FC<any> = (props) => {
  const { schema, ...rest } = props;
  return <div data-testid="test-div" {...rest} />;
};

describe('SchemaRenderer debug attributes', () => {
  beforeEach(() => {
    ComponentRegistry.register('test-debug-div', TestDiv);
  });

  it('should NOT inject data-debug-* attributes when debug is off', () => {
    const { getByTestId } = render(
      <SchemaRendererProvider dataSource={{}}>
        <SchemaRenderer schema={{ type: 'test-debug-div', id: 'myBtn' }} />
      </SchemaRendererProvider>,
    );
    const el = getByTestId('test-div');
    expect(el.getAttribute('data-debug-type')).toBeNull();
    expect(el.getAttribute('data-debug-id')).toBeNull();
  });

  it('should inject data-debug-type when debug is enabled', () => {
    const { getByTestId } = render(
      <SchemaRendererProvider dataSource={{}} debug={true}>
        <SchemaRenderer schema={{ type: 'test-debug-div', id: 'myBtn' }} />
      </SchemaRendererProvider>,
    );
    const el = getByTestId('test-div');
    expect(el.getAttribute('data-debug-type')).toBe('test-debug-div');
    expect(el.getAttribute('data-debug-id')).toBe('myBtn');
  });

  it('should inject data-debug-type when debugFlags.enabled is true', () => {
    const { getByTestId } = render(
      <SchemaRendererProvider dataSource={{}} debugFlags={{ enabled: true }}>
        <SchemaRenderer schema={{ type: 'test-debug-div' }} />
      </SchemaRendererProvider>,
    );
    const el = getByTestId('test-div');
    expect(el.getAttribute('data-debug-type')).toBe('test-debug-div');
    // No id on schema, so data-debug-id should not be present
    expect(el.getAttribute('data-debug-id')).toBeNull();
  });
});
