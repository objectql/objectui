/**
 * ObjectStack DataSource Adapter
 *
 * Re-exports the official @object-ui/data-objectstack adapter which provides:
 * - Auto-reconnect with exponential backoff
 * - Metadata caching (ETag-based)
 * - Batch operations with progress events
 * - Proper error handling (typed errors)
 * - OData-style query param conversion
 *
 * @see packages/data-objectstack/src/index.ts
 */

export { ObjectStackAdapter, createObjectStackAdapter } from '@object-ui/data-objectstack';
export type {
  ConnectionState,
  ConnectionStateEvent,
  BatchProgressEvent,
  ConnectionStateListener,
  BatchProgressListener,
} from '@object-ui/data-objectstack';

