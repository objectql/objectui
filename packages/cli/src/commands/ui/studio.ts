/**
 * ObjectUI — oclif plugin command
 * Copyright (c) 2024-present ObjectStack Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { Command } from '@oclif/core';
import chalk from 'chalk';
import { studio } from '../studio.js';

export default class Studio extends Command {
  static override description = 'Start the visual designer';

  async run(): Promise<void> {
    try {
      await studio();
    } catch (error) {
      this.error(chalk.red(error instanceof Error ? error.message : String(error)));
    }
  }
}
