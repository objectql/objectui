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
import { FloatingChatbotProvider } from '../FloatingChatbotProvider';
import { FloatingChatbotTrigger } from '../FloatingChatbotTrigger';
import { FloatingChatbotPanel } from '../FloatingChatbotPanel';

// Wrap in provider helper
function renderWithProvider(
  ui: React.ReactElement,
  { defaultOpen = false }: { defaultOpen?: boolean } = {}
) {
  return render(
    <FloatingChatbotProvider defaultOpen={defaultOpen}>{ui}</FloatingChatbotProvider>
  );
}

describe('FloatingChatbotTrigger', () => {
  it('renders a trigger button', () => {
    renderWithProvider(<FloatingChatbotTrigger />);
    expect(screen.getByTestId('floating-chatbot-trigger')).toBeInTheDocument();
  });

  it('shows "Open chat" label when closed', () => {
    renderWithProvider(<FloatingChatbotTrigger />);
    expect(screen.getByLabelText('Open chat')).toBeInTheDocument();
  });

  it('shows "Close chat" label when open', () => {
    renderWithProvider(<FloatingChatbotTrigger />, { defaultOpen: true });
    expect(screen.getByLabelText('Close chat')).toBeInTheDocument();
  });

  it('toggles open state on click', () => {
    renderWithProvider(
      <>
        <FloatingChatbotTrigger />
        <FloatingChatbotPanel><span>Panel content</span></FloatingChatbotPanel>
      </>
    );

    // Panel should not be visible initially
    expect(screen.queryByTestId('floating-chatbot-panel')).not.toBeInTheDocument();

    // Click trigger to open
    act(() => {
      fireEvent.click(screen.getByTestId('floating-chatbot-trigger'));
    });
    expect(screen.getByTestId('floating-chatbot-panel')).toBeInTheDocument();

    // Click trigger to close
    act(() => {
      fireEvent.click(screen.getByTestId('floating-chatbot-trigger'));
    });
    expect(screen.queryByTestId('floating-chatbot-panel')).not.toBeInTheDocument();
  });

  it('applies bottom-left position class', () => {
    renderWithProvider(<FloatingChatbotTrigger position="bottom-left" />);
    const trigger = screen.getByTestId('floating-chatbot-trigger');
    expect(trigger.className).toContain('left-6');
  });

  it('applies custom size', () => {
    renderWithProvider(<FloatingChatbotTrigger size={48} />);
    const trigger = screen.getByTestId('floating-chatbot-trigger');
    expect(trigger.style.width).toBe('48px');
    expect(trigger.style.height).toBe('48px');
  });
});

describe('FloatingChatbotPanel', () => {
  it('does not render when closed', () => {
    renderWithProvider(
      <FloatingChatbotPanel><span>Content</span></FloatingChatbotPanel>
    );
    expect(screen.queryByTestId('floating-chatbot-panel')).not.toBeInTheDocument();
  });

  it('renders when open', () => {
    renderWithProvider(
      <FloatingChatbotPanel><span>Panel body</span></FloatingChatbotPanel>,
      { defaultOpen: true }
    );
    expect(screen.getByTestId('floating-chatbot-panel')).toBeInTheDocument();
    expect(screen.getByText('Panel body')).toBeInTheDocument();
  });

  it('renders custom title', () => {
    renderWithProvider(
      <FloatingChatbotPanel title="Help"><span>Body</span></FloatingChatbotPanel>,
      { defaultOpen: true }
    );
    expect(screen.getByText('Help')).toBeInTheDocument();
  });

  it('has dialog role with aria-label', () => {
    renderWithProvider(
      <FloatingChatbotPanel title="Help"><span>Body</span></FloatingChatbotPanel>,
      { defaultOpen: true }
    );
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-label', 'Help');
  });

  it('close button closes the panel', () => {
    renderWithProvider(
      <FloatingChatbotPanel><span>Body</span></FloatingChatbotPanel>,
      { defaultOpen: true }
    );
    expect(screen.getByTestId('floating-chatbot-panel')).toBeInTheDocument();

    act(() => {
      fireEvent.click(screen.getByTestId('floating-chatbot-close'));
    });
    expect(screen.queryByTestId('floating-chatbot-panel')).not.toBeInTheDocument();
  });

  it('fullscreen button toggles fullscreen', () => {
    renderWithProvider(
      <FloatingChatbotPanel><span>Body</span></FloatingChatbotPanel>,
      { defaultOpen: true }
    );

    const fsButton = screen.getByTestId('floating-chatbot-fullscreen');
    expect(fsButton).toHaveAttribute('aria-label', 'Fullscreen');

    act(() => {
      fireEvent.click(fsButton);
    });
    expect(screen.getByTestId('floating-chatbot-fullscreen')).toHaveAttribute(
      'aria-label',
      'Exit fullscreen'
    );
  });

  it('applies custom width and height', () => {
    renderWithProvider(
      <FloatingChatbotPanel width={500} height={600}>
        <span>Body</span>
      </FloatingChatbotPanel>,
      { defaultOpen: true }
    );
    const panel = screen.getByTestId('floating-chatbot-panel');
    expect(panel.style.width).toBe('500px');
    expect(panel.style.height).toBe('600px');
  });

  it('bottom-left position applies left-6 class', () => {
    renderWithProvider(
      <FloatingChatbotPanel position="bottom-left"><span>Body</span></FloatingChatbotPanel>,
      { defaultOpen: true }
    );
    const panel = screen.getByTestId('floating-chatbot-panel');
    expect(panel.className).toContain('left-6');
  });
});
