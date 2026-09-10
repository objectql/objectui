/**
 * ObjectUI
 * Copyright (c) 2024-present ObjectStack Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * The TRUE-identity combinators reach the wire as "no constraint" —
 * objectui#8770.
 *
 * ## What was wrong
 *
 * `lowerLogicalGroup` answers `undefined` for a group that reduces to the TRUE
 * identity, and that is correct and deliberate (see its docblock: a childless
 * `['and']` is `isFilterAST` FALSE, which reads as no filter at all). But when
 * such a group was the ONLY thing in the filter, that `undefined` fell through
 * to `convertFiltersToAST`'s general tail — `if (conditions.length === 0)
 * return filter` — and the CALLER'S ORIGINAL OBJECT came back. So the group did
 * not disappear at that level after all; it reappeared one level up, in the `$`
 * dialect, in a slot the AST is expected to occupy.
 *
 * Three of the four identities went out that way and one did not, which is what
 * made this an internal inconsistency rather than an open question: the same
 * function already lowered `{ $or: [] }` correctly.
 *
 * ## Why the assertions are shaped the way they are
 *
 * Two halves, because either alone passes on something worse than the bug:
 *
 *   - a SHAPE assertion (`toBeUndefined`) alone passes on a converter that has
 *     stopped emitting anything at all;
 *   - a ROW-SET assertion alone passes on a filter that never ran — `$filter:
 *     undefined` returns EVERY row, and so does a correct TRUE identity, so the
 *     row set cannot tell "honoured" from "dropped".
 *
 * So the shape half is asserted against the spec's own door (`isFilterAST`)
 * rather than against a literal, the row-set half names exact ids, and the
 * FALSE identity `{ $or: [] }` is carried through every section as a control:
 * it must keep answering NO rows. A change that flattened the identities into
 * one arm would take the control with it.
 *
 * `FILTER_LOGIC_ROWS` (`@objectstack/spec/data`) is the published cross-backend
 * fixture the identity ruling (objectstack#5322, merged objectstack#5365) is
 * held to, so the row sets here are the platform's own and not a local
 * restatement of them.
 */

import { describe, it, expect } from 'vitest';
import { FILTER_LOGIC_ROWS, isFilterAST, parseFilterAST } from '@objectstack/spec/data';
import { convertFiltersToAST, toFilterNode, mergeFilterNodes } from '../filter-converter';
import { ValueDataSource } from '../../adapters/ValueDataSource';

const ALL_IDS = FILTER_LOGIC_ROWS.map((r) => String(r.id));

async function selectedIds(filter: unknown): Promise<string[]> {
  const ds = new ValueDataSource({ items: FILTER_LOGIC_ROWS as any[] });
  const result = await ds.find('rows', { $filter: filter as any });
  return result.data.map((r) => String(r.id));
}

/** The three groups objectstack#5322 rules TRUE — "every row". */
const TRUE_IDENTITIES: ReadonlyArray<[string, Record<string, any>]> = [
  ['{ $and: [] }', { $and: [] }],
  ['{ $or: [{}] }', { $or: [{}] }],
  ['{ $and: [{}] }', { $and: [{}] }],
];

// ---------------------------------------------------------------------------
// 0. The harness has to be able to fail
// ---------------------------------------------------------------------------

describe('objectui#8770 — harness', () => {
  it('every row and no rows are distinguishable answers here', async () => {
    expect(ALL_IDS).toEqual(['1', '2', '3', '4']);
    // A filter that really constrains lands strictly between the two, so
    // "every row" below is a measurement and not the fixture's only answer.
    expect(await selectedIds(['a', '=', 'x'])).toEqual(['1', '2']);
    expect(await selectedIds(undefined)).toEqual(ALL_IDS);
  });
});

// ---------------------------------------------------------------------------
// 1. The card's own table, re-measured
// ---------------------------------------------------------------------------

describe('objectui#8770 — the four identity groups', () => {
  it.each(TRUE_IDENTITIES)('%s lowers to "no constraint"', (_label, filter) => {
    // Not `['and']` and not the caller's object: the absence of the slot is how
    // this dialect says TRUE, which is exactly what `lowerLogicalGroup` decided
    // one level down and what the tail used to throw away.
    expect(convertFiltersToAST(filter)).toBeUndefined();
  });

  it('CONTROL — `{ $or: [] }` is FALSE and keeps the leaf it always had', () => {
    // The one identity that was already right. It must not be swept into the
    // fold above: FALSE is not "no constraint", and the AST has no
    // contradiction literal, so the pre-existing leaf is still the emission.
    const node = convertFiltersToAST({ $or: [] });
    expect(node).toEqual(['$or', '=', []]);
    expect(parseFilterAST(node)).toEqual({ $or: [] });
  });
});

// ---------------------------------------------------------------------------
// 2. The invariant that actually broke — what reaches the wire
// ---------------------------------------------------------------------------

describe('objectui#8770 — nothing unreadable is handed back', () => {
  it.each([...TRUE_IDENTITIES, ['{ $or: [] }', { $or: [] }] as const])(
    '%s is either absent or a node the spec can read',
    (_label, filter) => {
      // The property, stated once for all four: a value this function returns
      // is either `undefined` — no filter — or something `isFilterAST`
      // accepts. Before the fix three of the four returned a plain OBJECT
      // instead, which is neither: `client.data.find()` spreads such an object's
      // entries as query parameters (`?$and=`), so no `filter` parameter was
      // sent and the server refused the unknown `$`-prefixed one with `400
      // UNSUPPORTED_QUERY_PARAM`.
      const out = convertFiltersToAST(filter as Record<string, any>);
      expect(out === undefined || isFilterAST(out)).toBe(true);
    },
  );
});

// ---------------------------------------------------------------------------
// 3. The ruled row sets, through a real matcher
// ---------------------------------------------------------------------------

describe('objectui#8770 — the ruling reaches the consumer', () => {
  it.each(TRUE_IDENTITIES)('%s selects EVERY row after lowering', async (_label, filter) => {
    expect(await selectedIds(toFilterNode(filter))).toEqual(ALL_IDS);
  });

  it('CONTROL — `{ $or: [] }` still selects NO row after lowering', async () => {
    expect(await selectedIds(toFilterNode({ $or: [] }))).toEqual([]);
  });
});

// ---------------------------------------------------------------------------
// 4. Composition — the shape the two real sinks build
// ---------------------------------------------------------------------------

describe('objectui#8770 — composing with a filter that does constrain', () => {
  it.each(TRUE_IDENTITIES)('%s contributes nothing to the merged `and`', async (_label, filter) => {
    // `plugin-list`'s `buildEffectiveFilter` and `plugin-view`'s `ObjectView`
    // both merge several sources here. Before the fix the object landed in AST
    // CHILD position — `['and', { $and: [] }, ['a','=','x']]` — which
    // `isFilterAST` refuses, so the whole list 400'd on a filter that was
    // supposed to narrow nothing.
    const merged = mergeFilterNodes(filter, ['a', '=', 'x']);
    expect(merged).toEqual(['a', '=', 'x']);
    expect(isFilterAST(merged)).toBe(true);
    expect(await selectedIds(merged)).toEqual(['1', '2']);
  });

  it('a TRUE identity merged with a FALSE one is still FALSE', async () => {
    const merged = mergeFilterNodes({ $and: [] }, { $or: [] });
    expect(merged).toEqual(['$or', '=', []]);
    expect(await selectedIds(merged)).toEqual([]);
  });

  it('and the two identities inside ONE filter reduce the same way', async () => {
    // TRUE ∧ FALSE = FALSE, and the `$and` key must not drag the `$or` leaf out
    // of the result on its way to being dropped.
    const node = convertFiltersToAST({ $and: [], $or: [] });
    expect(node).toEqual(['$or', '=', []]);
    expect(await selectedIds(node)).toEqual([]);
  });
});

// ---------------------------------------------------------------------------
// 5. Nesting — an identity group inside an identity group
// ---------------------------------------------------------------------------

describe('objectui#8770 — nested identities fold all the way up', () => {
  it('a TRUE-identity child drops out of an `$and` and absorbs an `$or`', () => {
    expect(convertFiltersToAST({ $and: [{ $and: [] }] })).toBeUndefined();
    expect(convertFiltersToAST({ $or: [{ $and: [] }] })).toBeUndefined();
  });

  it('a nested identity beside a real conjunct leaves the conjunct alone', () => {
    expect(convertFiltersToAST({ $and: [{ $and: [] }, { a: 'x' }] })).toEqual([
      'and',
      ['a', '=', 'x'],
    ]);
  });
});

// ---------------------------------------------------------------------------
// 6. The boundary this fix deliberately did NOT move
// ---------------------------------------------------------------------------

describe('objectui#8770 — the non-combinator tail is untouched', () => {
  // The same tail serves inputs that are not combinators at all. Those are a
  // different question and were left exactly as they were: a null-valued key is
  // this converter's own tolerance rather than a ruled identity, and the object
  // handed back travels the `$expand` / `$search` route as `filter={"a":null}`,
  // which the server reads as a REAL `a IS NULL` predicate. Folding them into
  // "no constraint" would return MORE rows on a path objectstack#5322 said
  // nothing about — the one direction this file exists to avoid.

  it('an all-null filter still returns the original object', () => {
    expect(convertFiltersToAST({ a: null, b: undefined })).toEqual({ a: null, b: undefined });
  });

  it('an empty operator map still returns the original object', () => {
    expect(convertFiltersToAST({ a: {} })).toEqual({ a: {} });
  });

  it('an identity group beside a NON-combinator key returns the original object', () => {
    // The fold is keyed on "every key was such a group", not on "any key was".
    // `a: null` is not one, so this filter is not the ruled family and keeps the
    // answer it has always had.
    expect(convertFiltersToAST({ $and: [], a: null })).toEqual({ $and: [], a: null });
  });

  it('an identity group beside a key that DOES lower is unchanged', async () => {
    // Already correct before this card — the group was dropped and the sibling
    // carried the filter. Pinned because the fold must not start swallowing the
    // sibling.
    const node = convertFiltersToAST({ $and: [], a: 'x' });
    expect(node).toEqual(['a', '=', 'x']);
    expect(await selectedIds(node)).toEqual(['1', '2']);
  });
});
