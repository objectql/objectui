# Phase 2 Schemas - Quick Start Guide

## Overview

This guide helps you quickly understand and use the new Phase 2 schemas in your ObjectUI applications.

## Installation

```bash
npm install @object-ui/types
# or
pnpm add @object-ui/types
```

## Basic Usage

### 1. AppSchema - Application Configuration

Define your entire application structure in a single schema:

```typescript
import type { AppSchema } from '@object-ui/types';

const myApp: AppSchema = {
  type: 'app',
  name: 'my-crm',
  title: 'My CRM Application',
  logo: '/logo.svg',
  layout: 'sidebar',
  
  menu: [
    {
      type: 'item',
      label: 'Dashboard',
      icon: 'LayoutDashboard',
      path: '/dashboard'
    },
    {
      type: 'group',
      label: 'Sales',
      children: [
        { type: 'item', label: 'Leads', icon: 'Users', path: '/leads' },
        { type: 'item', label: 'Deals', icon: 'Briefcase', path: '/deals' }
      ]
    }
  ],
  
  actions: [
    {
      type: 'user',
      label: 'John Doe',
      avatar: '/avatar.jpg',
      items: [
        { type: 'item', label: 'Profile', path: '/profile' },
        { type: 'separator' },
        { type: 'item', label: 'Logout', path: '/logout' }
      ]
    }
  ]
};
```

### 2. ThemeSchema - Dynamic Theming

Create a theme configuration:

```typescript
import type { ThemeSchema } from '@object-ui/types';

const theme: ThemeSchema = {
  type: 'theme',
  mode: 'dark',
  themes: [
    {
      name: 'professional',
      label: 'Professional',
      light: {
        primary: '#3b82f6',
        background: '#ffffff',
        foreground: '#0f172a'
      },
      dark: {
        primary: '#60a5fa',
        background: '#0f172a',
        foreground: '#f1f5f9'
      }
    }
  ],
  allowSwitching: true,
  persistPreference: true
};
```

### 3. Enhanced Actions - Ajax, Confirm, Dialog

#### Ajax Action
```typescript
import type { ActionSchema } from '@object-ui/types';

const loadDataAction: ActionSchema = {
  type: 'action',
  label: 'Load Data',
  actionType: 'ajax',
  api: '/api/data',
  method: 'GET',
  onSuccess: {
    type: 'toast',
    message: 'Data loaded successfully!'
  }
};
```

#### Confirm Action
```typescript
const deleteAction: ActionSchema = {
  type: 'action',
  label: 'Delete',
  actionType: 'confirm',
  confirm: {
    title: 'Confirm Deletion',
    message: 'Are you sure you want to delete this item?',
    confirmText: 'Yes, Delete',
    confirmVariant: 'destructive'
  },
  api: '/api/items/123',
  method: 'DELETE'
};
```

#### Action Chaining
```typescript
const processOrderAction: ActionSchema = {
  type: 'action',
  label: 'Process Order',
  actionType: 'ajax',
  api: '/api/orders/process',
  chain: [
    {
      type: 'action',
      label: 'Send Email',
      actionType: 'ajax',
      api: '/api/emails/send'
    },
    {
      type: 'action',
      label: 'Update Inventory',
      actionType: 'ajax',
      api: '/api/inventory/update'
    }
  ],
  chainMode: 'sequential'
};
```

### 4. DetailView - Rich Detail Pages

```typescript
import type { DetailViewSchema } from '@object-ui/types';

const customerDetail: DetailViewSchema = {
  type: 'detail-view',
  title: 'Customer Details',
  api: '/api/customers/123',
  layout: 'grid',
  columns: 2,
  
  sections: [
    {
      title: 'Basic Information',
      fields: [
        { name: 'name', label: 'Name', type: 'text' },
        { name: 'email', label: 'Email', type: 'text' },
        { name: 'phone', label: 'Phone', type: 'text' }
      ]
    },
    {
      title: 'Address',
      fields: [
        { name: 'street', label: 'Street', type: 'text' },
        { name: 'city', label: 'City', type: 'text' },
        { name: 'country', label: 'Country', type: 'text' }
      ]
    }
  ],
  
  tabs: [
    {
      key: 'orders',
      label: 'Orders',
      content: {
        type: 'table',
        columns: []
      }
    }
  ]
};
```

### 5. ReportSchema - Data Reports

```typescript
import type { ReportSchema } from '@object-ui/types';

const salesReport: ReportSchema = {
  type: 'report',
  title: 'Monthly Sales Report',
  
  fields: [
    {
      name: 'total_sales',
      label: 'Total Sales',
      type: 'number',
      aggregation: 'sum',
      format: 'currency'
    },
    {
      name: 'customer_count',
      label: 'Customers',
      type: 'number',
      aggregation: 'count'
    }
  ],
  
  filters: [
    {
      field: 'date',
      operator: 'between',
      values: ['2024-01-01', '2024-01-31']
    }
  ],
  
  groupBy: [
    { field: 'region', sort: 'asc' }
  ],
  
  sections: [
    { type: 'summary', title: 'Summary' },
    { type: 'chart', title: 'Trend' },
    { type: 'table', title: 'Details' }
  ],
  
  schedule: {
    enabled: true,
    frequency: 'monthly',
    dayOfMonth: 1,
    recipients: ['manager@example.com'],
    formats: ['pdf', 'excel']
  }
};
```

### 6. BlockSchema - Reusable Components

```typescript
import type { BlockSchema } from '@object-ui/types';

const heroBlock: BlockSchema = {
  type: 'block',
  
  meta: {
    name: 'hero-section',
    label: 'Hero Section',
    description: 'A customizable hero banner',
    category: 'Marketing'
  },
  
  variables: [
    {
      name: 'title',
      type: 'string',
      defaultValue: 'Welcome',
      required: true
    },
    {
      name: 'showButton',
      type: 'boolean',
      defaultValue: true
    }
  ],
  
  slots: [
    {
      name: 'content',
      label: 'Content Area'
    }
  ],
  
  template: {
    type: 'div',
    className: 'hero-section',
    children: [
      { type: 'text', value: '${title}' }
    ]
  }
};
```

### 7. ViewSwitcher - Multiple View Modes

```typescript
import type { ViewSwitcherSchema } from '@object-ui/types';

const viewSwitcher: ViewSwitcherSchema = {
  type: 'view-switcher',
  views: [
    {
      type: 'list',
      label: 'List',
      icon: 'List'
    },
    {
      type: 'grid',
      label: 'Grid',
      icon: 'Grid'
    },
    {
      type: 'kanban',
      label: 'Kanban',
      icon: 'Kanban'
    }
  ],
  defaultView: 'list',
  variant: 'tabs',
  persistPreference: true
};
```

## Runtime Validation with Zod

All schemas can be validated at runtime:

```typescript
import { AppSchema, ThemeSchema, ReportSchema } from '@object-ui/types/zod';

// Validate app config
const result = AppSchema.safeParse(myAppConfig);
if (result.success) {
  console.log('Valid app config:', result.data);
} else {
  console.error('Validation errors:', result.error);
}

// Validate theme
const themeResult = ThemeSchema.safeParse(themeConfig);

// Validate report
const reportResult = ReportSchema.safeParse(reportConfig);
```

## Common Patterns

### 1. Conditional Actions

```typescript
const action: ActionSchema = {
  type: 'action',
  label: 'Approve',
  condition: {
    expression: '${data.amount > 1000}',
    then: {
      type: 'action',
      label: 'Manager Approval Required',
      actionType: 'confirm'
    },
    else: {
      type: 'action',
      label: 'Auto Approve',
      actionType: 'ajax'
    }
  }
};
```

### 2. Action Tracking

```typescript
const trackedAction: ActionSchema = {
  type: 'action',
  label: 'Download',
  actionType: 'ajax',
  tracking: {
    enabled: true,
    event: 'report_downloaded',
    metadata: {
      format: 'pdf',
      reportType: 'sales'
    }
  }
};
```

### 3. Theme Switcher Component

```typescript
const themeSwitcher: ThemeSwitcherSchema = {
  type: 'theme-switcher',
  variant: 'dropdown',
  showMode: true,
  showThemes: true,
  lightIcon: 'Sun',
  darkIcon: 'Moon'
};
```

## Tips & Best Practices

1. **Always use type imports** - Use `import type` for schemas to avoid runtime overhead
2. **Validate user input** - Use Zod schemas for runtime validation
3. **Leverage conditional logic** - Use `visibleOn`, `disabledOn`, and action conditions
4. **Reuse blocks** - Create a library of common blocks for consistency
5. **Theme consistency** - Define semantic colors once, use everywhere
6. **Report templates** - Create reusable report configurations
7. **Action chains** - Combine simple actions into complex workflows

## TypeScript Benefits

Full type safety and IntelliSense:

```typescript
// TypeScript knows all available fields and their types
const app: AppSchema = {
  type: 'app',
  layout: 'sidebar', // ✓ autocomplete: 'sidebar' | 'header' | 'empty'
  menu: [
    {
      type: 'item', // ✓ autocomplete: 'item' | 'group' | 'separator'
      // ... TypeScript suggests all valid fields
    }
  ]
};
```

## Next Steps

1. Review full documentation in `PHASE2_IMPLEMENTATION.md`
2. Check test cases in `__tests__/phase2-schemas.test.ts` for more examples
3. Wait for component implementations (coming soon)
4. Explore Storybook examples (coming soon)

## Support

- 📚 Documentation: `packages/types/PHASE2_IMPLEMENTATION.md`
- 🧪 Tests: `packages/types/src/__tests__/phase2-schemas.test.ts`
- 📊 Report: `PHASE2_FINAL_REPORT.md`

## Version

- **Phase:** 2
- **Status:** Schema Complete (95% coverage)
- **Next:** Component Implementation
