# Protocol Rules

## Canonical schema contract

- Keep UI definitions JSON-first. Define data contract and schema before writing JSX wrappers.
- Follow `@objectstack/spec` / `@object-ui/types` contracts strictly (`type`, `id`, `props`, `children`, `events`, `bind`, `hidden`, `visible`, `disabled`).
- Place dynamic expressions in expression-supported fields (`props.*`, `hidden`, `visible`, `disabled`), not in plain metadata text fields.
- Keep renderer implementations backend-agnostic and protocol-driven.

## Expression and binding boundaries

- Use `${...}` template expressions for computed values and condition expressions for booleans.
- Never use `eval` / `new Function`; expression parsing must remain safe-parser based.
- For deep expression details and troubleshooting, use [schema-expressions.md](../guides/schema-expressions.md).
- For page-composition expression usage, use [page-builder.md](../guides/page-builder.md).
