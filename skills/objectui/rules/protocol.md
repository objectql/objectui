# JSON Protocol Rules

> **Critical:** All ObjectUI schemas MUST strictly follow `@objectstack/spec` definitions.

## Rule: Expression Evaluation Boundaries

### Fields That ARE Evaluated

SchemaRenderer evaluates these fields automatically:

| Field | Evaluation Type | Return Type | Example |
|---|---|---|---|
| `props.*` | Template (`${}`) | Preserves original type | `"props": { "count": "${items.length}" }` → number |
| `content` | Template (`${}`) | string | `"content": "Total: ${data.total}"` |
| `hidden` | Condition | boolean | `"hidden": "${data.role !== 'admin'}"` |
| `hiddenOn` | Condition | boolean | `"hiddenOn": "data.status === 'draft'"` |
| `visible` | Condition | boolean | `"visible": "${data.isActive}"` |
| `visibleOn` | Condition | boolean | `"visibleOn": "data.permissions.canView"` |
| `disabled` | Condition | boolean | `"disabled": "${form.isSubmitting}"` |
| `disabledOn` | Condition | boolean | `"disabledOn": "!data.hasPermission"` |

**Precedence rule:** `visible` takes priority over `hidden`.

### Fields That are NOT Evaluated

These top-level schema fields are passed as raw strings:

- `value` — use `props.value` instead
- `label` — use `props.label` instead
- `description` — use `props.description` instead
- `title` — use `props.title` instead
- `className` — always a static Tailwind class string
- `id` — always a static string
- `type` — component type identifier
- `bind` — data scope path (resolved by `useDataScope`, not by expressions)

## Rule: Component Schema Structure

Every UI component node MUST follow this shape:

```typescript
interface UIComponent {
  type: string;              // Required: component type identifier
  id?: string;               // Optional: unique identifier
  props?: Record<string, any>; // Optional: component properties
  bind?: string;             // Optional: data binding path
  className?: string;        // Optional: Tailwind CSS classes
  hidden?: string;           // Optional: visibility expression
  disabled?: string;         // Optional: disabled expression
  events?: Record<string, ActionDef[]>; // Optional: event handlers
  children?: UIComponent[];  // Optional: nested components
}
```

## Rule: No Schema Property Invention

**❌ FORBIDDEN:** Adding custom properties not defined in `@objectstack/spec`.

**Example violation:**
```json
{
  "type": "grid",
  "fields": [...],  // ❌ spec uses "columns"
  "customProp": "value"  // ❌ not in spec
}
```

**✅ CORRECT:**
```json
{
  "type": "grid",
  "props": {
    "columns": [...]  // ✅ follows spec
  }
}
```

## Rule: Type Preservation in Expressions

When the entire string is a single `${expression}`, the result preserves its type:

```json
"${data.count}"        // → returns number 42, not string "42"
"${data.isActive}"     // → returns boolean true, not string "true"
"Count: ${data.count}" // → returns string "Count: 42" (mixed template)
```

## Rule: Data Binding Path Resolution

The `bind` field is NOT expression-evaluated. It's a path string resolved by `useDataScope()`:

```json
{
  "type": "data-table",
  "bind": "customers",  // Resolved as dataSource.customers
  "props": {
    "columns": [...]
  }
}
```

**Nested paths work:** `"bind": "app.settings.users"` resolves `dataSource.app.settings.users`.

## Rule: Action Event Structure

Events must be defined as arrays of action definitions:

```json
{
  "events": {
    "onClick": [
      { "action": "validate", "target": "form_1" },
      { "action": "submit", "target": "form_1" },
      { "action": "navigate", "params": { "url": "/success" } }
    ]
  }
}
```

**❌ DO NOT** use function references or inline callbacks in JSON schemas.

## Rule: Layout Responsiveness

Layout components must support responsive properties:

```json
{
  "type": "grid",
  "props": {
    "cols": { "sm": 1, "md": 2, "lg": 4 }  // ✅ Responsive config
  }
}
```

## Rule: Expression Security

The expression parser blocks dangerous patterns:

**❌ BLOCKED:**
- `eval()`
- `Function()`
- `setTimeout()`, `setInterval()`
- `import()`, `require()`
- `process.*`, `global.*`
- `window.*`, `document.*`
- `__proto__`, `constructor`, `prototype`

**✅ SAFE GLOBALS:**
- `Math` — `${Math.round(price)}`
- `JSON` — `${JSON.stringify(obj)}`
- `parseInt`, `parseFloat`, `isNaN`, `isFinite`
