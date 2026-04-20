/**
 * ConsoleLayout
 *
 * Root layout shell for the console application. Uses a top navigation bar
 * instead of sidebar for a more modern, horizontal layout.
 * Includes the global floating chatbot (FAB) widget.
 * Sets navigation context to 'app' for app-specific routes.
 * @module
 */

import React, { useEffect } from 'react';
import { FloatingChatbot, useObjectChat, type ChatMessage } from '@object-ui/plugin-chatbot';
import { useDiscovery } from '@object-ui/react';
import { AppTopNav } from './AppTopNav';
import { useNavigationContext } from '../context/NavigationContext';
import { resolveI18nLabel } from '../utils';
import type { ConnectionState } from '../dataSource';

/** Minimal object shape used by the chatbot context */
interface ConsoleObject {
  name: string;
  label?: string;
}

interface ConsoleLayoutProps {
  children: React.ReactNode;
  activeAppName: string;
  activeApp: any;
  onAppChange: (name: string) => void;
  objects: any[];
  connectionState?: ConnectionState;
}


/** Floating chatbot wired with useObjectChat for demo auto-response */
function ConsoleFloatingChatbot({ appLabel, objects }: { appLabel: string; objects: ConsoleObject[] }) {
  const objectNames = objects.map((o) => o.label || o.name).join(', ');

  const {
    messages,
    isLoading,
    error,
    sendMessage,
    stop,
    reload,
    clear,
  } = useObjectChat({
    initialMessages: [
      {
        id: 'welcome',
        role: 'assistant' as const,
        content: `Hello! I'm your **${appLabel}** assistant. How can I help you today?`,
      },
    ],
    autoResponse: true,
    autoResponseText: objectNames
      ? `I can help you work with ${objectNames}. What would you like to do?`
      : 'Thanks for your message! I\'m here to help you navigate and manage your data.',
    autoResponseDelay: 800,
  });

  return (
    <FloatingChatbot
      floatingConfig={{
        position: 'bottom-right',
        defaultOpen: false,
        panelWidth: 400,
        panelHeight: 520,
        title: `${appLabel} Assistant`,
        triggerSize: 56,
      }}
      messages={messages as ChatMessage[]}
      placeholder="Ask anything..."
      onSendMessage={(content: string) => sendMessage(content)}
      onClear={clear}
      onStop={isLoading ? stop : undefined}
      onReload={reload}
      isLoading={isLoading}
      error={error}
      enableMarkdown
    />
  );
}

export function ConsoleLayout({
  children,
  activeAppName,
  activeApp,
  onAppChange,
  objects,
  connectionState
}: ConsoleLayoutProps) {
  const appLabel = resolveI18nLabel(activeApp?.label) || activeAppName;
  const { isAiEnabled } = useDiscovery();
  const { setContext, setCurrentAppName } = useNavigationContext();

  // Set navigation context to 'app' when this layout mounts
  useEffect(() => {
    setContext('app');
    setCurrentAppName(activeAppName);
  }, [setContext, setCurrentAppName, activeAppName]);

  // Apply branding via CSS variables and document title
  useEffect(() => {
    if (activeApp?.branding) {
      const { primaryColor, accentColor, favicon, title } = activeApp.branding;

      if (primaryColor) {
        document.documentElement.style.setProperty('--primary', primaryColor);
      }
      if (accentColor) {
        document.documentElement.style.setProperty('--accent', accentColor);
      }
      if (favicon) {
        const link = document.querySelector("link[rel*='icon']") as HTMLLinkElement || document.createElement('link');
        link.type = 'image/x-icon';
        link.rel = 'shortcut icon';
        link.href = favicon;
        document.getElementsByTagName('head')[0].appendChild(link);
      }
      if (title) {
        document.title = `${resolveI18nLabel(activeApp.label)} — ObjectStack Console`;
      }
    }
  }, [activeApp]);

  return (
    <div className="flex min-h-svh w-full flex-col bg-muted/5" data-testid="console-layout">
      <AppTopNav
        activeApp={activeApp}
        onAppChange={onAppChange}
      />
      <main className="flex-1 min-w-0 overflow-auto">
        {children}
      </main>

      {/* Global floating chatbot — rendered only when AI service is available */}
      {isAiEnabled && <ConsoleFloatingChatbot appLabel={appLabel} objects={objects} />}
    </div>
  );
}
