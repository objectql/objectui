/**
 * ObjectUI
 * Copyright (c) 2024-present ObjectStack Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * @deprecated This component is part of the legacy Radix toast system.
 * Please use the Sonner-based Toaster instead by importing from the main package:
 * 
 * ```tsx
 * // Recommended (gets Sonner Toaster)
 * import { Toaster } from '@object-ui/components';
 * 
 * // NOT recommended (gets legacy Toaster)
 * import { Toaster } from '@object-ui/components/ui/toaster';
 * ```
 * 
 * See sonner.tsx for the recommended toast solution.
 */

"use client"

import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "./toast"
import { useToast } from "../hooks/use-toast"

export function Toaster() {
  const { toasts } = useToast()

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, ...props }) {
        return (
          <Toast key={id} {...props}>
            <div className="grid gap-1">
              {title && <ToastTitle>{title}</ToastTitle>}
              {description && (
                <ToastDescription>{description}</ToastDescription>
              )}
            </div>
            {action}
            <ToastClose />
          </Toast>
        )
      })}
      <ToastViewport />
    </ToastProvider>
  )
}
