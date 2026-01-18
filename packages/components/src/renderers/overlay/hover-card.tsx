/**
 * ObjectUI
 * Copyright (c) 2024-present ObjectStack Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { ComponentRegistry } from '@object-ui/core';
import type { HoverCardSchema } from '@object-ui/types';
import { 
  HoverCard, 
  HoverCardTrigger, 
  HoverCardContent 
} from '../../ui';
import { renderChildren } from '../../lib/utils';

ComponentRegistry.register('hover-card', 
  ({ schema, className, ...props }: { schema: HoverCardSchema; className?: string; [key: string]: any }) => (
    <HoverCard openDelay={schema.openDelay} closeDelay={schema.closeDelay} {...props}>
      <HoverCardTrigger asChild>
        {renderChildren(schema.trigger)}
      </HoverCardTrigger>
      <HoverCardContent align={schema.align} side={schema.side} className={className}>
         {renderChildren(schema.content)}
      </HoverCardContent>
    </HoverCard>
  ),
  {
    label: 'Hover Card',
    inputs: [
       { name: 'openDelay', type: 'number', label: 'Open Delay' },
        { name: 'closeDelay', type: 'number', label: 'Close Delay' },
         { name: 'side', type: 'enum', enum: ['top', 'right', 'bottom', 'left'], label: 'Side' },
      { name: 'align', type: 'enum', enum: ['start', 'center', 'end'], label: 'Align' },
       { 
        name: 'trigger', 
        type: 'slot', 
        label: 'Trigger' 
      },
      { 
        name: 'content', 
        type: 'slot', 
        label: 'Content' 
      },
      { name: 'className', type: 'string', label: 'Content CSS Class' }
    ],
    defaultProps: {
      trigger: [{ type: 'button', label: 'Hover me', variant: 'link' }],
      content: [{ type: 'text', content: 'Hover card content appears on hover' }],
      side: 'top'
    }
  }
);
