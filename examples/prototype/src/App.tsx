import { SchemaRenderer } from '@object-ui/react';
import '@object-ui/components';

const schema = {
  type: 'sidebar-provider',
  body: [
    {
      type: 'sidebar',
      body: [
        {
          type: 'sidebar-header',
          body: [
            {
              type: 'div',
              className: 'px-4 py-4 font-bold text-xl flex items-center gap-2',
              body: [
                {
                   type: 'image',
                   src: '/logo.svg',
                   className: 'size-8 rounded-lg',
                   alt: 'Object UI Logo'
                },
                {
                   type: 'text',
                   content: 'Object UI'
                }
              ]
            }
          ]
        },
        {
          type: 'sidebar-content',
          body: [
            {
              type: 'sidebar-group',
              label: 'Platform',
              body: [
                {
                  type: 'sidebar-menu',
                  body: [
                    {
                      type: 'sidebar-menu-item',
                      body: {
                        type: 'sidebar-menu-button',
                         active: true,
                        body: { type: 'span', body: { type: 'text', content: 'Dashboard' } }
                      }
                    },
                    {
                      type: 'sidebar-menu-item',
                      body: {
                        type: 'sidebar-menu-button',
                        body: { type: 'span', body: { type: 'text', content: 'Projects' } }
                      }
                    },
                    {
                      type: 'sidebar-menu-item',
                      body: {
                        type: 'sidebar-menu-button',
                        body: { type: 'span', body: { type: 'text', content: 'Tasks' } }
                      }
                    }
                  ]
                }
              ]
            },
            {
              type: 'sidebar-group',
              label: 'Settings',
              body: [
                {
                  type: 'sidebar-menu',
                  body: [
                    {
                      type: 'sidebar-menu-item',
                      body: {
                        type: 'sidebar-menu-button',
                        body: { type: 'span', body: { type: 'text', content: 'Profile' } }
                      }
                    },
                    {
                      type: 'sidebar-menu-item',
                      body: {
                        type: 'sidebar-menu-button',
                        body: { type: 'span', body: { type: 'text', content: 'Billing' } }
                      }
                    }
                  ]
                }
              ]
            }
          ]
        },
        {
          type: 'sidebar-footer',
          body: {
            type: 'div',
            className: 'p-4 text-xs text-muted-foreground border-t',
            body: { type: 'text', content: 'v1.0.0' }
          }
        }
      ]
    },
    {
      type: 'sidebar-inset',
      body: [
        {
          type: 'header-bar',
          className: 'border-b px-6 py-3',
          crumbs: [
            { label: 'Platform', href: '#' },
            { label: 'Dashboard' }
          ]
        },
        {
          type: 'div',
          className: 'flex flex-1 flex-col gap-6 p-8 bg-muted/10 min-h-[calc(100vh-4rem)]',
          body: [
            {
              type: 'div',
              className: 'flex items-center justify-between',
              body: [
                {
                    type: 'div',
                    className: 'space-y-1',
                    body: [
                        { type: 'div', className: 'text-2xl font-bold tracking-tight', body: { type: 'text', content: 'Dashboard' } },
                        { type: 'div', className: 'text-sm text-muted-foreground', body: { type: 'text', content: 'Overview of your project performance and metrics.' } }
                    ]
                },
                {
                    type: 'div',
                    className: 'flex items-center gap-2',
                    body: [
                        { type: 'button', label: 'Download', variant: 'outline', size: 'sm' },
                        { type: 'button', label: 'Create New', size: 'sm' }
                    ]
                }
              ]
            },
            {
              type: 'div',
              className: 'grid gap-6 md:grid-cols-2 lg:grid-cols-4',
              body: [
                {
                  type: 'card',
                  className: 'shadow-sm hover:shadow-md transition-shadow',
                  body: [
                    {
                        type: 'div',
                        className: 'p-6 pb-2',
                        body: { type: 'div', className: 'text-sm font-medium text-muted-foreground', body: { type: 'text', content: 'Total Revenue' } }
                    },
                    {
                      type: 'div',
                      className: 'p-6 pt-0',
                      body: [
                        { type: 'div', className: 'text-2xl font-bold', body: { type: 'text', content: '$45,231.89' } },
                        { type: 'div', className: 'text-xs text-muted-foreground mt-1', body: { type: 'text', content: '+20.1% from last month' } }
                      ]
                    }
                  ]
                },
                {
                  type: 'card',
                  className: 'shadow-sm hover:shadow-md transition-shadow',
                  body: [
                    {
                        type: 'div',
                        className: 'p-6 pb-2',
                        body: { type: 'div', className: 'text-sm font-medium text-muted-foreground', body: { type: 'text', content: 'Subscriptions' } }
                    },
                    {
                      type: 'div',
                      className: 'p-6 pt-0',
                      body: [
                        { type: 'div', className: 'text-2xl font-bold', body: { type: 'text', content: '+2,350' } },
                        { type: 'div', className: 'text-xs text-muted-foreground mt-1', body: { type: 'text', content: '+180.1% from last month' } }
                      ]
                    }
                  ]
                },
                {
                  type: 'card',
                  className: 'shadow-sm hover:shadow-md transition-shadow',
                  body: [
                    {
                        type: 'div',
                        className: 'p-6 pb-2',
                        body: { type: 'div', className: 'text-sm font-medium text-muted-foreground', body: { type: 'text', content: 'Sales' } }
                    },
                    {
                      type: 'div',
                      className: 'p-6 pt-0',
                      body: [
                        { type: 'div', className: 'text-2xl font-bold', body: { type: 'text', content: '+12,234' } },
                        { type: 'div', className: 'text-xs text-muted-foreground mt-1', body: { type: 'text', content: '+19% from last month' } }
                      ]
                    }
                  ]
                },
                {
                  type: 'card',
                  className: 'shadow-sm hover:shadow-md transition-shadow',
                  body: [
                     {
                        type: 'div',
                        className: 'p-6 pb-2',
                        body: { type: 'div', className: 'text-sm font-medium text-muted-foreground', body: { type: 'text', content: 'Active Now' } }
                    },
                    {
                      type: 'div',
                      className: 'p-6 pt-0',
                      body: [
                        { type: 'div', className: 'text-2xl font-bold', body: { type: 'text', content: '+573' } },
                        { type: 'div', className: 'text-xs text-muted-foreground mt-1', body: { type: 'text', content: '+201 since last hour' } }
                      ]
                    }
                  ]
                }
              ]
            },
            {
              type: 'tabs',
              defaultValue: 'overview',
              className: 'space-y-6',
              items: [
                {
                  value: 'overview',
                  label: 'Overview',
                  body: [
                    {
                      type: 'div',
                      className: 'grid gap-6 md:grid-cols-2 lg:grid-cols-7',
                      body: [
                        {
                          type: 'card',
                          className: 'col-span-4 shadow-sm',
                          title: 'Interactive Chart',
                          body: {
                            type: 'div',
                            className: 'h-[350px] flex items-center justify-center bg-muted/50 rounded-md border border-dashed text-muted-foreground m-6',
                            body: { type: 'text', content: 'Chart Area Placeholder' }
                          }
                        },
                        {
                          type: 'card',
                          className: 'col-span-3 shadow-sm',
                          title: 'Quick Access',
                          description: 'Common actions and forms.',
                          body: [
                            {
                                type: 'div',
                                className: 'p-6 pt-0 space-y-4',
                                body: [
                                     {
                                        type: 'input',
                                        label: 'Email Address',
                                        id: 'email',
                                        inputType: 'email',
                                        placeholder: 'm@example.com'
                                    },
                                    {
                                        type: 'input',
                                        label: 'Workspace Name',
                                        id: 'workspace',
                                        placeholder: 'Acme Inc.'
                                    },
                                    {
                                        type: 'button',
                                        label: 'Save Preferences',
                                        className: 'w-full mt-2'
                                    }
                                ]
                            }
                          ]
                        }
                      ]
                    },
                    {
                      type: 'card',
                      className: 'shadow-sm mt-6',
                      title: 'Recent Activity',
                      description: 'Your recent component usage history.',
                      body: {
                          type: 'div',
                          className: 'p-6 pt-0',
                          body: [
                              { type: 'div', className: 'text-sm', body: { type: 'text', content: 'User updated the schema at 10:42 AM' } },
                              { type: 'div', className: 'text-sm text-muted-foreground', body: { type: 'text', content: 'User created a new component at 09:15 AM' } }
                          ]
                      }
                    }
                  ]
                },
                {
                  value: 'analytics',
                  label: 'Analytics',
                  body: { type: 'text', content: 'Analytics Content' }
                },
                {
                  value: 'reports',
                  label: 'Reports',
                  body: { type: 'text', content: 'Reports Content' }
                },
                {
                  value: 'notifications',
                  label: 'Notifications',
                  body: { type: 'text', content: 'Notifications Content' }
                }
              ]
            }
          ]
        }
      ]
    }
  ]
};

function App() {
  return (
    <SchemaRenderer schema={schema} />
  )
}

export default App

