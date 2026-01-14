import { ComponentRegistry } from '@object-ui/core';
import type { TextSchema } from '@object-ui/types';

ComponentRegistry.register('text', 
  ({ schema }: { schema: TextSchema }) => (
    <>{schema.content}</>
  ),
  {
    label: 'Text',
    inputs: [
      { name: 'content', type: 'string', label: 'Content', required: true }
    ],
    defaultProps: {
      content: 'Text content'
    }
  }
);
