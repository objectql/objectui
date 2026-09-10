/**
 * ObjectUI
 * Copyright (c) 2024-present ObjectStack Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * objectui#8285 — what a REAL author is told when they write `quickAdd` on an
 * `object-kanban` / `kanban` page (director-seat ruling of 2026-09-08, batch
 * #91, slice C).
 *
 * The rule itself is pinned next door, over a fixture manifest
 * (`packages/sdui-parser/src/__tests__/kanban-quick-add-8285.test.ts`). THIS
 * file asks the question of the LIVE registry — a manifest built the way the
 * JSX-page compiler builds its own — so the verdicts here are the ones an
 * author gets, not the ones a fixture was written to produce. It also ties the
 * `sdui-parser` constant back to the registrations it describes, which is the
 * one thing a package with no registry dependency cannot check for itself.
 *
 * ## Which rows are readings, and of what
 *
 * Rows 1-2 are the change: the tier now names the pair instead of claiming the
 * block has no such prop. Rows 3-6 are green in BOTH worlds and each is kept
 * for a stated reason:
 *
 *   3. THE TAG SET — `QUICK_ADD_HOST_TYPES` is restated data in a package that
 *      must not depend on this one, so it is re-derived HERE from the
 *      registration calls. A third `ObjectKanbanRenderer` tag, or a rename,
 *      reddens this row rather than silently narrowing the diagnostic.
 *   4. STILL NOT DECLARED — the ruling DIAGNOSES, it does not widen. A "fix"
 *      that added `quickAdd` to `OBJECT_KANBAN_INPUTS` would publish a key the
 *      renderer cannot honour, which is what objectui#8201 escalated rather
 *      than doing.
 *   5. THE PRECONDITION — the spec still publishes `object-kanban.quickAdd`,
 *      with a control on the same `safeParse` so the verdict is a reading. It
 *      is what makes `unknown-prop` a FALSE message, and it is a TRIPWIRE: the
 *      day option B lands in `@objectstack/spec`, this row goes red, which is
 *      the day this interim and its module are deleted.
 *   6. THE DEFECT IS STILL THERE — `ObjectKanban` supplies no `onQuickAdd`
 *      (zero, against a lit `onCardClick` control in the same file). A board
 *      that grew a real handler would redden this row, and an interim that
 *      outlived its defect is exactly the thing nobody notices.
 */
import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { ComponentRegistry } from '@object-ui/core';
import { ComponentPropsMap } from '@objectstack/spec/ui';
import {
  INERT_QUICK_ADD,
  QUICK_ADD_HOST_TYPES,
  QUICK_ADD_KEY,
  manifestFromConfigs,
  validateTree,
} from '@object-ui/sdui-parser';
// Module scope, not a hook: this import IS the registration (AGENTS.md's
// test-discipline section — an unbounded module load must not be billed to a
// bounded window).
import { ObjectKanbanRenderer } from '../index';
import '../index';

const SRC = join(dirname(fileURLToPath(import.meta.url)), '..');
const INDEX_TSX = join(SRC, 'index.tsx');
const OBJECT_KANBAN_TSX = join(SRC, 'ObjectKanban.tsx');

/** Every key `index.tsx` registers `ObjectKanbanRenderer` under. */
const registeredKeys = (): string[] => {
  const re = /ComponentRegistry\.register\(\s*'([^']+)'\s*,\s*ObjectKanbanRenderer\b/g;
  return [...readFileSync(INDEX_TSX, 'utf8').matchAll(re)].map((m) => m[1]).sort();
};

/** A manifest built from the live registry, the way the page compiler builds its own. */
const liveManifest = () =>
  manifestFromConfigs(
    ComponentRegistry.getKnownTypes().map((type) => {
      const meta = ComponentRegistry.getMeta(type);
      return { type, namespace: meta?.namespace, isContainer: meta?.isContainer, inputs: meta?.inputs };
    }) as unknown as Parameters<typeof manifestFromConfigs>[0],
  );

/** Diagnostic codes a one-node page draws that NAME the given prop. */
const codesFor = (type: string, props: Record<string, unknown>, key: string): string[] =>
  validateTree({ type, objectName: 'task', ...props } as never, liveManifest())
    .diagnostics.filter((d) => d.message.includes(`"${key}"`))
    .map((d) => d.code);

const declaredInputNames = (type: string, namespace?: string): string[] =>
  ((ComponentRegistry.getConfig(type, namespace) as any)?.inputs ?? []).map((i: any) => i.name);

const KANBAN_TAGS = [
  { label: 'object-kanban', type: 'object-kanban', namespace: 'plugin-kanban' },
  { label: 'view:kanban', type: 'kanban', namespace: 'view' },
] as const;

/** The key names a strict parse of the block's spec schema refuses BY NAME. */
const refusedByName = (props: Record<string, unknown>): string[] => {
  const parsed = (ComponentPropsMap as Record<string, any>)['object-kanban'].safeParse(props);
  return parsed.success ? [] : parsed.error.issues.flatMap((issue: any) => issue.keys ?? []);
};

describe('objectui#8285 — the html tier names the Quick Add pair instead of dropping the key', () => {
  it.each(KANBAN_TAGS)('$label — an authored `quickAdd: true` draws the inert-pair warning', ({ type }) => {
    expect(codesFor(type, { quickAdd: true }, QUICK_ADD_KEY)).toEqual([INERT_QUICK_ADD]);
  });

  it.each(KANBAN_TAGS)('$label — control: a genuinely unknown prop is still reported', ({ type }) => {
    // Green in both worlds; guards a fix that suppressed the generic walk for
    // this block rather than answering for this one key.
    expect(codesFor(type, { bogusProp: 'x' }, 'bogusProp')).toEqual(['unknown-prop']);
  });

  it('the diagnostic covers exactly the tags `index.tsx` registers this renderer under', () => {
    expect(registeredKeys()).toEqual([...QUICK_ADD_HOST_TYPES].sort());
    // Anti-vacuity + discrimination: a regex that matched nothing would return
    // `[]`, and the two blocks registered in the SAME file to OTHER renderers
    // must not be in the set — `kanban-ui` is the one the ruling keeps.
    expect(registeredKeys().length).toBe(2);
    expect(registeredKeys()).not.toContain('kanban-ui');
    expect(registeredKeys()).not.toContain('kanban-enhanced');
    expect(ComponentRegistry.has('kanban-ui')).toBe(true);
    for (const key of registeredKeys()) expect(ComponentRegistry.get(key)).toBe(ObjectKanbanRenderer);
  });

  it.each(KANBAN_TAGS)('$label — this DIAGNOSES; it does not declare `quickAdd`', ({ type, namespace }) => {
    const declared = declaredInputNames(type, namespace);
    // Non-vacuity: an empty read (wrong type/namespace) would satisfy the
    // `not.toContain` below for the wrong reason.
    expect(declared, `${type} inputs`).toContain('objectName');
    expect(declared, `${type} inputs`).not.toContain(QUICK_ADD_KEY);
  });

  it('precondition + tripwire: the spec still publishes `object-kanban.quickAdd`', () => {
    // This is what makes "has no prop quickAdd" a false message. Red the day
    // option B retires the key — the day this interim is deleted.
    expect(refusedByName({ objectName: 'task', [QUICK_ADD_KEY]: true })).not.toContain(QUICK_ADD_KEY);
    // The control for that zero, on the same strict schema (objectui#8172's
    // lesson: "the spec declares it" is measured, never assumed).
    expect(refusedByName({ objectName: 'task', bogusProp: 'x' })).toContain('bogusProp');
  });

  it('the defect is still live: `ObjectKanban` supplies no `onQuickAdd`', () => {
    const src = readFileSync(OBJECT_KANBAN_TSX, 'utf8');
    expect(src.match(/onQuickAdd/g) ?? []).toHaveLength(0);
    // The control that makes that zero a reading rather than a broken query.
    expect((src.match(/onCardClick/g) ?? []).length).toBeGreaterThan(0);
  });
});
