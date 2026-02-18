/**
 * ObjectUI — oclif plugin command
 * Copyright (c) 2024-present ObjectStack Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { Command, Flags } from '@oclif/core';
import chalk from 'chalk';
import { lint } from '../lint.js';

export default class Lint extends Command {
  static override description = 'Lint the generated application code';

  static override flags = {
    fix: Flags.boolean({
      description: 'Automatically fix linting issues',
      default: false,
    }),
  };

  async run(): Promise<void> {
    const { flags } = await this.parse(Lint);
    try {
      await lint({ fix: flags.fix });
    } catch (error) {
      this.error(chalk.red(error instanceof Error ? error.message : String(error)));
    }
  }
}
