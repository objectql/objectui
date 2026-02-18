/**
 * ObjectUI — oclif plugin command
 * Copyright (c) 2024-present ObjectStack Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { Command, Flags } from '@oclif/core';
import chalk from 'chalk';
import { analyze } from '../analyze.js';

export default class Analyze extends Command {
  static override description = 'Analyze application performance';

  static override flags = {
    'bundle-size': Flags.boolean({
      description: 'Analyze bundle size',
      default: false,
    }),
    'render-performance': Flags.boolean({
      description: 'Analyze render performance',
      default: false,
    }),
  };

  async run(): Promise<void> {
    const { flags } = await this.parse(Analyze);
    try {
      await analyze({
        bundleSize: flags['bundle-size'],
        renderPerformance: flags['render-performance'],
      });
    } catch (error) {
      this.error(chalk.red(error instanceof Error ? error.message : String(error)));
    }
  }
}
