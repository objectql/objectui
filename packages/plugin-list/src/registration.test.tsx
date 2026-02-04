import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeAll } from 'vitest';
import { ComponentRegistry } from '@object-ui/core';

describe('Plugin List Registration', () => {
  beforeAll(async () => {
    await import('./index');
  });

  it('registers list-view component', () => {
    const config = ComponentRegistry.get('list-view');
    expect(config).toBeDefined();
    expect(config?.label).toBe('List View');
  });
});
