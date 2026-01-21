# ObjectUI AI Development Prompts

This directory contains specialized AI prompts for developing and optimizing each core component of the ObjectUI system.

## Purpose

These prompts serve as system instructions for AI agents (like GitHub Copilot, ChatGPT, Claude, etc.) when working on specific parts of the ObjectUI codebase. Each prompt contains:

- **Role & Context**: What the AI should act as and understand
- **Technical Constraints**: Stack-specific rules and requirements
- **Architecture Guidelines**: How the component fits in the system
- **Development Rules**: Best practices and patterns to follow
- **Testing Requirements**: What and how to test
- **Examples**: Common patterns and usage

## Directory Structure

```
.github/prompts/
├── README.md                           # This file
├── core-packages/                      # Core system packages
│   ├── types-package.md               # @object-ui/types - Protocol definitions
│   ├── core-package.md                # @object-ui/core - Engine logic
│   ├── react-package.md               # @object-ui/react - Runtime bindings
│   └── components-package.md          # @object-ui/components - UI library
├── components/                         # Component category prompts
│   ├── basic-components.md            # Basic primitives (text, image, icon)
│   ├── layout-components.md           # Layout system (grid, flex, container)
│   ├── form-components.md             # Form controls (input, select, checkbox)
│   ├── data-display-components.md     # Data visualization (list, table, badge)
│   ├── feedback-components.md         # User feedback (loading, progress, toast)
│   ├── overlay-components.md          # Overlays (dialog, popover, tooltip)
│   ├── navigation-components.md       # Navigation (menu, tabs, breadcrumb)
│   ├── disclosure-components.md       # Disclosure (accordion, collapsible)
│   └── complex-components.md          # Complex patterns (CRUD, calendar)
├── plugins/                            # Plugin development
│   └── plugin-development.md          # Guidelines for creating plugins
└── tools/                              # Developer tools
    ├── designer.md                    # Visual designer
    ├── cli.md                         # CLI tool
    └── runner.md                      # App runner

```

## How to Use

### For AI Agents

When working on a specific component or package:

1. **Identify** the relevant prompt file based on the task
2. **Load** the prompt as your system instruction
3. **Follow** the guidelines, constraints, and patterns defined
4. **Reference** the examples for common patterns

### For Developers

When requesting AI assistance:

1. **Point** the AI to the relevant prompt file
2. **Provide** context about what you're trying to achieve
3. **Review** the AI's output against the prompt's requirements

### Example Usage

```bash
# Using with GitHub Copilot Chat
"Use the prompt from .github/prompts/core-packages/types-package.md to help me add a new component schema"

# Using with ChatGPT/Claude
"I need to develop a new form component. Here's the development guide: [paste content from .github/prompts/components/form-components.md]"
```

## Prompt Categories

### 1. Core Packages (Foundation Layer)

These prompts govern the fundamental building blocks:

- **types**: Pure TypeScript interfaces, zero dependencies
- **core**: Schema validation, registry, expression engine
- **react**: React bindings and SchemaRenderer
- **components**: Shadcn/Tailwind implementation

### 2. Component Categories (UI Layer)

Organized by UI purpose and patterns:

- **basic**: Primitive elements (text, image, icon, separator)
- **layout**: Spatial organization (grid, flex, stack, container)
- **form**: User input (input, select, checkbox, radio, switch)
- **data-display**: Information presentation (list, table, badge, avatar)
- **feedback**: System state (loading, progress, skeleton, toast)
- **overlay**: Layered content (dialog, popover, dropdown, tooltip)
- **navigation**: Movement (menu, tabs, breadcrumb, pagination)
- **disclosure**: Show/hide content (accordion, collapsible, tabs)
- **complex**: Advanced patterns (CRUD, calendar, kanban, charts)

### 3. Plugins (Extension Layer)

Guidelines for extending ObjectUI:

- Plugin architecture and patterns
- Lazy loading and code splitting
- Integration with core system
- Examples: charts, editor, kanban, markdown

### 4. Tools (Developer Experience)

For building ObjectUI tooling:

- **designer**: Visual drag-and-drop editor
- **cli**: Command-line interface
- **runner**: Development server

## Key Principles (Applies to All Prompts)

### 1. JSON Schema-First Design

Every component must be fully definable via JSON schema:

```json
{
  "type": "button",
  "label": "Click Me",
  "variant": "primary",
  "onClick": { "type": "action", "name": "submit" }
}
```

### 2. Zero Runtime Overhead

- No inline styles (`style={{}}`)
- No CSS-in-JS libraries
- Tailwind classes only (via `cn()` utility)
- Use `class-variance-authority` for variants

### 3. Stateless Components

Components are controlled by schema props:

```tsx
// ✅ Good: Controlled by props
export function Button({ schema, data }: RendererProps<ButtonSchema>) {
  return <button className={cn(buttonVariants({ variant: schema.variant }))} />
}

// ❌ Bad: Internal state
export function Button() {
  const [clicked, setClicked] = useState(false)
}
```

### 4. Separation of Concerns

```
types (Protocol) → core (Logic) → react (Bindings) → components (UI)
```

No backwards dependencies allowed!

### 5. TypeScript Strict Mode

- All code must pass `tsc --strict`
- No `any` types without justification
- Comprehensive interface definitions

### 6. Accessibility First

- WCAG 2.1 AA minimum
- Keyboard navigation
- Screen reader support
- ARIA attributes
- Focus management

### 7. Testing Requirements

- Unit tests for logic (core)
- Integration tests for renderers (components)
- Type tests for schemas (types)
- Visual regression tests (Storybook)

## Maintenance

These prompts should be updated when:

- Architecture patterns change
- New constraints are identified
- Common mistakes are discovered
- Best practices evolve

## Contributing

When adding or updating prompts:

1. Follow the existing structure
2. Include concrete examples
3. Specify constraints clearly
4. Link to relevant documentation
5. Test the prompt with an AI agent

## Related Documentation

- [Architecture Overview](../../docs/spec/architecture.md)
- [Component System](../../docs/spec/component.md)
- [Protocol Specifications](../../docs/protocol/overview.md)
- [Contributing Guide](../../CONTRIBUTING.md)

---

**Version**: 1.0.0  
**Last Updated**: 2026-01-21  
**Maintainer**: ObjectUI Team
