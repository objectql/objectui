/**
 * ObjectUI
 * Copyright (c) 2024-present ObjectStack Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * objectui#7997 — `DetailViewSchema.related[].columns` admits a bare FIELD
 * NAME, which is the arm `@objectstack/spec` declares.
 *
 * ## What was wrong
 *
 * The member was declared `TableColumn[]`. `RelatedList.normalizeColumn` has a
 * dedicated bare-string branch that resolves the name against the related
 * object's schema — header from the field's `label`, plus a type-aware cell
 * renderer — and `RelatedList.columnIdentityAccessor.test.tsx` has pinned that
 * behaviour ("keeps bare-string entries hydrating as before") for cards. So the
 * renderer and its behaviour pins already agreed on two arms; only this
 * declaration said one. Measured on the base commit:
 *
 * ```
 * const view: DetailViewSchema = {
 *   type: 'detail-view',
 *   related: [{ title: 'Tasks', type: 'table', columns: ['status'] }],
 * };                                                      // TS2322
 * ```
 *
 * The direction was settled by the maintainer principle in force on this card,
 * quoted verbatim and untranslated because a paraphrase is a different ruling:
 *
 * > 我们的项目以 objectstack 协议为准，文档应该以实际实现为准。协议不正确的应该先修改协议。
 *
 * `@objectstack/spec` `packages/spec/src/ui/component.zod.ts` declares
 * `RecordRelatedListProps.columns` as `z.array(z.string())` — "Fields to
 * display in the related list" — so the string arm is the protocol's arm, and
 * the narrow declaration was the face out of line.
 *
 * ## Why the assertions below are shaped the way they are
 *
 * The caricature of a widening is `any[]`: it satisfies every "the string form
 * now compiles" assertion while deleting the whole authoring contract. So the
 * positives are never load-bearing alone. The division of labour between the
 * constructs below was MEASURED by mutating the member three ways and reading
 * `tsc -p tsconfig.test.json` each time — not reasoned about:
 *
 * | member mutated to           | what catches it, in this file |
 * | :-------------------------- | :---------------------------- |
 * | `TableColumn[]` (the bug)   | `_columnsShape`, `_stringArmReachesBothFaces`, and the four positive string rows |
 * | `any[]` (the caricature)    | `_columnsShape` + all three `@ts-expect-error`s go TS2578 "unused" |
 * | `string[]` (over-rotation)  | `_columnsShape` + the object-arm positives |
 *
 * ⚠️ The refusals do NOT catch the revert: `[42]` and `[{ header }]` are
 * refused by `TableColumn[]` too, so those three rows stay green under the very
 * bug this card fixes. `_columnsShape` is what holds that line — mutual
 * assignability, so it fails in both directions where a one-way `extends`
 * would pass for two of the three mutations above.
 *
 * ⚠️ Each `@ts-expect-error` sits on the `columns:` MEMBER, not on the `const`.
 * The error is reported at the offending member inside the object literal, so a
 * directive on the declaration suppresses nothing and `tsc` reports it twice
 * over: TS2578 for the unused directive AND the unsuppressed TS2322 below it.
 * Measured here, on the first run of this file — not a style choice.
 *
 * ## Which program checks this file
 *
 * `packages/types`' `type-check` runs THREE programs; this file is in the third
 * (`tsconfig.test.json` — `tsc --noEmit` builds `tsconfig.json`, which excludes
 * `__tests__/` by directory). The subject is imported as a sibling SOURCE
 * module (`../views`), so that program reads the declaration directly and no
 * `dist` staleness sits between this file and what it pins.
 *
 * ## What this card deliberately did NOT change
 *
 * Two things, both held visible below rather than left to rot into assumptions:
 *
 * 1. **The renderer.** Nothing in `RelatedList` moved. This is a declaration
 *    change, and the last block measures the runtime accept set it is catching
 *    up with.
 * 2. **The object arm.** The spec's `columns` is strings ONLY, so objectui is
 *    WIDER than the protocol here. The principle quoted above forbids being
 *    narrower; it does not, in its own text, settle a wider arm — and
 *    `DetailViewSchema` is objectui's own host-facing React view schema, not a
 *    spec-bound block (`packages/spec/src/ui/view.zod.ts` declares no
 *    `DetailView` at all). Retiring the object arm is a separate, non-additive
 *    change that needs its own answer; the block below pins it as PRESENT so
 *    that answer is taken deliberately rather than by drift.
 */

import { describe, it, expect } from 'vitest';
import type { DetailViewSchema } from '../views';
import type { TableColumn } from '../data-display';
import type { RecordRelatedListComponentProps } from '../record-components';
import { DetailViewSchema as DetailViewZodMirror } from '../zod/views.zod';

/** Mutual assignability, the standard invariant `Eq` — not `extends`. */
type Eq<A, B> = (<T>() => T extends A ? 1 : 2) extends (<T>() => T extends B ? 1 : 2)
  ? true
  : false;

/** One entry of the `related` array — the object this card is about. */
type RelatedEntry = NonNullable<DetailViewSchema['related']>[number];

/* ── (a) the member's type, pinned whole ──────────────────────────────────── */

describe('objectui#7997 — DetailViewSchema.related[].columns declares both arms', () => {
  it('the member type is exactly `TableColumn | string` entries, optional', () => {
    // Mutual assignability, so this fails in BOTH directions: reverted to
    // `TableColumn[]` it fails, and widened to `any[]` or over-rotated to
    // `string[]` it also fails. A one-way `extends` check would pass for two of
    // those three. This is the ONLY assertion in the file that catches the
    // revert — see the table in the header.
    const _columnsShape: Eq<RelatedEntry['columns'], Array<TableColumn | string> | undefined> =
      true;
    expect(_columnsShape).toBe(true);
  });

  it('the member is still optional — omitting `columns` is still authoring', () => {
    const noColumns: DetailViewSchema = {
      type: 'detail-view',
      related: [{ title: 'Tasks', type: 'table', api: 'task' }],
    };
    expect(noColumns.related?.[0].columns).toBeUndefined();
  });
});

/* ── (b) the arm this card exists for ─────────────────────────────────────── */

describe('objectui#7997 — the protocol-shaped string form type-checks', () => {
  it("the card's own reproduction compiles", () => {
    const view: DetailViewSchema = {
      type: 'detail-view',
      related: [{ title: 'Tasks', type: 'table', api: 'task', columns: ['status'] }],
    };
    expect(view.related?.[0].columns).toEqual(['status']);
  });

  it('the multi-field form the issue was filed with compiles', () => {
    const view: DetailViewSchema = {
      type: 'detail-view',
      related: [{ title: 'Contacts', type: 'table', api: 'contact', columns: ['name', 'email'] }],
    };
    expect(view.related?.[0].columns).toEqual(['name', 'email']);
  });

  it('a `string[]` built elsewhere assigns in — not only a fresh literal', () => {
    // Producers hand `columns` a computed list (a picked subset of an object's
    // fields, say). A widening that only admitted literals would not help them.
    const picked: string[] = ['status', 'amount'];
    const view: DetailViewSchema = {
      type: 'detail-view',
      related: [{ title: 'Tasks', type: 'table', api: 'task', columns: picked }],
    };
    expect(view.related?.[0].columns).toBe(picked);
  });

  it('the string and object arms mix in one list', () => {
    // `normalizeColumn` maps per entry, so a mixed list is a real authoring
    // shape rather than a curiosity: name the fields you want defaults for,
    // spell out the one you are overriding.
    const view: DetailViewSchema = {
      type: 'detail-view',
      related: [
        {
          title: 'Tasks',
          type: 'table',
          api: 'task',
          columns: ['status', { accessorKey: 'amount', header: 'Value (USD)' }],
        },
      ],
    };
    expect(view.related?.[0].columns).toHaveLength(2);
  });
});

/* ── (c) non-regression: the object arm is untouched ──────────────────────── */

describe('objectui#7997 — every shape that compiled before still compiles', () => {
  it("the README's own related block still type-checks", () => {
    // `packages/plugin-detail/README.md` teaches this exact shape. A widening
    // that broke it would be a breaking change wearing an additive label.
    const view: DetailViewSchema = {
      type: 'detail-view',
      related: [
        {
          title: 'Contacts',
          type: 'table',
          api: '/api/accounts/12345/contacts',
          columns: [
            { accessorKey: 'name', header: 'Name' },
            { accessorKey: 'email', header: 'Email' },
          ],
        },
      ],
    };
    expect(view.related?.[0].columns).toHaveLength(2);
  });

  it('a `TableColumn[]` built elsewhere still assigns in', () => {
    const built: TableColumn[] = [{ accessorKey: 'name', header: 'Name' }];
    const view: DetailViewSchema = {
      type: 'detail-view',
      related: [{ title: 'Contacts', type: 'table', api: 'contact', columns: built }],
    };
    expect(view.related?.[0].columns).toBe(built);
  });

  it('the optional `TableColumn` members still reach the entry', () => {
    // The object arm is the WHOLE `TableColumn`, not a narrowed stand-in.
    const view: DetailViewSchema = {
      type: 'detail-view',
      related: [
        {
          title: 'Contacts',
          type: 'table',
          api: 'contact',
          columns: [{ accessorKey: 'name', header: 'Name', width: 240, align: 'right' }],
        },
      ],
    };
    const col = view.related?.[0].columns?.[0] as TableColumn;
    expect(col.align).toBe('right');
  });
});

/* ── (d) the refusals — the `any[]` caricature guard ──────────────────────── */

describe('objectui#7997 — the widening is a union, not `any[]`', () => {
  it('a number entry is refused', () => {
    const view: DetailViewSchema = {
      type: 'detail-view',
      related: [
        {
          title: 'Tasks',
          type: 'table',
          api: 'task',
          // @ts-expect-error a column is a field NAME or a `TableColumn`, never a number (objectui#7997)
          columns: [42],
        },
      ],
    };
    expect(view).toBeDefined();
  });

  it('an object entry with no `accessorKey` is refused — `TableColumn` requires it', () => {
    const view: DetailViewSchema = {
      type: 'detail-view',
      related: [
        {
          title: 'Tasks',
          type: 'table',
          api: 'task',
          // @ts-expect-error `TableColumn.accessorKey` is required; a header alone addresses no field (objectui#7997)
          columns: [{ header: 'Status' }],
        },
      ],
    };
    expect(view).toBeDefined();
  });

  it('a bare string in place of the ARRAY is refused', () => {
    // The member widened by one element type, not into "anything at all".
    const view: DetailViewSchema = {
      type: 'detail-view',
      related: [
        {
          title: 'Tasks',
          type: 'table',
          api: 'task',
          // @ts-expect-error `columns` is a list of columns, not a single field name (objectui#7997)
          columns: 'status',
        },
      ],
    };
    expect(view).toBeDefined();
  });
});

/* ── (e) the two faces, measured against each other ───────────────────────── */

describe('objectui#7997 — the view schema and the `record:related_list` block agree', () => {
  it('one `string[]` assigns to BOTH faces — the protocol shape reaches each', () => {
    // The card is a DISAGREEMENT between two declarations of the same slot, so
    // fixing one and leaving the other out of line would not close it. This is
    // that check, made with a single value rather than two look-alike literals:
    // `specShaped` is what `@objectstack/spec`'s `z.array(z.string())` admits,
    // and both objectui faces now take it.
    const specShaped: string[] = ['name', 'email'];

    const viaViewSchema: RelatedEntry['columns'] = specShaped;
    const viaSpecBlock: RecordRelatedListComponentProps['columns'] = specShaped;

    expect(viaViewSchema).toBe(specShaped);
    expect(viaSpecBlock).toBe(specShaped);
  });

  it('the `record:related_list` face is STILL strings-only — it was already right', () => {
    // Held visible on purpose. That block mirrors a spec `strictObject`, and
    // spec says strings; it needed no change on this card, and a future widening
    // of it would be a protocol question, not a repo question. This assertion
    // is what turns such a change into a red test rather than a quiet drift.
    const _blockIsStringsOnly: Eq<
      RecordRelatedListComponentProps['columns'],
      string[] | undefined
    > = true;
    expect(_blockIsStringsOnly).toBe(true);
  });

  it('the object arm is objectui-only — the asymmetry this card did NOT resolve', () => {
    // `DetailViewSchema` admits `TableColumn`; the spec-mirroring block does
    // not. Pinned as PRESENT so that retiring the object arm (a separate,
    // non-additive decision) reddens here and gets taken deliberately.
    const objectArm: RelatedEntry['columns'] = [{ accessorKey: 'name', header: 'Name' }];
    expect(objectArm).toHaveLength(1);

    const _specBlockRefusesObjects: Eq<
      NonNullable<RecordRelatedListComponentProps['columns']>[number],
      string
    > = true;
    expect(_specBlockRefusesObjects).toBe(true);
  });
});

/* ── (f) the other authoring face — the JSON mirror, held visible ─────────── */

describe('objectui#7997 — the zod mirror already admitted the string form', () => {
  it('the JSON face accepts a bare-string column list', () => {
    // THE HANDOFF READING. `views.zod.ts` spells this member
    // `z.array(z.any())`, so the JSON authoring path never refused strings —
    // the TypeScript path was the only one that did, which is exactly why the
    // card reported the defect as reachable "only through the typed authoring
    // path". No mirror change was needed, and this block records the reading so
    // it cannot rot into an assumption that both faces moved together.
    const r = DetailViewZodMirror.safeParse({
      type: 'detail-view',
      related: [{ title: 'Tasks', type: 'table', api: 'task', columns: ['status'] }],
    });
    expect(r.success).toBe(true);
  });

  it('the JSON face still accepts the object form', () => {
    const r = DetailViewZodMirror.safeParse({
      type: 'detail-view',
      related: [
        {
          title: 'Contacts',
          type: 'table',
          api: 'contact',
          columns: [{ accessorKey: 'name', header: 'Name' }],
        },
      ],
    });
    expect(r.success).toBe(true);
  });

  it('CONTROL — the mirror is live: it refuses a non-array `columns`', () => {
    // Without this, both readings above would be equally green against a mirror
    // that validates nothing at all. `z.array(z.any())` still refuses a scalar,
    // so this is the assertion that says the member is being checked.
    const r = DetailViewZodMirror.safeParse({
      type: 'detail-view',
      related: [{ title: 'Tasks', type: 'table', api: 'task', columns: 'status' }],
    });
    expect(r.success).toBe(false);
  });

  it('CONTROL — and it refuses a related entry missing its required `title`', () => {
    // The second live control, one level up: it says the `related` entry shape
    // itself is parsed, not waved through as `z.any()`.
    const r = DetailViewZodMirror.safeParse({
      type: 'detail-view',
      related: [{ type: 'table', api: 'task', columns: ['status'] }],
    });
    expect(r.success).toBe(false);
  });

  it('the mirror is WIDER than the declaration — stated, not papered over', () => {
    // `z.array(z.any())` admits a number column, which the TypeScript face now
    // refuses (block (d)). Narrowing the mirror to match would be a change to
    // what already-shipped JSON is allowed to say — non-additive, and not what
    // this card was dispatched for. Reported rather than done; this row is the
    // record of the gap.
    const r = DetailViewZodMirror.safeParse({
      type: 'detail-view',
      related: [{ title: 'Tasks', type: 'table', api: 'task', columns: [42] }],
    });
    expect(r.success).toBe(true);
  });
});
