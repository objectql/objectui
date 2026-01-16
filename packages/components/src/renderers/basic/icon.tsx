import { ComponentRegistry } from '@object-ui/core';
import type { IconSchema } from '@object-ui/types';
import { icons } from 'lucide-react';
import React, { forwardRef } from 'react';

const IconRenderer = forwardRef<SVGSVGElement, { schema: IconSchema; className?: string; [key: string]: any }>(
  ({ schema, className, ...props }, ref) => {
    const Icon = (icons as any)[schema.name || schema.icon];
    if (!Icon) return null;
    return <Icon ref={ref} className={className} {...props} />;
  }
);

ComponentRegistry.register('icon',
  IconRenderer,
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
