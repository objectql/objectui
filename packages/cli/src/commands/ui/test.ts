/**
 * ObjectUI — oclif plugin command
 * Copyright (c) 2024-present ObjectStack Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { Command, Flags } from '@oclif/core';
import chalk from 'chalk';
import { test } from '../test.js';

export default class Test extends Command {
  static override description = 'Run tests for the application';

  static override flags = {
    watch: Flags.boolean({
      char: 'w',
      description: 'Run tests in watch mode',
      default: false,
    }),
    coverage: Flags.boolean({
      char: 'c',
      description: 'Generate test coverage report',
      default: false,
    }),
    ui: Flags.boolean({
      description: 'Run tests with Vitest UI',
      default: false,
    }),
  };

  async run(): Promise<void> {
    const { flags } = await this.parse(Test);
    try {
      await test({
        watch: flags.watch,
        coverage: flags.coverage,
        ui: flags.ui,
      });
    } catch (error) {
      this.error(chalk.red(error instanceof Error ? error.message : String(error)));
    }
  }
}
