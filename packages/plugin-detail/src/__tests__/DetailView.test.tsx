/**
 * ObjectUI
 * Copyright (c) 2024-present ObjectStack Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { DetailView } from '../DetailView';

describe('DetailView', () => {
  it('renders without crashing', () => {
    const schema = {
      type: 'detail-view' as const,
      title: 'Contact Details',
      data: {
        name: 'John Doe',
        email: 'john@example.com',
      },
      fields: [
        { name: 'name', label: 'Name' },
        { name: 'email', label: 'Email' },
      ],
    };

    const { container } = render(<DetailView schema={schema} />);
    expect(container).toBeTruthy();
  });

  it('displays title', () => {
    const schema = {
      type: 'detail-view' as const,
      title: 'Contact Details',
      fields: [],
    };

    const { getByText } = render(<DetailView schema={schema} />);
    expect(getByText('Contact Details')).toBeTruthy();
  });
});
