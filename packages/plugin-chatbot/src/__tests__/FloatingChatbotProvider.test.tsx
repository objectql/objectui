/**
 * ObjectUI
 * Copyright (c) 2024-present ObjectStack Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import '@testing-library/jest-dom';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import {
  FloatingChatbotProvider,
  useFloatingChatbot,
} from '../FloatingChatbotProvider';
import * as React from 'react';

// Helper to render the hook inside a provider
function TestConsumer() {
  const ctx = useFloatingChatbot();
  return (
    <div>
      <span data-testid="isOpen">{String(ctx.isOpen)}</span>
      <span data-testid="isFullscreen">{String(ctx.isFullscreen)}</span>
      <button data-testid="open" onClick={ctx.open}>Open</button>
      <button data-testid="close" onClick={ctx.close}>Close</button>
      <button data-testid="toggle" onClick={ctx.toggle}>Toggle</button>
      <button data-testid="toggleFs" onClick={ctx.toggleFullscreen}>ToggleFS</button>
    </div>
  );
}

describe('FloatingChatbotProvider', () => {
  it('defaults to closed', () => {
    render(
      <FloatingChatbotProvider>
        <TestConsumer />
      </FloatingChatbotProvider>
    );
    expect(screen.getByTestId('isOpen').textContent).toBe('false');
    expect(screen.getByTestId('isFullscreen').textContent).toBe('false');
  });

  it('respects defaultOpen=true', () => {
    render(
      <FloatingChatbotProvider defaultOpen={true}>
        <TestConsumer />
      </FloatingChatbotProvider>
    );
    expect(screen.getByTestId('isOpen').textContent).toBe('true');
  });

  it('open() sets isOpen to true', () => {
    render(
      <FloatingChatbotProvider>
        <TestConsumer />
      </FloatingChatbotProvider>
    );
    expect(screen.getByTestId('isOpen').textContent).toBe('false');

    act(() => {
      fireEvent.click(screen.getByTestId('open'));
    });
    expect(screen.getByTestId('isOpen').textContent).toBe('true');
  });

  it('close() sets isOpen to false and resets fullscreen', () => {
    render(
      <FloatingChatbotProvider defaultOpen={true}>
        <TestConsumer />
      </FloatingChatbotProvider>
    );

    // Go fullscreen first
    act(() => {
      fireEvent.click(screen.getByTestId('toggleFs'));
    });
    expect(screen.getByTestId('isFullscreen').textContent).toBe('true');

    // Close should reset both
    act(() => {
      fireEvent.click(screen.getByTestId('close'));
    });
    expect(screen.getByTestId('isOpen').textContent).toBe('false');
    expect(screen.getByTestId('isFullscreen').textContent).toBe('false');
  });

  it('toggle() flips isOpen', () => {
    render(
      <FloatingChatbotProvider>
        <TestConsumer />
      </FloatingChatbotProvider>
    );

    act(() => {
      fireEvent.click(screen.getByTestId('toggle'));
    });
    expect(screen.getByTestId('isOpen').textContent).toBe('true');

    act(() => {
      fireEvent.click(screen.getByTestId('toggle'));
    });
    expect(screen.getByTestId('isOpen').textContent).toBe('false');
  });

  it('toggleFullscreen() flips isFullscreen', () => {
    render(
      <FloatingChatbotProvider defaultOpen={true}>
        <TestConsumer />
      </FloatingChatbotProvider>
    );

    act(() => {
      fireEvent.click(screen.getByTestId('toggleFs'));
    });
    expect(screen.getByTestId('isFullscreen').textContent).toBe('true');

    act(() => {
      fireEvent.click(screen.getByTestId('toggleFs'));
    });
    expect(screen.getByTestId('isFullscreen').textContent).toBe('false');
  });
});

describe('useFloatingChatbot', () => {
  it('throws when used outside a provider', () => {
    // Suppress console.error for this test
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<TestConsumer />)).toThrow(
      'useFloatingChatbot must be used within a <FloatingChatbotProvider>'
    );
    spy.mockRestore();
  });
});
