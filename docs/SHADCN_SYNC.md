# Shadcn Components Sync Guide

This guide explains how to keep ObjectUI components synchronized with the latest Shadcn UI components.

## Overview

ObjectUI is built on top of Shadcn UI components. This sync script helps you:

1. **Compare** local components with Shadcn's latest versions
2. **Update** components to the latest Shadcn implementation
3. **Track** which components are custom vs. from Shadcn
4. **Maintain** consistency with the Shadcn ecosystem

## Prerequisites

### Network Access

The sync script requires internet access to fetch components from the Shadcn registry at `https://ui.shadcn.com/registry`. If you're behind a corporate firewall or in a restricted environment, you may need to:

1. Configure proxy settings
2. Use the offline mode (manual comparison)
3. Allow access to `ui.shadcn.com` in your firewall

### Alternative: Official Shadcn CLI

You can also use the official Shadcn CLI directly:

```bash
# Install shadcn CLI globally
npm install -g shadcn@latest

# Or use with npx
npx shadcn@latest add button

# Update all components
npx shadcn@latest add --all --overwrite
```

However, this will overwrite ObjectUI customizations, so you'll need to manually restore:
- ObjectUI copyright headers
- Custom styling and variants
- data-slot attributes
- Integration code

## Quick Start

### Check Component Status

```bash
node scripts/shadcn-sync.js --check
```

This will show:
- ✓ **Synced**: Components matching Shadcn
- ⚠ **Modified**: Components with customizations
- ● **Custom**: ObjectUI-specific components
- ✗ **Errors**: Components with issues

### Update a Single Component

```bash
# Update button component
node scripts/shadcn-sync.js --update button --backup

# Update without backup
node scripts/shadcn-sync.js --update button
```

### Update All Components

```bash
# Update all with backups (recommended)
node scripts/shadcn-sync.js --update-all --backup

# Update all without backups
node scripts/shadcn-sync.js --update-all
```

### Show Component Diff

```bash
node scripts/shadcn-sync.js --diff button
```

### List All Components

```bash
node scripts/shadcn-sync.js --list
```

## Component Categories

### Shadcn Components (40+ components)

These are standard Shadcn UI components that can be updated from the registry:

- **Forms**: `input`, `textarea`, `select`, `checkbox`, `radio-group`, `switch`, `form`, `label`
- **Layout**: `card`, `tabs`, `accordion`, `separator`, `scroll-area`, `resizable`
- **Overlay**: `dialog`, `popover`, `tooltip`, `hover-card`, `sheet`, `drawer`
- **Navigation**: `button`, `breadcrumb`, `navigation-menu`, `dropdown-menu`, `context-menu`, `menubar`, `pagination`
- **Data**: `table`, `avatar`, `badge`, `skeleton`, `progress`, `slider`
- **Feedback**: `alert`, `alert-dialog`, `toast`, `sonner`
- **Advanced**: `command`, `carousel`, `sidebar`, `collapsible`

### Custom ObjectUI Components (14 components)

These are custom components specific to ObjectUI and should NOT be auto-updated:

- `button-group` - Button group wrapper
- `calendar-view` - Full calendar view  
- `chatbot` - Chatbot interface
- `combobox` - Combo box (select + input)
- `date-picker` - Date picker wrapper
- `empty` - Empty state component
- `field` - Form field wrapper
- `filter-builder` - Query filter builder
- `input-group` - Input with addons
- `input-otp` - OTP input (from Shadcn but customized)
- `item` - Generic item component
- `kbd` - Keyboard key display
- `spinner` - Loading spinner
- `timeline` - Timeline component
- `toaster` - Toast container

## Component Manifest

Component metadata is tracked in `packages/components/shadcn-components.json`:

```json
{
  "components": {
    "button": {
      "source": "https://ui.shadcn.com/registry/styles/default/button.json",
      "dependencies": ["@radix-ui/react-slot"],
      "registryDependencies": []
    }
  },
  "customComponents": {
    "button-group": {
      "description": "Custom ObjectUI component",
      "dependencies": ["button"]
    }
  }
}
```

## Workflow

### Option 1: Update Individual Components (Recommended)

Best for selective updates and careful testing:

```bash
# 1. Check which components are outdated
node scripts/shadcn-sync.js --check

# 2. Review what changed
node scripts/shadcn-sync.js --diff button

# 3. Update with backup
node scripts/shadcn-sync.js --update button --backup

# 4. Review changes
git diff packages/components/src/ui/button.tsx

# 5. Test the component
pnpm --filter @object-ui/components test

# 6. If good, commit
git add packages/components/src/ui/button.tsx
git commit -m "chore(components): update button to latest Shadcn version"
```

### Option 2: Bulk Update All Components

Best for major version syncs:

```bash
# 1. Create backups
node scripts/shadcn-sync.js --update-all --backup

# 2. Review all changes
git diff packages/components/src/ui/

# 3. Check for breaking changes in key components
# (especially: form, input, button, card, dialog)

# 4. Test thoroughly
pnpm --filter @object-ui/components build
pnpm test

# 5. Commit if all tests pass
git add packages/components/src/ui/
git commit -m "chore(components): sync all components with Shadcn UI"
```

## Important Considerations

### 1. Custom Modifications

ObjectUI components may have customizations:

- **data-slot attributes** - Used for styling and component identification
- **Additional variants** - Extra CVA variants for ObjectUI themes
- **Dark mode enhancements** - Enhanced dark mode support
- **Accessibility improvements** - Extra ARIA attributes
- **Integration code** - Integration with ObjectUI's renderer system

After updating, you may need to re-apply these customizations.

### 2. Breaking Changes

Shadcn components occasionally have breaking changes:

- Check the [Shadcn UI changelog](https://github.com/shadcn-ui/ui/releases)
- Review prop changes in updated components
- Test all ObjectUI examples and demos
- Update TypeScript types if needed

### 3. Dependencies

Component updates may require dependency updates:

```bash
# Check if new Radix UI versions are needed
pnpm --filter @object-ui/components outdated

# Update specific dependency
pnpm --filter @object-ui/components add @radix-ui/react-dialog@latest
```

### 4. Backups

Backups are stored in `packages/components/.backup/`:

```bash
# List backups
ls -la packages/components/.backup/

# Restore from backup
cp packages/components/.backup/button.tsx.1234567890.backup \
   packages/components/src/ui/button.tsx
```

## Adding New Shadcn Components

To add a component that exists in Shadcn but not in ObjectUI:

1. **Update the manifest** (`shadcn-components.json`):

```json
{
  "components": {
    "new-component": {
      "source": "https://ui.shadcn.com/registry/styles/default/new-component.json",
      "dependencies": ["@radix-ui/react-*"],
      "registryDependencies": ["button", "label"]
    }
  }
}
```

2. **Download the component**:

```bash
node scripts/shadcn-sync.js --update new-component
```

3. **Install dependencies** (if needed):

```bash
pnpm --filter @object-ui/components add @radix-ui/react-*
```

4. **Export in index.ts**:

```typescript
export * from './ui/new-component'
```

5. **Create a renderer** (if needed for schema usage):

```typescript
// packages/components/src/renderers/new-component-renderer.tsx
import { registerRenderer } from '@object-ui/react'
import { NewComponent } from '../ui/new-component'

export function registerNewComponentRenderer() {
  registerRenderer('new-component', NewComponent)
}
```

## Troubleshooting

### Script Errors

If the sync script fails:

```bash
# Check Node.js version (needs v20+)
node --version

# Check network connectivity to Shadcn registry
curl https://ui.shadcn.com/registry/styles/default/button.json

# Run with verbose output
node scripts/shadcn-sync.js --check 2>&1 | tee sync-log.txt
```

### Build Errors After Update

```bash
# Clear build cache
rm -rf packages/components/dist
rm -rf node_modules/.vite

# Rebuild
pnpm --filter @object-ui/components build

# Check TypeScript errors
pnpm --filter @object-ui/components type-check
```

### Test Failures

```bash
# Run tests in watch mode
pnpm --filter @object-ui/components test:watch

# Run with coverage
pnpm --filter @object-ui/components test:coverage

# Check specific component test
pnpm test -- button.test
```

## CI/CD Integration

Add to your GitHub Actions workflow:

```yaml
name: Check Shadcn Components

on:
  schedule:
    # Run weekly on Mondays
    - cron: '0 0 * * 1'
  workflow_dispatch:

jobs:
  check-components:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'pnpm'
      
      - name: Install dependencies
        run: pnpm install
      
      - name: Check component status
        run: node scripts/shadcn-sync.js --check
      
      - name: Create issue if outdated
        if: failure()
        uses: actions/github-script@v7
        with:
          script: |
            github.rest.issues.create({
              owner: context.repo.owner,
              repo: context.repo.repo,
              title: 'Components need Shadcn sync',
              body: 'Run `node scripts/shadcn-sync.js --check` for details'
            })
```

## Best Practices

1. ✅ **Always create backups** when updating components
2. ✅ **Test after each update** - Don't update all at once
3. ✅ **Review diffs carefully** - Look for breaking changes
4. ✅ **Update dependencies** together with components
5. ✅ **Document customizations** - Add comments explaining ObjectUI-specific code
6. ✅ **Run full test suite** before committing
7. ✅ **Check examples** - Make sure demos still work
8. ✅ **Update docs** if component APIs change

## Resources

- [Shadcn UI Documentation](https://ui.shadcn.com)
- [Shadcn UI GitHub](https://github.com/shadcn-ui/ui)
- [Radix UI Documentation](https://www.radix-ui.com)
- [ObjectUI Documentation](https://objectui.org)

## Support

If you encounter issues:

1. Check the [ObjectUI Issues](https://github.com/objectstack-ai/objectui/issues)
2. Review [Shadcn UI Discussions](https://github.com/shadcn-ui/ui/discussions)
3. Open an issue with:
   - Component name
   - Error message
   - Output of `--check` command
   - Node.js version
