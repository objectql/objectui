/**
 * ObjectUI
 * Copyright (c) 2024-present ObjectStack Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { defineConfig } from 'tsup';

export default defineConfig([
  // Main library entry points (with DTS)
  {
    entry: {
      cli: 'src/cli.ts',
      index: 'src/index.ts',
    },
    format: ['esm'],
    dts: true,
    clean: true,
    sourcemap: true,
    shims: false,
  },
  // oclif command entry points (runtime only, no DTS needed)
  {
    entry: {
      'commands/ui/init': 'src/commands/ui/init.ts',
      'commands/ui/dev': 'src/commands/ui/dev.ts',
      'commands/ui/build': 'src/commands/ui/build.ts',
      'commands/ui/start': 'src/commands/ui/start.ts',
      'commands/ui/serve': 'src/commands/ui/serve.ts',
      'commands/ui/lint': 'src/commands/ui/lint.ts',
      'commands/ui/test': 'src/commands/ui/test.ts',
      'commands/ui/generate': 'src/commands/ui/generate.ts',
      'commands/ui/doctor': 'src/commands/ui/doctor.ts',
      'commands/ui/add': 'src/commands/ui/add.ts',
      'commands/ui/studio': 'src/commands/ui/studio.ts',
      'commands/ui/check': 'src/commands/ui/check.ts',
      'commands/ui/validate': 'src/commands/ui/validate.ts',
      'commands/ui/create-plugin': 'src/commands/ui/create-plugin.ts',
      'commands/ui/analyze': 'src/commands/ui/analyze.ts',
    },
    format: ['esm'],
    dts: false,
    clean: false,
    sourcemap: true,
    shims: false,
  },
]);
