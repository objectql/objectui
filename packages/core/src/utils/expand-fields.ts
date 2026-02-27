/**
 * ObjectUI — expand-fields utility
 * Copyright (c) 2024-present ObjectStack Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Build an array of field names that should be included in `$expand`
 * when fetching data. This scans the given object schema fields
 * (and optional column configuration) for `lookup` and `master_detail`
 * field types, so the backend (e.g. objectql) returns expanded objects
 * instead of raw foreign-key IDs.
 *
 * @param schemaFields - Object map of field metadata from `getObjectSchema()`,
 *   e.g. `{ account: { type: 'lookup', reference_to: 'accounts' }, ... }`.
 * @param columns - Optional explicit column list. When provided, only
 *   lookup/master_detail fields that appear in `columns` are expanded.
 *   Accepts `string[]` or `ListColumn[]` (objects with a `field` property).
 * @returns Array of field names to pass as `$expand`.
 *
 * @example
 * ```ts
 * const fields = {
 *   name: { type: 'text' },
 *   account: { type: 'lookup', reference_to: 'accounts' },
 *   parent: { type: 'master_detail', reference_to: 'contacts' },
 * };
 * buildExpandFields(fields);
 * // → ['account', 'parent']
 *
 * buildExpandFields(fields, ['name', 'account']);
 * // → ['account']
 * ```
 */
export function buildExpandFields(
  schemaFields?: Record<string, any> | null,
  columns?: (string | { field?: string; name?: string; fieldName?: string })[],
): string[] {
  if (!schemaFields || typeof schemaFields !== 'object') {
    return [];
  }

  // Collect all lookup / master_detail field names from the schema
  const lookupFieldNames: string[] = [];
  for (const [fieldName, fieldDef] of Object.entries(schemaFields)) {
    if (
      fieldDef &&
      typeof fieldDef === 'object' &&
      (fieldDef.type === 'lookup' || fieldDef.type === 'master_detail')
    ) {
      lookupFieldNames.push(fieldName);
    }
  }

  if (lookupFieldNames.length === 0) {
    return [];
  }

  // When columns are provided, restrict expansion to visible columns only
  if (columns && Array.isArray(columns) && columns.length > 0) {
    const columnFieldNames = new Set<string>();
    for (const col of columns) {
      if (typeof col === 'string') {
        columnFieldNames.add(col);
      } else if (col && typeof col === 'object') {
        const name = col.field ?? col.name ?? col.fieldName;
        if (name) columnFieldNames.add(name);
      }
    }
    return lookupFieldNames.filter((f) => columnFieldNames.has(f));
  }

  return lookupFieldNames;
}
