/**
 * ObjectUI — oclif plugin command
 * Copyright (c) 2024-present ObjectStack Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { Command, Args, Flags } from '@oclif/core';
import chalk from 'chalk';
import { generate } from '../generate.js';

export default class Generate extends Command {
  static override description = 'Generate new resources (objects, pages, plugins)';

  static override aliases = ['ui:g'];

  static override args = {
    type: Args.string({
      description: 'Type of resource to generate (resource/object, page, plugin)',
      required: true,
    }),
    name: Args.string({
      description: 'Name of the resource',
      required: true,
    }),
  };

  static override flags = {
    from: Flags.string({
      description: 'Generate schema from external source (openapi.yaml, prisma.schema)',
    }),
    output: Flags.string({
      description: 'Output directory for generated schemas',
      default: 'schemas/',
    }),
  };

  async run(): Promise<void> {
    const { args, flags } = await this.parse(Generate);
    try {
      if (flags.from) {
        console.log(chalk.yellow('\n⚠ Schema generation from external sources (OpenAPI/Prisma) is not yet implemented.'));
        console.log(chalk.gray('This feature will be available in a future release.\n'));
        return;
      }

      await generate(args.type, args.name);
    } catch (error) {
      this.error(chalk.red(error instanceof Error ? error.message : String(error)));
    }
  }
}
