/**
 * Root Development Configuration
 *
 * Aggregates all example apps for `pnpm serve` / `pnpm dev:server`.
 * This is NOT a deployable config — it's the monorepo dev entry point.
 *
 * Console supports two running modes:
 *   - MSW:    `pnpm dev`        — Vite dev server with MSW intercepting API calls in browser
 *   - Server: `pnpm dev:server` — Real ObjectStack API server + Vite console proxying to it
 *
 * Note: Examples are merged into a single AppPlugin (rather than separate AppPlugins)
 * because CRM and Kitchen Sink both define an `account` object, which would
 * trigger an ownership conflict in the ObjectQL Schema Registry.
 *
 */
import { defineStack } from '@objectstack/spec';
import { AppPlugin, DriverPlugin } from '@objectstack/runtime';
import { ObjectQLPlugin } from '@objectstack/objectql';
import { InMemoryDriver } from '@objectstack/driver-memory';
import { HonoServerPlugin } from '@objectstack/plugin-hono-server';
import { ConsolePlugin } from '@object-ui/console';
import CrmConfig from './examples/crm/objectstack.config';
import TodoConfig from './examples/todo/objectstack.config';
import KitchenSinkConfig from './examples/kitchen-sink/objectstack.config';

const crm = (CrmConfig as any).default || CrmConfig;
const todo = (TodoConfig as any).default || TodoConfig;
const kitchenSink = (KitchenSinkConfig as any).default || KitchenSinkConfig;

// Base objects from built-in examples
const baseObjects = [
  ...(crm.objects || []),
  ...(todo.objects || []),
  ...(kitchenSink.objects || []),
];

// Collect all example configs for view merging
const allConfigs = [crm, todo, kitchenSink];

// ---------------------------------------------------------------------------
// Merge stack-level views into object definitions.
// defineStack() strips non-standard properties like listViews from objects.
// Re-merge listViews after validation so the runtime protocol serves objects
// with their view definitions (calendar, kanban, etc.).
// ---------------------------------------------------------------------------
function mergeViewsIntoObjects(objects: any[], configs: any[]): any[] {
  const viewsByObject: Record<string, Record<string, any>> = {};
  for (const config of configs) {
    if (!Array.isArray(config.views)) continue;
    for (const view of config.views) {
      if (!view.listViews) continue;
      for (const [viewName, listView] of Object.entries(view.listViews as Record<string, any>)) {
        const objectName = listView?.data?.object;
        if (!objectName) continue;
        if (!viewsByObject[objectName]) viewsByObject[objectName] = {};
        viewsByObject[objectName][viewName] = listView;
      }
    }
  }
  return objects.map((obj: any) => {
    const views = viewsByObject[obj.name];
    if (!views) return obj;
    return { ...obj, listViews: { ...(obj.listViews || {}), ...views } };
  });
}

// Merge all example configs into a single app bundle for AppPlugin
const mergedApp = defineStack({
  manifest: {
    id: 'dev-workspace',
    name: 'dev_workspace',
    version: '0.0.0',
    description: 'ObjectUI monorepo development workspace',
    type: 'app',
    data: [
      ...(crm.manifest?.data || []),
      ...(todo.manifest?.data || []),
      ...(kitchenSink.manifest?.data || []),
    ],
  },
  objects: baseObjects,
  views: [
    ...(crm.views || []),
    ...(todo.views || []),
    ...(kitchenSink.views || []),
  ],
  apps: [
    ...(crm.apps || []),
    ...(todo.apps || []),
    ...(kitchenSink.apps || []),
  ],
  dashboards: [
    ...(crm.dashboards || []),
    ...(todo.dashboards || []),
    ...(kitchenSink.dashboards || []),
  ],
  reports: [
    ...(crm.reports || []),
  ],
  pages: [
    ...(crm.pages || []),
    ...(todo.pages || []),
    ...(kitchenSink.pages || []),
  ],
} as any);

// Re-merge listViews that defineStack stripped from objects
const mergedAppWithViews = {
  ...mergedApp,
  objects: mergeViewsIntoObjects(mergedApp.objects || [], allConfigs),
};

// Export only plugins — no top-level objects/manifest/apps.
// The CLI auto-creates an AppPlugin from the config if it detects objects/manifest/apps,
// which would conflict with our explicit AppPlugin and skip seed data loading.
export default {
  plugins: [
    new ObjectQLPlugin(),
    new DriverPlugin(new InMemoryDriver()),
    new AppPlugin(mergedAppWithViews),
    new HonoServerPlugin({ port: 3000 }),
    new ConsolePlugin(),
  ],
};
