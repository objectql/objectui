/**
 * ObjectUI
 * Copyright (c) 2024-present ObjectStack Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { describe, it, expect } from 'vitest';
import { name } from '../index';

describe('@object-ui/designer', () => {
  describe('name', () => {
    it('should export package name', () => {
      expect(name).toBeDefined();
      expect(typeof name).toBe('string');
    });

    it('should be @object-ui/designer', () => {
      expect(name).toBe('@object-ui/designer');
    });
  });
});
