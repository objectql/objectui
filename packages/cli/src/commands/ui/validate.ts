/**
 * ObjectUI — oclif plugin command
 * Copyright (c) 2024-present ObjectStack Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { Command, Args } from '@oclif/core';
import chalk from 'chalk';
import { validate } from '../validate.js';

export default class Validate extends Command {
  static override description = 'Validate a schema file against ObjectUI specifications';

  static override args = {
    schema: Args.string({
      description: 'Path to schema file (JSON or YAML)',
      default: 'app.json',
    }),
  };

  async run(): Promise<void> {
    const { args } = await this.parse(Validate);
    try {
      await validate(args.schema);
    } catch (error) {
      this.error(chalk.red(error instanceof Error ? error.message : String(error)));
    }
  }
}
