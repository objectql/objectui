/**
 * ObjectUI
 * Copyright (c) 2024-present ObjectStack Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { defineConfig } from 'vitest/config';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  test: {
    environment: 'happy-dom',
    exclude: ['**/node_modules/**', '**/dist/**'],
    alias: {
      '@object-ui/core': path.resolve(__dirname, '../core/src/index.ts'),
      '@object-ui/react': path.resolve(__dirname, '../react/src/index.ts'),
      '@object-ui/components': path.resolve(__dirname, '../components/src/index.ts'),
      '@/ui': path.resolve(__dirname, '../components/src/ui'),
      '@/lib': path.resolve(__dirname, '../components/src/lib'),
      '@/hooks': path.resolve(__dirname, '../components/src/hooks'),
      'react': path.resolve(__dirname, '../../node_modules/react'),
      'react-dom': path.resolve(__dirname, '../../node_modules/react-dom'),
    },
    globals: true,
  },
});
