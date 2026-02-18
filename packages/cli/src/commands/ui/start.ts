/**
 * ObjectUI — oclif plugin command
 * Copyright (c) 2024-present ObjectStack Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { Command, Flags } from '@oclif/core';
import chalk from 'chalk';
import { start } from '../start.js';

export default class Start extends Command {
  static override description = 'Start production server';

  static override flags = {
    port: Flags.string({
      char: 'p',
      description: 'Port to run the server on',
      default: '3000',
    }),
    host: Flags.string({
      char: 'H',
      description: 'Host to bind the server to',
      default: '0.0.0.0',
    }),
    dir: Flags.string({
      char: 'd',
      description: 'Directory to serve',
      default: 'dist',
    }),
  };

  async run(): Promise<void> {
    const { flags } = await this.parse(Start);
    try {
      await start({
        port: flags.port,
        host: flags.host,
        dir: flags.dir,
      });
    } catch (error) {
      this.error(chalk.red(error instanceof Error ? error.message : String(error)));
    }
  }
}
