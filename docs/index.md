---
layout: home

hero:
  name: Object UI
  text: The Universal UI Engine
  tagline: Build Enterprise Interfaces with JSON. Render with React, Style with Tailwind.
  actions:
    - theme: brand
      text: Quick Start
      link: /guide/introduction
    - theme: alt
      text: Architecture
      link: /spec/architecture

features:
  - title: 🎨 Tailwind Native
    details: Fully stylable using standard Utility Classes. No hidden styles or CSS modules. Merge styles via `className`.
  - title: 🔌 Backend Agnostic
    details: Connect to Rest, GraphQL, or Local Data. Universal `DataSource` interface allows usage with any API.
  - title: 🧱 Shadcn Compatible
    details: Built on Radix UI primitives. The rendered output looks and feels like hand-coded Shadcn components.
  - title: ⚡️ Lazy Loaded Plugins
    details: Heavy components (Monaco, Recharts) are loaded only when rendered, keeping your bundle ultra-light.
---

# The Shift to Schema-Driven UI

Object UI decouples the **Protocol** (JSON Schema) from the **Implementation** (React Components), allowing you to build complex enterprise apps faster without sacrificing control.

## How it works

### 1. Define Protocol (JSON)
You define the *what*, not the *how*. Standard Tailwind classes apply directly.

```json
{
  "type": "form",
  "className": "space-y-4 border p-4 rounded-lg", 
  "fields": [
    {
      "type": "input",
      "name": "email",
      "label": "Email Address",
      "className": "bg-slate-50" 
    }
  ]
}
```

### 2. Render Component (React)
The engine transforms generic JSON into polished **Shadcn UI** components.

```tsx
<div className="space-y-4 border p-4 rounded-lg">
  <div className="flex flex-col gap-2 bg-slate-50">
    <Label>Email Address</Label>
    <Input name="email" />
  </div>
</div>
```
