import { ComponentRegistry } from '@object-ui/core';
import type { IconSchema } from '@object-ui/types';
import { icons } from 'lucide-react';

ComponentRegistry.register('icon',
  ({ schema, className, ...props }: { schema: IconSchema; className?: string; [key: string]: any }) => {
    const Icon = (icons as any)[schema.name || schema.icon];
    if (!Icon) return null;
    return <Icon className={className} {...props} />;
  },
  {
    label: 'Icon',
    icon: 'smile',
    category: 'basic',
    inputs: [
      { name: 'name', type: 'string', label: 'Icon Name', defaultValue: 'smile' },
      { name: 'className', type: 'string', label: 'CSS Class' }
    ]
  }
);
