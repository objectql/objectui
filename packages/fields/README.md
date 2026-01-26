# @object-ui/fields

The standard field library and registry for Object UI.

## Features

- 📚 **Standard Fields** - Implementation of all ObjectStack protocol fields (Text, Number, Date, Lookup, etc.)
- 🔌 **Plugin System** - `FieldRegistry` allows registering custom renderers or overriding standard ones.
- 🛠 **Helpers** - Utilities for schema mapping, validation, and expression evaluation.

## Installation

```bash
npm install @object-ui/fields
```

## Field Registry

The Field Registry is the core mechanism that allows decoupling view components from specific field implementations.

### Registering a Custom Field

You can override standard fields or add new ones:

```tsx
import { registerFieldRenderer } from '@object-ui/fields';
import { MyCustomColorPicker } from './MyCustomColorPicker';

// Register a new 'color' field type
registerFieldRenderer('color', MyCustomColorPicker);
```

### Using Standard Fields

View components use `getCellRenderer` to resolve the correct component for a field type.

```tsx
import { getCellRenderer } from '@object-ui/fields';

const MyGridCell = ({ field, value }) => {
  const Renderer = getCellRenderer(field.type);
  return <Renderer field={field} value={value} />;
};
```

## Standard Field Types

Supported types out of the box:

- **Basic**: `text`, `textarea`, `number`, `boolean`
- **Format**: `currency`, `percent`
- **Date**: `date`, `datetime`, `time`
- **Selection**: `select`, `lookup`, `master_detail`
- **Contact**: `email`, `phone`, `url`
- **Media**: `file`, `image`
- **System**: `formula`, `summary`, `auto_number`
