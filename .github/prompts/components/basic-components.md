# AI Prompt: Basic Components

## Overview

Basic components are the **primitive building blocks** of the ObjectUI system. They represent fundamental HTML elements like text, images, icons, and dividers - wrapped in schema-driven interfaces.

**Category**: `basic`  
**Examples**: text, image, icon, div, span, separator, html  
**Complexity**: ⭐ Simple  
**Package**: `@object-ui/components/src/renderers/basic/`

## Purpose

Basic components serve as:
1. **Foundational elements** for complex layouts
2. **Content display** primitives (text, images)
3. **Structural elements** (div, span, separator)
4. **Visual decorations** (icons, lines)

## Component List

### Text Component
Display plain or formatted text.

**Schema**:
```json
{
  "type": "text",
  "content": "Hello World",
  "variant": "body" | "heading" | "caption",
  "className": "text-lg font-bold"
}
```

**Implementation**:
```tsx
export function TextRenderer({ schema }: RendererProps<TextSchema>) {
  return (
    <span className={cn(textVariants({ variant: schema.variant }), schema.className)}>
      {schema.content}
    </span>
  );
}

const textVariants = cva('', {
  variants: {
    variant: {
      body: 'text-base',
      heading: 'text-2xl font-bold',
      caption: 'text-sm text-muted-foreground'
    }
  }
});
```

### Image Component
Display images with responsive sizing and loading states.

**Schema**:
```json
{
  "type": "image",
  "src": "https://example.com/image.jpg",
  "alt": "Description",
  "width": 300,
  "height": 200,
  "className": "rounded-lg"
}
```

**Implementation**:
```tsx
export function ImageRenderer({ schema }: RendererProps<ImageSchema>) {
  return (
    <img
      src={schema.src}
      alt={schema.alt || ''}
      width={schema.width}
      height={schema.height}
      loading="lazy"
      className={cn('object-cover', schema.className)}
    />
  );
}
```

### Icon Component
Display icons using Lucide React.

**Schema**:
```json
{
  "type": "icon",
  "name": "Check",
  "size": 24,
  "className": "text-green-500"
}
```

**Implementation**:
```tsx
import * as Icons from 'lucide-react';

export function IconRenderer({ schema }: RendererProps<IconSchema>) {
  const IconComponent = Icons[schema.name as keyof typeof Icons] as any;
  
  if (!IconComponent) {
    console.warn(`Icon not found: ${schema.name}`);
    return null;
  }

  return (
    <IconComponent
      size={schema.size || 24}
      className={schema.className}
    />
  );
}
```

### Div Component
Generic container element.

**Schema**:
```json
{
  "type": "div",
  "className": "p-4 bg-gray-100 rounded",
  "children": [...]
}
```

**Implementation**:
```tsx
export function DivRenderer({ schema }: RendererProps<DivSchema>) {
  return (
    <div className={schema.className}>
      {schema.children?.map((child, index) => (
        <SchemaRenderer key={child.id || index} schema={child} />
      ))}
    </div>
  );
}
```

### Separator Component
Visual divider line.

**Schema**:
```json
{
  "type": "separator",
  "orientation": "horizontal" | "vertical",
  "className": "my-4"
}
```

**Implementation**:
```tsx
import { Separator as ShadcnSeparator } from '@/ui/separator';

export function SeparatorRenderer({ schema }: RendererProps<SeparatorSchema>) {
  return (
    <ShadcnSeparator
      orientation={schema.orientation || 'horizontal'}
      className={schema.className}
    />
  );
}
```

## Development Guidelines

### Keep It Simple
Basic components should be straightforward wrappers around HTML elements:

```tsx
// ✅ Good: Simple wrapper
export function TextRenderer({ schema }: RendererProps<TextSchema>) {
  return <span className={schema.className}>{schema.content}</span>;
}

// ❌ Bad: Over-engineered
export function TextRenderer({ schema }: RendererProps<TextSchema>) {
  const [formatted, setFormatted] = useState('');
  useEffect(() => {
    // Complex formatting logic...
  }, [schema.content]);
  return <span>{formatted}</span>;
}
```

### No Business Logic
Basic components display data, they don't transform it:

```tsx
// ❌ Bad: Business logic
export function TextRenderer({ schema }: RendererProps<TextSchema>) {
  const formatted = formatCurrency(schema.content);  // Don't do this
  return <span>{formatted}</span>;
}

// ✅ Good: Display as-is
export function TextRenderer({ schema }: RendererProps<TextSchema>) {
  return <span>{schema.content}</span>;
}
```

### Accessibility

```tsx
// ✅ Good: Proper alt text
<img src={schema.src} alt={schema.alt || 'Image'} />

// ❌ Bad: Missing alt
<img src={schema.src} />

// ✅ Good: Semantic HTML
<h1 className={schema.className}>{schema.content}</h1>

// ❌ Bad: Div soup
<div className="text-2xl font-bold">{schema.content}</div>
```

## Testing

```tsx
describe('TextRenderer', () => {
  it('renders text content', () => {
    const schema = { type: 'text', content: 'Hello' };
    render(<SchemaRenderer schema={schema} />);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });

  it('applies className', () => {
    const schema = { type: 'text', content: 'Hello', className: 'font-bold' };
    render(<SchemaRenderer schema={schema} />);
    expect(screen.getByText('Hello')).toHaveClass('font-bold');
  });
});
```

## Common Patterns

### With Expression Support
```tsx
export function TextRenderer({ schema }: RendererProps<TextSchema>) {
  const content = useExpression(schema.content, {}, '');
  return <span className={schema.className}>{content}</span>;
}
```

### With Children
```tsx
export function DivRenderer({ schema }: RendererProps<DivSchema>) {
  return (
    <div className={schema.className}>
      {schema.children?.map((child, i) => (
        <SchemaRenderer key={child.id || i} schema={child} />
      ))}
    </div>
  );
}
```

## Checklist

- [ ] Simple, no complex logic
- [ ] Accessible (alt text, ARIA)
- [ ] Supports className override
- [ ] Handles missing data gracefully
- [ ] Tests added
- [ ] Registered in index.ts

---

**Principle**: Keep it **simple**, **semantic**, and **accessible**.
