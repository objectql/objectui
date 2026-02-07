/**
 * ListColumn Zod Schema Tests
 *
 * Verifies that the ListColumnSchema Zod definition includes link and action properties.
 */
import { describe, it, expect } from 'vitest';
import { ListColumnSchema } from '@object-ui/types/zod';

describe('ListColumnSchema (Zod)', () => {
  it('should accept link property', () => {
    const result = ListColumnSchema.safeParse({
      field: 'name',
      link: true,
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.link).toBe(true);
    }
  });

  it('should accept action property', () => {
    const result = ListColumnSchema.safeParse({
      field: 'status',
      action: 'toggleStatus',
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.action).toBe('toggleStatus');
    }
  });

  it('should accept all properties together', () => {
    const result = ListColumnSchema.safeParse({
      field: 'name',
      label: 'Full Name',
      width: 200,
      align: 'left',
      hidden: false,
      sortable: true,
      resizable: true,
      wrap: false,
      type: 'text',
      link: true,
      action: 'viewDetail',
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.link).toBe(true);
      expect(result.data.action).toBe('viewDetail');
    }
  });

  it('should make link optional', () => {
    const result = ListColumnSchema.safeParse({
      field: 'name',
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.link).toBeUndefined();
    }
  });

  it('should make action optional', () => {
    const result = ListColumnSchema.safeParse({
      field: 'name',
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.action).toBeUndefined();
    }
  });

  it('should reject non-boolean link', () => {
    const result = ListColumnSchema.safeParse({
      field: 'name',
      link: 'yes',
    });
    expect(result.success).toBe(false);
  });

  it('should reject non-string action', () => {
    const result = ListColumnSchema.safeParse({
      field: 'name',
      action: 42,
    });
    expect(result.success).toBe(false);
  });
});
