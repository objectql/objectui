# Bundle Size Optimization

## Problem

The `@object-ui/components` package had an excessively large bundle size:
- **Before**: 1.35MB (UMD), 1.77MB (ESM)
- **Gzipped**: 309KB (UMD), 353KB (ESM)

This was caused by bundling all dependencies (Radix UI, lucide-react, date-fns, etc.) into the package instead of externalizing them.

## Solution

### 1. Externalize Dependencies in `@object-ui/components`

Updated `packages/components/vite.config.ts` to externalize:
- All workspace dependencies (`@object-ui/*`)
- All Radix UI packages (`@radix-ui/*`)
- Heavy UI libraries (lucide-react, date-fns, react-day-picker, etc.)

**Result**:
- **After**: 199KB (UMD), 279KB (ESM) - **85% reduction!**
- **Gzipped**: 43KB (UMD), 50KB (ESM) - **86% reduction!**

### 2. Move Dependencies to peerDependencies

For all packages, moved heavy third-party dependencies from `dependencies` to `peerDependencies`:

#### `@object-ui/components`
All Radix UI components and utilities are now peer dependencies.

#### `@object-ui/plugin-charts`
- `recharts` → peerDependency
- Bundle: 8.8KB UMD (was likely much larger before)

#### `@object-ui/plugin-editor`
- `@monaco-editor/react` → peerDependency  
- Bundle: 2.1KB UMD

#### `@object-ui/plugin-kanban`
- `@dnd-kit/core`, `@dnd-kit/sortable`, `@dnd-kit/utilities` → peerDependencies
- Bundle: 5.6KB UMD

#### `@object-ui/plugin-markdown`
- `react-markdown`, `remark-gfm`, `rehype-sanitize` → peerDependencies
- Bundle: 2.6KB UMD

### 3. Added Bundle Analyzer

Added `rollup-plugin-visualizer` to the components package to track bundle composition over time.

## Benefits

1. **Smaller Downloads**: Users download significantly less code
2. **Better Tree-Shaking**: Modern bundlers can optimize better with externalized dependencies
3. **Deduplication**: If multiple Object UI packages use the same dependency, it's only installed once
4. **Flexibility**: Users can upgrade peer dependencies independently

## Migration Guide for Users

### Before (v0.2.0 and earlier)
```bash
npm install @object-ui/components
```

### After (v0.2.1+)
```bash
# Install core package
npm install @object-ui/components @object-ui/react @object-ui/core

# Install required peer dependencies
npm install @radix-ui/react-accordion @radix-ui/react-alert-dialog \
  @radix-ui/react-checkbox @radix-ui/react-dialog @radix-ui/react-dropdown-menu \
  @radix-ui/react-label @radix-ui/react-popover @radix-ui/react-select \
  @radix-ui/react-separator @radix-ui/react-slider @radix-ui/react-switch \
  @radix-ui/react-tabs lucide-react class-variance-authority clsx tailwind-merge

# Or install only what you need for specific components
```

For plugins:
```bash
# Charts plugin
npm install @object-ui/plugin-charts recharts

# Editor plugin  
npm install @object-ui/plugin-editor @monaco-editor/react

# Kanban plugin
npm install @object-ui/plugin-kanban @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities

# Markdown plugin
npm install @object-ui/plugin-markdown react-markdown remark-gfm rehype-sanitize
```

## Technical Details

### Why Externalize?

1. **Library Pattern**: Libraries should externalize dependencies that:
   - Are commonly used across projects (React, React DOM)
   - Are large and can be shared (Radix UI)
   - Have their own peer dependencies

2. **User Control**: Users can:
   - Choose specific versions (within semver range)
   - Avoid duplicate installations
   - Reduce total bundle size in their applications

### Vite Configuration

The key change in `vite.config.ts`:

```typescript
rollupOptions: {
  external: [
    'react',
    'react-dom',
    'react/jsx-runtime',
    '@object-ui/core',
    '@object-ui/react',
    '@object-ui/types',
    /^@radix-ui\/.*/,  // Regex for all Radix UI packages
    'class-variance-authority',
    'clsx',
    // ... other dependencies
  ],
}
```

## Monitoring

To analyze bundle size in the future:

```bash
cd packages/components
pnpm build
open dist/stats.html  # View bundle composition
```

## References

- [Rollup External](https://rollupjs.org/configuration-options/#external)
- [Vite Library Mode](https://vitejs.dev/guide/build.html#library-mode)
- [npm peerDependencies](https://docs.npmjs.com/cli/v10/configuring-npm/package-json#peerdependencies)
