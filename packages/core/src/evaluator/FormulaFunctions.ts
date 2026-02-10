/**
 * ObjectUI
 * Copyright (c) 2024-present ObjectStack Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * @object-ui/core - Formula Functions
 *
 * Built-in formula functions for the expression engine.
 * Provides aggregation, date, logic, and string functions
 * compatible with low-code platform expression evaluation.
 *
 * @module evaluator
 * @packageDocumentation
 */

/**
 * A formula function that can be registered with the expression evaluator
 */
export type FormulaFunction = (...args: any[]) => any;

/**
 * Registry of built-in formula functions
 */
export class FormulaFunctions {
  private functions = new Map<string, FormulaFunction>();

  constructor() {
    this.registerDefaults();
  }

  /**
   * Register a custom formula function
   */
  register(name: string, fn: FormulaFunction): void {
    this.functions.set(name.toUpperCase(), fn);
  }

  /**
   * Get a formula function by name
   */
  get(name: string): FormulaFunction | undefined {
    return this.functions.get(name.toUpperCase());
  }

  /**
   * Check if a function is registered
   */
  has(name: string): boolean {
    return this.functions.has(name.toUpperCase());
  }

  /**
   * Get all registered function names
   */
  getNames(): string[] {
    return Array.from(this.functions.keys());
  }

  /**
   * Get all functions as a plain object (for injection into expression context)
   */
  toObject(): Record<string, FormulaFunction> {
    const result: Record<string, FormulaFunction> = {};
    for (const [name, fn] of this.functions) {
      result[name] = fn;
    }
    return result;
  }

  /**
   * Register all default built-in functions
   */
  private registerDefaults(): void {
    this.registerAggregationFunctions();
    this.registerDateFunctions();
    this.registerLogicFunctions();
    this.registerStringFunctions();
  }

  // ==========================================================================
  // Aggregation Functions
  // ==========================================================================

  private registerAggregationFunctions(): void {
    this.register('SUM', (...args: any[]): number => {
      const values = flattenNumericArgs(args);
      return values.reduce((sum, v) => sum + v, 0);
    });

    this.register('AVG', (...args: any[]): number => {
      const values = flattenNumericArgs(args);
      if (values.length === 0) return 0;
      return values.reduce((sum, v) => sum + v, 0) / values.length;
    });

    this.register('COUNT', (...args: any[]): number => {
      const values = flattenArgs(args);
      return values.filter(v => v != null).length;
    });

    this.register('MIN', (...args: any[]): number => {
      const values = flattenNumericArgs(args);
      if (values.length === 0) return 0;
      return Math.min(...values);
    });

    this.register('MAX', (...args: any[]): number => {
      const values = flattenNumericArgs(args);
      if (values.length === 0) return 0;
      return Math.max(...values);
    });
  }

  // ==========================================================================
  // Date Functions
  // ==========================================================================

  private registerDateFunctions(): void {
    this.register('TODAY', (): string => {
      const now = new Date();
      return now.toISOString().split('T')[0];
    });

    this.register('NOW', (): string => {
      return new Date().toISOString();
    });

    this.register('DATEADD', (dateStr: string, amount: number, unit: string): string => {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) {
        throw new Error(`DATEADD: Invalid date "${dateStr}"`);
      }
      const normalizedUnit = String(unit).toLowerCase();
      switch (normalizedUnit) {
        case 'day':
        case 'days':
          date.setDate(date.getDate() + amount);
          break;
        case 'month':
        case 'months':
          date.setMonth(date.getMonth() + amount);
          break;
        case 'year':
        case 'years':
          date.setFullYear(date.getFullYear() + amount);
          break;
        case 'hour':
        case 'hours':
          date.setHours(date.getHours() + amount);
          break;
        case 'minute':
        case 'minutes':
          date.setMinutes(date.getMinutes() + amount);
          break;
        default:
          throw new Error(`DATEADD: Unsupported unit "${unit}"`);
      }
      return date.toISOString();
    });

    this.register('DATEDIFF', (dateStr1: string, dateStr2: string, unit: string): number => {
      const date1 = new Date(dateStr1);
      const date2 = new Date(dateStr2);
      if (isNaN(date1.getTime())) {
        throw new Error(`DATEDIFF: Invalid date "${dateStr1}"`);
      }
      if (isNaN(date2.getTime())) {
        throw new Error(`DATEDIFF: Invalid date "${dateStr2}"`);
      }
      const diffMs = date2.getTime() - date1.getTime();
      const normalizedUnit = String(unit).toLowerCase();
      switch (normalizedUnit) {
        case 'day':
        case 'days':
          return Math.floor(diffMs / (1000 * 60 * 60 * 24));
        case 'month':
        case 'months':
          return (date2.getFullYear() - date1.getFullYear()) * 12 + (date2.getMonth() - date1.getMonth());
        case 'year':
        case 'years':
          return date2.getFullYear() - date1.getFullYear();
        case 'hour':
        case 'hours':
          return Math.floor(diffMs / (1000 * 60 * 60));
        case 'minute':
        case 'minutes':
          return Math.floor(diffMs / (1000 * 60));
        default:
          throw new Error(`DATEDIFF: Unsupported unit "${unit}"`);
      }
    });
  }

  // ==========================================================================
  // Logic Functions
  // ==========================================================================

  private registerLogicFunctions(): void {
    this.register('IF', (condition: any, trueValue: any, falseValue: any): any => {
      return condition ? trueValue : falseValue;
    });

    this.register('AND', (...args: any[]): boolean => {
      return args.every(Boolean);
    });

    this.register('OR', (...args: any[]): boolean => {
      return args.some(Boolean);
    });

    this.register('NOT', (value: any): boolean => {
      return !value;
    });

    this.register('SWITCH', (expr: any, ...cases: any[]): any => {
      // SWITCH(expr, val1, result1, val2, result2, ..., defaultResult)
      for (let i = 0; i < cases.length - 1; i += 2) {
        if (expr === cases[i]) {
          return cases[i + 1];
        }
      }
      // Return default value if odd number of case args
      if (cases.length % 2 === 1) {
        return cases[cases.length - 1];
      }
      return undefined;
    });
  }

  // ==========================================================================
  // String Functions
  // ==========================================================================

  private registerStringFunctions(): void {
    this.register('CONCAT', (...args: any[]): string => {
      return args.map(a => String(a ?? '')).join('');
    });

    this.register('LEFT', (text: string, count: number): string => {
      return String(text ?? '').substring(0, count);
    });

    this.register('RIGHT', (text: string, count: number): string => {
      const str = String(text ?? '');
      return str.substring(Math.max(0, str.length - count));
    });

    this.register('TRIM', (text: string): string => {
      return String(text ?? '').trim();
    });

    this.register('UPPER', (text: string): string => {
      return String(text ?? '').toUpperCase();
    });

    this.register('LOWER', (text: string): string => {
      return String(text ?? '').toLowerCase();
    });
  }
}

// ==========================================================================
// Helpers
// ==========================================================================

/**
 * Flatten nested arrays and extract numeric values
 */
function flattenNumericArgs(args: any[]): number[] {
  const result: number[] = [];
  for (const arg of args) {
    if (Array.isArray(arg)) {
      result.push(...flattenNumericArgs(arg));
    } else {
      const num = Number(arg);
      if (!isNaN(num)) {
        result.push(num);
      }
    }
  }
  return result;
}

/**
 * Flatten nested arrays
 */
function flattenArgs(args: any[]): any[] {
  const result: any[] = [];
  for (const arg of args) {
    if (Array.isArray(arg)) {
      result.push(...flattenArgs(arg));
    } else {
      result.push(arg);
    }
  }
  return result;
}
