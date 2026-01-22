/**
 * ObjectUI
 * Copyright (c) 2024-present ObjectStack Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { ComponentRegistry } from '@object-ui/core';
import type { ToastSchema } from '@object-ui/types';
import { useToast } from '../../hooks/use-toast';
import { Button } from '../../ui';

ComponentRegistry.register('toast', 
  ({ schema, ...props }: { schema: ToastSchema; [key: string]: any }) => {
    const { toast } = useToast();
    
    const showToast = () => {
      toast({
        title: schema.title,
        description: schema.description,
        variant: schema.variant as any,
      });
    };
    
    return (
      <Button onClick={showToast} variant={schema.buttonVariant} className={schema.className}>
        {schema.buttonLabel || 'Show Toast'}
      </Button>
    );
  },
  {
    label: 'Toast',
    inputs: [
      { name: 'title', type: 'string', label: 'Title' },
      { name: 'description', type: 'string', label: 'Description' },
      { 
        name: 'variant', 
        type: 'enum', 
        enum: ['default', 'destructive'], 
        defaultValue: 'default',
        label: 'Variant'
      },
      { name: 'buttonLabel', type: 'string', label: 'Button Label' },
      { name: 'className', type: 'string', label: 'CSS Class' }
    ],
    defaultProps: {
      title: 'Notification',
      buttonLabel: 'Show Toast',
      variant: 'default'
    }
  }
);
