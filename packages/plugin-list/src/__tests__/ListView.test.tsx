/**
 * ObjectUI
 * Copyright (c) 2024-present ObjectStack Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { describe, it, expect } from 'vitest';
import { ListView } from '../ListView';

describe('ListView', () => {
  it('should be exported', () => {
    expect(ListView).toBeDefined();
  });

  it('should be a function', () => {
    expect(typeof ListView).toBe('function');
  });
});
