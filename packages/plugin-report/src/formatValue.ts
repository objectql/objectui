/**
 * ObjectUI
 * Copyright (c) 2024-present ObjectStack Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { ReportField } from '@object-ui/types';

/**
 * Format a cell value based on the field definition.
 * Handles number (with thousand separators), currency, percent, and date formatting.
 */
export function formatValue(value: any, field?: ReportField): string {
  if (value == null || value === '') return '';

  const type = field?.type;
  const format = field?.format;

  // Date formatting
  if (type === 'date' || format === 'date' || isISODateString(value)) {
    return formatDate(value);
  }

  // Number-based formatting
  if (type === 'number' || typeof value === 'number') {
    const num = typeof value === 'number' ? value : Number(value);
    if (isNaN(num)) return String(value);

    if (format === 'currency' || format === 'currency_cny') {
      return `¥${num.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
    }
    if (format === 'currency_usd') {
      return `$${num.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
    }
    if (format === 'percent') {
      return `${num.toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}%`;
    }
    // Default: thousand-separated number
    return num.toLocaleString('en-US');
  }

  return String(value);
}

/**
 * Check if a value looks like an ISO date string.
 */
function isISODateString(value: any): boolean {
  if (typeof value !== 'string') return false;
  return /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2})?/.test(value);
}

/**
 * Format a date value to a readable yyyy-MM-dd format.
 */
function formatDate(value: any): string {
  try {
    const date = new Date(value);
    if (isNaN(date.getTime())) return String(value);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  } catch {
    return String(value);
  }
}
