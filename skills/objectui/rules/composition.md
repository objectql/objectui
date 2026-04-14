# Composition Rules

## Package boundary discipline

- Keep monorepo boundaries clear: protocol/types → core/runtime → components/fields/layout → plugin-* / app layers.
- Register custom UI through `ComponentRegistry` instead of hard-coded renderer branches.
- Put heavy domain features in plugin packages; keep shared primitives lightweight.

## Data and integration boundaries

- Access data through `DataSource` abstractions, not hardcoded transport calls inside visual components.
- Keep auth/permissions, i18n, mobile, and testing concerns composable via providers/hooks.

## Related guides

- Plugin authoring: [plugin-development.md](../guides/plugin-development.md)
- Data integration: [data-integration.md](../guides/data-integration.md)
- Auth and permission composition: [auth-permissions.md](../guides/auth-permissions.md)
