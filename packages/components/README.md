# @object-ui/components

Standard UI component library for Object UI, built with Shadcn UI + Tailwind CSS.

## Features

- 🎨 **Tailwind Native** - Built entirely with Tailwind CSS utility classes
- 🧩 **Shadcn UI** - Based on Radix UI primitives for accessibility
- 📦 **50+ Components** - Complete set of UI components
- ♿ **Accessible** - WCAG compliant components
- 🎯 **Type-Safe** - Full TypeScript support
- 🔌 **Extensible** - Easy to customize and extend

## Installation

```bash
npm install @object-ui/components @object-ui/react @object-ui/core
```

**Peer Dependencies:**
- `react` ^18.0.0 || ^19.0.0
- `react-dom` ^18.0.0 || ^19.0.0
- `tailwindcss` ^3.0.0

**Additional Dependencies:**

All UI component dependencies are externalized to keep the bundle size small (~43KB gzipped). You'll need to install them separately:

```bash
npm install @radix-ui/react-accordion @radix-ui/react-alert-dialog @radix-ui/react-checkbox \
  @radix-ui/react-dialog @radix-ui/react-dropdown-menu @radix-ui/react-label @radix-ui/react-popover \
  @radix-ui/react-select @radix-ui/react-separator @radix-ui/react-slider @radix-ui/react-switch \
  @radix-ui/react-tabs @radix-ui/react-toast lucide-react class-variance-authority clsx tailwind-merge
```

Or if you're only using specific components, install only what you need.

## Setup

### 1. Configure Tailwind

Add to your `tailwind.config.js`:

```js
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    './node_modules/@object-ui/components/**/*.{js,ts,jsx,tsx}'
  ],
  // ... your config
}
```

### 2. Import Styles

Add to your main CSS file:

```css
@import '@object-ui/components/dist/style.css';
```

### 3. Register Components

```tsx
import { registerDefaultRenderers } from '@object-ui/components'

registerDefaultRenderers()
```

## Usage

### With SchemaRenderer

```tsx
import { SchemaRenderer } from '@object-ui/react'
import { registerDefaultRenderers } from '@object-ui/components'

registerDefaultRenderers()

const schema = {
  type: 'card',
  title: 'Welcome',
  body: {
    type: 'text',
    value: 'Hello from Object UI!'
  }
}

function App() {
  return <SchemaRenderer schema={schema} />
}
```

### Direct Import

You can also import UI components directly:

```tsx
import { Button, Input, Card } from '@object-ui/components'

function MyComponent() {
  return (
    <Card>
      <Input placeholder="Enter text" />
      <Button>Submit</Button>
    </Card>
  )
}
```

## Available Components

### Form Components
- `input` - Text input
- `textarea` - Multi-line text
- `select` - Dropdown select
- `checkbox` - Checkbox
- `radio` - Radio button
- `date-picker` - Date selection
- `switch` - Toggle switch

### Layout Components
- `container` - Container wrapper
- `grid` - Grid layout
- `flex` - Flexbox layout
- `card` - Card container
- `tabs` - Tab navigation
- `accordion` - Collapsible sections

### Data Display
- `table` - Data table
- `list` - List view
- `badge` - Badge label
- `avatar` - User avatar
- `progress` - Progress bar

### Feedback
- `alert` - Alert messages
- `toast` - Toast notifications
- `dialog` - Modal dialog
- `popover` - Popover overlay

### Navigation
- `button` - Button component
- `link` - Link component
- `breadcrumb` - Breadcrumb navigation

## Customization

### Bundle Size Optimization

The package is optimized for tree-shaking and minimal bundle size:

- **Core bundle**: ~43KB gzipped (ESM)
- **Dependencies externalized**: All Radix UI and other dependencies are peer dependencies
- **Tree-shakeable**: Modern bundlers will only include the components you use

**Tips for smaller bundles:**
1. Use modern bundlers (Vite, Webpack 5+, Rollup) that support tree-shaking
2. Import components directly when possible
3. Only install the peer dependencies you need

### Override Styles

All components accept `className` for Tailwind classes:

```json
{
  "type": "button",
  "label": "Click Me",
  "className": "bg-blue-500 hover:bg-blue-700 text-white"
}
```

### Custom Components

Register your own components:

```tsx
import { registerRenderer } from '@object-ui/react'
import { Button } from '@object-ui/components'

function CustomButton(props) {
  return <Button {...props} className="my-custom-style" />
}

registerRenderer('custom-button', CustomButton)
```

## API Reference

See [full documentation](https://objectui.org/api/components) for detailed API reference.

## License

MIT
