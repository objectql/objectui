
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
// @ts-ignore
globalThis.require = require;

import { sharedConfig, appConfigs, setupAppConfig } from './objectstack.shared';

// @ts-ignore
import * as MSWPluginPkg from '@objectstack/plugin-msw';
// @ts-ignore
import * as ObjectQLPluginPkg from '@objectstack/objectql';
// @ts-ignore
import * as HonoServerPluginPkg from '@objectstack/plugin-hono-server';
// @ts-ignore
import * as DriverMemoryPkg from '@objectstack/driver-memory';
// @ts-ignore
import * as RuntimePkg from '@objectstack/runtime';
// @ts-ignore
import * as CorePkg from '@objectstack/core';

const MSWPlugin = MSWPluginPkg.MSWPlugin || (MSWPluginPkg as any).default?.MSWPlugin || (MSWPluginPkg as any).default;
const ObjectQLPlugin = ObjectQLPluginPkg.ObjectQLPlugin || (ObjectQLPluginPkg as any).default?.ObjectQLPlugin || (ObjectQLPluginPkg as any).default;
const InMemoryDriver = DriverMemoryPkg.InMemoryDriver || (DriverMemoryPkg as any).default?.InMemoryDriver || (DriverMemoryPkg as any).default;
const DriverPlugin = RuntimePkg.DriverPlugin || (RuntimePkg as any).default?.DriverPlugin || (RuntimePkg as any).default;
const AppPlugin = RuntimePkg.AppPlugin || (RuntimePkg as any).default?.AppPlugin || (RuntimePkg as any).default;
const HonoServerPlugin = HonoServerPluginPkg.HonoServerPlugin || (HonoServerPluginPkg as any).default?.HonoServerPlugin || (HonoServerPluginPkg as any).default;
const createMemoryI18n = CorePkg.createMemoryI18n || (CorePkg as any).default?.createMemoryI18n;

import { ConsolePlugin } from './plugin';

/**
 * Lightweight plugin that registers the in-memory i18n service during the
 * init phase.  This is critical for server mode (`pnpm start`) because:
 *
 *   1. AppPlugin.start() → loadTranslations() needs an i18n service.
 *   2. The kernel's own memory i18n fallback is auto-registered in
 *      validateSystemRequirements() — which runs AFTER all plugin starts.
 *   3. Without an early-registered i18n service, loadTranslations() finds
 *      nothing and silently skips — translations never get loaded.
 *
 * By registering the service during init (Phase 1), AppPlugin.start()
 * (Phase 2) finds it and loads the spec-format `translations` array.
 *
 * Name matches the CLI's dedup check so it won't attempt to also import
 * @objectstack/service-i18n.
 */
class MemoryI18nPlugin {
  readonly name = 'com.objectstack.service.i18n';
  readonly version = '1.0.0';
  readonly type = 'service' as const;

  init(ctx: any) {
    const svc = createMemoryI18n();
    ctx.registerService('i18n', svc);
  }
}

/**
 * Plugin ordering matters for server mode (`pnpm start`):
 *
 * The CLI's isHostConfig() detects that config.plugins contains objects with
 * init methods (ObjectQLPlugin, DriverPlugin, etc.) and treats this as a
 * "host config" — skipping auto-registration of AppPlugin.
 *
 * We therefore include AppPlugin explicitly so that:
 *   - Objects/metadata are registered with the kernel
 *   - Seed data is loaded into the in-memory driver
 *   - Translations are loaded into the i18n service (via loadTranslations)
 *
 * MemoryI18nPlugin MUST come before AppPlugin so that the i18n service
 * exists when AppPlugin.start() → loadTranslations() runs.
 */
const plugins: any[] = [
    new MemoryI18nPlugin(),
    new ObjectQLPlugin(),
    new DriverPlugin(new InMemoryDriver(), 'memory'),
    // Each example stack loaded as an independent AppPlugin
    ...appConfigs.map((config: any) => new AppPlugin(config)),
    // Setup App registered via AppPlugin so ObjectQLPlugin discovers it
    new AppPlugin(setupAppConfig),
    new HonoServerPlugin({ port: 3000 }),
    new ConsolePlugin(),
];

// Re-enable MSW only if explicitly needed
if (process.env.ENABLE_MSW_PLUGIN === 'true') {
    plugins.push(new MSWPlugin());
}

export default {
  ...sharedConfig,
  
  build: {
    outDir: './dist',
    sourcemap: true,
    minify: true,
    target: 'node18',
  },
  
  datasources: {
    default: {
      driver: 'memory', 
    },
  },
  
  plugins,
  
  dev: {
    port: 3000,
    host: '0.0.0.0',
    watch: true,
    hotReload: true,
  },
  
  deploy: {
    target: 'static',
    region: 'us-east-1',
  },
};
