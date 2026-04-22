/**
 * MetadataProvider (console re-export shim)
 *
 * The runtime metadata cache implementation lives in `@object-ui/app-shell`
 * (see PR #1262 — "Extract console core providers and hooks to
 * @object-ui/app-shell"). `App.tsx` mounts `<MetadataProvider>` from the
 * app-shell package, so any consumer that imports `useMetadata` from a
 * different module ends up reading a *different* React context and throws
 * "useMetadata must be used within a <MetadataProvider>".
 *
 * This file used to hold a parallel copy of the provider with its own
 * `createContext`. We now re-export the single source of truth from
 * `@object-ui/app-shell` so the many existing
 * `from '../../context/MetadataProvider'` and `vi.mock('../context/MetadataProvider', ...)`
 * call sites keep working without touching them.
 *
 * @module
 */

export {
  MetadataProvider,
  useMetadata,
  useMetadataItem,
} from '@object-ui/app-shell';

export type {
  MetadataState,
  MetadataContextValue,
  MetadataTypeStatus,
} from '@object-ui/app-shell';
