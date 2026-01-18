/**
 * ObjectUI
 * Copyright (c) 2024-present ObjectStack Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * @object-ui/data-objectql
 * 
 * ObjectQL Data Source Adapter for Object UI
 * 
 * This package provides seamless integration between Object UI components
 * and ObjectQL API backends, implementing the universal DataSource interface.
 * 
 * @packageDocumentation
 */

export { 
  ObjectQLDataSource, 
  createObjectQLDataSource,
  type ObjectQLConfig,
  type ObjectQLQueryParams,
} from './ObjectQLDataSource';

export { 
  useObjectQL,
  useObjectQLQuery,
  useObjectQLMutation,
  type UseObjectQLOptions,
  type UseObjectQLQueryOptions,
  type UseObjectQLMutationOptions,
} from './hooks';
