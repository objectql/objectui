import { ComponentRegistry } from '@object-ui/core';
import type { DivSchema } from '@object-ui/types';
import { renderChildren } from '../../lib/utils';
import { forwardRef } from 'react';

const DivRenderer = forwardRef<HTMLDivElement, { schema: DivSchema; className?: string; [key: string]: any }>(
  ({ schema, className, ...props }, ref) => {
    // Extract designer-related props
    const { 
        'data-obj-id': dataObjId, 
        'data-obj-type': dataObjType,
        style,
        ...divProps
    } = props;
    
    return (
    <div 
        ref={ref}
        className={className} 
        {...divProps}
        // Apply designer props
        {...{ 'data-obj-id': dataObjId, 'data-obj-type': dataObjType, style }}
    >
      {renderChildren(schema.children || schema.body)}
    </div>
  );
  }
);

ComponentRegistry.register('div', 
  DivRenderer,
  {
    label: 'Container',
    inputs: [
      { name: 'className', type: 'string', label: 'CSS Class' }
    ],
    defaultProps: {
      className: 'p-4 border border-dashed border-gray-300 rounded min-h-[100px]'
    }
  }
);
