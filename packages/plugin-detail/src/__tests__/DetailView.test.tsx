/**
 * ObjectUI
 * Copyright (c) 2024-present ObjectStack Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { describe, it, expect } from 'vitest';
import { DetailView } from '../DetailView';

describe('DetailView', () => {
  it('should be exported', () => {
    expect(DetailView).toBeDefined();
  });

  it('should be a function', () => {
    expect(typeof DetailView).toBe('function');
  });
});
