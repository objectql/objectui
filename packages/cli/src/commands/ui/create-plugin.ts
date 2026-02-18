/**
 * ObjectUI — oclif plugin command
 * Copyright (c) 2024-present ObjectStack Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { Command, Args } from '@oclif/core';
import chalk from 'chalk';
import { createPlugin } from '../create-plugin.js';

export default class CreatePlugin extends Command {
  static override description = 'Create a new ObjectUI plugin';

  static override args = {
    name: Args.string({
      description: 'Name of the plugin',
      required: true,
    }),
  };

  async run(): Promise<void> {
    const { args } = await this.parse(CreatePlugin);
    try {
      await createPlugin(args.name);
    } catch (error) {
      this.error(chalk.red(error instanceof Error ? error.message : String(error)));
    }
  }
}
