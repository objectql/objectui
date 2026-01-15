import { SchemaRenderer } from '@object-ui/react';
import type { PageSchema } from '@object-ui/types';
import { MockDataSource } from './lib/mockDataSource';

// 1. 数据层 (Rule #1: The Universal Adapter)
// Object UI 引擎不包含任何后端逻辑，而是通过 DataSource 接口与外部世界通信。
// 这里我们注入一个 Mock 实现，但它可以轻松替换为 RestDataSource 或 GraphQLDataSource。
const dataSource = new MockDataSource();

// 2. 协议层 (Rule #3: Schema First)
// 这就是您的 "应用"。它是纯 JSON 数据，不包含任何 React 代码。
// 在真实生产环境中，这个 JSON 对象通常由后端 API (如 GET /api/schema/dashboard) 动态返回。
const applicationSchema: PageSchema = {
  type: "page", // 根组件是一个完整的页面
  title: "Object UI Demo",
  // 🎨 Rule #2: Tailwind Native - 直接在 Schema 中写样式
  className: "min-h-screen bg-slate-50/50 font-sans", 
  body: [
    {
      type: "header", 
      title: "App Builder",
      className: "bg-white border-b px-6 py-4 sticky top-0 z-10 flex items-center justify-between",
      actions: [
         {
             type: "button",
             label: "View Source",
             variant: "ghost",
             className: "text-slate-600 hover:text-slate-900"
         },
         {
             type: "button",
             label: "Deploy App",
             variant: "default",
             className: "bg-black hover:bg-slate-800 text-white"
         }
      ]
    },
    {
      type: "grid", 
      className: "max-w-5xl mx-auto p-8 gap-8 grid-cols-1 md:grid-cols-3",
      children: [
        {
          type: "card",
          title: "Application Stats",
          className: "col-span-1 md:col-span-3 lg:col-span-1 border rounded-xl shadow-sm bg-white p-6",
          body: [
            { type: "text", value: "Active Users", className: "text-sm text-muted-foreground" },
            { type: "text", value: "1,234", className: "text-3xl font-bold tracking-tight mt-2" },
            { type: "text", value: "+12% from last month", className: "text-xs text-green-600 mt-1 font-medium" }
          ]
        },
        {
          type: "form",
          objectApiName: "users", // 告诉 DataSource 操作哪个资源
          title: "User Registration",
          className: "col-span-1 md:col-span-2 border rounded-xl shadow-sm bg-white p-6 h-fit",
          description: "This form is generated entirely from JSON logic.",
          fields: [
            {
              type: "group",
              className: "grid grid-cols-2 gap-4 mb-4",
              fields: [
                {
                  type: "input",
                  name: "firstName",
                  label: "First Name",
                  required: true,
                  placeholder: "Jane"
                },
                {
                  type: "input",
                  name: "lastName",
                  label: "Last Name",
                  required: true,
                  placeholder: "Doe"
                }
              ]
            },
            {
              type: "input",
              name: "email",
              label: "Work Email",
              required: true,
              inputType: "email",
              className: "mb-4"
            },
            {
              type: "select",
              name: "role",
              label: "System Role",
              className: "mb-6",
              options: [
                { label: "Administrator", value: "admin" },
                { label: "Content Editor", value: "editor" },
                { label: "Viewer", value: "viewer" }
              ],
              defaultValue: "viewer"
            }
          ],
          actions: [
            {
              type: "button",
              label: "Create User",
              variant: "default",
              submit: true, // 引擎会自动处理校验并调用 dataSource.create()
              className: "w-full"
            }
          ]
        }
      ]
    }
  ]
};

function App() {
  return (
    // 3. 渲染引擎 (The Engine)
    // 这里的 <SchemaRenderer> 是从 JSON 到 UI 的转换器。
    // 它负责解析 Schema 中定义的 type ('page', 'form', 'input')，
    // 并将它们映射到 @object-ui/components 中的 Shadcn 组件。
    <SchemaRenderer 
      schema={applicationSchema}
      dataSource={dataSource}
    />
  );
}

export default App;
