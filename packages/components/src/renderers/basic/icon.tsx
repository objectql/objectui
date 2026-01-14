import { ComponentRegistry } from '@object-ui/core';
import { icons } from 'lucide-react';

ComponentRegistry.register('icon',
  ({ schema, className, ...props }) => {
    const Icon = (icons as any)[schema.name || schema.icon];
    if (!Icon) return null;
    return <Icon className={className} {...props} />;
  },
  {
    label: 'Icon',
    inputs: [
      { name: 'name', type: 'string', label: 'Icon Name' },
      { name: 'className', type: 'string', label: 'CSS Class' }
    ]
  }
);
