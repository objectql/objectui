import { vi, describe, it, expect } from 'vitest';

vi.mock('@object-ui/plugin-designer', () => {
  const React = require('react');
  return {
    CreateAppPage: () => React.createElement('div', { 'data-testid': 'mock-create-page' }, 'MOCK'),
  };
});

import * as pd from '@object-ui/plugin-designer';

describe('debug', () => {
  it('mock exports', () => {
    console.log('plugin-designer exports:', Object.keys(pd));
    expect(Object.keys(pd)).toContain('CreateAppPage');
  });
});
