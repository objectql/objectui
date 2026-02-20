/**
 * ObjectUI
 * Copyright (c) 2024-present ObjectStack Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { describe, it, expect } from 'vitest';
import { normalizeFilterCondition, normalizeFilters } from '../ListView';

describe('normalizeFilterCondition', () => {
  // =========================================================================
  // `in` operator normalization
  // =========================================================================
  describe('in operator', () => {
    it('converts single-value `in` to `=`', () => {
      expect(normalizeFilterCondition(['status', 'in', ['active']])).toEqual(
        ['status', '=', 'active'],
      );
    });

    it('converts multi-value `in` to `or` of `=`', () => {
      expect(normalizeFilterCondition(['status', 'in', ['active', 'pending']])).toEqual(
        ['or', ['status', '=', 'active'], ['status', '=', 'pending']],
      );
    });

    it('returns empty array for empty `in` values', () => {
      expect(normalizeFilterCondition(['status', 'in', []])).toEqual([]);
    });

    it('handles numeric values in `in`', () => {
      expect(normalizeFilterCondition(['priority', 'in', [1, 2, 3]])).toEqual(
        ['or', ['priority', '=', 1], ['priority', '=', 2], ['priority', '=', 3]],
      );
    });

    it('handles boolean values in `in`', () => {
      expect(normalizeFilterCondition(['is_active', 'in', [true]])).toEqual(
        ['is_active', '=', true],
      );
    });
  });

  // =========================================================================
  // `not in` operator normalization
  // =========================================================================
  describe('not in operator', () => {
    it('converts single-value `not in` to `!=`', () => {
      expect(normalizeFilterCondition(['status', 'not in', ['closed']])).toEqual(
        ['status', '!=', 'closed'],
      );
    });

    it('converts multi-value `not in` to `and` of `!=`', () => {
      expect(normalizeFilterCondition(['status', 'not in', ['closed', 'archived']])).toEqual(
        ['and', ['status', '!=', 'closed'], ['status', '!=', 'archived']],
      );
    });

    it('returns empty array for empty `not in` values', () => {
      expect(normalizeFilterCondition(['status', 'not in', []])).toEqual([]);
    });
  });

  // =========================================================================
  // Passthrough for non-in operators
  // =========================================================================
  describe('passthrough', () => {
    it('passes through `=` operator unchanged', () => {
      expect(normalizeFilterCondition(['name', '=', 'Alice'])).toEqual(
        ['name', '=', 'Alice'],
      );
    });

    it('passes through `!=` operator unchanged', () => {
      expect(normalizeFilterCondition(['status', '!=', null])).toEqual(
        ['status', '!=', null],
      );
    });

    it('passes through `>` operator unchanged', () => {
      expect(normalizeFilterCondition(['amount', '>', 100])).toEqual(
        ['amount', '>', 100],
      );
    });

    it('passes through `contains` operator unchanged', () => {
      expect(normalizeFilterCondition(['name', 'contains', 'test'])).toEqual(
        ['name', 'contains', 'test'],
      );
    });
  });

  // =========================================================================
  // Logical group recursion
  // =========================================================================
  describe('logical groups', () => {
    it('recursively normalizes `and` groups', () => {
      const input = ['and', ['status', 'in', ['a', 'b']], ['name', '=', 'Alice']];
      expect(normalizeFilterCondition(input)).toEqual(
        ['and', ['or', ['status', '=', 'a'], ['status', '=', 'b']], ['name', '=', 'Alice']],
      );
    });

    it('recursively normalizes `or` groups', () => {
      const input = ['or', ['priority', 'in', [1, 2]], ['status', '=', 'active']];
      expect(normalizeFilterCondition(input)).toEqual(
        ['or', ['or', ['priority', '=', 1], ['priority', '=', 2]], ['status', '=', 'active']],
      );
    });
  });

  // =========================================================================
  // Edge cases
  // =========================================================================
  describe('edge cases', () => {
    it('handles non-array input gracefully', () => {
      expect(normalizeFilterCondition([] as any)).toEqual([]);
    });

    it('handles short array input gracefully', () => {
      expect(normalizeFilterCondition(['field'] as any)).toEqual(['field']);
    });
  });
});

describe('normalizeFilters', () => {
  it('normalizes an array of conditions', () => {
    const input = [
      ['status', 'in', ['active', 'pending']],
      ['name', '=', 'Alice'],
    ];
    const result = normalizeFilters(input);
    expect(result).toEqual([
      ['or', ['status', '=', 'active'], ['status', '=', 'pending']],
      ['name', '=', 'Alice'],
    ]);
  });

  it('filters out empty arrays from normalization', () => {
    const input = [
      ['status', 'in', []],
      ['name', '=', 'Alice'],
    ];
    const result = normalizeFilters(input);
    expect(result).toEqual([
      ['name', '=', 'Alice'],
    ]);
  });

  it('returns empty array for empty input', () => {
    expect(normalizeFilters([])).toEqual([]);
  });

  it('handles non-array items gracefully', () => {
    const input = [null, undefined, 'invalid', ['name', '=', 'test']];
    const result = normalizeFilters(input as any);
    expect(result).toEqual([['name', '=', 'test']]);
  });
});
