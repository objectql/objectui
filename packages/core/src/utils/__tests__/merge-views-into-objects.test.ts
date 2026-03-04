/**
 * ObjectUI
 * Copyright (c) 2024-present ObjectStack Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { describe, it, expect } from 'vitest';
import { mergeViewsIntoObjects } from '../merge-views-into-objects';

describe('mergeViewsIntoObjects', () => {
  it('should merge listViews from views into corresponding objects', () => {
    const objects = [{ name: 'account', label: 'Account', fields: {} }];
    const views = [
      {
        listViews: {
          all_accounts: {
            name: 'all_accounts',
            label: 'All Accounts',
            type: 'grid',
            data: { provider: 'object', object: 'account' },
          },
        },
      },
    ];

    const result = mergeViewsIntoObjects(objects, views);
    expect(result[0].listViews.all_accounts).toBeDefined();
    expect(result[0].listViews.all_accounts.label).toBe('All Accounts');
  });

  it('should preserve existing listViews on objects', () => {
    const objects = [
      {
        name: 'todo_task',
        label: 'Task',
        fields: {},
        listViews: {
          existing: { name: 'existing', label: 'Existing View', type: 'grid', data: { provider: 'object', object: 'todo_task' } },
        },
      },
    ];
    const views = [
      {
        listViews: {
          new_view: {
            name: 'new_view',
            label: 'New View',
            type: 'grid',
            data: { provider: 'object', object: 'todo_task' },
          },
        },
      },
    ];

    const result = mergeViewsIntoObjects(objects, views);
    const task = result[0];
    expect(task.listViews.existing).toBeDefined();
    expect(task.listViews.new_view).toBeDefined();
  });

  it('should ignore listViews without data.object', () => {
    const objects = [{ name: 'account', label: 'Account', fields: {} }];
    const views = [
      {
        listViews: {
          orphan: { name: 'orphan', label: 'Orphan View', type: 'grid' },
        },
      },
    ];

    const result = mergeViewsIntoObjects(objects, views);
    expect(result[0].listViews).toBeUndefined();
  });

  it('should return objects unchanged when views is empty', () => {
    const objects = [{ name: 'account', label: 'Account', fields: {} }];

    const result = mergeViewsIntoObjects(objects, []);
    expect(result).toEqual(objects);
  });

  it('should ignore views without listViews property', () => {
    const objects = [{ name: 'account', label: 'Account', fields: {} }];
    const views = [{ someOtherProp: true }];

    const result = mergeViewsIntoObjects(objects, views);
    expect(result).toEqual(objects);
  });

  it('should merge views from multiple view entries into different objects', () => {
    const objects = [
      { name: 'account', label: 'Account', fields: {} },
      { name: 'contact', label: 'Contact', fields: {} },
    ];
    const views = [
      {
        listViews: {
          all_accounts: { name: 'all_accounts', label: 'All Accounts', type: 'grid', data: { provider: 'object', object: 'account' } },
          all_contacts: { name: 'all_contacts', label: 'All Contacts', type: 'grid', data: { provider: 'object', object: 'contact' } },
        },
      },
    ];

    const result = mergeViewsIntoObjects(objects, views);
    expect(result[0].listViews.all_accounts).toBeDefined();
    expect(result[1].listViews.all_contacts).toBeDefined();
  });
});
