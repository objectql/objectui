/**
 * ExpressionContext Provider
 *
 * Provides expression evaluation context (user, app, data) to all child components.
 * Used by useCondition/useExpression hooks from @object-ui/react to evaluate
 * dynamic visibility, disabled, and hidden expressions in navigation items,
 * fields, and components.
 *
 * @example
 * ```tsx
 * <ExpressionProvider user={currentUser} app={activeApp}>
 *   <AppSidebar />
 * </ExpressionProvider>
 * ```
 */

import React, { createContext, useContext, useMemo } from 'react';
import { ExpressionEvaluator } from '@object-ui/core';

export interface ExpressionContextValue {
  /** Current authenticated user */
  user: Record<string, any>;
  /** Active application config */
  app: Record<string, any>;
  /** Additional data scope */
  data: Record<string, any>;
  /** The evaluator instance (for imperative use) */
  evaluator: ExpressionEvaluator;
}

const ExprCtx = createContext<ExpressionContextValue | null>(null);

interface ExpressionProviderProps {
  children: React.ReactNode;
  user?: Record<string, any>;
  app?: Record<string, any>;
  data?: Record<string, any>;
}

export function ExpressionProvider({ children, user = {}, app = {}, data = {} }: ExpressionProviderProps) {
  const value = useMemo(() => {
    const context = { user, app, data };
    const evaluator = new ExpressionEvaluator(context);
    return { user, app, data, evaluator };
  }, [user, app, data]);

  return <ExprCtx.Provider value={value}>{children}</ExprCtx.Provider>;
}

/**
 * Hook to access the expression context.
 * Returns the full context value or a default empty context.
 */
export function useExpressionContext(): ExpressionContextValue {
  const ctx = useContext(ExprCtx);
  if (!ctx) {
    // Return a safe default so components can be used outside the provider
    const fallback = { user: {}, app: {}, data: {} };
    return { ...fallback, evaluator: new ExpressionEvaluator(fallback) };
  }
  return ctx;
}

/**
 * Evaluate a visibility expression.
 * Supports:
 * - boolean: true/false
 * - string "true"/"false"
 * - template expression: "${user.role === 'admin'}"
 *
 * Returns true if the item should be visible.
 */
export function evaluateVisibility(
  expression: string | boolean | undefined,
  evaluator: ExpressionEvaluator,
): boolean {
  if (expression === undefined || expression === null) return true;
  if (expression === true || expression === 'true') return true;
  if (expression === false || expression === 'false') return false;

  if (typeof expression === 'string' && expression.includes('${')) {
    try {
      const result = evaluator.evaluateCondition(expression);
      return result;
    } catch {
      return true; // Default to visible on error
    }
  }

  return true;
}
