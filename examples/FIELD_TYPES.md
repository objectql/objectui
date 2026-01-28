# Field Types Implementation

This document describes all field type components implemented according to the ObjectStack specification protocol.

## Overview

All field types defined in `@object-ui/types/field-types.ts` are now implemented with corresponding widget components in `@object-ui/fields`.

## Field Type Categories

### Text Fields

#### Text Field
- **Type**: `text`
- **Component**: `TextField`
- **Description**: Single-line text input
- **Props**: `min_length`, `max_length`, `pattern`

#### Textarea Field
- **Type**: `textarea`
- **Component**: `TextAreaField`
- **Description**: Multi-line text input
- **Props**: `rows`, `min_length`, `max_length`

#### Markdown Field
- **Type**: `markdown`
- **Component**: `RichTextField`
- **Description**: Markdown editor
- **Props**: `max_length`

#### HTML Field
- **Type**: `html`
- **Component**: `RichTextField`
- **Description**: Rich text HTML editor
- **Props**: `max_length`

### Numeric Fields

#### Number Field
- **Type**: `number`
- **Component**: `NumberField`
- **Description**: Numeric input with precision
- **Props**: `min`, `max`, `precision`, `step`

#### Currency Field
- **Type**: `currency`
- **Component**: `CurrencyField`
- **Description**: Currency input with symbol and formatting
- **Props**: `currency`, `precision`, `min`, `max`
- **Features**: Auto-formats on blur, shows currency symbol

#### Percent Field ✨ NEW
- **Type**: `percent`
- **Component**: `PercentField`
- **Description**: Percentage input (stores 0-1, displays 0-100)
- **Props**: `precision`, `min`, `max`
- **Features**: Automatic % conversion and display

### Boolean Field

#### Boolean Field
- **Type**: `boolean`
- **Component**: `BooleanField`
- **Description**: Switch or checkbox toggle
- **Props**: `widget` (switch or checkbox)

### Date/Time Fields

#### Date Field
- **Type**: `date`
- **Component**: `DateField`
- **Description**: Date picker
- **Props**: `format`, `min_date`, `max_date`

#### DateTime Field ✨ NEW
- **Type**: `datetime`
- **Component**: `DateTimeField`
- **Description**: Date and time picker
- **Props**: `format`, `min_date`, `max_date`

#### Time Field ✨ NEW
- **Type**: `time`
- **Component**: `TimeField`
- **Description**: Time-only picker
- **Props**: `format`

### Selection Fields

#### Select Field
- **Type**: `select`
- **Component**: `SelectField`
- **Description**: Dropdown select with options
- **Props**: `options`, `multiple`, `searchable`
- **Features**: Badge display with colors

#### Lookup Field
- **Type**: `lookup` or `master_detail`
- **Component**: `LookupField`
- **Description**: Reference to another object
- **Props**: `reference_to`, `reference_field`, `multiple`, `searchable`

### Contact Fields

#### Email Field
- **Type**: `email`
- **Component**: `EmailField`
- **Description**: Email input with validation
- **Props**: `max_length`
- **Features**: Auto-validation, mailto: links

#### Phone Field
- **Type**: `phone`
- **Component**: `PhoneField`
- **Description**: Phone number input
- **Props**: `format`
- **Features**: tel: links

#### URL Field
- **Type**: `url`
- **Component**: `UrlField`
- **Description**: URL input with validation
- **Props**: `max_length`
- **Features**: Opens in new tab

#### Password Field ✨ NEW
- **Type**: `password`
- **Component**: `PasswordField`
- **Description**: Password input with show/hide toggle
- **Props**: `min_length`, `max_length`
- **Features**: Toggle visibility button

### File Fields

#### File Field ✨ NEW
- **Type**: `file`
- **Component**: `FileField`
- **Description**: File upload with preview
- **Props**: `multiple`, `accept`, `max_size`, `max_files`
- **Features**: File list, remove files, size display

#### Image Field ✨ NEW
- **Type**: `image`
- **Component**: `ImageField`
- **Description**: Image upload with thumbnails
- **Props**: `multiple`, `accept`, `max_size`, `max_files`, `max_width`, `max_height`
- **Features**: Thumbnail grid, hover to remove

### Location Field

#### Location Field ✨ NEW
- **Type**: `location`
- **Component**: `LocationField`
- **Description**: Geographic coordinates input
- **Props**: `default_zoom`
- **Format**: Stores as `{ latitude: number, longitude: number }`
- **Display**: "latitude, longitude" format

### Computed/Read-only Fields

#### Formula Field ✨ NEW
- **Type**: `formula`
- **Component**: `FormulaField`
- **Description**: Computed field from formula
- **Props**: `formula`, `return_type`
- **Features**: Read-only, formatted by return type

#### Summary Field ✨ NEW
- **Type**: `summary`
- **Component**: `SummaryField`
- **Description**: Aggregation from related records
- **Props**: `summary_object`, `summary_field`, `summary_type` (count, sum, avg, min, max)
- **Features**: Read-only, tabular number display

#### AutoNumber Field ✨ NEW
- **Type**: `auto_number`
- **Component**: `AutoNumberField`
- **Description**: Auto-generated sequence number
- **Props**: `format`, `starting_number`
- **Features**: Read-only, monospace display

### User Fields

#### User Field ✨ NEW
- **Type**: `user` or `owner`
- **Component**: `UserField`
- **Description**: User/owner selector
- **Props**: `multiple`
- **Features**: Avatar display, badge list

### Complex Data Types

#### Object Field ✨ NEW
- **Type**: `object`
- **Component**: `ObjectField`
- **Description**: JSON object editor
- **Props**: `schema`
- **Features**: Textarea with JSON validation, syntax highlighting

#### Vector Field ✨ NEW
- **Type**: `vector`
- **Component**: `VectorField`
- **Description**: Vector embeddings display
- **Props**: `dimensions`
- **Features**: Read-only, shows preview of first values and dimensions

#### Grid Field ✨ NEW
- **Type**: `grid`
- **Component**: `GridField`
- **Description**: Sub-table/inline grid
- **Props**: `columns`
- **Features**: Table view, pagination preview

## Usage

### Registration

All field types are automatically registered when you call `registerFields()`:

\`\`\`typescript
import { registerFields } from '@object-ui/fields';

registerFields();
\`\`\`

### Using Field Types

Define fields in your object schema:

\`\`\`typescript
import { ObjectSchemaMetadata } from '@object-ui/types';

const schema: ObjectSchemaMetadata = {
  name: 'contact',
  label: 'Contact',
  fields: {
    name: {
      name: 'name',
      label: 'Full Name',
      type: 'text',
      required: true,
    },
    email: {
      name: 'email',
      label: 'Email',
      type: 'email',
      required: true,
    },
    percentage: {
      name: 'percentage',
      label: 'Completion',
      type: 'percent',
      precision: 1,
    },
    // ... more fields
  },
};
\`\`\`

### Custom Styling

All field components accept `className` prop for custom Tailwind styling:

\`\`\`typescript
<TextField 
  field={fieldMetadata}
  value={value}
  onChange={onChange}
  className="custom-class"
/>
\`\`\`

## Implementation Notes

### File Upload
- File and Image fields create object URLs for preview
- Actual file upload requires backend integration
- File metadata structure: `{ name, original_name, size, mime_type, url }`

### User Selection
- UserField displays avatars with initials
- Actual user selection requires integration with user management system

### Read-only Fields
- Formula, Summary, AutoNumber, and Vector fields are display-only
- Values must be computed/generated by the backend

### Data Format Standards
- **Location**: Always stores as `{ latitude: number, longitude: number }`
- **Percent**: Stores as decimal (0-1), displays as percentage (0-100)
- **Currency**: Stores as number, formats according to currency code
- **DateTime**: Stores as ISO 8601 string

## Testing

Build the fields package:

\`\`\`bash
pnpm --filter @object-ui/fields build
\`\`\`

All 26+ field types are now available and registered!

## See Also

- [ObjectStack Field Types Specification](../../packages/types/src/field-types.ts)
- [Example Schema](./field-types-example.ts)
