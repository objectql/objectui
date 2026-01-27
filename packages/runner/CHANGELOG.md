# @object-ui/runner

## 0.3.1

### Patch Changes

- Release version 0.4.0 with package restructure changes

  This release documents the package restructure where `@object-ui/plugin-object` has been upgraded to a core package and renamed to `@object-ui/views`. The functionality remains the same, only the package name and classification have changed.

- Updated dependencies
  - @object-ui/core@0.3.1
  - @object-ui/react@0.3.1
  - @object-ui/components@0.3.1
  - @object-ui/types@0.3.1
  - @object-ui/plugin-charts@0.3.1
  - @object-ui/plugin-kanban@0.3.1

## 0.3.0

### Minor Changes

- Unified version across all packages to 0.3.0 for consistent versioning

## 0.1.1

### Patch Changes

- New plugin-object and ObjectQL SDK updates

  **Added:**
  - New Plugin: @object-ui/plugin-object - ObjectQL plugin for automatic table and form generation
    - ObjectTable: Auto-generates tables from ObjectQL object schemas
    - ObjectForm: Auto-generates forms from ObjectQL object schemas with create/edit/view modes
    - Full TypeScript support with comprehensive type definitions
  - Type Definitions: Added ObjectTableSchema and ObjectFormSchema to @object-ui/types
  - ObjectQL Integration: Enhanced ObjectQLDataSource with getObjectSchema() method using MetadataApiClient

  **Changed:**
  - Updated @objectql/sdk from ^1.8.3 to ^1.9.1
  - Updated @objectql/types from ^1.8.3 to ^1.9.1

- Updated dependencies
  - @object-ui/types@0.3.0
  - @object-ui/core@0.2.2
  - @object-ui/react@0.2.2
  - @object-ui/components@0.2.2
  - @object-ui/plugin-charts@0.2.2
  - @object-ui/plugin-kanban@0.2.2
