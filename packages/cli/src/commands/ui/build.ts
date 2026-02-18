/**
 * ObjectUI — oclif plugin command
 * Copyright (c) 2024-present ObjectStack Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { Command, Args, Flags } from '@oclif/core';
import chalk from 'chalk';
import { buildApp } from '../build.js';

export default class Build extends Command {
  static override description = 'Build application for production';

  static override args = {
    schema: Args.string({
      description: 'Path to JSON/YAML schema file',
      default: 'app.json',
    }),
  };

  static override flags = {
    'out-dir': Flags.string({
      char: 'o',
      description: 'Output directory',
      default: 'dist',
    }),
    clean: Flags.boolean({
      description: 'Clean output directory before build',
      default: false,
    }),
  };

  async run(): Promise<void> {
    const { args, flags } = await this.parse(Build);
    try {
      await buildApp(args.schema, {
        outDir: flags['out-dir'],
        clean: flags.clean,
      });
    } catch (error) {
      this.error(chalk.red(error instanceof Error ? error.message : String(error)));
    }
  }
}
