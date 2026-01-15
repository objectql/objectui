# Specialized Designers

Object UI Designer now supports three specialized designer modes, each optimized for specific use cases:

## 🎯 Designer Modes

### 1. Form Designer (`mode="form"`)

A specialized designer for creating object forms with validation and field management.

**Features:**
- Form-specific component palette (inputs, selects, checkboxes, etc.)
- Validation rule editor
- Form layout helpers
- Field property configuration
- Optimized for form building workflows

**Usage:**
```tsx
import { Designer } from '@object-ui/designer';

function App() {
  return (
    <Designer 
      mode="form"
      initialSchema={{
        type: 'div',
        className: 'w-full max-w-2xl mx-auto p-8',
        body: []
      }}
      onSchemaChange={(schema) => console.log(schema)}
    />
  );
}
```

Or use the dedicated component:
```tsx
import { FormDesigner } from '@object-ui/designer';

function App() {
  return <FormDesigner />;
}
```

**Available Components:**
- **Form Fields**: input, textarea, select, checkbox, switch, label
- **Actions**: button
- **Layout**: div, card, stack, grid, separator
- **Display**: text, span, badge

### 2. Layout Designer (`mode="layout"`)

A specialized designer for creating page layouts and structures.

**Features:**
- Layout-specific component palette
- Grid and flexbox layout helpers
- Responsive breakpoint controls
- Layout templates (planned)
- Optimized for page structure design

**Usage:**
```tsx
import { Designer } from '@object-ui/designer';

function App() {
  return (
    <Designer 
      mode="layout"
      initialSchema={{
        type: 'div',
        className: 'h-full w-full flex flex-col',
        body: []
      }}
      onSchemaChange={(schema) => console.log(schema)}
    />
  );
}
```

Or use the dedicated component:
```tsx
import { LayoutDesigner } from '@object-ui/designer';

function App() {
  return <LayoutDesigner />;
}
```

**Available Components:**
- **Containers**: div, card, grid
- **Layout**: stack, separator
- **Navigation**: tabs, breadcrumb, menubar, pagination
- **Content**: text, span, image, button
- **Data Display**: table, badge, avatar

### 3. General Designer (`mode="general"` or default)

The full-featured, general-purpose designer with all components and capabilities.

**Features:**
- Complete component library
- All advanced features (resize, undo/redo, etc.)
- Maximum flexibility
- Suitable for any UI design task

**Usage:**
```tsx
import { Designer } from '@object-ui/designer';

function App() {
  return (
    <Designer 
      mode="general"  // or omit for default
      initialSchema={{ type: 'div', body: [] }}
    />
  );
}
```

Or use the dedicated component:
```tsx
import { GeneralDesigner } from '@object-ui/designer';

function App() {
  return <GeneralDesigner />;
}
```

**Available Components:**
All components from the component registry, including:
- Layout, Form, Data Display, Feedback, Overlay, Navigation categories

## 🔄 Migration Guide

### From Previous Version

The default `Designer` component now supports a `mode` prop but remains backward compatible:

```tsx
// Old way (still works)
import { Designer } from '@object-ui/designer';
<Designer initialSchema={schema} />

// New way - explicit general mode
<Designer mode="general" initialSchema={schema} />

// New - specialized modes
<Designer mode="form" initialSchema={schema} />
<Designer mode="layout" initialSchema={schema} />
```

All existing code will continue to work without changes. The default mode is `'general'`, which provides the same functionality as before.

## 🎨 Customization

### Using Filtered Component Palette

You can also use the `FilteredComponentPalette` component directly for custom designer layouts:

```tsx
import { 
  DesignerProvider,
  Canvas,
  FilteredComponentPalette,
  PropertyPanel 
} from '@object-ui/designer';

function CustomDesigner() {
  return (
    <DesignerProvider>
      <div className="flex h-screen">
        <FilteredComponentPalette 
          allowedComponents={['input', 'button', 'text']}
          categories={{
            'Form': ['input', 'button'],
            'Display': ['text']
          }}
          title="My Custom Components"
        />
        <Canvas />
        <PropertyPanel />
      </div>
    </DesignerProvider>
  );
}
```

## 📋 Component Comparison

| Feature | Form Designer | Layout Designer | General Designer |
|---------|--------------|----------------|------------------|
| Form Components | ✅ Primary | ⚠️ Limited | ✅ Full |
| Layout Components | ⚠️ Limited | ✅ Primary | ✅ Full |
| Navigation | ❌ None | ✅ Full | ✅ Full |
| Data Display | ⚠️ Basic | ⚠️ Basic | ✅ Full |
| Feedback/Overlay | ❌ None | ❌ None | ✅ Full |
| Component Count | ~15 | ~15 | ~30+ |
| Complexity | Low | Medium | High |
| Use Case | Forms Only | Page Layouts | Everything |

## 🚀 Best Practices

1. **Choose the Right Mode**: Use specialized designers when you know your use case:
   - Building a form? Use `mode="form"`
   - Designing a page structure? Use `mode="layout"`
   - Need everything? Use `mode="general"` or omit the prop

2. **Start Specialized, Upgrade Later**: Begin with a specialized designer for focused work, then export the schema and open it in the general designer if you need additional components.

3. **Component Filtering**: The specialized designers limit available components to reduce cognitive load and improve the design experience for specific tasks.

## 📝 Examples

See the `examples/` directory for complete working examples:
- `examples/form-designer/` - Form builder example
- `examples/layout-designer/` - Page layout example
- `examples/general-designer/` - General purpose example

## 🔧 TypeScript Support

All designer modes are fully typed:

```typescript
import type { DesignerMode, FormDesignerConfig, LayoutDesignerConfig } from '@object-ui/designer';

const mode: DesignerMode = 'form'; // 'form' | 'layout' | 'general'

// Form-specific config
const formConfig: FormDesignerConfig = {
  mode: 'form',
  showValidationRules: true,
  fieldTypes: ['input', 'select']
};

// Layout-specific config
const layoutConfig: LayoutDesignerConfig = {
  mode: 'layout',
  showBreakpointControls: true,
  layoutTypes: ['grid', 'flex']
};
```

## 📚 Related Documentation

- [Main README](./README.md) - Full designer documentation
- [Drag and Resize Guide](./DRAG_AND_RESIZE_GUIDE.md) - Interaction details
- [Implementation Guide](./IMPLEMENTATION.zh-CN.md) - Architecture overview
