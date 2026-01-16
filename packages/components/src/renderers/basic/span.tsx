import { ComponentRegistry } from '@object-ui/core';
import type { SpanSchema } from '@object-ui/types';
import { renderChildren } from '../../lib/utils';
import { forwardRef } from 'react';

const SpanRenderer = forwardRef<HTMLSpanElement, { schema: SpanSchema; className?: string; [key: string]: any }>(
  ({ schema, className, ...props }, ref) => {
    // Extract designer-related props
    const { 
        'data-obj-id': dataObjId, 
        'data-obj-type': dataObjType,
        style,
        ...spanProps
    } = props;
    
    return (
    <span 
        ref={ref}
        className={className} 
        {...spanProps}
        // Apply designer props
        {...{ 'data-obj-id': dataObjId, 'data-obj-type': dataObjType, style }}
    >
      {renderChildren(schema.body)}
    </span>
  );
  }
);

ComponentRegistry.register('span', 
  SpanRenderer,
  {
    label: 'Inline Container',
    inputs: [
      { name: 'className', type: 'string', label: 'CSS Class' }
    ],
    defaultProps: {
      className: 'px-2 py-1'
    },
    defaultChildren: [
      { type: 'text', content: 'Inline text' }
    ]
  }
);
