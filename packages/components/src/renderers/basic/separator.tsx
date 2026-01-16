import { ComponentRegistry } from '@object-ui/core';
import type { SeparatorSchema } from '@object-ui/types';
import { Separator } from '../../ui';
import { forwardRef } from 'react';

const SeparatorRenderer = forwardRef<HTMLDivElement, { schema: SeparatorSchema; className?: string; [key: string]: any }>(
  ({ schema, className, ...props }, ref) => {
    // Extract designer-related props
    const { 
        'data-obj-id': dataObjId, 
        'data-obj-type': dataObjType,
        style, 
        ...separatorProps 
    } = props;
    
    return (
    <Separator 
        ref={ref}
        orientation={schema.orientation} 
        className={className} 
        {...separatorProps}
        // Apply designer props
        {...{ 'data-obj-id': dataObjId, 'data-obj-type': dataObjType, style }}
    />
  );
  }
);

ComponentRegistry.register('separator', 
  SeparatorRenderer,
  {
    label: 'Separator',
    inputs: [
      { 
        name: 'orientation', 
        type: 'enum', 
        enum: ['horizontal', 'vertical'], 
        defaultValue: 'horizontal',
        label: 'Orientation'
      },
      { name: 'className', type: 'string', label: 'CSS Class' }
    ],
    defaultProps: {
      orientation: 'horizontal',
      className: 'my-4'
    }
  }
);
