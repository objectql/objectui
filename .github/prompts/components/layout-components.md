# AI Prompt: Layout Components

## Overview

Layout components control the **spatial organization** of UI elements. They implement responsive grid systems, flexbox layouts, and container structures using Tailwind's utility classes.

**Category**: `layout`  
**Examples**: grid, flex, stack, container, card, section  
**Complexity**: ⭐⭐ Moderate  
**Package**: `@object-ui/components/src/renderers/layout/`

## Purpose

Layout components:
1. **Organize content** spatially (grids, flex containers)
2. **Create responsive layouts** (mobile, tablet, desktop)
3. **Group related elements** (cards, sections)
4. **Control spacing** (gaps, padding, margins)

## Core Layout Components

### Grid Component
CSS Grid layout with responsive columns.

**Schema**:
```json
{
  "type": "grid",
  "columns": 3,
  "gap": 4,
  "items": [
    { "type": "card", "title": "Item 1" },
    { "type": "card", "title": "Item 2" }
  ]
}
```

**Responsive Schema**:
```json
{
  "type": "grid",
  "columns": { "sm": 1, "md": 2, "lg": 3 },
  "gap": 4,
  "items": [...]
}
```

**Implementation**:
```tsx
export function GridRenderer({ schema }: RendererProps<GridSchema>) {
  const gridClasses = cn(
    'grid',
    getGridColumns(schema.columns),
    getGap(schema.gap),
    schema.className
  );

  return (
    <div className={gridClasses}>
      {schema.items?.map((item, index) => (
        <SchemaRenderer key={item.id || index} schema={item} />
      ))}
    </div>
  );
}

function getGridColumns(columns: GridSchema['columns']): string {
  if (typeof columns === 'number') {
    return `grid-cols-${columns}`;
  }
  
  const classes: string[] = [];
  if (columns?.sm) classes.push(`grid-cols-${columns.sm}`);
  if (columns?.md) classes.push(`md:grid-cols-${columns.md}`);
  if (columns?.lg) classes.push(`lg:grid-cols-${columns.lg}`);
  return classes.join(' ');
}

function getGap(gap?: number | string): string {
  if (typeof gap === 'number') return `gap-${gap}`;
  return gap || '';
}
```

### Flex Component
Flexbox layout with direction and alignment controls.

**Schema**:
```json
{
  "type": "flex",
  "direction": "row" | "column",
  "justify": "start" | "center" | "between" | "around",
  "align": "start" | "center" | "end" | "stretch",
  "gap": 4,
  "wrap": true,
  "children": [...]
}
```

**Implementation**:
```tsx
export function FlexRenderer({ schema }: RendererProps<FlexSchema>) {
  const flexClasses = cn(
    'flex',
    getFlexDirection(schema.direction),
    getJustify(schema.justify),
    getAlign(schema.align),
    schema.wrap && 'flex-wrap',
    getGap(schema.gap),
    schema.className
  );

  return (
    <div className={flexClasses}>
      {schema.children?.map((child, index) => (
        <SchemaRenderer key={child.id || index} schema={child} />
      ))}
    </div>
  );
}

function getFlexDirection(direction?: FlexSchema['direction']): string {
  const map = {
    row: 'flex-row',
    column: 'flex-col',
    'row-reverse': 'flex-row-reverse',
    'column-reverse': 'flex-col-reverse'
  };
  return map[direction || 'row'];
}

function getJustify(justify?: FlexSchema['justify']): string {
  const map = {
    start: 'justify-start',
    center: 'justify-center',
    end: 'justify-end',
    between: 'justify-between',
    around: 'justify-around',
    evenly: 'justify-evenly'
  };
  return map[justify || 'start'];
}

function getAlign(align?: FlexSchema['align']): string {
  const map = {
    start: 'items-start',
    center: 'items-center',
    end: 'items-end',
    stretch: 'items-stretch',
    baseline: 'items-baseline'
  };
  return map[align || 'start'];
}
```

### Stack Component
Vertical or horizontal stack with consistent spacing.

**Schema**:
```json
{
  "type": "stack",
  "direction": "vertical" | "horizontal",
  "spacing": 4,
  "children": [...]
}
```

**Implementation**:
```tsx
export function StackRenderer({ schema }: RendererProps<StackSchema>) {
  const isVertical = schema.direction !== 'horizontal';
  
  const stackClasses = cn(
    'flex',
    isVertical ? 'flex-col' : 'flex-row',
    getGap(schema.spacing),
    schema.className
  );

  return (
    <div className={stackClasses}>
      {schema.children?.map((child, index) => (
        <SchemaRenderer key={child.id || index} schema={child} />
      ))}
    </div>
  );
}
```

### Container Component
Centered container with max-width.

**Schema**:
```json
{
  "type": "container",
  "maxWidth": "lg" | "xl" | "2xl",
  "padding": 4,
  "children": [...]
}
```

**Implementation**:
```tsx
export function ContainerRenderer({ schema }: RendererProps<ContainerSchema>) {
  const containerClasses = cn(
    'container mx-auto',
    getMaxWidth(schema.maxWidth),
    getPadding(schema.padding),
    schema.className
  );

  return (
    <div className={containerClasses}>
      {schema.children?.map((child, index) => (
        <SchemaRenderer key={child.id || index} schema={child} />
      ))}
    </div>
  );
}

function getMaxWidth(maxWidth?: ContainerSchema['maxWidth']): string {
  const map = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '4xl': 'max-w-4xl',
    '6xl': 'max-w-6xl',
    full: 'max-w-full'
  };
  return map[maxWidth || 'lg'];
}
```

### Card Component
Card container with header, body, and footer.

**Schema**:
```json
{
  "type": "card",
  "title": "Card Title",
  "description": "Card description",
  "body": { "type": "div", "children": [...] },
  "footer": { "type": "div", "children": [...] }
}
```

**Implementation**:
```tsx
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/ui/card';

export function CardRenderer({ schema }: RendererProps<CardSchema>) {
  return (
    <Card className={schema.className}>
      {(schema.title || schema.description) && (
        <CardHeader>
          {schema.title && <CardTitle>{schema.title}</CardTitle>}
          {schema.description && <CardDescription>{schema.description}</CardDescription>}
        </CardHeader>
      )}
      
      {schema.body && (
        <CardContent>
          <SchemaRenderer schema={schema.body} />
        </CardContent>
      )}
      
      {schema.footer && (
        <CardFooter>
          <SchemaRenderer schema={schema.footer} />
        </CardFooter>
      )}
    </Card>
  );
}
```

## Development Guidelines

### Responsive Design

Always support responsive breakpoints:

```tsx
// ✅ Good: Responsive grid
{
  "columns": { "sm": 1, "md": 2, "lg": 3 }
}

// ✅ Good: Responsive gap
{
  "gap": { "sm": 2, "md": 4, "lg": 6 }
}
```

### Flexible Spacing

Use Tailwind spacing scale (0-96):

```tsx
// ✅ Good: Tailwind scale
const gap = schema.gap || 4;  // 1rem
const padding = schema.padding || 4;

// ❌ Bad: Pixel values
const gap = schema.gap || '16px';
```

### Nested Layouts

Support nested layout components:

```tsx
{
  "type": "grid",
  "columns": 2,
  "items": [
    {
      "type": "flex",
      "direction": "column",
      "children": [...]
    }
  ]
}
```

## Testing

```tsx
describe('GridRenderer', () => {
  it('renders grid with correct columns', () => {
    const schema = {
      type: 'grid',
      columns: 3,
      items: [
        { type: 'text', content: 'Item 1' },
        { type: 'text', content: 'Item 2' }
      ]
    };

    render(<SchemaRenderer schema={schema} />);
    
    const grid = screen.getByText('Item 1').parentElement;
    expect(grid).toHaveClass('grid', 'grid-cols-3');
  });

  it('renders responsive grid', () => {
    const schema = {
      type: 'grid',
      columns: { sm: 1, md: 2, lg: 3 },
      items: [...]
    };

    render(<SchemaRenderer schema={schema} />);
    
    const grid = screen.getByText('Item 1').parentElement;
    expect(grid).toHaveClass('grid-cols-1', 'md:grid-cols-2', 'lg:grid-cols-3');
  });
});
```

## Common Patterns

### Auto-fit Grid

```json
{
  "type": "grid",
  "className": "grid-cols-[repeat(auto-fit,minmax(250px,1fr))]",
  "gap": 4,
  "items": [...]
}
```

### Centered Content

```json
{
  "type": "flex",
  "justify": "center",
  "align": "center",
  "className": "min-h-screen",
  "children": [...]
}
```

### Sidebar Layout

```json
{
  "type": "grid",
  "className": "grid-cols-[250px_1fr]",
  "gap": 0,
  "items": [
    { "type": "div", "className": "bg-gray-100", "children": [...] },
    { "type": "div", "children": [...] }
  ]
}
```

## Performance

### Avoid Deep Nesting

```tsx
// ❌ Bad: Too many nested layouts
<Grid>
  <Flex>
    <Stack>
      <Container>
        <Flex>
          <Content />
        </Flex>
      </Container>
    </Stack>
  </Flex>
</Grid>

// ✅ Good: Flatten when possible
<Grid>
  <Content />
</Grid>
```

## Checklist

- [ ] Responsive breakpoints supported
- [ ] Tailwind spacing scale used
- [ ] Supports nested layouts
- [ ] Tests added
- [ ] Accessible structure
- [ ] Performance optimized

---

**Principle**: Build **flexible**, **responsive** layouts with **Tailwind utilities**.
