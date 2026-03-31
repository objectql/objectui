/**
 * ObjectUI
 * Copyright (c) 2024-present ObjectStack Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import * as React from "react"
import * as ReactDOM from "react-dom"
import type { FloatingChatbotConfig } from "@object-ui/types"
import { FloatingChatbotProvider } from "./FloatingChatbotProvider"
import { FloatingChatbotTrigger } from "./FloatingChatbotTrigger"
import { FloatingChatbotPanel } from "./FloatingChatbotPanel"
import { ChatbotEnhanced, type ChatbotEnhancedProps } from "./ChatbotEnhanced"

export interface FloatingChatbotProps extends ChatbotEnhancedProps {
  /** Floating configuration */
  floatingConfig?: FloatingChatbotConfig
}

/**
 * Floating Chatbot — Airtable-style FAB widget.
 *
 * Wraps `ChatbotEnhanced` in a floating panel that can be toggled
 * via a fixed FAB trigger button. Uses React portal to avoid
 * DOM/z-index conflicts.
 */
export function FloatingChatbot({
  floatingConfig,
  ...chatbotProps
}: FloatingChatbotProps) {
  const {
    position = "bottom-right",
    defaultOpen = false,
    panelWidth = 400,
    panelHeight = 520,
    title = "Chat",
    triggerSize = 56,
  } = floatingConfig ?? {}

  const [portalContainer, setPortalContainer] = React.useState<HTMLElement | null>(null)

  React.useEffect(() => {
    // Create a portal root so the floating UI sits outside the normal DOM tree
    let container = document.getElementById("floating-chatbot-portal")
    if (!container) {
      container = document.createElement("div")
      container.id = "floating-chatbot-portal"
      document.body.appendChild(container)
    }
    setPortalContainer(container)

    return () => {
      // Only remove if we created it and it's still in the DOM
      if (container && container.parentNode && !container.hasChildNodes()) {
        container.parentNode.removeChild(container)
      }
    }
  }, [])

  const content = (
    <FloatingChatbotProvider defaultOpen={defaultOpen}>
      <FloatingChatbotTrigger
        position={position}
        size={triggerSize}
      />
      <FloatingChatbotPanel
        title={title}
        position={position}
        width={panelWidth}
        height={panelHeight}
      >
        <ChatbotEnhanced
          {...chatbotProps}
          maxHeight="100%"
          className="h-full border-0 rounded-none"
        />
      </FloatingChatbotPanel>
    </FloatingChatbotProvider>
  )

  // Use portal rendering when in browser, fallback to inline for SSR / tests
  if (portalContainer) {
    return ReactDOM.createPortal(content, portalContainer)
  }

  return content
}
