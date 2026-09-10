/**
 * ObjectUI
 * Copyright (c) 2024-present ObjectStack Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { describe, it, expect } from 'vitest';
import {
  parseUrlFilterTriples,
  serializeDrillFilterParams,
  deleteFieldFilterParams,
  groupFilterChips,
  type FilterTriple,
} from './drillUrlFilters';

const parse = (qs: string) => parseUrlFilterTriples(new URLSearchParams(qs));

describe('parseUrlFilterTriples', () => {
  it('parses the equality shorthand', () => {
    expect(parse('filter[status]=open')).toEqual([['status', '=', 'open']]);
  });

  it('parses range/comparison operators into ObjectQL ops', () => {
    expect(parse('filter[close_date][gte]=2026-04-01&filter[close_date][lt]=2026-07-01')).toEqual([
      ['close_date', '>=', '2026-04-01'],
      ['close_date', '<', '2026-07-01'],
    ]);
  });

  it('keeps relationship-path field names intact', () => {
    expect(parse('filter[account.region]=NA')).toEqual([['account.region', '=', 'NA']]);
  });

  it('ignores an unknown operator (never downgrades it to equality)', () => {
    expect(parse('filter[x][bogus]=1')).toEqual([]);
  });

  it('skips empty values', () => {
    expect(parse('filter[status]=')).toEqual([]);
  });
});

describe('serializeDrillFilterParams', () => {
  it('serializes an equality value', () => {
    expect(serializeDrillFilterParams({ status: 'open' }).toString()).toBe('filter%5Bstatus%5D=open');
  });

  it('serializes an ObjectQL range operator object to gte/lt params', () => {
    const qs = serializeDrillFilterParams({ close_date: { $gte: '2026-04-01', $lt: '2026-07-01' } });
    expect(qs.get('filter[close_date][gte]')).toBe('2026-04-01');
    expect(qs.get('filter[close_date][lt]')).toBe('2026-07-01');
  });

  it('skips null/undefined and never stringifies an unknown object to "[object Object]"', () => {
    const qs = serializeDrillFilterParams({ a: null, b: undefined, weird: { nope: 1 } });
    expect(qs.toString()).toBe('');
  });
});

describe('serializeDrillFilterParams — a COMPOSED drill filter (objectui#8944)', () => {
  /**
   * `composeDrillFilter` lowers `widget.filter ∧ click context` to
   * `{ $and: […] }` whenever both sources survive. Before this branch existed
   * that value fell to the `String(value)` path — `$and` holds an ARRAY, so it
   * was neither null nor a non-array object — and produced a bogus
   * `filter[$and]=[object Object],[object Object]` while BOTH real conditions
   * vanished, i.e. the list landed scoped by nothing the user clicked.
   */
  it('flattens a top-level $and into the params of each child', () => {
    const qs = serializeDrillFilterParams({ $and: [{ region: 'emea' }, { stage: 'won' }] });
    expect(qs.get('filter[region]')).toBe('emea');
    expect(qs.get('filter[stage]')).toBe('won');
    // The hazard, named: no key spells the combinator, and nothing stringified.
    expect(qs.get('filter[$and]')).toBeNull();
    expect(qs.toString()).not.toContain('object%20Object');
  });

  it('walks a NESTED $and, which is what composing an array arm produces', () => {
    // `[['stage','=','won'],['amount','>',100]]` conjoined with a click context
    // lowers to an $and whose first child is itself an $and.
    const qs = serializeDrillFilterParams({
      $and: [{ $and: [{ stage: 'won' }, { amount: { $gt: 100 } }] }, { region: 'emea' }],
    });
    expect(qs.get('filter[stage]')).toBe('won');
    expect(qs.get('filter[amount][gt]')).toBe('100');
    expect(qs.get('filter[region]')).toBe('emea');
  });

  it('a composed filter survives the URL round-trip as a conjunction of triples', () => {
    // The read side ANDs its triples, so the conjunction is preserved in
    // meaning, not just in bytes.
    const triples = parseUrlFilterTriples(
      serializeDrillFilterParams({
        $and: [{ region: 'emea' }, { close_date: { $gte: '2026-06-01', $lt: '2026-07-01' } }],
      }),
    );
    expect(triples).toEqual<FilterTriple[]>([
      ['region', '=', 'emea'],
      ['close_date', '>=', '2026-06-01'],
      ['close_date', '<', '2026-07-01'],
    ]);
  });

  it('skips a bare ARRAY comparand rather than stringifying it', () => {
    // The same promise the unknown-object case makes, for the shape that used
    // to escape it.
    expect(serializeDrillFilterParams({ tags: ['a', 'b'] }).toString()).toBe('');
  });
});

describe('round-trip: serialize → parse (write and read sides agree)', () => {
  it('a mixed equality + date-range drill filter survives the URL round-trip', () => {
    const filter = { stage: 'qualification', close_date: { $gte: '2026-06-01', $lt: '2026-07-01' } };
    const triples = parseUrlFilterTriples(serializeDrillFilterParams(filter));
    expect(triples).toEqual<FilterTriple[]>([
      ['stage', '=', 'qualification'],
      ['close_date', '>=', '2026-06-01'],
      ['close_date', '<', '2026-07-01'],
    ]);
  });
});

describe('deleteFieldFilterParams', () => {
  it('removes the equality AND both range-bound params for a field, leaving others', () => {
    const params = new URLSearchParams(
      'filter[close_date][gte]=2026-06-01&filter[close_date][lt]=2026-07-01&filter[stage]=qualification',
    );
    deleteFieldFilterParams(params, 'close_date');
    expect(params.toString()).toBe('filter%5Bstage%5D=qualification');
  });
});

describe('groupFilterChips', () => {
  it('collapses a date range into a single from → to chip', () => {
    expect(
      groupFilterChips([
        ['close_date', '>=', '2026-04-01'],
        ['close_date', '<', '2026-07-01'],
      ]),
    ).toEqual([{ field: 'close_date', text: '2026-04-01 → 2026-07-01' }]);
  });

  it('renders an equality chip and preserves field order', () => {
    expect(
      groupFilterChips([
        ['stage', '=', 'qualification'],
        ['close_date', '>=', '2026-04-01'],
        ['close_date', '<', '2026-07-01'],
      ]),
    ).toEqual([
      { field: 'stage', text: '= qualification' },
      { field: 'close_date', text: '2026-04-01 → 2026-07-01' },
    ]);
  });
});
