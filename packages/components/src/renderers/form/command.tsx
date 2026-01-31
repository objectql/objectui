/**
 * ObjectUI
 * Copyright (c) 2024-present ObjectStack Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { ComponentRegistry } from '@object-ui/core';
import type { CommandSchema } from '@object-ui/types';
import { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from '../../ui/command';

ComponentRegistry.register('command', 
  ({ schema, ...props }: { schema: CommandSchema; [key: string]: any }) => {
    const { 
        'data-obj-id': dataObjId, 
        'data-obj-type': dataObjType,
        style,
        ...commandProps
    } = props;
    
    return (
    <Command 
        className={schema.className} 
        {...commandProps}
        {...{ 'data-obj-id': dataObjId, 'data-obj-type': dataObjType, style }}
    >
      <CommandInput placeholder={schema.placeholder || 'Type a command or search...'} />
      <CommandList>
        <CommandEmpty>{schema.emptyText || 'No results found.'}</CommandEmpty>
        {schema.groups?.map((group, idx) => (
          <CommandGroup key={idx} heading={group.heading}>
            {group.items?.map((item, itemIdx) => (
              <CommandItem key={itemIdx} value={item.value}>
                {item.label}
              </CommandItem>
            ))}
          </CommandGroup>
        ))}
      </CommandList>
    </Command>
  );
  },
  {
    namespace: 'ui',
    label: 'Command',
    inputs: [
      { name: 'placeholder', type: 'string', label: 'Placeholder' },
      { name: 'emptyText', type: 'string', label: 'Empty Text' },
      { name: 'className', type: 'string', label: 'CSS Class' }
    ],
    defaultProps: {
      placeholder: 'Type a command or search...',
      emptyText: 'No results found.',
      groups: []
    }
  }
);
