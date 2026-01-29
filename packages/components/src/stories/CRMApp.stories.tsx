
import type { Meta, StoryObj } from '@storybook/react';
import React, { useState, useEffect } from 'react';
import { SchemaRenderer, SchemaRendererProvider } from '@object-ui/react';
import { PageSchema } from '@object-ui/types';
import { SidebarProvider } from '../ui/sidebar';

// Mock Component for SidebarNav since we can't easily import the one from examples/crm-app
// In a real monorepo scenario, this component should probably live in a shared package or be defined here.
const SidebarNav = () => {
  return (
    <SchemaRenderer schema={{
      type: "sidebar",
      props: { collapsible: "icon" },
      children: [
        {
          type: "sidebar:header",
          children: [
            {
               type: "div",
               className: "flex items-center gap-2 px-2 py-3",
               children: [
                  { type: "icon", props: { name: "GalleryVerticalEnd", className: "size-4" } },
                  { type: "text", content: "Object UI", className: "font-semibold" }
               ]
            }
          ]
        },
        {
          type: "sidebar:content",
          children: [
             {
                type: "sidebar:group",
                children: [
                   { type: "sidebar:group-label", content: "Platform" },
                   { 
                      type: "sidebar:menu", 
                      children: [
                         { type: "sidebar:menu-button", props: { isActive: true }, children: [{type:"text", content:"Dashboard"}] },
                         { type: "sidebar:menu-button", children: [{type:"text", content:"Contacts"}] },
                         { type: "sidebar:menu-button", children: [{type:"text", content:"Opportunities"}] },
                         { type: "sidebar:menu-button", children: [{type:"text", content:"Accounts"}] },
                      ] 
                   }
                ]
             }
          ]
        },
        {
           type: "sidebar:footer",
           children: [
              {
                 type: "sidebar:menu-button",
                 children: [
                    { type: "avatar", props: { src: "https://github.com/shadcn.png" }, className: "h-8 w-8 rounded-lg" },
                    { type: "text", content: "Admin User", className: "ml-2 text-sm" }
                 ]
              }
           ]
        }
      ]
    }} />
  );
};


const CRMAppPreview = () => {
    return (
      <SidebarProvider>
        <div className="flex h-screen w-full bg-sidebar-background">
             {/* We simulate the generic layout structure here since SidebarProvider relies on context */}
             {/* In a real integration, we'd use the actual Providers. For Storybook, we might need a decorator */}
             {/* But here we use SchemaRenderer to render the Sidebar using the JSON we defined above */}
             <div className="w-[250px] border-r bg-background h-full hidden md:block">
                <SidebarNav />
             </div>
             
             <div className="flex flex-1 flex-col h-full overflow-hidden">
                <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 bg-background">
                   <div className="flex items-center gap-2">
                      <span className="font-semibold">CRM Demo App</span>
                   </div>
                </header>
                <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-gray-50/50">
                   <SchemaRenderer schema={{
                       type: "page",
                       props: { title: "Dashboard" },
                       children: [
                           {
                               type: "grid",
                               props: { cols: 3, gap: 4, className: "mb-8" },
                               children: [
                                   { type: "card", props: { title: "Total Revenue", description: "+20.1% from last month" }, children: [{type: "text", content: "$45,231.89", className: "text-2xl font-bold"}] },
                                   { type: "card", props: { title: "Subscriptions", description: "+180.1% from last month" }, children: [{type: "text", content: "+2350", className: "text-2xl font-bold"}] },
                                   { type: "card", props: { title: "Sales", description: "+19% from last month" }, children: [{type: "text", content: "+12,234", className: "text-2xl font-bold"}] },
                               ]
                           },
                           {
                               type: "grid",
                               props: { cols: 7, gap: 4 },
                               children: [
                                   { 
                                       type: "card", 
                                       props: { title: "Overview", className: "col-span-4" },
                                       children: [{ type: "chart:bar", props: { 
                                           data: [
                                               { name: "Jan", total: 1200 }, { name: "Feb", total: 1500 }, { name: "Mar", total: 1300 },
                                               { name: "Apr", total: 1800 }, { name: "May", total: 2200 }, { name: "Jun", total: 2600 }
                                           ],
                                           index: "name",
                                           categories: ["total"]
                                       }}] 
                                   },
                                   { 
                                       type: "card", 
                                       props: { title: "Recent Sales", description: "You made 265 sales this month.", className: "col-span-3" },
                                       children: [
                                           { type: "view:simple", children: [
                                               { type: "div", className: "flex items-center justify-between py-2 border-b", children: [
                                                   { type: "div", className: "flex items-center gap-2", children: [{type:"avatar", props:{fallback:"OM"}}, {type:"div", children:[{type:"text", content:"Olivia Martin", className:"font-medium"}, {type:"text", content:"olivia.martin@email.com", className:"text-xs text-muted-foreground"}]}] },
                                                   { type: "text", content: "+$1,999.00", className: "font-medium" }
                                               ]},
                                                { type: "div", className: "flex items-center justify-between py-2 border-b", children: [
                                                   { type: "div", className: "flex items-center gap-2", children: [{type:"avatar", props:{fallback:"JL"}}, {type:"div", children:[{type:"text", content:"Jackson Lee", className:"font-medium"}, {type:"text", content:"jackson.lee@email.com", className:"text-xs text-muted-foreground"}]}] },
                                                   { type: "text", content: "+$39.00", className: "font-medium" }
                                               ]},
                                                { type: "div", className: "flex items-center justify-between py-2", children: [
                                                   { type: "div", className: "flex items-center gap-2", children: [{type:"avatar", props:{fallback:"IN"}}, {type:"div", children:[{type:"text", content:"Isabella Nguyen", className:"font-medium"}, {type:"text", content:"isabella.nguyen@email.com", className:"text-xs text-muted-foreground"}]}] },
                                                   { type: "text", content: "+$299.00", className: "font-medium" }
                                               ]},
                                           ]}
                                       ]
                                   }
                               ]
                           }
                       ]
                   }} />
                </div>
             </div>
        </div>
      </SidebarProvider>
    );
}


const meta: Meta = {
  title: 'Apps/CRM',
  component: CRMAppPreview,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;

export const Default: StoryObj = {};
