/**
 * ObjectUI
 * Copyright (c) 2024-present ObjectStack Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import { PageSchema } from '@object-ui/types';
import { SchemaRenderer } from '@object-ui/react';
import { ComponentRegistry } from '@object-ui/core';
import { cn } from '../../lib/utils'; // Keep internal import for utils

export const PageRenderer: React.FC<{ schema: PageSchema; className?: string; [key: string]: any }> = ({ 
  schema, 
  className,
  ...props 
}) => {
  // Support regions (spec compliant), body (legacy), and children
  let nodes: any[] = [];
  
  if (schema.regions && schema.regions.length > 0) {
    // If regions are present, flatten their components into the main flow
    // Ideally, we might want a grid layout here, but linear stacking works for simple single-region pages
    nodes = schema.regions.flatMap(r => r.components || []);
  } else {
    // Fallback to direct children/body
    const content = schema.body || schema.children;
    nodes = Array.isArray(content) ? content : (content ? [content] : []);
  }

  // Extract designer-related props
  const { 
      'data-obj-id': dataObjId, 
      'data-obj-type': dataObjType,
      style, 
      ...pageProps 
  } = props;

  return (
    <div 
      className={cn("min-h-full w-full bg-background p-4 md:p-6 lg:p-8", className)}
      {...pageProps}
      // Apply designer props
      data-obj-id={dataObjId}
      data-obj-type={dataObjType}
      style={style}
    >
      <div className="mx-auto max-w-7xl space-y-8">
        {(schema.title || schema.description) && (
          <div className="space-y-2">
            {schema.title && (
              <h1 className="text-3xl font-bold tracking-tight text-foreground">
                {schema.title}
              </h1>
            )}
            {schema.description && (
              <p className="text-muted-foreground">
                {schema.description}
              </p>
            )}
          </div>
        )}
        
        <div className="space-y-6">
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          {nodes.map((node: any, index: number) => (
            <SchemaRenderer 
              key={node?.id || index} 
              schema={node} 
            />
          ))}
        </div>
      </div>
    </div>
  );
};

const pageMeta: any = {
  namespace: 'ui',
  label: 'Page',
  icon: 'Layout',
  category: 'layout',
  inputs: [
    { name: 'title', type: 'string', label: 'Title' },
    { name: 'description', type: 'string', label: 'Description' },
    { 
      name: 'body', 
      type: 'array', 
      label: 'Content',
      itemType: 'component' 
    }
  ]
};

ComponentRegistry.register('page', PageRenderer, pageMeta);
ComponentRegistry.register('app', PageRenderer, { ...pageMeta, label: 'App Page' });
ComponentRegistry.register('utility', PageRenderer, { ...pageMeta, label: 'Utility Page' });
ComponentRegistry.register('home', PageRenderer, { ...pageMeta, label: 'Home Page' });
ComponentRegistry.register('record', PageRenderer, { ...pageMeta, label: 'Record Page' });

