/**
 * ObjectUI — oclif plugin command
 * Copyright (c) 2024-present ObjectStack Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { Command, Args, Flags } from '@oclif/core';
import chalk from 'chalk';
import { dev } from '../dev.js';

export default class Dev extends Command {
  static override description = 'Start development server (alias for serve)';

  static override args = {
    schema: Args.string({
      description: 'Path to JSON/YAML schema file',
      default: 'app.json',
    }),
  };

  static override flags = {
    port: Flags.string({
      char: 'p',
      description: 'Port to run the server on',
      default: '3000',
    }),
    host: Flags.string({
      char: 'H',
      description: 'Host to bind the server to',
      default: 'localhost',
    }),
    open: Flags.boolean({
      description: 'Open browser automatically',
      default: true,
      allowNo: true,
    }),
  };

  async run(): Promise<void> {
    const { args, flags } = await this.parse(Dev);
    try {
      await dev(args.schema, {
        port: flags.port,
        host: flags.host,
        open: flags.open,
      });
    } catch (error) {
      this.error(chalk.red(error instanceof Error ? error.message : String(error)));
    }
  }
}
