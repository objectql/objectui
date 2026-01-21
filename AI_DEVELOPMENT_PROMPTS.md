# AI Development Prompts for ObjectUI Core Components

> 📅 **Last Updated**: January 21, 2026  
> 🎯 **Purpose**: AI prompts to guide development of ObjectUI components with ObjectStack integration  
> 👥 **Maintained by**: ObjectStack Team

---

## 📋 Table of Contents

1. [How to Use These Prompts](#how-to-use-these-prompts)
2. [Basic Components](#basic-components)
3. [Form Components](#form-components)
4. [Layout Components](#layout-components)
5. [Data Display Components](#data-display-components)
6. [Complex Components](#complex-components)
7. [Navigation Components](#navigation-components)
8. [Overlay Components](#overlay-components)
9. [Feedback Components](#feedback-components)
10. [Disclosure Components](#disclosure-components)
11. [Plugin Components](#plugin-components)

---

## How to Use These Prompts

These prompts are designed to guide AI-assisted development of ObjectUI components. Each prompt includes:

- **Component Purpose**: Clear description of what the component does
- **Key Requirements**: Critical features and behaviors
- **ObjectStack Integration**: How to integrate with ObjectStack client
- **Implementation Guidelines**: Technical approach and best practices
- **Testing Requirements**: What to test and validate

### General Guidelines for All Components

```
When developing any ObjectUI component, always:

1. **Extend from UIComponent** (@objectstack/spec)
2. **Use Tailwind CSS** for all styling (no inline styles)
3. **Implement with TypeScript** (strict mode)
4. **Support className prop** for Tailwind customization
5. **Use class-variance-authority (cva)** for variants
6. **Implement accessibility** (WCAG 2.1 AA)
7. **Support dynamic expressions** (visibleOn, disabledOn, etc.)
8. **Include comprehensive tests** (85%+ coverage)
9. **Follow Shadcn/UI patterns** for consistency
10. **Document with JSDoc comments** and examples
```

---

## Basic Components

### 1. Text Component

**AI Development Prompt:**

```
Create a Text component for ObjectUI that renders text content with Tailwind styling.

REQUIREMENTS:
- Type: 'text'
- Extends BaseSchema from @object-ui/types
- Supports HTML semantic tags (p, span, h1-h6, label, etc.)
- Variants: body, caption, label, heading (1-6)
- Supports text formatting: bold, italic, underline, strikethrough
- Text colors via Tailwind classes
- Truncation support with ellipsis
- Alignment: left, center, right, justify

PROPS:
- content: string (required) - Text to display
- tag?: string - HTML tag to use (default: 'p')
- variant?: TextVariant - Text style variant
- color?: string - Tailwind color class
- truncate?: boolean - Enable text truncation
- align?: 'left' | 'center' | 'right' | 'justify'
- className?: string - Additional Tailwind classes

IMPLEMENTATION:
- Use cva() for variant management
- Support expression evaluation for content (${...})
- Handle multiline text with proper whitespace
- Ensure accessibility with proper semantic HTML

EXAMPLE SCHEMA:
{
  "type": "text",
  "content": "Welcome to ObjectUI",
  "variant": "heading-1",
  "className": "text-blue-600 mb-4"
}

TEST CASES:
- Renders correct HTML tag
- Applies variant styles correctly
- Evaluates expressions in content
- Truncates long text when enabled
- Applies custom className
```

### 2. Icon Component

**AI Development Prompt:**

```
Create an Icon component for ObjectUI using Lucide React icons with Tailwind styling.

REQUIREMENTS:
- Type: 'icon'
- Extends BaseSchema from @object-ui/types
- Uses Lucide React icon library
- Size variants: xs, sm, md, lg, xl (16px to 48px)
- Color support via Tailwind classes
- Rotation support (0, 90, 180, 270 degrees)
- Accessibility with aria-label

PROPS:
- name: string (required) - Lucide icon name (e.g., 'user', 'settings')
- size?: IconSize - Icon size variant
- color?: string - Tailwind color class
- rotation?: 0 | 90 | 180 | 270 - Icon rotation
- className?: string - Additional Tailwind classes
- ariaLabel?: string - Accessibility label

IMPLEMENTATION:
- Dynamic icon loading from Lucide React
- Use cva() for size variants
- Transform rotation with Tailwind classes
- Fallback icon for invalid names
- Optimize bundle size with tree-shaking

EXAMPLE SCHEMA:
{
  "type": "icon",
  "name": "user",
  "size": "md",
  "color": "text-gray-600",
  "className": "mr-2"
}

TEST CASES:
- Loads correct Lucide icon
- Applies size correctly
- Rotates icon as specified
- Shows fallback for invalid icon names
- Accessibility attributes present
```

### 3. Image Component

**AI Development Prompt:**

```
Create an Image component for ObjectUI with fallback, lazy loading, and responsive support.

REQUIREMENTS:
- Type: 'image'
- Extends BaseSchema from @object-ui/types
- Lazy loading support
- Fallback image or placeholder
- Responsive sizing
- Object-fit options (cover, contain, fill, none, scale-down)
- Rounded corners support
- Loading state indicator

PROPS:
- src: string (required) - Image URL
- alt: string (required) - Alt text for accessibility
- width?: string | number - Image width
- height?: string | number - Image height
- fallback?: string - Fallback image URL
- objectFit?: ObjectFit - How image fits container
- rounded?: boolean | string - Tailwind rounded class
- lazy?: boolean - Enable lazy loading (default: true)
- className?: string - Additional Tailwind classes

IMPLEMENTATION:
- Use native loading="lazy" attribute
- Handle image load errors with fallback
- Show skeleton loader while loading
- Support expression evaluation for src
- Optimize with Next.js Image if available

EXAMPLE SCHEMA:
{
  "type": "image",
  "src": "${user.avatar}",
  "alt": "User avatar",
  "width": 64,
  "height": 64,
  "fallback": "/default-avatar.png",
  "rounded": "rounded-full",
  "className": "border-2 border-gray-200"
}

TEST CASES:
- Loads image correctly
- Shows fallback on error
- Lazy loads when enabled
- Applies correct object-fit
- Accessible with alt text
- Handles expression in src
```

---

## Form Components

### 1. Input Component

**AI Development Prompt:**

```
Create an Input component for ObjectUI with validation, Shadcn/UI styling, and ObjectStack integration.

REQUIREMENTS:
- Type: 'input'
- Extends BaseSchema from @object-ui/types
- Based on Shadcn/UI Input component
- Input types: text, email, password, number, tel, url, search
- Validation support (required, pattern, min, max, minLength, maxLength)
- Disabled and readonly states
- Prefix/suffix support (icons, text)
- Clear button for text inputs
- Error state with validation messages

PROPS:
- name: string (required) - Field name
- label?: string - Field label
- type?: InputType - Input type (default: 'text')
- placeholder?: string - Placeholder text
- value?: any - Controlled value
- defaultValue?: any - Uncontrolled default value
- required?: boolean - Required field
- disabled?: boolean - Disabled state
- readonly?: boolean - Readonly state
- validation?: ValidationRules - Validation rules
- prefix?: SchemaNode - Prefix element (icon, text)
- suffix?: SchemaNode - Suffix element
- clearable?: boolean - Show clear button
- error?: string - Error message
- className?: string - Additional Tailwind classes

IMPLEMENTATION:
- Use Shadcn/UI Input primitives
- Integrate with form context for validation
- Support controlled and uncontrolled modes
- Evaluate expressions in validation rules
- Handle change events and emit to parent form
- Apply error styles automatically

EXAMPLE SCHEMA:
{
  "type": "input",
  "name": "email",
  "label": "Email Address",
  "type": "email",
  "placeholder": "you@example.com",
  "required": true,
  "validation": {
    "pattern": "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$",
    "message": "Please enter a valid email"
  },
  "prefix": { "type": "icon", "name": "mail" }
}

TEST CASES:
- Validates required fields
- Validates pattern matching
- Shows error messages
- Disabled/readonly states work
- Clear button clears value
- Prefix/suffix render correctly
- Integrates with form context
```

### 2. Select Component

**AI Development Prompt:**

```
Create a Select component for ObjectUI using Shadcn/UI Select with ObjectStack data binding.

REQUIREMENTS:
- Type: 'select'
- Extends BaseSchema from @object-ui/types
- Based on Shadcn/UI Select (Radix UI)
- Single and multiple selection modes
- Option groups support
- Search/filter options
- Custom option rendering
- Load options from ObjectStack API
- Validation support

PROPS:
- name: string (required) - Field name
- label?: string - Field label
- options?: SelectOption[] - Static options
- dataSource?: DataSource - ObjectStack data source
- resource?: string - Resource name for dynamic options
- valueField?: string - Field to use as value (default: 'id')
- labelField?: string - Field to use as label (default: 'name')
- multiple?: boolean - Multi-select mode
- searchable?: boolean - Enable option search
- placeholder?: string - Placeholder text
- disabled?: boolean - Disabled state
- required?: boolean - Required field
- className?: string - Additional Tailwind classes

IMPLEMENTATION:
- Use Shadcn/UI Select component
- Fetch options from ObjectStack if dataSource provided
- Support static options or dynamic loading
- Implement search with debounce
- Handle multi-select with checkboxes
- Show loading state while fetching
- Cache fetched options

EXAMPLE SCHEMA:
{
  "type": "select",
  "name": "country",
  "label": "Country",
  "dataSource": "${objectStackAdapter}",
  "resource": "countries",
  "valueField": "code",
  "labelField": "name",
  "searchable": true,
  "required": true
}

TEST CASES:
- Loads static options
- Fetches options from ObjectStack
- Search filters options correctly
- Multi-select works
- Validation works
- Disabled state works
- Shows loading state
```

### 3. Checkbox Component

**AI Development Prompt:**

```
Create a Checkbox component for ObjectUI using Shadcn/UI Checkbox with form integration.

REQUIREMENTS:
- Type: 'checkbox'
- Extends BaseSchema from @object-ui/types
- Based on Shadcn/UI Checkbox (Radix UI)
- Controlled and uncontrolled modes
- Indeterminate state support
- Label click toggles checkbox
- Validation support
- Disabled state

PROPS:
- name: string (required) - Field name
- label?: string - Checkbox label
- checked?: boolean - Controlled checked state
- defaultChecked?: boolean - Uncontrolled default
- indeterminate?: boolean - Indeterminate state
- disabled?: boolean - Disabled state
- required?: boolean - Required field
- className?: string - Additional Tailwind classes

IMPLEMENTATION:
- Use Shadcn/UI Checkbox component
- Integrate with form context
- Handle indeterminate state
- Emit change events to form
- Support label click interaction
- Accessibility with proper ARIA

EXAMPLE SCHEMA:
{
  "type": "checkbox",
  "name": "terms",
  "label": "I agree to the terms and conditions",
  "required": true
}

TEST CASES:
- Toggles on click
- Label click works
- Indeterminate state displays
- Disabled state works
- Form integration works
- Required validation works
```

### 4. Form Component

**AI Development Prompt:**

```
Create a Form component for ObjectUI that handles submission, validation, and ObjectStack integration.

REQUIREMENTS:
- Type: 'form'
- Extends BaseSchema from @object-ui/types
- Form context provider for child inputs
- Validation orchestration
- ObjectStack CRUD integration
- Submit/cancel actions
- Loading states
- Error handling and display

PROPS:
- name?: string - Form name
- title?: string - Form title
- dataSource?: DataSource - ObjectStack data source
- resource?: string - Resource for CRUD operations
- initialValues?: Record<string, any> - Initial form values
- mode?: 'create' | 'edit' - Form mode
- recordId?: string - Record ID for edit mode
- onSubmit?: ActionSchema - Submit action
- onCancel?: ActionSchema - Cancel action
- body: SchemaNode[] (required) - Form fields
- className?: string - Additional Tailwind classes

IMPLEMENTATION:
- Use React Hook Form for form state
- Create form context for child components
- Load data from ObjectStack in edit mode
- Validate on submit with aggregated rules
- Submit to ObjectStack (create or update)
- Show loading spinner during submission
- Display validation errors inline
- Support optimistic updates

EXAMPLE SCHEMA:
{
  "type": "form",
  "title": "Create User",
  "dataSource": "${objectStackAdapter}",
  "resource": "users",
  "mode": "create",
  "body": [
    { "type": "input", "name": "name", "label": "Name", "required": true },
    { "type": "input", "name": "email", "label": "Email", "type": "email", "required": true },
    { "type": "select", "name": "role", "label": "Role", "options": [...] }
  ],
  "onSubmit": { "type": "toast", "message": "User created successfully" }
}

TEST CASES:
- Loads initial values in edit mode
- Validates all fields on submit
- Creates record via ObjectStack
- Updates record via ObjectStack
- Shows validation errors
- Handles submission errors
- Optimistic updates work
- Cancel action works
```

---

## Layout Components

### 1. Grid Component

**AI Development Prompt:**

```
Create a Grid component for ObjectUI using CSS Grid with responsive breakpoints.

REQUIREMENTS:
- Type: 'grid'
- Extends BaseSchema from @object-ui/types
- CSS Grid layout
- Responsive columns (1-12)
- Gap/spacing control
- Alignment options
- Auto-fit/auto-fill support

PROPS:
- columns?: number | ResponsiveColumns - Column count (1-12)
- gap?: number | string - Grid gap (Tailwind spacing)
- alignItems?: AlignItems - Vertical alignment
- justifyItems?: JustifyItems - Horizontal alignment
- autoFit?: boolean - Auto-fit columns
- minColumnWidth?: string - Min column width for auto-fit
- children: SchemaNode[] (required) - Grid items
- className?: string - Additional Tailwind classes

IMPLEMENTATION:
- Use Tailwind grid utilities
- Support responsive columns object
- Handle auto-fit with grid-template-columns
- Default to grid-cols-1 on mobile
- Use cva() for variants

EXAMPLE SCHEMA:
{
  "type": "grid",
  "columns": { "sm": 1, "md": 2, "lg": 3 },
  "gap": 4,
  "children": [
    { "type": "card", "title": "Card 1" },
    { "type": "card", "title": "Card 2" },
    { "type": "card", "title": "Card 3" }
  ]
}

TEST CASES:
- Applies correct grid columns
- Responsive columns work
- Gap spacing correct
- Auto-fit works
- Alignment options work
```

### 2. Card Component

**AI Development Prompt:**

```
Create a Card component for ObjectUI using Shadcn/UI Card with variants.

REQUIREMENTS:
- Type: 'card'
- Extends BaseSchema from @object-ui/types
- Based on Shadcn/UI Card
- Header, body, footer sections
- Variants: default, outlined, elevated
- Clickable cards with hover effects
- Image support

PROPS:
- title?: string - Card title
- description?: string - Card description
- image?: string - Card image URL
- variant?: CardVariant - Card style variant
- clickable?: boolean - Enable hover/click effects
- onClick?: ActionSchema - Click action
- header?: SchemaNode - Custom header
- body?: SchemaNode | SchemaNode[] - Card body content
- footer?: SchemaNode - Card footer
- className?: string - Additional Tailwind classes

IMPLEMENTATION:
- Use Shadcn/UI Card primitives
- Use cva() for variants
- Add hover effects for clickable cards
- Support custom header/footer
- Handle click actions
- Optimize image rendering

EXAMPLE SCHEMA:
{
  "type": "card",
  "title": "Product Name",
  "description": "Product description here",
  "image": "/product.jpg",
  "variant": "elevated",
  "clickable": true,
  "onClick": { "type": "navigate", "url": "/product/123" }
}

TEST CASES:
- Renders title and description
- Shows image correctly
- Variant styles apply
- Click action works
- Hover effects work
- Custom header/footer render
```

---

## Data Display Components

### 1. Data Table Component

**AI Development Prompt:**

```
Create a DataTable component for ObjectUI with ObjectStack integration, pagination, sorting, and filtering.

REQUIREMENTS:
- Type: 'data-table'
- Extends BaseSchema from @object-ui/types
- Based on TanStack Table
- ObjectStack data source integration
- Server-side pagination
- Server-side sorting
- Server-side filtering
- Row selection
- Row actions
- Column customization
- Responsive design

PROPS:
- dataSource: DataSource (required) - ObjectStack adapter
- resource: string (required) - Resource name
- columns: ColumnDef[] (required) - Column definitions
- pagination?: PaginationConfig - Pagination settings
- sorting?: SortingConfig - Sorting configuration
- filtering?: FilterConfig - Filter configuration
- selectable?: boolean - Enable row selection
- rowActions?: ActionSchema[] - Row action buttons
- searchable?: boolean - Enable global search
- className?: string - Additional Tailwind classes

IMPLEMENTATION:
- Use TanStack Table v8
- Integrate with ObjectStackAdapter
- Convert sorting to ObjectStack format
- Convert filters to FilterNode AST
- Handle pagination state
- Show loading skeleton
- Error state handling
- Optimistic updates for actions
- Export to CSV/Excel

EXAMPLE SCHEMA:
{
  "type": "data-table",
  "dataSource": "${objectStackAdapter}",
  "resource": "users",
  "columns": [
    { "accessorKey": "name", "header": "Name", "sortable": true },
    { "accessorKey": "email", "header": "Email" },
    { "accessorKey": "role", "header": "Role", "filterable": true }
  ],
  "pagination": { "pageSize": 20, "showSizeChanger": true },
  "selectable": true,
  "searchable": true,
  "rowActions": [
    { "type": "button", "label": "Edit", "onClick": { "type": "dialog", "form": "edit-user" } },
    { "type": "button", "label": "Delete", "onClick": { "type": "confirm-delete" } }
  ]
}

TEST CASES:
- Fetches data from ObjectStack
- Pagination works (client & server)
- Sorting works
- Filtering works
- Search works
- Row selection works
- Row actions execute
- Loading states show
- Error handling works
- Export works
```

### 2. Badge Component

**AI Development Prompt:**

```
Create a Badge component for ObjectUI using Shadcn/UI Badge with variants and icons.

REQUIREMENTS:
- Type: 'badge'
- Extends BaseSchema from @object-ui/types
- Based on Shadcn/UI Badge
- Variants: default, secondary, destructive, outline, success, warning
- Size variants: sm, md, lg
- Icon support (prefix/suffix)
- Dot indicator option
- Removable badges

PROPS:
- label: string (required) - Badge text
- variant?: BadgeVariant - Badge style
- size?: BadgeSize - Badge size
- icon?: string - Icon name (Lucide)
- iconPosition?: 'prefix' | 'suffix' - Icon position
- dot?: boolean - Show dot indicator
- removable?: boolean - Show remove button
- onRemove?: ActionSchema - Remove action
- className?: string - Additional Tailwind classes

IMPLEMENTATION:
- Use Shadcn/UI Badge component
- Use cva() for variants and sizes
- Integrate Lucide icons
- Handle remove action
- Support dot indicator variant

EXAMPLE SCHEMA:
{
  "type": "badge",
  "label": "Active",
  "variant": "success",
  "icon": "check-circle",
  "iconPosition": "prefix"
}

TEST CASES:
- Renders with correct variant
- Icon shows in correct position
- Removable badge has remove button
- Remove action works
- Dot indicator shows
- Size variants apply
```

---

## Complex Components

### 1. Filter Builder Component

**AI Development Prompt:**

```
Create a FilterBuilder component for ObjectUI that generates ObjectStack FilterNode AST from UI.

REQUIREMENTS:
- Type: 'filter-builder'
- Extends BaseSchema from @object-ui/types
- Visual filter condition builder
- Support all ObjectStack filter operators
- Field selection from metadata
- Operator selection based on field type
- Value input with type validation
- Group conditions (AND/OR)
- Nested condition groups
- Convert to FilterNode AST
- Filter preview

PROPS:
- dataSource: DataSource (required) - ObjectStack adapter
- resource: string (required) - Resource for field metadata
- filters?: FilterCondition[] - Initial filter conditions
- onChange?: ActionSchema - Filter change callback
- showPreview?: boolean - Show JSON preview
- className?: string - Additional Tailwind classes

FILTER OPERATORS BY TYPE:
- String: =, !=, contains, startswith, endswith, in, notin
- Number: =, !=, >, <, >=, <=, between
- Boolean: =, !=
- Date: =, !=, >, <, >=, <=, between
- Array: in, notin

IMPLEMENTATION:
- Fetch field metadata from ObjectStack
- Build UI for adding conditions
- Support nested groups with AND/OR
- Convert UI state to FilterNode AST format
- Validate values based on field types
- Show filter preview in JSON
- Debounce onChange events
- Support saving/loading filter presets

EXAMPLE SCHEMA:
{
  "type": "filter-builder",
  "dataSource": "${objectStackAdapter}",
  "resource": "users",
  "showPreview": true,
  "onChange": { "type": "update-table-filters" }
}

OUTPUT AST FORMAT:
['and',
  ['status', '=', 'active'],
  ['age', '>=', 18],
  ['role', 'in', ['admin', 'user']]
]

TEST CASES:
- Loads field metadata
- Adds filter conditions
- Removes filter conditions
- Groups conditions with AND/OR
- Converts to correct AST format
- Validates values by field type
- Preview shows correct JSON
- onChange fires with AST
```

### 2. Kanban Component

**AI Development Prompt:**

```
Create a Kanban component for ObjectUI with ObjectStack integration and drag-and-drop.

REQUIREMENTS:
- Type: 'kanban'
- Extends BaseSchema from @object-ui/types
- Drag-and-drop between columns
- ObjectStack data source integration
- Board/column configuration
- Card CRUD operations
- Column-based filtering
- Card customization
- Optimistic updates

PROPS:
- dataSource: DataSource (required) - ObjectStack adapter
- resource: string (required) - Resource name
- columns: KanbanColumn[] (required) - Column definitions
- statusField: string - Field for card status (default: 'status')
- cardRenderer?: ComponentSchema - Custom card template
- cardActions?: ActionSchema[] - Card action buttons
- sortBy?: string - Default sort field
- className?: string - Additional Tailwind classes

IMPLEMENTATION:
- Use dnd-kit for drag-and-drop
- Fetch cards from ObjectStack
- Group cards by status field
- Handle card drag between columns
- Update status via ObjectStack on drop
- Optimistic update during drag
- Rollback on error
- Support custom card rendering
- Show loading skeleton
- Virtualize for large boards

EXAMPLE SCHEMA:
{
  "type": "kanban",
  "dataSource": "${objectStackAdapter}",
  "resource": "tasks",
  "statusField": "status",
  "columns": [
    { "id": "todo", "title": "To Do", "color": "gray" },
    { "id": "in_progress", "title": "In Progress", "color": "blue" },
    { "id": "done", "title": "Done", "color": "green" }
  ],
  "cardRenderer": {
    "type": "card",
    "title": "${title}",
    "description": "${description}",
    "footer": { "type": "badge", "label": "${priority}" }
  }
}

TEST CASES:
- Loads cards from ObjectStack
- Groups cards by status
- Drag-and-drop works
- Updates status on drop
- Optimistic updates work
- Rollback on error works
- Custom card renderer works
- Card actions execute
- Virtualization works
```

---

## Plugin Components

### 1. Chart Component (plugin-charts)

**AI Development Prompt:**

```
Create a Chart component for ObjectUI with ObjectStack data binding and Chart.js integration.

REQUIREMENTS:
- Type: 'chart'
- Extends BaseSchema from @object-ui/types
- Chart.js integration
- Chart types: line, bar, pie, doughnut, radar, polar
- ObjectStack data source binding
- Auto-refresh support
- Responsive sizing
- Legend and tooltips
- Color schemes

PROPS:
- chartType: ChartType (required) - Chart type
- dataSource?: DataSource - ObjectStack adapter
- resource?: string - Resource for dynamic data
- series?: ChartSeries[] - Chart data series
- categories?: string[] - X-axis categories
- title?: string - Chart title
- showLegend?: boolean - Show legend (default: true)
- showGrid?: boolean - Show grid lines (default: true)
- height?: string | number - Chart height
- colors?: string[] - Custom color palette
- refreshInterval?: number - Auto-refresh interval (ms)
- className?: string - Additional Tailwind classes

IMPLEMENTATION:
- Use react-chartjs-2 wrapper
- Fetch data from ObjectStack if dataSource provided
- Map ObjectStack data to chart format
- Support aggregation queries
- Auto-refresh with interval
- Responsive container
- Custom color schemes
- Export chart as image
- Accessibility with ARIA

EXAMPLE SCHEMA:
{
  "type": "chart",
  "chartType": "bar",
  "title": "Monthly Sales",
  "dataSource": "${objectStackAdapter}",
  "resource": "sales",
  "series": [
    {
      "name": "Revenue",
      "dataField": "amount",
      "aggregation": "sum",
      "groupBy": "month"
    }
  ],
  "height": 400,
  "showLegend": true
}

TEST CASES:
- Renders chart correctly
- Fetches data from ObjectStack
- Maps data to chart format
- Aggregation queries work
- Auto-refresh works
- Responsive sizing works
- Legend toggles series
- Export works
```

### 2. ObjectTable Component (plugin-object)

**AI Development Prompt:**

```
Create an ObjectTable component that auto-generates from ObjectStack metadata.

REQUIREMENTS:
- Type: 'object-table'
- Extends BaseSchema from @object-ui/types
- Auto-generate columns from ObjectStack metadata
- Full CRUD operations
- Field type-aware renderers
- Field-level permissions
- Relationship handling (lookups)
- Validation from metadata

PROPS:
- dataSource: DataSource (required) - ObjectStack adapter
- resource: string (required) - Object/resource name
- mode?: 'view' | 'edit' - Table mode
- columnOverrides?: ColumnOverride[] - Override generated columns
- actions?: ActionSchema[] - Custom actions
- className?: string - Additional Tailwind classes

IMPLEMENTATION:
- Fetch object metadata from ObjectStack
- Auto-generate columns from field definitions
- Map field types to column renderers:
  - text → Text cell
  - number → Number cell (formatted)
  - boolean → Checkbox/Badge
  - date → Date cell (formatted)
  - reference → Lookup cell (fetch related)
  - picklist → Badge with options
- Apply field-level permissions (read-only, hidden)
- Generate edit forms from metadata
- Validate using metadata validation rules
- Handle relationships (display related data)

EXAMPLE SCHEMA:
{
  "type": "object-table",
  "dataSource": "${objectStackAdapter}",
  "resource": "contacts",
  "mode": "edit",
  "columnOverrides": [
    { "field": "email", "width": 200 },
    { "field": "created_at", "hidden": true }
  ]
}

TEST CASES:
- Fetches metadata correctly
- Generates columns from metadata
- Maps field types to renderers
- Permissions hide/disable fields
- Edit mode works
- Validation from metadata works
- Relationships display correctly
- Column overrides apply
```

### 3. ObjectForm Component (plugin-object)

**AI Development Prompt:**

```
Create an ObjectForm component that auto-generates from ObjectStack metadata.

REQUIREMENTS:
- Type: 'object-form'
- Extends BaseSchema from @object-ui/types
- Auto-generate fields from ObjectStack metadata
- Field type-aware controls
- Validation from metadata
- Field dependencies
- Section/group layout
- Create/edit modes

PROPS:
- dataSource: DataSource (required) - ObjectStack adapter
- resource: string (required) - Object/resource name
- recordId?: string - Record ID for edit mode
- mode?: 'create' | 'edit' - Form mode
- layout?: 'vertical' | 'horizontal' | 'grid' - Field layout
- sections?: SectionDef[] - Group fields into sections
- fieldOverrides?: FieldOverride[] - Override generated fields
- onSubmit?: ActionSchema - Submit action
- className?: string - Additional Tailwind classes

IMPLEMENTATION:
- Fetch object metadata from ObjectStack
- Auto-generate form fields from field definitions
- Map field types to form controls:
  - text → Input
  - textarea → Textarea
  - number → Input type=number
  - boolean → Checkbox/Switch
  - date → DatePicker
  - datetime → DateTimePicker
  - reference → Select (lookup)
  - picklist → Select (options)
  - email → Input type=email
  - url → Input type=url
- Apply validation rules from metadata
- Handle field dependencies (visibleOn, requiredOn)
- Load record data in edit mode
- Submit to ObjectStack (create/update)
- Show validation errors inline

EXAMPLE SCHEMA:
{
  "type": "object-form",
  "dataSource": "${objectStackAdapter}",
  "resource": "contacts",
  "mode": "create",
  "layout": "grid",
  "sections": [
    {
      "title": "Basic Information",
      "fields": ["first_name", "last_name", "email"]
    },
    {
      "title": "Additional Details",
      "fields": ["phone", "company", "title"]
    }
  ]
}

TEST CASES:
- Fetches metadata correctly
- Generates fields from metadata
- Maps field types to controls
- Validation rules apply
- Field dependencies work
- Loads data in edit mode
- Creates record correctly
- Updates record correctly
- Error handling works
```

---

## Implementation Best Practices

### 1. Component Structure

```typescript
// 1. Import dependencies
import React from 'react';
import { BaseSchema } from '@object-ui/types';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

// 2. Define schema interface
interface MyComponentSchema extends BaseSchema {
  type: 'my-component';
  // ... component-specific props
}

// 3. Define variants with cva
const myComponentVariants = cva(
  'base-classes', // Base classes
  {
    variants: {
      variant: {
        default: 'variant-default-classes',
        // ... more variants
      },
      size: {
        sm: 'size-sm-classes',
        md: 'size-md-classes',
        lg: 'size-lg-classes',
      }
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    }
  }
);

// 4. Component implementation
export function MyComponentRenderer({ schema, data, context }: RendererProps<MyComponentSchema>) {
  // Implementation
  return <div className={cn(myComponentVariants({ variant, size }), schema.className)} />;
}

// 5. Register component
registerRenderer('my-component', MyComponentRenderer);
```

### 2. ObjectStack Integration Pattern

```typescript
import { useObjectStack } from '@object-ui/react';

function MyDataComponent({ schema }: RendererProps<MyDataComponentSchema>) {
  const { data, loading, error, refetch } = useObjectStack({
    dataSource: schema.dataSource,
    resource: schema.resource,
    query: {
      $filter: schema.filters,
      $orderby: schema.sorting,
      $top: schema.pageSize,
    }
  });

  if (loading) return <SkeletonLoader />;
  if (error) return <ErrorDisplay error={error} />;

  return <div>{/* Render data */}</div>;
}
```

### 3. Testing Template

```typescript
import { render, screen } from '@testing-library/react';
import { MyComponentRenderer } from './my-component';

describe('MyComponent', () => {
  it('renders correctly', () => {
    const schema = { type: 'my-component', /* ... */ };
    render(<MyComponentRenderer schema={schema} />);
    expect(screen.getByRole('...')).toBeInTheDocument();
  });

  it('applies variants correctly', () => {
    // Test variant application
  });

  it('handles ObjectStack integration', async () => {
    // Test data fetching
  });

  it('is accessible', () => {
    // Test accessibility
  });
});
```

---

## Next Steps

1. **Review existing components** - Check which components already exist and their current state
2. **Prioritize development** - Start with critical ObjectStack integration components (ObjectTable, ObjectForm, Filter Builder)
3. **Use these prompts** - Copy the relevant prompt when developing a new component
4. **Iterate and improve** - Update prompts based on learnings from development
5. **Share feedback** - Contribute improvements back to this document

---

## Resources

- [ObjectStack Client Documentation](https://github.com/objectstack-ai/client)
- [ObjectStack Spec Documentation](https://github.com/objectstack-ai/spec)
- [Shadcn/UI Components](https://ui.shadcn.com/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TanStack Table Documentation](https://tanstack.com/table)
- [React Hook Form Documentation](https://react-hook-form.com/)

---

<div align="center">

**AI-Powered Development for ObjectUI** 🤖

[Component Inventory](./COMPONENT_INVENTORY.md) · [Development Plan](./docs/community/contributing/development-plan.md)

</div>
