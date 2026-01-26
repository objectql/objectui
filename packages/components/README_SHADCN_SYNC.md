# Shadcn Components Synchronization

This directory contains tools for keeping ObjectUI components in sync with Shadcn UI.

## Files

- `shadcn-components.json` - Component manifest tracking Shadcn components and custom ObjectUI components
- `shadcn-sync.js` - Automated sync script (requires network access to ui.shadcn.com)

## Component Categories

### Shadcn Components (46)

These components come from Shadcn UI and can be updated from the registry:

**Form Controls:**
- input, textarea, select, checkbox, radio-group, switch, form, label, input-otp

**Layout:**
- card, tabs, accordion, separator, scroll-area, resizable

**Overlays:**
- dialog, popover, tooltip, hover-card, sheet, drawer, alert-dialog

**Navigation:**
- button, breadcrumb, navigation-menu, dropdown-menu, context-menu, menubar, pagination

**Data Display:**
- table, avatar, badge, skeleton, progress, slider

**Feedback:**
- alert, toast, sonner

**Advanced:**
- command, carousel, sidebar, collapsible, calendar, aspect-ratio, toggle, toggle-group

### Custom ObjectUI Components (14)

These are custom to ObjectUI and should NOT be auto-updated:

- `button-group` - Button group wrapper
- `calendar-view` - Full calendar implementation
- `chatbot` - Chatbot UI interface
- `combobox` - Combined select/input component
- `date-picker` - Date picker with calendar
- `empty` - Empty state component
- `field` - Form field wrapper with validation
- `filter-builder` - Advanced query builder
- `input-group` - Input with prefix/suffix
- `item` - Generic item display
- `kbd` - Keyboard shortcut display
- `spinner` - Loading spinner
- `timeline` - Timeline/activity feed
- `toaster` - Toast notification manager

## Usage

### Automated Sync (Requires Internet)

```bash
# Check component status
pnpm shadcn:check

# Update a specific component
pnpm shadcn:update button

# Update all components
pnpm shadcn:update-all

# Show diff for a component
pnpm shadcn:diff button

# List all components
pnpm shadcn:list
```

### Manual Sync Process

If you don't have network access or prefer manual control:

1. **Visit Shadcn UI Documentation**
   - Go to https://ui.shadcn.com/docs/components/[component-name]
   - Click "View Code" to see the latest implementation

2. **Compare with Local Version**
   ```bash
   # View local component
   cat packages/components/src/ui/button.tsx
   ```

3. **Copy Latest Version**
   - Copy the component code from Shadcn docs
   - Paste into a temporary file

4. **Adjust Imports**
   Replace Shadcn imports:
   ```typescript
   // FROM:
   import { cn } from "@/lib/utils"
   import { Button } from "@/components/ui/button"
   
   // TO:
   import { cn } from "../lib/utils"
   import { Button } from "./button"
   ```

5. **Add ObjectUI Header**
   ```typescript
   /**
    * ObjectUI
    * Copyright (c) 2024-present ObjectStack Inc.
    *
    * This source code is licensed under the MIT license found in the
    * LICENSE file in the root directory of this source tree.
    */
   ```

6. **Preserve Customizations**
   - Keep any `data-slot` attributes
   - Keep ObjectUI-specific variants
   - Keep dark mode enhancements
   - Keep accessibility improvements

7. **Test the Component**
   ```bash
   pnpm --filter @object-ui/components build
   pnpm --filter @object-ui/components test
   ```

## Using Official Shadcn CLI

You can also use the official Shadcn CLI:

```bash
# Install Shadcn CLI
npm install -g shadcn@latest

# Initialize (if not done)
cd packages/components
npx shadcn@latest init

# Add/update a component
npx shadcn@latest add button --overwrite

# Add all components
npx shadcn@latest add --all --overwrite
```

**⚠️ Warning:** This will overwrite all ObjectUI customizations! You'll need to:

1. Review the diff carefully: `git diff src/ui/`
2. Restore ObjectUI copyright headers
3. Re-add any custom variants or styling
4. Re-add data-slot attributes
5. Test thoroughly

## Checking for Updates

### Manual Check

1. Visit [Shadcn UI GitHub](https://github.com/shadcn-ui/ui/tree/main/apps/www/registry/default/ui)
2. Compare file dates with last update
3. Check [Shadcn Releases](https://github.com/shadcn-ui/ui/releases) for changelog

### Compare Dependencies

```bash
# Check Radix UI versions
cat packages/components/package.json | grep @radix-ui

# Check latest versions
npm view @radix-ui/react-dialog version
npm view @radix-ui/react-select version
```

### Review Breaking Changes

Check Shadcn's changelog:
- [UI Changelog](https://github.com/shadcn-ui/ui/releases)
- [Radix UI Releases](https://github.com/radix-ui/primitives/releases)

## Common Customizations in ObjectUI

When updating components, preserve these ObjectUI patterns:

### 1. Copyright Headers

```typescript
/**
 * ObjectUI
 * Copyright (c) 2024-present ObjectStack Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
```

### 2. Data Slot Attributes

```typescript
<div data-slot="card-header" className={...}>
```

### 3. Additional Variants

```typescript
const buttonVariants = cva(
  "...",
  {
    variants: {
      // ObjectUI-specific variants
      size: {
        "icon-sm": "h-8 w-8",  // Extra size variant
        "icon-lg": "h-10 w-10", // Extra size variant
      }
    }
  }
)
```

### 4. Enhanced Dark Mode

ObjectUI may have enhanced dark mode styles:

```typescript
className="... dark:bg-background/95 dark:backdrop-blur-sm"
```

## Testing After Updates

```bash
# Type check
pnpm --filter @object-ui/components type-check

# Build
pnpm --filter @object-ui/components build

# Run tests
pnpm --filter @object-ui/components test

# Visual regression (if available)
pnpm --filter @object-ui/components storybook

# Integration test
pnpm test
```

## Rollback

If an update causes issues:

```bash
# Revert specific file
git checkout HEAD -- packages/components/src/ui/button.tsx

# Revert all UI components
git checkout HEAD -- packages/components/src/ui/

# Restore from backup (if created)
cp packages/components/.backup/button.tsx.* packages/components/src/ui/button.tsx
```

## Contributing

When you update a component:

1. Document the changes in CHANGELOG.md
2. Update the version in shadcn-components.json (add lastUpdated field)
3. Test with all examples
4. Create a PR with:
   - Component name in title
   - Reason for update
   - Breaking changes (if any)
   - Screenshots (if visual changes)

## Resources

- [Shadcn UI Docs](https://ui.shadcn.com)
- [Radix UI Docs](https://www.radix-ui.com)
- [Tailwind CSS Docs](https://tailwindcss.com)
- [CVA (Class Variance Authority)](https://cva.style)
