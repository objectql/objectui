# Shadcn Component Sync - Quick Start Guide

This guide helps you quickly get started with syncing ObjectUI components with Shadcn UI.

## 🚀 Quick Commands

```bash
# Analyze components (works offline)
pnpm shadcn:analyze

# List all components
pnpm shadcn:list

# Check status online (requires internet)
pnpm shadcn:check

# Update a single component
pnpm shadcn:update button

# Update all components with backups
pnpm shadcn:update-all
```

## 📊 Understanding the Analysis

When you run `pnpm shadcn:analyze`, you'll see components categorized by customization level:

### ✅ Safe to Update (4 components)
These have minimal ObjectUI customizations and can be updated directly:
- `calendar`
- `sonner`
- `table`
- `toast`

**How to update:**
```bash
pnpm shadcn:update calendar --backup
```

### ⚠️ Review Before Updating (37 components)
These have light customizations (mainly data-slot attributes):
- Most form components: `input`, `checkbox`, `select`, etc.
- Navigation components: `dropdown-menu`, `menubar`, etc.
- Overlay components: `dialog`, `popover`, `tooltip`, etc.

**How to update:**
1. Check what changed: `pnpm shadcn:diff input`
2. Update with backup: `pnpm shadcn:update input --backup`
3. Review changes: `git diff packages/components/src/ui/input.tsx`
4. Re-add data-slot attributes if needed
5. Test: `pnpm --filter @object-ui/components test`

### 🔧 Manual Merge Required (5 components)
These have heavy customizations requiring careful manual merging:
- `card` - Glassmorphism effects, custom styling
- `form` - React Hook Form integration
- `label` - Enhanced with data-slots
- `skeleton` - Glassmorphism effects
- `tabs` - Glassmorphism, custom animations

**How to update:**
1. Copy current file as reference
2. Get latest from Shadcn docs
3. Manually merge customizations
4. Test thoroughly

### ● Never Update (14 components)
These are custom ObjectUI components, not from Shadcn:
- `button-group`, `calendar-view`, `chatbot`, `combobox`
- `date-picker`, `empty`, `field`, `filter-builder`
- `input-group`, `item`, `kbd`, `spinner`
- `timeline`, `toaster`

## 🎯 Common Workflows

### Workflow 1: Update a Single Safe Component

```bash
# 1. Analyze to find safe components
pnpm shadcn:analyze

# 2. Update with backup
pnpm shadcn:update toast --backup

# 3. Review changes
git diff packages/components/src/ui/toast.tsx

# 4. Test
pnpm --filter @object-ui/components build
pnpm --filter @object-ui/components test

# 5. Commit if good
git add packages/components/src/ui/toast.tsx
git commit -m "chore(components): update toast to latest Shadcn"
```

### Workflow 2: Update Multiple Components

```bash
# 1. Analyze first
pnpm shadcn:analyze

# 2. Create a branch
git checkout -b chore/update-shadcn-components

# 3. Update components one by one
pnpm shadcn:update button --backup
pnpm shadcn:update input --backup
pnpm shadcn:update select --backup

# 4. Review all changes
git diff packages/components/src/ui/

# 5. Test everything
pnpm build
pnpm test

# 6. Commit and push
git add packages/components/src/ui/
git commit -m "chore(components): update form components to latest Shadcn"
git push origin chore/update-shadcn-components
```

### Workflow 3: Check for Updates (Weekly)

```bash
# The GitHub Action runs automatically every Monday
# Or trigger manually:

# 1. Go to GitHub Actions
# 2. Select "Check Shadcn Components"
# 3. Click "Run workflow"

# Check the results:
# - If components are outdated, an issue will be created
# - Review the issue and follow recommendations
```

## 🔍 Troubleshooting

### "Cannot reach ui.shadcn.com"

If online sync fails due to network issues:

1. **Use offline mode:**
   ```bash
   pnpm shadcn:analyze
   ```

2. **Use official Shadcn CLI:**
   ```bash
   npx shadcn@latest add button --overwrite
   # Then manually restore ObjectUI customizations
   ```

3. **Manual process:**
   - Visit https://ui.shadcn.com/docs/components/button
   - Copy code from docs
   - Update local file manually

### "Component has customizations"

If a component has ObjectUI customizations:

1. **Create backup:**
   ```bash
   cp packages/components/src/ui/card.tsx packages/components/src/ui/card.tsx.backup
   ```

2. **Update component:**
   ```bash
   pnpm shadcn:update card
   ```

3. **Restore customizations:**
   - Compare with backup: `diff card.tsx card.tsx.backup`
   - Re-add data-slot attributes
   - Re-add custom variants
   - Re-add ObjectUI header

4. **Test:**
   ```bash
   pnpm --filter @object-ui/components test
   ```

## 📚 Learn More

- [Full Sync Guide](../docs/SHADCN_SYNC.md) - Comprehensive documentation
- [Component README](../packages/components/README_SHADCN_SYNC.md) - Detailed reference
- [Shadcn UI Docs](https://ui.shadcn.com) - Official Shadcn documentation

## 🤝 Need Help?

- Check existing [GitHub Issues](https://github.com/objectstack-ai/objectui/issues?q=label%3Ashadcn-sync)
- Read the [Contributing Guide](../CONTRIBUTING.md)
- Open a new issue with the `shadcn-sync` label

## 📝 Component Manifest

The manifest at `packages/components/shadcn-components.json` tracks:

- **46 Shadcn components** - Can be updated from registry
- **14 Custom components** - ObjectUI-specific, do not update

To add a new Shadcn component:

1. Add to manifest
2. Run `pnpm shadcn:update <component>`
3. Export in `src/index.ts`
4. Create renderer if needed
5. Add tests
6. Update docs
