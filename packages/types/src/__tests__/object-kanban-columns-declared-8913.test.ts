/**
 * ObjectUI
 * Copyright (c) 2024-present ObjectStack Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * objectui#8913 — `ObjectKanbanSchema.columns` is DECLARED on both faces, and
 * the element is the PROTOCOL's union rather than this repository's runtime
 * lane type.
 *
 * ## What was measurably wrong
 *
 * Retiring the bare `kanban` node type key (objectui#8802) removed the only
 * face that judged a lane. `object-kanban` never declared `columns`, so the key
 * rode `BaseSchema`'s `.passthrough()` on the surviving face: the renderer read
 * it at three sites while neither published face named it, and
 * `columns: "todo"`, `columns: [42]`, a lane with no `title` and — the one
 * objectui#6939 was filed for — a lane card with no `title` all parsed GREEN.
 *
 * Declaring on a face that already carries `[key: string]: any` /
 * `.passthrough()` can only NARROW. That direction check is the first `it`
 * below, and it is asserted rather than asserted-in-prose.
 *
 * ## ⛔ Why the element is NOT `KanbanColumn`
 *
 * The card that dispatched this work proposed `columns: KanbanColumn[]`. That
 * is a PROPOSAL, and it is falsified by measurement on three independent axes.
 * `KanbanColumn` requires `cards`; it is the RUNTIME lane —
 * `bucketCardsIntoColumns` fills `cards` before `KanbanImpl` / `KanbanEnhanced`
 * ever see a lane — and as the AUTHORING element it would refuse:
 *
 *   1. **the protocol's own gate-validated example.**
 *      `@objectstack/spec` declares this key as
 *      `columns: z.array(z.unknown()).optional()` with its element shape stated
 *      in `describe` prose — "Swimlane definitions ({ id, title } per `groupBy`
 *      value, or bare value strings) — NOT a field projection" — and the
 *      protocol's own docs author three lanes as `{ id, title }` with no
 *      `cards`, inside an `os:check-yaml PageComponentSchema` fence;
 *   2. **the renderer.** `bucketCardsIntoColumns` reads `col.cards || []` on
 *      both of its legs, and the lanes `ObjectKanban` materializes from a
 *      picklist or from the data carry no `cards` at all;
 *   3. **this repository's own typed corpus.** Several `plugin-kanban` board
 *      fixtures author `columns: [{ id, title }]` under
 *      `satisfies ObjectKanbanSchema`.
 *
 * Refusing the bare-string arm would fail the same way, one arm over. The
 * maintainer principle in force decides both (2026-09-09, recorded verbatim and
 * NOT translated):
 *
 *   > 我们的项目以 objectstack 协议为准，文档应该以实际实现为准。协议不正确的应该先修改协议。
 *
 * ⇒ `cards` is OPTIONAL and both arms are admitted. Narrowing further is an
 * `@objectstack/spec` card, not a local edit.
 *
 * ## The firing control, and why it is this one
 *
 * Every refusal below is paired with the SAME lane bag written under an
 * UNDECLARED key. That document is ACCEPTED, because `BaseSchema` is
 * `.passthrough()` — which is exactly the state `columns` was in before this
 * card. So the control is not a re-implementation of the old face; it IS the
 * old face's mechanism, reached through a key nothing declares. Delete the
 * `columns` declaration and every refusal here goes green while the control
 * stays green: the instrument reports its own removal.
 */

import { describe, it, expect } from 'vitest';

import { ObjectKanbanSchema } from '../zod/objectql.zod';
import type { ObjectKanbanSchema as TsObjectKanbanSchema } from '../objectql';
import type { KanbanColumn } from '../complex';

/** The board every document below is a variation of. `data: []` is the record source. */
const BOARD = { type: 'object-kanban', groupBy: 'status', data: [] } as const;

const board = (columns: unknown): Record<string, unknown> => ({ ...BOARD, columns });

/**
 * The control: the same value under a key NOTHING declares. It rides
 * `BaseSchema`'s `.passthrough()`, which is where `columns` itself sat before
 * this card.
 */
const control = (columns: unknown): Record<string, unknown> => ({ ...BOARD, columnsUndeclared: columns });

/** Report the issues rather than `false`, so a red run says what broke. */
const reasons = (doc: unknown): string[] => {
  const r = ObjectKanbanSchema.safeParse(doc);
  return r.success ? [] : r.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`);
};

/* ── The direction check the card owes: declaring here NARROWS, never widens ── */

describe('the declaration narrows and cannot widen (objectui#8913)', () => {
  it('the face it sits on is passthrough, so an undeclared key was already accepted', () => {
    // If this ever fails, `columns` was not riding an index signature before
    // this card and the whole "narrow only" reasoning has to be re-derived.
    const r = ObjectKanbanSchema.safeParse(control('anything at all'));
    expect(r.success).toBe(true);
    expect(r.success && (r.data as Record<string, unknown>).columnsUndeclared).toBe('anything at all');
  });

  it('a board that authored no `columns` is untouched', () => {
    expect(reasons({ ...BOARD })).toEqual([]);
  });
});

/* ── ACCEPTED: the protocol's union, both arms. ⛔ Narrowing any of these is a
      spec card, not a local edit. ────────────────────────────────────────── */

describe('the protocol union is admitted whole (objectui#8913)', () => {
  it('bare value strings — the arm the protocol names second', () => {
    expect(reasons(board(['todo', 'in_progress', 'done']))).toEqual([]);
  });

  it('`{ id, title }` lanes with NO cards — the protocol\'s own gate-validated example', () => {
    expect(
      reasons(
        board([
          { id: 'todo', title: 'To Do' },
          { id: 'in_progress', title: 'In Progress' },
          { id: 'done', title: 'Done' },
        ]),
      ),
    ).toEqual([]);
  });

  it('static lanes carrying their own cards — the schema-catalog fixture shape', () => {
    expect(
      reasons(
        board([
          {
            id: 'todo',
            title: 'To Do',
            cards: [{ id: '1', title: 'Design new feature', description: 'Create mockups' }],
          },
          { id: 'done', title: 'Done', limit: 3, className: 'w-72', collapsed: true, cards: [] },
        ]),
      ),
    ).toEqual([]);
  });

  it('a NUMERIC lane id — the renderer coerces with `String(col.id)`', () => {
    expect(reasons(board([{ id: 1, title: 'Stage one' }]))).toEqual([]);
  });

  it('the two arms mix in one array, as a partially-labelled board authors them', () => {
    expect(reasons(board(['todo', { id: 'done', title: 'Done' }]))).toEqual([]);
  });
});

/* ── REFUSED: the judging this card restores, each with its firing control ── */

/**
 * `[document, the reason it is refused]`. Every one of these parsed GREEN
 * before this card.
 */
const REFUSED: Array<readonly [string, unknown]> = [
  ['`columns` is not an array at all', 'todo'],
  ['an element that is neither a string nor a lane', [42]],
  ['a lane with no `id`', [{ title: 'To Do' }]],
  ['a lane with no `title`', [{ id: 'todo' }]],
  ['⭐ a lane CARD with no `title` — objectui#6939\'s defect', [{ id: 'todo', title: 'To Do', cards: [{ id: '1' }] }]],
  ['a lane CARD with no `id`', [{ id: 'todo', title: 'To Do', cards: [{ title: 'Design' }] }]],
  ['a lane CARD that is not an object', [{ id: 'todo', title: 'To Do', cards: ['Design'] }]],
  ['a WIP `limit` that is not a number', [{ id: 'todo', title: 'To Do', limit: 'three' }]],
  ['a `collapsed` that is not a boolean', [{ id: 'todo', title: 'To Do', collapsed: 'yes' }]],
  ['a `className` that is not a string', [{ id: 'todo', title: 'To Do', className: 42 }]],
];

describe('the restored refusals, each against a firing control (objectui#8913)', () => {
  it.each(REFUSED)('REFUSES %s', (_why, columns) => {
    expect(reasons(board(columns))).not.toEqual([]);
  });

  it.each(REFUSED)('CONTROL — the same value under an undeclared key is ACCEPTED (%s)', (_why, columns) => {
    // The control is what makes each row above an attribution rather than an
    // observation: the only difference between the two documents is the key
    // name, so the refusal comes from THIS declaration and from nothing else on
    // the face. Remove the declaration and the row above goes green while this
    // one stays green — a pin that cannot report its own removal is not a pin.
    expect(reasons(control(columns))).toEqual([]);
  });
});

/* ── The premise correction this card owes back to its own issue ──────────── */

describe('an undeclared LANE key is accepted and dropped, NOT refused (objectui#8913)', () => {
  it('`columns[].items` — the retired arm\'s spelling — parses green and is stripped', () => {
    // The dispatching card listed `columns[].items` among the refusals to
    // restore. It is not one, and the reason is the protocol: the retired arm
    // refused that document only because its `cards` was REQUIRED, so a lane
    // spelling `items` and no `cards` failed the required check. `cards` cannot
    // be required here (see this file's header), so the honest verdict for an
    // undeclared lane key is the STRIP posture — the same one `KanbanColumn`'s
    // own mirror carries.
    const r = ObjectKanbanSchema.safeParse(
      board([{ id: 'todo', title: 'To Do', items: [{ id: '1', title: 'Design' }] }]),
    );
    expect(r.success).toBe(true);
    const lane = r.success ? (r.data as { columns: Array<Record<string, unknown>> }).columns[0] : {};
    expect(lane).toEqual({ id: 'todo', title: 'To Do' });
    expect('items' in lane).toBe(false);
  });
});

/* ── Type-level: the TS face mirrors the zod face, arm for arm ────────────── */

/** Bare value strings annotate. */
export const STRING_LANES: TsObjectKanbanSchema = {
  type: 'object-kanban',
  groupBy: 'status',
  data: [],
  columns: ['todo', 'done'],
};

/**
 * `{ id, title }` lanes with no `cards` annotate. This is the shape several
 * `plugin-kanban` board fixtures already author under
 * `satisfies ObjectKanbanSchema`, and the shape the protocol's own docs teach —
 * `columns?: KanbanColumn[]` would have made both a compile error.
 */
export const SWIMLANES: TsObjectKanbanSchema = {
  type: 'object-kanban',
  groupBy: 'status',
  data: [],
  columns: [
    { id: 'todo', title: 'To Do' },
    { id: 2, title: 'In Progress' },
  ],
};

/** A static board's lanes, cards and all, annotate. */
export const STATIC_LANES: TsObjectKanbanSchema = {
  type: 'object-kanban',
  groupBy: 'status',
  data: [],
  columns: [
    { id: 'todo', title: 'To Do', cards: [{ id: '1', title: 'Design new feature' }], limit: 5 },
    { id: 'done', title: 'Done', cards: [], collapsed: true, className: 'w-72' },
  ],
};

/**
 * The RUNTIME lane type still annotates. The authoring arm is deliberately
 * WIDER than {@link KanbanColumn} — its `cards` is optional and it carries no
 * `color` tombstone — so a `KanbanColumn[]` remains assignable to `columns`.
 * That assignability is what the published doc snippets rest on: both
 * `packages/plugin-kanban/README.md` and `content/docs/plugins/plugin-kanban.mdx`
 * hand a `KanbanColumn[]` variable straight to a board, and this board is those
 * snippets in one line.
 */
const RUNTIME_LANES: KanbanColumn[] = [
  { id: 'todo', title: 'To Do', cards: [{ id: '1', title: 'Design new feature' }], limit: 5 },
  { id: 'done', title: 'Done', cards: [] },
];

export const RUNTIME_LANES_BOARD: TsObjectKanbanSchema = {
  type: 'object-kanban',
  groupBy: 'status',
  data: [],
  columns: RUNTIME_LANES,
};

describe('the TS face admits what the zod face admits (objectui#8913)', () => {
  it.each([
    ['bare strings', STRING_LANES],
    ['swimlanes without cards', SWIMLANES],
    ['static lanes with cards', STATIC_LANES],
    ['a runtime KanbanColumn[] handed straight to the board', RUNTIME_LANES_BOARD],
  ])('the annotated %s board also parses', (_name, doc) => {
    expect(reasons(doc)).toEqual([]);
  });
});
