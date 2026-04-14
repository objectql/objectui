---
name: objectui
description: Unified ObjectUI framework skill covering SDUI page building, schema expressions, plugins, data integration, console development, setup, testing, i18n, mobile, and auth/permissions. Use this skill for all ObjectUI development tasks and route to guides/rules by domain.
---

# ObjectUI Unified Skill

This skill consolidates the former 10 parallel `objectui-*` skills into one tree-structured skill, aligned with the shadcn single-skill model.

## Existing ObjectUI skills vs shadcn structure

### Previous ObjectUI layout (parallel skills)

- `skills/objectui-auth-permissions/`
- `skills/objectui-console-development/`
- `skills/objectui-data-integration/`
- `skills/objectui-i18n/`
- `skills/objectui-mobile/`
- `skills/objectui-plugin-development/`
- `skills/objectui-project-setup/`
- `skills/objectui-schema-expressions/`
- `skills/objectui-sdui-page-builder/`
- `skills/objectui-testing/`

### shadcn-style layout (single entry with tree)

- `skills/<skill>/SKILL.md` as the only frontmatter entry
- `skills/<skill>/rules/*` for critical rules
- `skills/<skill>/guides/*` for domain guides
- shared `evals/` for unified evaluation prompts

## Target ObjectUI directory structure

```text
skills/objectui/
├── SKILL.md
├── rules/
│   ├── protocol.md
│   ├── styling.md
│   ├── composition.md
│   └── quality.md
├── guides/
│   ├── auth-permissions.md
│   ├── console-development.md
│   ├── data-integration.md
│   ├── i18n.md
│   ├── mobile.md
│   ├── page-builder.md
│   ├── plugin-development.md
│   ├── project-setup.md
│   ├── schema-expressions.md
│   └── testing.md
└── evals/
    └── evals.json
```

## Rules index

- Protocol and expression boundaries → [rules/protocol.md](./rules/protocol.md)
- Styling and Shadcn alignment → [rules/styling.md](./rules/styling.md)
- Package/data composition boundaries → [rules/composition.md](./rules/composition.md)
- Validation and cross-link quality gates → [rules/quality.md](./rules/quality.md)

## Guides index

- Auth and permissions → [guides/auth-permissions.md](./guides/auth-permissions.md)
- Console development → [guides/console-development.md](./guides/console-development.md)
- Data integration → [guides/data-integration.md](./guides/data-integration.md)
- Internationalization → [guides/i18n.md](./guides/i18n.md)
- Mobile adaptation → [guides/mobile.md](./guides/mobile.md)
- SDUI page builder → [guides/page-builder.md](./guides/page-builder.md)
- Plugin development → [guides/plugin-development.md](./guides/plugin-development.md)
- Project setup → [guides/project-setup.md](./guides/project-setup.md)
- Schema expressions → [guides/schema-expressions.md](./guides/schema-expressions.md)
- Testing → [guides/testing.md](./guides/testing.md)

## Cross-skill routing rules

When tasks span multiple domains, keep all related guides in context:

- Page build + expressions: `page-builder` + `schema-expressions`
- Page build + data: `page-builder` + `data-integration`
- Console + auth: `console-development` + `auth-permissions`
- Console + i18n/mobile: `console-development` + `i18n` + `mobile`
- Plugin + testing: `plugin-development` + `testing`

This unified entry ensures all key rules remain linked and indexable from one skill root.
