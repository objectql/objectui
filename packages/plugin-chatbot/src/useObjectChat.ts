/**
 * ObjectUI
 * Copyright (c) 2024-present ObjectStack Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { useState, useCallback, useRef } from 'react';
import type { ChatMessage as OuiChatMessage } from '@object-ui/types';
import { generateUniqueId } from './utils';

/**
 * Configuration options for useObjectChat hook.
 */
export interface UseObjectChatOptions {
  /**
   * Backend API endpoint for streaming chat.
   * When provided, uses @ai-sdk/react useChat for SSE streaming.
   * When absent, operates in local/legacy mode.
   */
  api?: string;
  /**
   * Initial messages to populate the chat.
   */
  initialMessages?: OuiChatMessage[];
  /**
   * Conversation ID for multi-turn context.
   */
  conversationId?: string;
  /**
   * System prompt for the assistant.
   */
  systemPrompt?: string;
  /**
   * AI model identifier.
   */
  model?: string;
  /**
   * Whether streaming is enabled.
   * @default true
   */
  streamingEnabled?: boolean;
  /**
   * Additional headers to send with API requests.
   */
  headers?: Record<string, string>;
  /**
   * Additional body parameters for each API request.
   */
  body?: Record<string, unknown>;
  /**
   * Maximum tool-calling round-trips per message.
   * @default 5
   */
  maxToolRoundtrips?: number;
  /**
   * Error callback.
   */
  onError?: (error: Error) => void;
  /**
   * Show timestamps on messages.
   */
  showTimestamp?: boolean;

  // --- Legacy/demo mode options ---
  /**
   * Enable local auto-response (legacy/demo mode). Ignored when `api` is set.
   */
  autoResponse?: boolean;
  /**
   * Auto-response text for legacy/demo mode.
   */
  autoResponseText?: string;
  /**
   * Auto-response delay in ms for legacy/demo mode.
   * @default 1000
   */
  autoResponseDelay?: number;
  /**
   * External send callback (fires for both modes).
   */
  onSend?: (content: string, messages: OuiChatMessage[]) => void;
}

/**
 * Return type of useObjectChat.
 */
export interface UseObjectChatReturn {
  /** Current chat messages */
  messages: OuiChatMessage[];
  /** Whether the assistant is currently generating a response */
  isLoading: boolean;
  /** Current error, if any */
  error: Error | undefined;
  /** Send a new user message */
  sendMessage: (content: string, files?: File[]) => void;
  /** Stop the current streaming response */
  stop: () => void;
  /** Reload / retry the last assistant message */
  reload: () => void;
  /** Clear all messages */
  clear: () => void;
  /** Whether the hook is operating in API (streaming) mode */
  isApiMode: boolean;
  /** Input value (controlled by the hook for API mode) */
  input: string;
  /** Set input value */
  setInput: (value: string) => void;
  /** Handle input change event */
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

/**
 * Normalize an OUI ChatMessage[] from schema into internal format.
 */
function normalizeMessages(msgs?: OuiChatMessage[]): OuiChatMessage[] {
  return (msgs ?? []).map((msg, idx) => ({
    id: msg.id || `msg-${idx}`,
    role: msg.role || 'user',
    content: msg.content || '',
    timestamp: typeof msg.timestamp === 'string'
      ? msg.timestamp
      : (msg.timestamp instanceof Date ? msg.timestamp.toISOString() : undefined),
    metadata: msg.metadata,
    streaming: msg.streaming,
    toolInvocations: msg.toolInvocations,
  }));
}

/**
 * useObjectChat – Composable hook for ObjectUI Chatbot.
 *
 * When `api` is provided, delegates to @ai-sdk/react's useChat for
 * SSE streaming, tool-calling, and production-grade chat.
 *
 * When `api` is absent, operates in local/legacy mode with optional
 * auto-response for demos and playground use.
 */
export function useObjectChat(options: UseObjectChatOptions = {}): UseObjectChatReturn {
  const {
    api,
    initialMessages,
    conversationId,
    systemPrompt,
    model,
    streamingEnabled = true,
    headers,
    body,
    maxToolRoundtrips = 5,
    onError,
    showTimestamp,
    autoResponse,
    autoResponseText,
    autoResponseDelay = 1000,
    onSend,
  } = options;

  const isApiMode = Boolean(api);

  // ---- API mode: use @ai-sdk/react useChat ----
  if (isApiMode) {
    return useApiChat({
      api: api!,
      initialMessages,
      conversationId,
      systemPrompt,
      model,
      streamingEnabled,
      headers,
      body,
      maxToolRoundtrips,
      onError,
      onSend,
    });
  }

  // ---- Local/legacy mode ----
  return useLocalChat({
    initialMessages,
    showTimestamp,
    autoResponse,
    autoResponseText,
    autoResponseDelay,
    onSend,
  });
}

// ============================================================================
// API Mode Implementation (uses @ai-sdk/react)
// ============================================================================

interface ApiChatOptions {
  api: string;
  initialMessages?: OuiChatMessage[];
  conversationId?: string;
  systemPrompt?: string;
  model?: string;
  streamingEnabled?: boolean;
  headers?: Record<string, string>;
  body?: Record<string, unknown>;
  maxToolRoundtrips?: number;
  onError?: (error: Error) => void;
  onSend?: (content: string, messages: OuiChatMessage[]) => void;
}

function useApiChat(options: ApiChatOptions): UseObjectChatReturn {
  // Dynamic import to avoid bundling @ai-sdk/react when not in API mode
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { useChat } = require('@ai-sdk/react');

  const {
    api,
    initialMessages,
    conversationId,
    systemPrompt,
    model,
    streamingEnabled,
    headers,
    body,
    maxToolRoundtrips,
    onError,
    onSend,
  } = options;

  // Convert OUI messages to vercel/ai format for initialMessages
  const aiInitialMessages = normalizeMessages(initialMessages).map(msg => ({
    id: msg.id,
    role: msg.role as 'user' | 'assistant' | 'system',
    content: msg.content,
  }));

  const chatResult = useChat({
    api,
    initialMessages: aiInitialMessages.length > 0 ? aiInitialMessages : undefined,
    headers: {
      ...headers,
      ...(conversationId ? { 'x-conversation-id': conversationId } : {}),
    },
    body: {
      ...body,
      ...(model ? { model } : {}),
      ...(systemPrompt ? { systemPrompt } : {}),
      ...(streamingEnabled !== undefined ? { stream: streamingEnabled } : {}),
    },
    maxToolRoundtrips,
    onError: (err: Error) => {
      onError?.(err);
    },
  });

  const {
    messages: aiMessages,
    isLoading,
    error,
    input,
    setInput,
    handleInputChange,
    append,
    stop,
    reload,
    setMessages,
  } = chatResult;

  // Convert vercel/ai messages back to OUI ChatMessage format
  const messages: OuiChatMessage[] = aiMessages.map((msg: any) => ({
    id: msg.id,
    role: msg.role,
    content: msg.content,
    toolInvocations: msg.toolInvocations,
    streaming: isLoading && msg.id === aiMessages[aiMessages.length - 1]?.id && msg.role === 'assistant',
  }));

  const sendMessage = useCallback((content: string) => {
    if (!content.trim()) return;
    const newMsg = { role: 'user' as const, content: content.trim() };
    append(newMsg);
    onSend?.(content.trim(), messages);
  }, [append, onSend, messages]);

  const clear = useCallback(() => {
    setMessages([]);
  }, [setMessages]);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    stop,
    reload,
    clear,
    isApiMode: true,
    input,
    setInput,
    handleInputChange,
  };
}

// ============================================================================
// Local/Legacy Mode Implementation
// ============================================================================

interface LocalChatOptions {
  initialMessages?: OuiChatMessage[];
  showTimestamp?: boolean;
  autoResponse?: boolean;
  autoResponseText?: string;
  autoResponseDelay?: number;
  onSend?: (content: string, messages: OuiChatMessage[]) => void;
}

function useLocalChat(options: LocalChatOptions): UseObjectChatReturn {
  const {
    initialMessages,
    showTimestamp,
    autoResponse,
    autoResponseText,
    autoResponseDelay = 1000,
    onSend,
  } = options;

  const [messages, setMessages] = useState<OuiChatMessage[]>(
    () => normalizeMessages(initialMessages)
  );
  const [isLoading, setIsLoading] = useState(false);
  const [input, setInput] = useState('');
  const autoResponseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const sendMessage = useCallback((content: string) => {
    if (!content.trim()) return;

    const userMessage: OuiChatMessage = {
      id: generateUniqueId('msg'),
      role: 'user',
      content: content.trim(),
      timestamp: showTimestamp ? new Date().toLocaleTimeString() : undefined,
    };

    setMessages(prev => {
      const updated = [...prev, userMessage];
      onSend?.(content.trim(), updated);
      return updated;
    });
    setInput('');

    // Auto-response for demo/playground
    if (autoResponse) {
      setIsLoading(true);
      autoResponseTimerRef.current = setTimeout(() => {
        const assistantMessage: OuiChatMessage = {
          id: generateUniqueId('msg'),
          role: 'assistant',
          content: autoResponseText || 'Thank you for your message!',
          timestamp: showTimestamp ? new Date().toLocaleTimeString() : undefined,
        };
        setMessages(prev => [...prev, assistantMessage]);
        setIsLoading(false);
      }, autoResponseDelay);
    }
  }, [showTimestamp, autoResponse, autoResponseText, autoResponseDelay, onSend]);

  const stop = useCallback(() => {
    if (autoResponseTimerRef.current) {
      clearTimeout(autoResponseTimerRef.current);
      autoResponseTimerRef.current = null;
    }
    setIsLoading(false);
  }, []);

  const reload = useCallback(() => {
    // In local mode, there's no server to retry — no-op
  }, []);

  const clear = useCallback(() => {
    setMessages([]);
    setIsLoading(false);
  }, []);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setInput(e.target.value);
  }, []);

  return {
    messages,
    isLoading,
    error: undefined,
    sendMessage,
    stop,
    reload,
    clear,
    isApiMode: false,
    input,
    setInput,
    handleInputChange,
  };
}
