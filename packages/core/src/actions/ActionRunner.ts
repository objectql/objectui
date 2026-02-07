/**
 * ObjectUI
 * Copyright (c) 2024-present ObjectStack Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * @object-ui/core - Action Runner
 * 
 * Executes actions defined in ActionSchema and EventHandler.
 * Supports typed action dispatch, conditional execution, confirmation,
 * toast notifications, redirect handling, and custom handler registration.
 */

import { ExpressionEvaluator } from '../evaluator/ExpressionEvaluator';

export interface ActionResult {
  success: boolean;
  data?: any;
  error?: string;
  reload?: boolean;
  close?: boolean;
  redirect?: string;
}

export interface ActionContext {
  data?: Record<string, any>;
  record?: any;
  user?: any;
  [key: string]: any;
}

/**
 * Action definition accepted by the runner.
 * Compatible with both UIActionSchema (spec v0.7.1) and legacy crud.ts ActionSchema.
 */
export interface ActionDef {
  /** Action type identifier (e.g., 'create', 'delete', 'navigate', 'api', 'script', 'url') */
  type?: string;
  /** Legacy action type field */
  actionType?: string;
  /** Action name (from UIActionSchema) */
  name?: string;
  /** Confirmation text — shows a confirm dialog before executing */
  confirmText?: string;
  /** Structured confirmation (from crud.ts) */
  confirm?: { title?: string; message?: string; confirmText?: string; cancelText?: string };
  /** Condition expression — if falsy, skip action */
  condition?: string;
  /** Disabled expression — if truthy, skip action */
  disabled?: string | boolean;
  /** API endpoint */
  api?: string;
  /** HTTP method */
  method?: string;
  /** Navigation target */
  navigate?: any;
  /** onClick callback (legacy) */
  onClick?: () => void | Promise<void>;
  /** Whether to reload data after success */
  reload?: boolean;
  /** Whether to close dialog after success */
  close?: boolean;
  /** Redirect URL expression */
  redirect?: string;
  /** Toast configuration */
  toast?: { showOnSuccess?: boolean; showOnError?: boolean; duration?: number };
  /** Success message (from UIActionSchema) */
  successMessage?: string;
  /** Error message (from UIActionSchema) */
  errorMessage?: string;
  /** Whether to refresh data after execution (from UIActionSchema) */
  refreshAfter?: boolean;
  /** Params object (for custom handlers) */
  params?: Record<string, any>;
  /** Any additional properties */
  [key: string]: any;
}

export type ActionHandler = (
  action: ActionDef,
  context: ActionContext
) => Promise<ActionResult> | ActionResult;

/**
 * Confirmation handler — replaces window.confirm.
 * Consumers can provide an async implementation (e.g., Shadcn AlertDialog).
 */
export type ConfirmationHandler = (message: string, options?: {
  title?: string;
  confirmText?: string;
  cancelText?: string;
}) => Promise<boolean>;

/**
 * Toast handler — consumers can wire to Sonner or any toast library.
 */
export type ToastHandler = (message: string, options?: {
  type?: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
}) => void;

export class ActionRunner {
  private handlers = new Map<string, ActionHandler>();
  private evaluator: ExpressionEvaluator;
  private context: ActionContext;
  private confirmHandler: ConfirmationHandler;
  private toastHandler: ToastHandler | null;

  constructor(context: ActionContext = {}) {
    this.context = context;
    this.evaluator = new ExpressionEvaluator(context);
    // Default confirmation: window.confirm (can be overridden)
    this.confirmHandler = async (message: string) => window.confirm(message);
    this.toastHandler = null;
  }

  /**
   * Set a custom confirmation handler (e.g., Shadcn AlertDialog).
   */
  setConfirmHandler(handler: ConfirmationHandler): void {
    this.confirmHandler = handler;
  }

  /**
   * Set a custom toast handler (e.g., Sonner).
   */
  setToastHandler(handler: ToastHandler): void {
    this.toastHandler = handler;
  }

  registerHandler(actionName: string, handler: ActionHandler): void {
    this.handlers.set(actionName, handler);
  }

  async execute(action: ActionDef): Promise<ActionResult> {
    try {
      // Resolve the action type
      const actionType = action.type || action.actionType || action.name || '';

      // Conditional execution
      if (action.condition) {
        const shouldExecute = this.evaluator.evaluateCondition(action.condition);
        if (!shouldExecute) {
          return { success: false, error: 'Action condition not met' };
        }
      }

      if (action.disabled) {
        const isDisabled = typeof action.disabled === 'string'
          ? this.evaluator.evaluateCondition(action.disabled)
          : action.disabled;
        
        if (isDisabled) {
          return { success: false, error: 'Action is disabled' };
        }
      }

      // Confirmation (structured or simple)
      const confirmMessage = action.confirm?.message || action.confirmText;
      if (confirmMessage) {
        const confirmed = await this.confirmHandler(
          this.evaluator.evaluate(confirmMessage) as string,
          action.confirm ? {
            title: action.confirm.title,
            confirmText: action.confirm.confirmText,
            cancelText: action.confirm.cancelText,
          } : undefined,
        );
        if (!confirmed) {
          return { success: false, error: 'Action cancelled by user' };
        }
      }

      // Check for a registered custom handler first
      if (actionType && this.handlers.has(actionType)) {
        const handler = this.handlers.get(actionType)!;
        const result = await handler(action, this.context);
        this.handlePostExecution(action, result);
        return result;
      }

      // Built-in action execution
      let result: ActionResult;

      if (actionType === 'navigation' || action.navigate) {
        result = await this.executeNavigation(action);
      } else if (actionType === 'api' || action.api) {
        result = await this.executeAPI(action);
      } else if (action.onClick) {
        await action.onClick();
        result = { success: true };
      } else {
        // Try as a generic action with API
        result = await this.executeActionSchema(action);
      }

      this.handlePostExecution(action, result);
      return result;
    } catch (error) {
      const result: ActionResult = { success: false, error: (error as Error).message };
      this.handlePostExecution(action, result);
      return result;
    }
  }

  /**
   * Post-execution: emit toast notifications, set reload/redirect.
   */
  private handlePostExecution(action: ActionDef, result: ActionResult): void {
    if (!this.toastHandler) return;

    const showToast = action.toast ?? { showOnSuccess: true, showOnError: true };
    const duration = action.toast?.duration;

    if (result.success && showToast.showOnSuccess !== false) {
      const message = action.successMessage || 'Action completed successfully';
      this.toastHandler(message, { type: 'success', duration });
    }

    if (!result.success && showToast.showOnError !== false && result.error) {
      const message = action.errorMessage || result.error;
      this.toastHandler(message, { type: 'error', duration });
    }

    // Apply refreshAfter from UIActionSchema
    if (action.refreshAfter && result.success) {
      result.reload = true;
    }
  }

  private async executeActionSchema(action: ActionDef): Promise<ActionResult> {
    const result: ActionResult = { success: true };

    if (action.api) {
      const apiResult = await this.executeAPI(action);
      if (!apiResult.success) return apiResult;
      result.data = apiResult.data;
    }

    if (action.onClick) {
      await action.onClick();
    }

    result.reload = action.reload !== false;
    result.close = action.close !== false;

    if (action.redirect) {
      result.redirect = this.evaluator.evaluate(action.redirect) as string;
    }

    return result;
  }

  /**
   * Execute navigation action
   */
  private async executeNavigation(action: ActionDef): Promise<ActionResult> {
    const nav = action.navigate || action;
    const to = this.evaluator.evaluate(nav.to) as string;

    // Validate URL to prevent javascript: or data: schemes
    const isValidUrl = typeof to === 'string' && (
      to.startsWith('http://') || 
      to.startsWith('https://') || 
      to.startsWith('/') || 
      to.startsWith('./')
    );

    if (!isValidUrl) {
      return {
        success: false,
        error: 'Invalid URL scheme. Only http://, https://, and relative URLs are allowed.'
      };
    }

    if (nav.external) {
      window.open(to, '_blank', 'noopener,noreferrer');
    } else {
      return { success: true, redirect: to };
    }

    return { success: true };
  }

  private async executeAPI(action: ActionDef): Promise<ActionResult> {
    const apiConfig = action.api;
    
    if (typeof apiConfig === 'string') {
      try {
        const response = await fetch(apiConfig, {
          method: action.method || 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(this.context.data || {})
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        return { success: true, data };
      } catch (error) {
        return { success: false, error: (error as Error).message };
      }
    }

    return { success: false, error: 'Complex API configuration not yet implemented' };
  }

  updateContext(newContext: Partial<ActionContext>): void {
    this.context = { ...this.context, ...newContext };
    this.evaluator.updateContext(newContext);
  }

  getContext(): ActionContext {
    return this.context;
  }
}

export async function executeAction(
  action: ActionDef,
  context: ActionContext = {}
): Promise<ActionResult> {
  const runner = new ActionRunner(context);
  return await runner.execute(action);
}
