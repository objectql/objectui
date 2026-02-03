/**
 * ObjectUI
 * Copyright (c) 2024-present ObjectStack Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { ListView } from '../ListView';

describe('ListView', () => {
  it('renders without crashing', () => {
    const schema = {
      type: 'list-view' as const,
      objectName: 'contacts',
      viewType: 'grid' as const,
      fields: ['name', 'email'],
    };

    const { container } = render(<ListView schema={schema} />);
    expect(container).toBeTruthy();
  });

  it('displays search input', () => {
    const schema = {
      type: 'list-view' as const,
      objectName: 'contacts',
      fields: ['name'],
    };

    const { getByPlaceholderText } = render(<ListView schema={schema} />);
    expect(getByPlaceholderText(/search contacts/i)).toBeTruthy();
  });
});
