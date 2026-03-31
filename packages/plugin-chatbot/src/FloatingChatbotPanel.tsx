/**
 * ObjectUI
 * Copyright (c) 2024-present ObjectStack Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import * as React from "react"
import { cn } from "@object-ui/components"
import { Button } from "@object-ui/components"
import { X, Maximize2, Minimize2 } from "lucide-react"
import { useFloatingChatbot } from "./FloatingChatbotProvider"

export interface FloatingChatbotPanelProps {
  /** Panel title */
  title?: string
  /** Position of the panel (anchored to FAB corner) */
  position?: "bottom-right" | "bottom-left"
  /** Panel width in pixels (ignored in fullscreen) */
  width?: number
  /** Panel height in pixels (ignored in fullscreen) */
  height?: number
  /** Content to render inside the panel body */
  children: React.ReactNode
  /** Custom className for the panel container */
  className?: string
}

/**
 * Floating panel overlay for the chatbot.
 * Renders above all content, anchored to the configured position.
 * Supports fullscreen toggle and close.
 */
export function FloatingChatbotPanel({
  title = "Chat",
  position = "bottom-right",
  width = 400,
  height = 520,
  children,
  className,
}: FloatingChatbotPanelProps) {
  const { isOpen, isFullscreen, close, toggleFullscreen } = useFloatingChatbot()

  if (!isOpen) return null

  const panelStyle: React.CSSProperties = isFullscreen
    ? { inset: 0, width: "100vw", height: "100vh" }
    : { width, height, maxHeight: "calc(100vh - 100px)" }

  return (
    <div
      className={cn(
        "fixed z-50 flex flex-col rounded-lg border bg-background shadow-xl overflow-hidden transition-all",
        isFullscreen
          ? "inset-0 rounded-none"
          : position === "bottom-right"
            ? "right-6 bottom-20"
            : "left-6 bottom-20",
        className
      )}
      style={panelStyle}
      role="dialog"
      aria-label={title}
      data-testid="floating-chatbot-panel"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b bg-muted/40">
        <span className="text-sm font-medium truncate">{title}</span>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={toggleFullscreen}
            aria-label={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
            data-testid="floating-chatbot-fullscreen"
          >
            {isFullscreen ? (
              <Minimize2 className="h-4 w-4" />
            ) : (
              <Maximize2 className="h-4 w-4" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={close}
            aria-label="Close chat"
            data-testid="floating-chatbot-close"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-hidden">{children}</div>
    </div>
  )
}
