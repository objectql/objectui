/**
 * Examples Metadata Spec Compliance Tests
 *
 * Validates that all defineStack configurations in examples/ conform to the
 * ObjectStack spec protocol. Ensures required fields are present and correctly
 * typed across objects, views, dashboards, pages, apps, and manifests.
 */
import { describe, it, expect } from 'vitest';
import { ObjectStackDefinitionSchema } from '@objectstack/spec';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Validate a defineStack result against the Zod schema */
function expectValidStack(config: unknown, name: string) {
  const result = ObjectStackDefinitionSchema.safeParse(config);
  if (!result.success) {
    const issues = result.error.issues.map(
      (i) => `  [${i.path.join('.')}] ${i.message}`
    );
    throw new Error(
      `${name} failed spec validation:\n${issues.join('\n')}`
    );
  }
  expect(result.success).toBe(true);
}

// ---------------------------------------------------------------------------
// Structural helpers — verify required keys exist on metadata objects
// ---------------------------------------------------------------------------

function assertDashboards(dashboards: any[], label: string) {
  for (const d of dashboards) {
    expect(d).toHaveProperty('name');
    expect(d).toHaveProperty('label');
    expect(d).toHaveProperty('description');
    expect(Array.isArray(d.widgets)).toBe(true);

    for (const w of d.widgets) {
      // defineStack normalizes widgets — id may be stripped, but title/type/layout should remain
      expect(w).toHaveProperty('title');
      expect(w).toHaveProperty('type');
      expect(w).toHaveProperty('layout');
    }
  }
}

function assertManifest(manifest: any) {
  expect(manifest).toHaveProperty('id');
  expect(manifest).toHaveProperty('version');
  expect(manifest).toHaveProperty('type', 'app');
  expect(manifest).toHaveProperty('name');
  expect(manifest).toHaveProperty('description');
}

function assertNavigation(items: any[]) {
  for (const item of items) {
    expect(item).toHaveProperty('id');
    expect(item).toHaveProperty('type');
    expect(item).toHaveProperty('label');
    if (item.children) {
      assertNavigation(item.children);
    }
  }
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('Example: todo', () => {
  let config: any;

  it('should import cleanly', async () => {
    const mod = await import('../../../../examples/todo/objectstack.config');
    config = mod.default;
    expect(config).toBeDefined();
  });

  it('should pass ObjectStackDefinitionSchema validation', () => {
    expectValidStack(config, 'todo');
  });

  it('should have explicit views', () => {
    expect(Array.isArray(config.views)).toBe(true);
    expect(config.views.length).toBeGreaterThan(0);
  });

  it('objects should have name, label, and fields', () => {
    for (const obj of config.objects) {
      expect(obj).toHaveProperty('name');
      expect(obj).toHaveProperty('label');
      expect(obj).toHaveProperty('fields');
    }
  });

  it('dashboards should have name, label, description, and valid widgets', () => {
    assertDashboards(config.dashboards, 'todo');
  });

  it('pages should have name, label, type, and regions', () => {
    for (const page of config.pages ?? []) {
      expect(page).toHaveProperty('name');
      expect(page).toHaveProperty('label');
      expect(page).toHaveProperty('type');
      expect(page).toHaveProperty('regions');
    }
  });

  it('manifest should have required fields', () => {
    assertManifest(config.manifest);
  });

  it('apps navigation items should have id/type/label', () => {
    for (const app of config.apps) {
      assertNavigation(app.navigation ?? []);
    }
  });
});

describe('Example: kitchen-sink', () => {
  let config: any;

  it('should import cleanly', async () => {
    const mod = await import(
      '../../../../examples/kitchen-sink/objectstack.config'
    );
    config = mod.default;
    expect(config).toBeDefined();
  });

  it('should pass ObjectStackDefinitionSchema validation', () => {
    expectValidStack(config, 'kitchen-sink');
  });

  it('objects should have name, label, and fields', () => {
    for (const obj of config.objects) {
      expect(obj).toHaveProperty('name');
      expect(obj).toHaveProperty('label');
      expect(obj).toHaveProperty('fields');
    }
  });

  it('should have explicit views', () => {
    expect(Array.isArray(config.views)).toBe(true);
    expect(config.views.length).toBeGreaterThan(0);
  });

  it('dashboards should have name, label, description, and valid widgets', () => {
    assertDashboards(config.dashboards, 'kitchen-sink');
  });

  it('pages should have name, label, type, and regions', () => {
    for (const page of config.pages ?? []) {
      expect(page).toHaveProperty('name');
      expect(page).toHaveProperty('label');
      expect(page).toHaveProperty('type');
      expect(page).toHaveProperty('regions');
    }
  });

  it('manifest should have required fields', () => {
    assertManifest(config.manifest);
  });

  it('apps navigation items should have id/type/label', () => {
    for (const app of config.apps) {
      assertNavigation(app.navigation ?? []);
    }
  });
});

describe('Example: crm', () => {
  let config: any;

  it('should import cleanly', async () => {
    const mod = await import('../../../../examples/crm/objectstack.config');
    config = mod.default;
    expect(config).toBeDefined();
  });

  it('should pass ObjectStackDefinitionSchema validation', () => {
    expectValidStack(config, 'crm');
  });

  it('objects should have name, label, and fields', () => {
    for (const obj of config.objects) {
      expect(obj).toHaveProperty('name');
      expect(obj).toHaveProperty('label');
      expect(obj).toHaveProperty('fields');
    }
  });

  it('should have explicit views', () => {
    expect(Array.isArray(config.views)).toBe(true);
    expect(config.views.length).toBeGreaterThan(0);
  });

  it('dashboards should have name, label, description, and valid widgets', () => {
    assertDashboards(config.dashboards, 'crm');
  });

  it('pages should have name, label, type, and regions', () => {
    for (const page of config.pages ?? []) {
      expect(page).toHaveProperty('name');
      expect(page).toHaveProperty('label');
      expect(page).toHaveProperty('type');
      expect(page).toHaveProperty('regions');
    }
  });

  it('manifest should have required fields', () => {
    assertManifest(config.manifest);
  });

  it('apps navigation items should have id/type/label', () => {
    for (const app of config.apps) {
      assertNavigation(app.navigation ?? []);
    }
  });
});

describe('Example: msw-todo', () => {
  let config: any;

  it('should import cleanly', async () => {
    const mod = await import(
      '../../../../examples/msw-todo/objectstack.config'
    );
    config = mod.default;
    expect(config).toBeDefined();
  });

  it('should pass ObjectStackDefinitionSchema validation', () => {
    expectValidStack(config, 'msw-todo');
  });

  it('should have explicit views', () => {
    expect(Array.isArray(config.views)).toBe(true);
    expect(config.views.length).toBeGreaterThan(0);
  });

  it('objects should use ObjectSchema.create (have normalized defaults)', () => {
    for (const obj of config.objects) {
      // ObjectSchema.create populates normalized defaults like active, isSystem, datasource
      expect(obj).toHaveProperty('name');
      expect(obj).toHaveProperty('label');
      expect(obj).toHaveProperty('fields');
      expect(obj).toHaveProperty('active', true);
      expect(obj).toHaveProperty('datasource', 'default');
    }
  });

  it('manifest should have required fields', () => {
    assertManifest(config.manifest);
  });

  it('apps navigation items should have id/type/label', () => {
    for (const app of config.apps) {
      assertNavigation(app.navigation ?? []);
    }
  });
});
