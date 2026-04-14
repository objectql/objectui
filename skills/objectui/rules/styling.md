# Styling Rules

## Shadcn-native styling baseline

- Prefer Tailwind utility classes and ObjectUI theme tokens.
- Use `cva` for variants and `cn()` (`clsx` + `tailwind-merge`) for class composition.
- Keep styling consistent with Shadcn primitives and ObjectUI wrappers.

## Forbidden styling patterns

- Do not introduce inline `style={{}}` for normal component styling.
- Do not introduce CSS Modules or styled-components in ObjectUI packages.
- Do not fork upstream Shadcn primitives for business logic changes; use wrappers/registrations instead.

## Related guides

- Setup and theme wiring: [project-setup.md](../guides/project-setup.md)
- Mobile responsive behavior: [mobile.md](../guides/mobile.md)
- Console-specific UI conventions: [console-development.md](../guides/console-development.md)
