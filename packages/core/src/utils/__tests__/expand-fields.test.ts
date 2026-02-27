/**
 * ObjectUI
 * Copyright (c) 2024-present ObjectStack Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { describe, it, expect } from 'vitest';
import { buildExpandFields } from '../expand-fields';

describe('buildExpandFields', () => {
  const sampleFields = {
    name: { type: 'text', label: 'Name' },
    email: { type: 'email', label: 'Email' },
    account: { type: 'lookup', label: 'Account', reference_to: 'accounts' },
    parent: { type: 'master_detail', label: 'Parent', reference_to: 'contacts' },
    status: { type: 'select', label: 'Status' },
  };

  it('should return lookup and master_detail field names', () => {
    const result = buildExpandFields(sampleFields);
    expect(result).toEqual(['account', 'parent']);
  });

  it('should return empty array when no lookup/master_detail fields exist', () => {
    const fields = {
      name: { type: 'text' },
      age: { type: 'number' },
    };
    expect(buildExpandFields(fields)).toEqual([]);
  });

  it('should return empty array for null/undefined schema', () => {
    expect(buildExpandFields(null)).toEqual([]);
    expect(buildExpandFields(undefined)).toEqual([]);
  });

  it('should return empty array for empty fields object', () => {
    expect(buildExpandFields({})).toEqual([]);
  });

  it('should filter by string columns when provided', () => {
    const result = buildExpandFields(sampleFields, ['name', 'account']);
    expect(result).toEqual(['account']);
  });

  it('should filter by ListColumn objects with field property', () => {
    const columns = [
      { field: 'name', label: 'Name' },
      { field: 'parent', label: 'Parent Contact' },
    ];
    const result = buildExpandFields(sampleFields, columns);
    expect(result).toEqual(['parent']);
  });

  it('should support columns with name property', () => {
    const columns = [
      { name: 'account', label: 'Account' },
    ];
    const result = buildExpandFields(sampleFields, columns);
    expect(result).toEqual(['account']);
  });

  it('should support columns with fieldName property', () => {
    const columns = [
      { fieldName: 'parent', label: 'Parent' },
    ];
    const result = buildExpandFields(sampleFields, columns);
    expect(result).toEqual(['parent']);
  });

  it('should return empty array when columns have no lookup fields', () => {
    const result = buildExpandFields(sampleFields, ['name', 'email']);
    expect(result).toEqual([]);
  });

  it('should handle mixed string and object columns', () => {
    const columns = [
      'name',
      { field: 'account' },
      'parent',
    ];
    const result = buildExpandFields(sampleFields, columns);
    expect(result).toEqual(['account', 'parent']);
  });

  it('should return all lookup fields when columns is empty array', () => {
    // Empty columns array does not satisfy the length > 0 check,
    // so no column restriction is applied → all lookup fields returned
    const result = buildExpandFields(sampleFields, []);
    expect(result).toEqual(['account', 'parent']);
  });

  it('should handle malformed field definitions gracefully', () => {
    const fields = {
      name: null,
      account: { type: 'lookup' },
      broken: 'not-an-object',
      empty: {},
    };
    const result = buildExpandFields(fields as any);
    expect(result).toEqual(['account']);
  });

  it('should handle only lookup fields', () => {
    const fields = {
      ref1: { type: 'lookup', reference_to: 'obj1' },
      ref2: { type: 'lookup', reference_to: 'obj2' },
    };
    expect(buildExpandFields(fields)).toEqual(['ref1', 'ref2']);
  });

  it('should handle only master_detail fields', () => {
    const fields = {
      detail1: { type: 'master_detail', reference_to: 'obj1' },
    };
    expect(buildExpandFields(fields)).toEqual(['detail1']);
  });
});
