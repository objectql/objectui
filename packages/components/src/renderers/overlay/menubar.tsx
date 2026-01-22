/**
 * ObjectUI
 * Copyright (c) 2024-present ObjectStack Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { ComponentRegistry } from '@object-ui/core';
import type { MenubarSchema } from '@object-ui/types';
import { Menubar, MenubarMenu, MenubarTrigger, MenubarContent, MenubarItem, MenubarSeparator, MenubarSub, MenubarSubTrigger, MenubarSubContent } from '../../ui/menubar';

ComponentRegistry.register('menubar', 
  ({ schema, ...props }: { schema: MenubarSchema; [key: string]: any }) => {
    const { 
        'data-obj-id': dataObjId, 
        'data-obj-type': dataObjType,
        style,
        ...menubarProps
    } = props;
    
    return (
      <Menubar 
        className={schema.className} 
        {...menubarProps}
        {...{ 'data-obj-id': dataObjId, 'data-obj-type': dataObjType, style }}
      >
        {schema.menus?.map((menu, idx) => (
          <MenubarMenu key={idx}>
            <MenubarTrigger>{menu.label}</MenubarTrigger>
            <MenubarContent>
              {menu.items?.map((item, itemIdx) => (
                item.separator ? (
                  <MenubarSeparator key={itemIdx} />
                ) : item.children ? (
                  <MenubarSub key={itemIdx}>
                    <MenubarSubTrigger>{item.label}</MenubarSubTrigger>
                    <MenubarSubContent>
                      {item.children.map((child, childIdx) => (
                        <MenubarItem key={childIdx}>{child.label}</MenubarItem>
                      ))}
                    </MenubarSubContent>
                  </MenubarSub>
                ) : (
                  <MenubarItem key={itemIdx} disabled={item.disabled}>
                    {item.label}
                  </MenubarItem>
                )
              ))}
            </MenubarContent>
          </MenubarMenu>
        ))}
      </Menubar>
    );
  },
  {
    label: 'Menubar',
    inputs: [
      { name: 'className', type: 'string', label: 'CSS Class' }
    ],
    defaultProps: {
      menus: [
        {
          label: 'File',
          items: [
            { label: 'New' },
            { label: 'Open' },
            { separator: true },
            { label: 'Exit' }
          ]
        }
      ]
    }
  }
);
