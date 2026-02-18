/**
 * ObjectUI — oclif plugin command
 * Copyright (c) 2024-present ObjectStack Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { Command } from '@oclif/core';
import chalk from 'chalk';
import { doctor } from '../doctor.js';

export default class Doctor extends Command {
  static override description = 'Diagnose and fix common issues';

  async run(): Promise<void> {
    try {
      await doctor();
    } catch (error) {
      this.error(chalk.red(error instanceof Error ? error.message : String(error)));
    }
  }
}
