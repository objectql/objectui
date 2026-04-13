---
name: objectui-sdui-page-builder
description: Build and integrate Schema-Driven UI pages in third-party projects using Object UI. Use this skill whenever the user asks to create app pages from JSON schemas, wire SchemaRenderer into an existing React app, implement CRUD/dashboard/form/list/detail pages with Object UI, or migrate handwritten React pages to schema-driven rendering. Use it even if the user does not explicitly mention "skill" or "SchemaRenderer" but describes metadata-driven page development, console-like page composition, or JSON-to-UI workflows.
---

# ObjectUI SDUI Page Builder

Use this skill to guide app developers (not framework maintainers) to build production pages with Object UI's Schema-Driven UI Engine.

## What this skill should optimize for

- Deliver working page features quickly with JSON-first design.
- Keep architecture aligned with Object UI conventions.
- Keep third-party projects backend-agnostic through DataSource interfaces.
- Produce outputs that are immediately usable in app codebases.

## When to use this skill

Use this skill when requests include:

- "Build a page with Object UI / SchemaRenderer"
- "Create a CRUD/dashboard/form/detail page from JSON"
- "Integrate Object UI in an existing React/Vite/Next app"
- "Design a metadata-driven page similar to console"
- "Move an existing React page to schema-driven rendering"

Do not use this skill for:

- Modifying Shadcn upstream primitives under `packages/components/src/ui/**`.
- Core engine internals that belong to `@object-ui/core` maintenance.
- Non-UI backend implementation unrelated to schema rendering.

## Required mindset

1. JSON first, React second.
2. Protocol compatibility before convenience shortcuts.
3. Reusable schema blocks before one-off page code.
4. DataSource abstraction over hardcoded transport logic.

## Standard workflow

### 1. Frame the page contract first

Before writing implementation code, define:

- Page purpose (dashboard, list, detail, form, wizard, board).
- Required data inputs and output actions.
- User roles and visibility rules.
- Interaction model (navigation, submit, bulk actions, modals).

Then produce a first schema draft.

### 2. Select the right package boundaries

Use these boundaries in guidance and generated code:

- `@object-ui/types`: schema and typed interfaces.
- `@object-ui/core`: expression/action/registry logic.
- `@object-ui/components`: base visual components and wrappers.
- `@object-ui/fields`: form input renderers.
- `@object-ui/layout`: shell and page composition.
- `@object-ui/plugin-*`: heavy feature widgets (grid, charts, kanban, map).
- `@object-ui/react`: `SchemaRenderer`, provider wiring, runtime bridge.

When helping third-party apps, consume these packages; avoid duplicating core runtime logic in the app layer.

### 3. Compose schema using proven node shape

Use a strict component schema shape similar to:

```json
{
  "type": "card",
  "id": "customer_summary",
  "className": "col-span-12 lg:col-span-4",
  "props": {
    "title": "Customer Summary"
  },
  "hidden": "${data.userRole !== 'admin'}",
  "children": [
    {
      "type": "text",
      "props": {
        "content": "Active users: ${data.metrics.activeUsers}"
      }
    }
  ]
}
```

Prefer expression-based behavior (`hidden`, `disabled`, computed props) over imperative branching in component code.

### 4. Wire renderer and registry cleanly

Typical integration sequence:

1. Register default renderers/components.
2. Register plugin components needed by the page type.
3. Provide `dataSource` and contextual data through renderer provider.
4. Render schema via `SchemaRenderer`.

Keep custom component registrations namespaced to avoid collisions.

### 5. Use action data, not inline callback spaghetti

Represent interactions as data where possible:

```json
{
  "events": {
    "onClick": [
      { "action": "validate", "target": "customer_form" },
      { "action": "submit", "target": "customer_form" },
      { "action": "navigate", "params": { "url": "/customers" } }
    ]
  }
}
```

If custom app-side handlers are needed, isolate them in action handlers instead of embedding business logic into presentation components.

### 6. Validate responsiveness and accessibility

For every generated page, ensure:

- Responsive layout behavior (mobile/tablet/desktop).
- Semantic labels and ARIA fields where relevant.
- Keyboard-safe interactions for forms and actions.
- Error and loading states are present in schema or wrappers.

### 7. Ship with verification artifacts

Always include:

- Final page schema JSON.
- Integration code snippet (provider + renderer + registry wiring).
- Test checklist (rendering, expressions, actions, data loading).
- Optional migration notes if replacing legacy React page code.

## Output format

Always structure results in this order:

1. `Page Goal` - one paragraph.
2. `Schema JSON` - complete runnable draft.
3. `Integration Steps` - app wiring steps.
4. `Code Snippets` - minimal required TS/TSX examples.
5. `Validation Checklist` - what to test before merge.
6. `Extension Options` - how to add fields/plugins/actions next.

## Console-inspired patterns to reuse

When users ask for a "console-like" experience, prefer:

- App-shell layout with persistent navigation.
- Metadata-driven detail pages composed from widgets.
- Registry-based component resolution over switch/case rendering.
- PageSchema factories for page variants of the same domain entity.

## Common mistakes to avoid

- Writing large bespoke React JSX trees before schema definition.
- Hardcoding API calls directly inside visual renderers.
- Introducing package coupling (for example, UI package depending on business logic package).
- Registering components without namespace in plugin-heavy projects.
- Skipping docs updates for newly introduced schema patterns.

## Fast triage playbook for ambiguous requests

If the request is underspecified:

1. Infer likely page category (list/detail/form/dashboard).
2. Produce a minimal viable schema first.
3. Mark assumptions clearly.
4. Provide one conservative and one advanced variant.

This keeps momentum while inviting focused user feedback.

## Example prompts this skill should handle well

- "In our CRM app, create a customer detail page with tabs, related orders, and action buttons using SchemaRenderer."
- "Migrate this existing React order list to Object UI schema, keep filters and bulk actions."
- "Set up a dashboard page in a Vite app with Object UI cards + chart plugin and role-based visibility."
