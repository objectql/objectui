/**
 * ObjectUI
 * Copyright (c) 2024-present ObjectStack Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { ComponentRegistry } from '@object-ui/core';
import type { EmptySchema } from '@object-ui/types';
import { InboxIcon } from 'lucide-react';
import { cn } from '../../lib/utils';

ComponentRegistry.register('empty', 
  ({ schema, ...props }: { schema: EmptySchema; [key: string]: any }) => {
    const { 
        'data-obj-id': dataObjId, 
        'data-obj-type': dataObjType,
        style,
        ...emptyProps
    } = props;
    
    return (
      <div 
        className={cn('flex flex-col items-center justify-center p-8 text-center', schema.className)} 
        {...emptyProps}
        {...{ 'data-obj-id': dataObjId, 'data-obj-type': dataObjType, style }}
      >
        <InboxIcon className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold">{schema.title || 'No data'}</h3>
        {schema.description && (
          <p className="text-sm text-muted-foreground mt-2">{schema.description}</p>
        )}
      </div>
    );
  },
  {
    label: 'Empty',
    inputs: [
      { name: 'title', type: 'string', label: 'Title', defaultValue: 'No data' },
      { name: 'description', type: 'string', label: 'Description' },
      { name: 'className', type: 'string', label: 'CSS Class' }
    ],
    defaultProps: {
      title: 'No data'
    }
  }
);
