import { ComponentRegistry } from '@object-ui/core';
import type { SeparatorSchema } from '@object-ui/types';
import { Separator } from '@/ui';

ComponentRegistry.register('separator', 
  ({ schema, className, ...props }: { schema: SeparatorSchema; className?: string; [key: string]: any }) => (
    <Separator orientation={schema.orientation} className={className} {...props} />
  ),
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
