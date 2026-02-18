/**
 * ObjectUI — oclif plugin command
 * Copyright (c) 2024-present ObjectStack Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { Command, Args, Flags } from '@oclif/core';
import chalk from 'chalk';
import { init } from '../init.js';

export default class Init extends Command {
  static override description = '初始化新的Object UI应用 / Initialize a new Object UI application with sample schema';

  static override args = {
    name: Args.string({
      description: '应用名称 / Application name',
      default: 'my-app',
    }),
  };

  static override flags = {
    template: Flags.string({
      char: 't',
      description: '使用的模板 / Template to use (dashboard, form, simple)',
      default: 'dashboard',
    }),
  };

  async run(): Promise<void> {
    const { args, flags } = await this.parse(Init);
    try {
      await init(args.name, { template: flags.template });
    } catch (error) {
      this.error(chalk.red(error instanceof Error ? error.message : String(error)));
    }
  }
}
