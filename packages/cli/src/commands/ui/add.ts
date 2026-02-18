/**
 * ObjectUI — oclif plugin command
 * Copyright (c) 2024-present ObjectStack Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { Command, Args } from '@oclif/core';
import chalk from 'chalk';
import { add } from '../add.js';

export default class Add extends Command {
  static override description = 'Add a new component renderer to your project';

  static override args = {
    component: Args.string({
      description: 'Component name (e.g. Input, Grid)',
      required: true,
    }),
  };

  async run(): Promise<void> {
    const { args } = await this.parse(Add);
    try {
      await add(args.component);
    } catch (error) {
      this.error(chalk.red(error instanceof Error ? error.message : String(error)));
    }
  }
}
