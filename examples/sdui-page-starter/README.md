# SDUI Page Starter Example

A practical starter example for third-party application teams that want to build pages with Object UI Schema-Driven UI Engine.

## What this example demonstrates

1. JSON-first page composition using `schema.json`
2. Data-driven expressions such as `${data.metrics.activeCustomers}`
3. Role-based visibility with expression rules (`hidden`)
4. Minimal React integration using `SchemaRendererProvider` + `SchemaRenderer`

## Files

```
examples/sdui-page-starter/
├── index.html               # Vite HTML entry
├── vite.config.ts            # Vite dev server config
├── tailwind.config.js        # Tailwind CSS config
├── postcss.config.js         # PostCSS plugins
├── tsconfig.json             # TypeScript config
├── package.json
├── README.md
└── src/
    ├── main.tsx              # React entry point
    ├── App.tsx               # Renderer wiring with provider data source
    └── schema.json           # Complete page schema
```

## How to run

```bash
# From the monorepo root
pnpm install
pnpm build

# Start this example
pnpm --filter @object-ui/example-sdui-page-starter dev
# Opens http://localhost:3001
```

## Use this in your own project

1. Copy `src/schema.json` into your app.
2. Provide runtime data from your own API adapter or state layer.
3. Render with:

```tsx
import '@object-ui/components';
import { SchemaRendererProvider, SchemaRenderer } from '@object-ui/react';
import schema from './schema.json';

export function CustomerOpsPage() {
  const dataSource = {
    user: { role: 'admin' },
    metrics: { activeCustomers: 1284, monthlyRevenue: '$96,430', conversionRate: '4.2%' },
    recentOrders: []
  };

  return (
    <SchemaRendererProvider dataSource={dataSource}>
      <SchemaRenderer schema={schema} />
    </SchemaRendererProvider>
  );
}
```

## Next steps

- Replace `data-table` section with `plugin-grid` when you need sorting, pagination, and bulk actions.
- Move action behavior to ActionEngine for reusable event logic.
- Split large pages into schema fragments and compose them in page factories.
