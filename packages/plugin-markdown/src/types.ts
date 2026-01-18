/**
 * ObjectUI
 * Copyright (c) 2024-present ObjectStack Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { BaseSchema } from '@object-ui/types';

/**
 * Markdown component schema.
 * Renders markdown content with GitHub Flavored Markdown support.
 */
export interface MarkdownSchema extends BaseSchema {
  type: 'markdown';
  
  /**
   * The markdown content to render. Supports GitHub Flavored Markdown including:
   * - Headers (H1-H6)
   * - Bold, italic, and inline code
   * - Links and images
   * - Lists (ordered, unordered, and nested)
   * - Tables
   * - Blockquotes
   * - Code blocks
   * - Strikethrough
   * - Task lists
   */
  content?: string;
  
  /**
   * Optional CSS class name to apply custom styling to the markdown container.
   */
  className?: string;
}
