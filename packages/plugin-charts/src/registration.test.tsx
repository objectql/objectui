import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeAll } from 'vitest';
import { ComponentRegistry } from '@object-ui/core';

describe('Plugin Charts Registration', () => {
  beforeAll(async () => {
    await import('./index');
  });

  it('registers bar-chart component', () => {
    const config = ComponentRegistry.get('bar-chart');
    expect(config).toBeDefined();
  });

   it('registers chart component types', () => {
    expect(ComponentRegistry.get('chart-renderer')).toBeDefined(); // Assuming base
    // Verify aliases if they exist
    expect(ComponentRegistry.get('pie-chart')).toBeDefined();
    expect(ComponentRegistry.get('donut-chart')).toBeDefined();
  });
});
