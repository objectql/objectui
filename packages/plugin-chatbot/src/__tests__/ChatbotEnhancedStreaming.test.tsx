/**
 * ObjectUI
 * Copyright (c) 2024-present ObjectStack Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import '@testing-library/jest-dom';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ChatbotEnhanced, type ChatMessage } from '../ChatbotEnhanced';

describe('ChatbotEnhanced - Streaming & AI Features', () => {
  const mockMessages: ChatMessage[] = [
    { id: '1', role: 'user', content: 'Hello!' },
    { id: '2', role: 'assistant', content: 'Hi there!' },
  ];

  it('should show stop button when isLoading and onStop is provided', () => {
    const onStop = vi.fn();
    render(
      <ChatbotEnhanced
        messages={mockMessages}
        isLoading={true}
        onStop={onStop}
      />
    );

    const stopButton = screen.getByRole('button', { name: /stop/i });
    expect(stopButton).toBeInTheDocument();

    fireEvent.click(stopButton);
    expect(onStop).toHaveBeenCalledTimes(1);
  });

  it('should not show stop button when not loading', () => {
    const onStop = vi.fn();
    render(
      <ChatbotEnhanced
        messages={mockMessages}
        isLoading={false}
        onStop={onStop}
      />
    );

    expect(screen.queryByRole('button', { name: /stop/i })).not.toBeInTheDocument();
  });

  it('should not show stop button when onStop is not provided', () => {
    render(
      <ChatbotEnhanced
        messages={mockMessages}
        isLoading={true}
      />
    );

    expect(screen.queryByRole('button', { name: /stop/i })).not.toBeInTheDocument();
  });

  it('should show error message when error is provided', () => {
    const error = new Error('Connection failed');
    render(
      <ChatbotEnhanced
        messages={mockMessages}
        error={error}
      />
    );

    expect(screen.getByText('Connection failed')).toBeInTheDocument();
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('should show retry button in error state when onReload is provided', () => {
    const onReload = vi.fn();
    const error = new Error('Network error');
    render(
      <ChatbotEnhanced
        messages={mockMessages}
        error={error}
        onReload={onReload}
      />
    );

    const retryButton = screen.getByRole('button', { name: /retry/i });
    expect(retryButton).toBeInTheDocument();

    fireEvent.click(retryButton);
    expect(onReload).toHaveBeenCalledTimes(1);
  });

  it('should not show retry button when onReload is not provided', () => {
    const error = new Error('Error');
    render(
      <ChatbotEnhanced
        messages={mockMessages}
        error={error}
      />
    );

    expect(screen.queryByRole('button', { name: /retry/i })).not.toBeInTheDocument();
  });

  it('should disable input when isLoading is true', () => {
    render(
      <ChatbotEnhanced
        messages={mockMessages}
        isLoading={true}
      />
    );

    const input = screen.getByPlaceholderText(/message/i);
    expect(input).toBeDisabled();
  });

  it('should disable send button when isLoading is true', () => {
    render(
      <ChatbotEnhanced
        messages={mockMessages}
        isLoading={true}
      />
    );

    const sendButton = screen.getByRole('button', { name: /send/i });
    expect(sendButton).toBeDisabled();
  });

  it('should show streaming indicator on streaming messages', () => {
    const streamingMessages: ChatMessage[] = [
      {
        id: '1',
        role: 'assistant',
        content: 'Generating...',
        streaming: true,
      },
    ];

    const { container } = render(
      <ChatbotEnhanced messages={streamingMessages} />
    );

    expect(screen.getByText('Generating...')).toBeInTheDocument();
    // Streaming indicator should be present (bouncing dots)
    const bouncingDots = container.querySelectorAll('.animate-bounce');
    expect(bouncingDots.length).toBe(3);
  });

  it('should show default error message when error has no message', () => {
    const error = new Error('');
    render(
      <ChatbotEnhanced
        messages={mockMessages}
        error={error}
      />
    );

    expect(screen.getByText('An error occurred')).toBeInTheDocument();
  });
});
