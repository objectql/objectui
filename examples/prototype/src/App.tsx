import { SchemaRenderer } from '@object-ui/renderer';

const meta = {
  type: 'page',
  body: [
    {
      type: 'sidebar',
      logo: 'STEEDOS UI',
      body: [
        { type: 'menu-item', label: 'Dashboard', active: true, icon: '📊' },
        { type: 'menu-item', label: 'Projects', icon: '📁' },
        { type: 'menu-item', label: 'Tasks', icon: '✅' },
        { type: 'menu-item', label: 'Team', icon: '👥' },
        { type: 'menu-item', label: 'Reports', icon: '📈' },
        { type: 'div', className: 'mt-auto pt-4 border-t border-slate-800', body: [
             { type: 'menu-item', label: 'Settings', icon: '⚙️' },
             { type: 'menu-item', label: 'Logout', icon: '🚪' }
        ]}
      ]
    },
    {
      type: 'div',
      className: 'flex-1 flex flex-col h-screen overflow-hidden',
      body: [
         {
           type: 'header',
           title: 'Executive Dashboard',
           body: [
             { type: 'button', label: 'New Project', className: 'bg-blue-600 text-white hover:bg-blue-700' },
             { type: 'button', label: '🔔', className: 'ml-2 bg-gray-100 text-gray-600 rounded-full w-10 h-10 flex items-center justify-center p-0' },
             { type: 'div', className: 'ml-4 w-8 h-8 rounded-full bg-blue-200 border border-blue-300' }
           ]
         },
         {
           type: 'div',
           className: 'flex-1 overflow-auto p-8',
           body: [
             // Stats Row
             {
               type: 'div',
               className: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8',
               body: [
                 { type: 'stat-card', title: 'Total Revenue', value: '$124,592', trend: '+12.5%', iconStr: '💰' },
                 { type: 'stat-card', title: 'Active Projects', value: '45', trend: '+3', iconStr: '🚀' },
                 { type: 'stat-card', title: 'Pending Tasks', value: '12', trend: '-2', iconStr: '📝' },
                 { type: 'stat-card', title: 'Team Capacity', value: '87%', trend: '+5%', iconStr: '⚡' }
               ]
             },
             // Content Row
             {
               type: 'div',
               className: 'grid grid-cols-1 lg:grid-cols-3 gap-8',
               body: [
                 {
                   type: 'card',
                   title: 'Revenue Overview',
                   className: 'lg:col-span-2 h-96',
                   body: {
                     type: 'div',
                     className: 'flex items-center justify-center h-full text-gray-400 bg-gray-50 rounded border border-dashed border-gray-200',
                     body: { type: 'tpl', tpl: '[Chart Component Placeholder]' }
                   }
                 },
                 {
                   type: 'card',
                   title: 'Recent Activity',
                   className: 'h-96',
                   body: {
                      type: 'div',
                      className: 'space-y-4',
                      body: [
                        { type: 'div', className: 'flex items-start pb-4 border-b border-gray-100', body: [
                            { type: 'div', className: 'w-2 h-2 mt-2 rounded-full bg-blue-500 mr-3' },
                            { type: 'div', body: [ { type: 'div', className: 'text-sm font-medium', body: {type:'tpl', tpl:'New project created'} }, { type: 'div', className: 'text-xs text-gray-500', body: {type:'tpl', tpl:'2 hours ago'} } ] }
                        ]},
                        { type: 'div', className: 'flex items-start pb-4 border-b border-gray-100', body: [
                            { type: 'div', className: 'w-2 h-2 mt-2 rounded-full bg-green-500 mr-3' },
                            { type: 'div', body: [ { type: 'div', className: 'text-sm font-medium', body: {type:'tpl', tpl:'Task completed: Homepage Design'} }, { type: 'div', className: 'text-xs text-gray-500', body: {type:'tpl', tpl:'4 hours ago'} } ] }
                        ]},
                         { type: 'div', className: 'flex items-start pb-4', body: [
                            { type: 'div', className: 'w-2 h-2 mt-2 rounded-full bg-purple-500 mr-3' },
                            { type: 'div', body: [ { type: 'div', className: 'text-sm font-medium', body: {type:'tpl', tpl:'Meeting with Client'} }, { type: 'div', className: 'text-xs text-gray-500', body: {type:'tpl', tpl:'Tomorrow, 10:00 AM'} } ] }
                        ]}
                      ]
                   }
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
    <SchemaRenderer schema={meta} />
  );
}

export default App;
