/**
 * Tests for useColumnSummary hook
 */
import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useColumnSummary } from '../useColumnSummary';

const sampleData = [
  { name: 'Alice', amount: 100, category: 'A' },
  { name: 'Bob', amount: 200, category: 'B' },
  { name: 'Charlie', amount: 300, category: 'A' },
  { name: 'Diana', amount: 400, category: 'C' },
];

describe('useColumnSummary', () => {
  it('computes sum correctly', () => {
    const { result } = renderHook(() =>
      useColumnSummary(sampleData, { field: 'amount', function: 'sum' })
    );
    expect(result.current.value).toBe(1000);
    expect(result.current.label).toBe('SUM');
  });

  it('computes avg correctly', () => {
    const { result } = renderHook(() =>
      useColumnSummary(sampleData, { field: 'amount', function: 'avg' })
    );
    expect(result.current.value).toBe(250);
  });

  it('computes count correctly', () => {
    const { result } = renderHook(() =>
      useColumnSummary(sampleData, { field: 'amount', function: 'count' })
    );
    expect(result.current.value).toBe(4);
  });

  it('computes min correctly', () => {
    const { result } = renderHook(() =>
      useColumnSummary(sampleData, { field: 'amount', function: 'min' })
    );
    expect(result.current.value).toBe(100);
  });

  it('computes max correctly', () => {
    const { result } = renderHook(() =>
      useColumnSummary(sampleData, { field: 'amount', function: 'max' })
    );
    expect(result.current.value).toBe(400);
  });

  it('computes distinct correctly', () => {
    const { result } = renderHook(() =>
      useColumnSummary(sampleData, { field: 'category', function: 'distinct' })
    );
    expect(result.current.value).toBe(3); // A, B, C
  });

  it('uses custom label', () => {
    const { result } = renderHook(() =>
      useColumnSummary(sampleData, { field: 'amount', function: 'sum', label: 'Total Revenue' })
    );
    expect(result.current.label).toBe('Total Revenue');
  });

  it('returns formatted string', () => {
    const { result } = renderHook(() =>
      useColumnSummary(sampleData, { field: 'amount', function: 'sum' }, 'en-US')
    );
    expect(result.current.formatted).toBe('1,000');
  });

  it('handles empty data for sum', () => {
    const { result } = renderHook(() =>
      useColumnSummary([], { field: 'amount', function: 'sum' })
    );
    expect(result.current.value).toBe(0);
  });

  it('handles empty data for avg', () => {
    const { result } = renderHook(() =>
      useColumnSummary([], { field: 'amount', function: 'avg' })
    );
    expect(result.current.value).toBe(0);
  });

  it('handles empty data for min', () => {
    const { result } = renderHook(() =>
      useColumnSummary([], { field: 'amount', function: 'min' })
    );
    expect(result.current.value).toBe(0);
  });
});
