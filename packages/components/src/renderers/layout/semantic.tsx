import { ComponentRegistry } from '@object-ui/core';
import { renderChildren } from '../../lib/utils';
import { forwardRef } from 'react';

const tags = ['aside', 'main', 'header', 'nav', 'footer', 'section', 'article'] as const;

tags.forEach(tag => {
  const Component = forwardRef<HTMLElement, any>(({ schema, className, ...props }, ref) => {
      // Extract designer-related props
      const { 
          'data-obj-id': dataObjId, 
          'data-obj-type': dataObjType,
          style,
          ...restProps
      } = props;
      
      const Tag = tag;
      
      return (
      <Tag 
          ref={ref}
          className={className} 
          {...restProps}
          {...{ 'data-obj-id': dataObjId, 'data-obj-type': dataObjType, style }}
      >
        {renderChildren(schema.children || schema.body)}
      </Tag>
    );
  });
  Component.displayName = `Semantic${tag.charAt(0).toUpperCase() + tag.slice(1)}`;

  ComponentRegistry.register(tag, Component, {
      label: tag.charAt(0).toUpperCase() + tag.slice(1),
      category: 'layout',
      inputs: [
        { name: 'className', type: 'string', label: 'CSS Class' }
      ]
  });
});
