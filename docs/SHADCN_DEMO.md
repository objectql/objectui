# Shadcn Component Sync - Demo Walkthrough

This document shows real examples of using the component sync tools.

## Demo 1: Analyzing Components (Offline)

```bash
$ npm run shadcn:analyze
```

**Output:**
```
======================================================================
ObjectUI Components Analysis (Offline Mode)
======================================================================

Analyzing 60 components...
Manifest tracks 46 Shadcn components
Manifest tracks 14 custom components

======================================================================
Shadcn Components - Customization Analysis
======================================================================

📊 Customization Levels:
   ✓ Unmodified:          4 components
   ⚡ Light customization: 37 components
   🔧 Heavy customization: 5 components

🔧 Heavily Customized Components:

  card (147 lines)
    • Glassmorphism effects
    • Data-slot attributes (7 instances)
    • ObjectUI copyright header
    • Significantly different size (147 vs ~80 lines)

  form (176 lines)
    • Data-slot attributes (5 instances)
    • React Hook Form integration
    • ObjectUI copyright header

...

======================================================================
Update Recommendations
======================================================================

✅ Safe to update (minimal customizations):
   • calendar
   • sonner
   • table
   • toast

⚠️  Review carefully before updating (moderate customizations):
   • accordion
   • alert-dialog
   • button
   • input
   ...

🔧 Manual merge required (heavy customizations):
   • card
   • form
   • label
   • skeleton
   • tabs

● Do NOT update (custom ObjectUI components):
   • button-group
   • calendar-view
   • chatbot
   ...
```

**What This Tells You:**

1. **4 components are safe** - You can update these directly
2. **37 need review** - Check diffs before updating
3. **5 need manual merge** - Heavy customizations
4. **14 are custom** - Don't update from Shadcn

## Demo 2: Listing All Components

```bash
$ npm run shadcn:list
```

**Output:**
```
============================================================
Component List
============================================================

Shadcn Components:
  • accordion
  • alert
  • alert-dialog
  • aspect-ratio
  • avatar
  • badge
  • breadcrumb
  • button
  ...
  (46 total)

Custom ObjectUI Components:
  • button-group         Custom ObjectUI component - Button group wrapper
  • calendar-view        Custom ObjectUI component - Full calendar view
  • chatbot              Custom ObjectUI component - Chatbot interface
  ...
  (14 total)
```

**What This Tells You:**

- Which components come from Shadcn (can be updated)
- Which are ObjectUI-specific (should not be updated)

## Demo 3: Updating a Safe Component

Let's update the `toast` component (identified as safe):

```bash
# Step 1: Check current state
$ npm run shadcn:analyze | grep "toast"
✓ toast                     Synced with Shadcn

# Step 2: View current file
$ cat packages/components/src/ui/toast.tsx | head -20
/**
 * ObjectUI
 * Copyright (c) 2024-present ObjectStack Inc.
 */
import * as React from "react"
import * as ToastPrimitives from "@radix-ui/react-toast"
import { cva, type VariantProps } from "class-variance-authority"
...

# Step 3: Update with backup
$ npm run shadcn:update toast -- --backup

Updating toast...
Created backup: toast.tsx.1706252400000.backup
✓ Updated toast.tsx
  Dependencies: @radix-ui/react-toast

# Step 4: Review changes
$ git diff packages/components/src/ui/toast.tsx
diff --git a/packages/components/src/ui/toast.tsx b/packages/components/src/ui/toast.tsx
...
(shows the changes made)

# Step 5: Test
$ npm run test -- toast
✓ All tests passed

# Step 6: Commit
$ git add packages/components/src/ui/toast.tsx
$ git commit -m "chore(components): update toast to latest Shadcn version"
```

## Demo 4: Checking What Changed in a Component

Want to see what's different before updating?

```bash
$ npm run shadcn:diff button
```

**Output:**
```
============================================================
Component Diff: button
============================================================

Local version:
/**
 * ObjectUI
 * Copyright (c) 2024-present ObjectStack Inc.
 */

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "../lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2...",
  {
    variants: {
      variant: { ... },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
        "icon-sm": "h-8 w-8",      // ← ObjectUI custom
        "icon-lg": "h-10 w-10",    // ← ObjectUI custom
      },
    },
  }
)
...

Shadcn version:
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2...",
  {
    variants: {
      variant: { ... },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
      },
    },
  }
)
...

Local:  68 lines
Shadcn: 65 lines
```

**What You Learn:**

- ObjectUI has custom `icon-sm` and `icon-lg` sizes
- Import paths are different (`../lib/utils` vs `@/lib/utils`)
- ObjectUI has copyright header
- Size difference is small (3 lines)

**Decision:** You can update, but need to restore the custom sizes after.

## Demo 5: Batch Updating Components

Update multiple safe components at once:

```bash
# Step 1: Create a branch
$ git checkout -b chore/update-shadcn-safe-components

# Step 2: Identify safe components
$ npm run shadcn:analyze | grep "Safe to update" -A 10
✅ Safe to update (minimal customizations):
   • calendar
   • sonner
   • table
   • toast

# Step 3: Update each one
$ npm run shadcn:update calendar -- --backup
$ npm run shadcn:update sonner -- --backup
$ npm run shadcn:update table -- --backup
$ npm run shadcn:update toast -- --backup

# Step 4: Review all changes
$ git status
modified:   packages/components/src/ui/calendar.tsx
modified:   packages/components/src/ui/sonner.tsx
modified:   packages/components/src/ui/table.tsx
modified:   packages/components/src/ui/toast.tsx

$ git diff packages/components/src/ui/
(review each file's changes)

# Step 5: Test
$ npm test

# Step 6: Commit and push
$ git add packages/components/src/ui/
$ git commit -m "chore(components): update safe components to latest Shadcn"
$ git push origin chore/update-shadcn-safe-components
```

## Demo 6: Handling a Heavily Customized Component

Let's try updating `card` (identified as heavily customized):

```bash
# Step 1: Check what's custom
$ npm run shadcn:analyze | grep -A 5 "card"
  card (147 lines)
    • Glassmorphism effects
    • Data-slot attributes (7 instances)
    • ObjectUI copyright header
    • Significantly different size (147 vs ~80 lines)

# Step 2: View the diff
$ npm run shadcn:diff card
(shows significant differences)

# Step 3: Manual process
# 3a. Create backup
$ cp packages/components/src/ui/card.tsx \
     packages/components/src/ui/card.tsx.manual-backup

# 3b. Note ObjectUI customizations
$ grep -n "data-slot\|backdrop-blur\|glassmorphism" \
  packages/components/src/ui/card.tsx
12:  className={cn("... backdrop-blur-sm", className)}  data-slot="card"
25:  className={cn("...", className)}  data-slot="card-header"
...

# 3c. Get latest from Shadcn
$ npm run shadcn:update card

# 3d. Manually re-add customizations
$ vim packages/components/src/ui/card.tsx
(restore data-slot attributes, glassmorphism effects)

# 3e. Test extensively
$ npm test -- card
$ npm run build

# 3f. Commit
$ git add packages/components/src/ui/card.tsx
$ git commit -m "chore(components): update card with manual customization merge"
```

## Demo 7: Weekly Automated Check (GitHub Actions)

The GitHub Action runs automatically every Monday:

**Workflow Run Output:**
```
✓ Checkout code
✓ Setup pnpm
✓ Setup Node.js
✓ Install dependencies
✓ Analyze components (offline)
  
  Component analysis completed:
  - 4 unmodified
  - 37 light customization
  - 5 heavy customization
  - 14 custom

✓ Check component status (online)
  
  Modified components found:
  - button (15 lines difference)
  - dialog (8 lines difference)
  - select (12 lines difference)

✓ Create issue: "Shadcn Components Need Review"
```

**Created Issue:**
```
Title: Shadcn Components Need Review

## Shadcn Components Status Report

The weekly component sync check has detected issues or updates.

### Modified Components
- button: 15 lines difference
- dialog: 8 lines difference  
- select: 12 lines difference

### Next Steps
1. Review the analysis results
2. Run `npm run shadcn:analyze` locally
3. Update components with `npm run shadcn:update <component>`
4. See SHADCN_SYNC.md for detailed guide

Labels: maintenance, shadcn-sync, dependencies
```

## Real-World Scenarios

### Scenario 1: New Shadcn Feature Released

Shadcn adds a new feature to the Button component:

```bash
# 1. Check what changed
$ npm run shadcn:diff button

# 2. See that new "loading" variant was added
# 3. Update component
$ npm run shadcn:update button -- --backup

# 4. Restore ObjectUI custom sizes
$ vim packages/components/src/ui/button.tsx
# Add back icon-sm and icon-lg

# 5. Test and commit
```

### Scenario 2: Radix UI Version Bump

Shadcn updates to use a newer Radix UI version:

```bash
# 1. Update component
$ npm run shadcn:update select -- --backup

# 2. Check if dependency needs updating
$ npm run shadcn:list
# Shows: Dependencies: @radix-ui/react-select

# 3. Update dependency
$ cd packages/components
$ npm install @radix-ui/react-select@latest

# 4. Test thoroughly
$ npm test
```

### Scenario 3: Monthly Maintenance

Once a month, proactively check for updates:

```bash
# 1. Analyze current state
$ npm run shadcn:analyze > analysis.txt

# 2. Review safe components
$ grep "Safe to update" analysis.txt -A 5

# 3. Update safe ones
$ npm run shadcn:update calendar -- --backup
$ npm run shadcn:update table -- --backup

# 4. Create PR
$ git checkout -b chore/monthly-shadcn-sync
$ git add .
$ git commit -m "chore: monthly Shadcn component sync"
$ git push
```

## Tips & Tricks

### Tip 1: Quick Check Before Starting Work

```bash
# Always analyze before making component changes
$ npm run shadcn:analyze | grep "your-component"
```

### Tip 2: Backup Everything

```bash
# Create a full backup before bulk updates
$ cp -r packages/components/src/ui packages/components/src/ui.backup.$(date +%s)
```

### Tip 3: Selective Updates

```bash
# Update only form-related components
$ for comp in input textarea select checkbox radio-group; do
    npm run shadcn:update $comp -- --backup
  done
```

### Tip 4: Compare with Git

```bash
# Use git to see exactly what changed
$ git diff --word-diff packages/components/src/ui/button.tsx
```

## Conclusion

These tools make it easy to:
- ✅ Track which components need updates
- ✅ Safely update components with backups
- ✅ Preserve ObjectUI customizations
- ✅ Automate weekly checks
- ✅ Make informed decisions about updates

See the full documentation for more details!
