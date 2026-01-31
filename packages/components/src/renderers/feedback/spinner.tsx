/**
 * ObjectUI
 * Copyright (c) 2024-present ObjectStack Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { ComponentRegistry } from '@object-ui/core';
import type { SpinnerSchema } from '@object-ui/types';
import { Loader2 } from 'lucide-react';
import { cn } from '../../lib/utils';

ComponentRegistry.register('spinner', 
  ({ schema, ...props }: { schema: SpinnerSchema; [key: string]: any }) => {
    const { 
        'data-obj-id': dataObjId, 
        'data-obj-type': dataObjType,
        style,
        ...spinnerProps
    } = props;
    
    const sizeClasses = {
      sm: 'h-4 w-4',
      md: 'h-6 w-6',
      lg: 'h-8 w-8',
      xl: 'h-12 w-12'
    };
    
    return (
      <Loader2 
        className={cn('animate-spin', sizeClasses[schema.size || 'md'], schema.className)} 
        {...spinnerProps}
        {...{ 'data-obj-id': dataObjId, 'data-obj-type': dataObjType, style }}
      />
    );
  },
  {
    namespace: 'ui',
    label: 'Spinner',
    inputs: [
      { 
        name: 'size', 
        type: 'enum', 
        enum: ['sm', 'md', 'lg', 'xl'], 
        defaultValue: 'md',
        label: 'Size'
      },
      { name: 'className', type: 'string', label: 'CSS Class' }
    ],
    defaultProps: {
      size: 'md'
    }
  }
);
