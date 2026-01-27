/**
 * Example schema demonstrating all field types according to ObjectStack spec
 */

export const fieldTypesExample = {
  name: 'example_object',
  label: 'Field Types Example',
  description: 'Demonstrates all available field types',
  fields: {
    // Text fields
    text_field: {
      name: 'text_field',
      label: 'Text Field',
      type: 'text',
      placeholder: 'Enter text...',
    },
    textarea_field: {
      name: 'textarea_field',
      label: 'Textarea Field',
      type: 'textarea',
      rows: 4,
    },
    
    // Numeric fields
    number_field: {
      name: 'number_field',
      label: 'Number Field',
      type: 'number',
      precision: 2,
    },
    currency_field: {
      name: 'currency_field',
      label: 'Currency Field',
      type: 'currency',
      currency: 'USD',
    },
    percent_field: {
      name: 'percent_field',
      label: 'Percent Field',
      type: 'percent',
      precision: 2,
    },
    
    // Boolean field
    boolean_field: {
      name: 'boolean_field',
      label: 'Boolean Field',
      type: 'boolean',
    },
    
    // Date/Time fields
    date_field: {
      name: 'date_field',
      label: 'Date Field',
      type: 'date',
    },
    datetime_field: {
      name: 'datetime_field',
      label: 'DateTime Field',
      type: 'datetime',
    },
    time_field: {
      name: 'time_field',
      label: 'Time Field',
      type: 'time',
    },
    
    // Selection field
    select_field: {
      name: 'select_field',
      label: 'Select Field',
      type: 'select',
      options: [
        { label: 'Option 1', value: 'opt1', color: 'blue' },
        { label: 'Option 2', value: 'opt2', color: 'green' },
        { label: 'Option 3', value: 'opt3', color: 'red' },
      ],
    },
    
    // Contact fields
    email_field: {
      name: 'email_field',
      label: 'Email Field',
      type: 'email',
    },
    phone_field: {
      name: 'phone_field',
      label: 'Phone Field',
      type: 'phone',
    },
    url_field: {
      name: 'url_field',
      label: 'URL Field',
      type: 'url',
    },
    password_field: {
      name: 'password_field',
      label: 'Password Field',
      type: 'password',
    },
    
    // File fields
    file_field: {
      name: 'file_field',
      label: 'File Field',
      type: 'file',
      multiple: true,
      accept: ['application/pdf', 'image/*'],
    },
    image_field: {
      name: 'image_field',
      label: 'Image Field',
      type: 'image',
      multiple: true,
    },
    
    // Location field
    location_field: {
      name: 'location_field',
      label: 'Location Field',
      type: 'location',
      placeholder: 'latitude, longitude',
    },
    
    // Lookup/Relation field
    lookup_field: {
      name: 'lookup_field',
      label: 'Lookup Field',
      type: 'lookup',
      reference_to: 'users',
      multiple: false,
    },
    master_detail_field: {
      name: 'master_detail_field',
      label: 'Master Detail Field',
      type: 'master_detail',
      reference_to: 'accounts',
    },
    
    // Computed/Read-only fields
    formula_field: {
      name: 'formula_field',
      label: 'Formula Field',
      type: 'formula',
      formula: 'number_field * percent_field',
      return_type: 'number',
      readonly: true,
    },
    summary_field: {
      name: 'summary_field',
      label: 'Summary Field',
      type: 'summary',
      summary_object: 'orders',
      summary_field: 'amount',
      summary_type: 'sum',
      readonly: true,
    },
    auto_number_field: {
      name: 'auto_number_field',
      label: 'Auto Number',
      type: 'auto_number',
      format: 'ORD-{0000}',
      readonly: true,
    },
    
    // User field
    user_field: {
      name: 'user_field',
      label: 'User Field',
      type: 'user',
      multiple: false,
    },
    owner_field: {
      name: 'owner_field',
      label: 'Owner Field',
      type: 'owner',
      readonly: true,
    },
    
    // Rich text fields
    markdown_field: {
      name: 'markdown_field',
      label: 'Markdown Field',
      type: 'markdown',
    },
    html_field: {
      name: 'html_field',
      label: 'HTML Field',
      type: 'html',
    },
    
    // Complex data types
    object_field: {
      name: 'object_field',
      label: 'Object Field',
      type: 'object',
      schema: {
        key: 'string',
        value: 'any',
      },
    },
    vector_field: {
      name: 'vector_field',
      label: 'Vector Field',
      type: 'vector',
      dimensions: 768,
      readonly: true,
    },
    grid_field: {
      name: 'grid_field',
      label: 'Grid Field',
      type: 'grid',
      columns: [
        { name: 'item', label: 'Item', type: 'text' },
        { name: 'quantity', label: 'Quantity', type: 'number' },
        { name: 'price', label: 'Price', type: 'currency' },
      ],
    },
  },
};
