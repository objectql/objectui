# ObjectUI Copilot Skill

This directory contains the unified ObjectUI Copilot skill, consolidating all ObjectUI development knowledge into a single tree-based structure aligned with [shadcn/ui](https://github.com/shadcn-ui/ui/tree/main/skills/shadcn) best practices.

## Structure

```
skills/objectui/
├── SKILL.md                  # Main entry point - core principles & architecture
├── rules/                    # Global non-negotiable constraints
│   ├── protocol.md          # JSON Protocol compliance rules
│   ├── styling.md           # Tailwind & Shadcn styling rules
│   ├── composition.md       # Component composition patterns
│   └── no-touch-zones.md    # Protected upstream files
├── guides/                   # Domain-specific expertise (10 guides)
│   ├── page-builder.md              # Schema-driven page building
│   ├── plugin-development.md        # Creating custom plugins
│   ├── schema-expressions.md        # Expression syntax & debugging
│   ├── data-integration.md          # DataSource & API integration
│   ├── project-setup.md             # Project initialization & config
│   ├── testing.md                   # Testing patterns (Vitest, Storybook, Playwright)
│   ├── i18n.md                      # Internationalization & localization
│   ├── mobile.md                    # Mobile responsiveness & PWA
│   ├── auth-permissions.md          # Authentication & RBAC
│   └── console-development.md       # Console app development
├── evals/                    # Evaluation test cases (10 JSON files)
└── agents/                   # Agent configurations (empty, reserved for future)
```

## Why This Structure?

### Before (10 Parallel Skills)
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

**Problems:**
- Agent had to choose between 10+ skills
- Cross-skill knowledge was fragmented
- Maintenance overhead (10 separate manifests)
- Inconsistent with shadcn/ui single-skill model

### After (1 Tree-Based Skill)
- `skills/objectui/` (single skill)
  - `SKILL.md` - unified entry point
  - `rules/` - global constraints
  - `guides/` - domain expertise

**Benefits:**
- ✅ Single unified entry point
- ✅ AI agent always knows where to look
- ✅ Global rules apply consistently
- ✅ Aligned with shadcn/ui architecture
- ✅ Easier maintenance and updates

## Usage

When working with ObjectUI, the AI agent will:

1. **Start with `SKILL.md`** - Core principles, architecture, and quick reference
2. **Check `rules/`** - Ensure compliance with non-negotiable constraints
3. **Consult `guides/`** - Get deep domain expertise for specific tasks

### Example Flow

**User:** "Help me build a dashboard page with ObjectUI"

**Agent:**
1. Reads `SKILL.md` → Understands core principles
2. Checks `rules/protocol.md` → Learns JSON schema structure
3. Checks `rules/styling.md` → Learns Tailwind requirements
4. Reads `guides/page-builder.md` → Gets dashboard building patterns
5. Reads `guides/schema-expressions.md` → Learns dynamic expressions

## Maintenance

When adding new content:

- **Core principles or architecture changes** → Update `SKILL.md`
- **New global rule** → Add to `rules/`
- **New domain area** → Add guide to `guides/`
- **New eval test** → Add JSON to `evals/`

## Migration Notes

This structure was created on April 14, 2026, consolidating:
- 10 parallel skill directories
- 10 SKILL.md files → 1 SKILL.md + 10 guides
- 10 evals directories → 1 unified evals/
- Cross-skill references unified into single namespace

All content preserved and reorganized for better discoverability.

## Reference

- **shadcn/ui skill structure**: https://github.com/shadcn-ui/ui/tree/main/skills/shadcn
- **Issue**: [#架构优化-将-objectui-多-Copilot-skill-合并为单-skill-树状体系](https://github.com/objectstack-ai/objectui/issues)
