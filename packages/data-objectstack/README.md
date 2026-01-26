# @object-ui/data-objectstack

Official ObjectStack data adapter for Object UI.

## Overview

This package provides the `ObjectStackAdapter` class, which connects Object UI's universal `DataSource` interface with the `@objectstack/client` SDK.

This enables strictly typed, metadata-driven UI components to communicate seamlessly with ObjectStack backends (Steedos, Salesforce, etc.).

## Installation

```bash
npm install @object-ui/data-objectstack @objectstack/client
```

## Usage

```typescript
import { createObjectStackAdapter } from '@object-ui/data-objectstack';
import { SchemaRenderer } from '@object-ui/react';

// 1. Create the adapter
const dataSource = createObjectStackAdapter({
  baseUrl: 'https://api.example.com',
  token: 'your-api-token' // Optional if effectively handling auth elsewhere
});

// 2. Pass to the Renderer
function App() {
  return (
    <SchemaRenderer 
      schema={mySchema} 
      dataSource={dataSource} 
    />
  );
}
```

## Features

- ✅ **CRUD Operations**: Implements `find`, `findOne`, `create`, `update`, `delete`.
- ✅ **Metadata Fetching**: Implements `getObjectSchema` to power auto-generated forms and grids.
- ✅ **Query Translation**: Converts Object UI's OData-like query parameters to ObjectStack's native query format.
- ✅ **Bulk Operations**: Supports batch create/update/delete.
