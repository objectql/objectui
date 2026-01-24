# Field Types Examples

Comprehensive examples demonstrating all ObjectUI field types in ObjectForm and ObjectTable.

## Complete CRM Contact Form

This example shows all field types in a realistic CRM contact management form:

```typescript
import { ObjectForm } from '@object-ui/plugin-object';

const contactFormSchema = {
  type: 'object-form',
  objectName: 'contacts',
  mode: 'create',
  title: 'New Contact',
  
  // Define all fields with various types
  customFields: [
    // Basic Information
    {
      name: 'firstName',
      type: 'text',
      label: 'First Name',
      required: true,
      placeholder: 'John',
      max_length: 50
    },
    {
      name: 'lastName',
      type: 'text',
      label: 'Last Name',
      required: true,
      placeholder: 'Doe',
      max_length: 50
    },
    {
      name: 'fullName',
      type: 'formula',
      label: 'Full Name',
      formula: 'CONCAT(firstName, " ", lastName)',
      readonly: true
    },
    
    // Contact Information
    {
      name: 'email',
      type: 'email',
      label: 'Email',
      required: true,
      placeholder: 'john.doe@example.com'
    },
    {
      name: 'phone',
      type: 'phone',
      label: 'Phone',
      placeholder: '+1 (555) 123-4567'
    },
    {
      name: 'website',
      type: 'url',
      label: 'Website',
      placeholder: 'https://example.com'
    },
    
    // Company Information
    {
      name: 'company',
      type: 'lookup',
      label: 'Company',
      reference_to: 'accounts',
      searchable: true
    },
    {
      name: 'title',
      type: 'text',
      label: 'Job Title',
      placeholder: 'Senior Manager'
    },
    {
      name: 'department',
      type: 'select',
      label: 'Department',
      options: [
        { value: 'sales', label: 'Sales', color: 'blue' },
        { value: 'marketing', label: 'Marketing', color: 'purple' },
        { value: 'engineering', label: 'Engineering', color: 'green' },
        { value: 'support', label: 'Support', color: 'orange' }
      ]
    },
    
    // Status and Priority
    {
      name: 'status',
      type: 'select',
      label: 'Status',
      options: [
        { value: 'active', label: 'Active', color: 'green' },
        { value: 'inactive', label: 'Inactive', color: 'gray' },
        { value: 'pending', label: 'Pending', color: 'yellow' }
      ],
      defaultValue: 'active'
    },
    {
      name: 'tags',
      type: 'select',
      label: 'Tags',
      multiple: true,
      searchable: true,
      options: [
        { value: 'vip', label: 'VIP', color: 'red' },
        { value: 'partner', label: 'Partner', color: 'blue' },
        { value: 'prospect', label: 'Prospect', color: 'yellow' }
      ]
    },
    
    // Financial
    {
      name: 'lifetimeValue',
      type: 'currency',
      label: 'Lifetime Value',
      currency: 'USD',
      precision: 2,
      min: 0
    },
    {
      name: 'conversionRate',
      type: 'percent',
      label: 'Conversion Rate',
      precision: 2,
      min: 0,
      max: 100
    },
    
    // Assignment
    {
      name: 'owner',
      type: 'owner',
      label: 'Account Owner',
      required: true
    },
    {
      name: 'assignedTo',
      type: 'user',
      label: 'Assigned To',
      multiple: false
    },
    
    // Dates
    {
      name: 'birthDate',
      type: 'date',
      label: 'Birth Date'
    },
    {
      name: 'lastContactDate',
      type: 'datetime',
      label: 'Last Contact',
      readonly: true
    },
    
    // Preferences
    {
      name: 'optInMarketing',
      type: 'boolean',
      label: 'Opt-in to Marketing',
      defaultValue: false
    },
    {
      name: 'preferredContactTime',
      type: 'time',
      label: 'Preferred Contact Time'
    },
    
    // Location
    {
      name: 'address',
      type: 'location',
      label: 'Address'
    },
    
    // Files
    {
      name: 'avatar',
      type: 'image',
      label: 'Profile Photo',
      accept: ['image/jpeg', 'image/png'],
      max_size: 2097152 // 2MB
    },
    {
      name: 'documents',
      type: 'file',
      label: 'Documents',
      multiple: true,
      max_files: 5,
      max_size: 10485760 // 10MB
    },
    
    // Notes
    {
      name: 'notes',
      type: 'textarea',
      label: 'Notes',
      rows: 4,
      placeholder: 'Add internal notes...'
    },
    {
      name: 'bio',
      type: 'markdown',
      label: 'Biography',
      max_length: 5000
    }
  ],
  
  // Group fields for better organization
  groups: [
    {
      title: 'Basic Information',
      fields: ['firstName', 'lastName', 'fullName']
    },
    {
      title: 'Contact Details',
      fields: ['email', 'phone', 'website']
    },
    {
      title: 'Company',
      fields: ['company', 'title', 'department']
    },
    {
      title: 'Status & Classification',
      fields: ['status', 'tags', 'lifetimeValue', 'conversionRate']
    },
    {
      title: 'Assignment',
      fields: ['owner', 'assignedTo']
    },
    {
      title: 'Important Dates',
      fields: ['birthDate', 'lastContactDate', 'preferredContactTime']
    },
    {
      title: 'Preferences',
      fields: ['optInMarketing', 'address']
    },
    {
      title: 'Media',
      fields: ['avatar', 'documents']
    },
    {
      title: 'Additional Information',
      fields: ['notes', 'bio'],
      collapsible: true,
      defaultCollapsed: true
    }
  ],
  
  layout: 'vertical',
  submitText: 'Create Contact',
  showCancel: true
};

// Usage
<ObjectForm 
  schema={contactFormSchema}
  dataSource={myDataSource}
/>
```

## ObjectTable with All Field Types

Display contacts in a table with type-aware cell rendering:

```typescript
import { ObjectTable } from '@object-ui/plugin-object';

const contactTableSchema = {
  type: 'object-table',
  objectName: 'contacts',
  title: 'Contacts',
  
  // Select which fields to display
  fields: [
    'avatar',
    'fullName',
    'email',
    'phone',
    'company',
    'status',
    'tags',
    'lifetimeValue',
    'owner',
    'lastContactDate',
    'optInMarketing'
  ],
  
  // Enable features
  selectable: 'multiple',
  showSearch: true,
  showFilters: true,
  showPagination: true,
  pageSize: 25,
  
  // Default sorting
  defaultSort: {
    field: 'lastContactDate',
    order: 'desc'
  },
  
  // Enable operations
  operations: {
    create: true,
    read: true,
    update: true,
    delete: true
  }
};

// Usage
<ObjectTable
  schema={contactTableSchema}
  dataSource={myDataSource}
  onEdit={(record) => console.log('Edit:', record)}
  onDelete={(record) => console.log('Delete:', record)}
/>
```

## Inline Data Example (No DataSource Required)

For demos and documentation, you can provide inline data:

```typescript
const demoTableSchema = {
  type: 'object-table',
  objectName: 'contacts',
  
  // Provide inline data
  data: [
    {
      id: 1,
      fullName: 'John Doe',
      email: 'john@example.com',
      phone: '+1 (555) 123-4567',
      status: 'active',
      tags: ['vip', 'partner'],
      lifetimeValue: 125000,
      optInMarketing: true
    },
    {
      id: 2,
      fullName: 'Jane Smith',
      email: 'jane@example.com',
      phone: '+1 (555) 987-6543',
      status: 'active',
      tags: ['prospect'],
      lifetimeValue: 45000,
      optInMarketing: false
    }
  ],
  
  // Define custom columns with field metadata
  columns: [
    {
      header: 'Name',
      accessorKey: 'fullName'
    },
    {
      header: 'Email',
      accessorKey: 'email'
    },
    {
      header: 'Status',
      accessorKey: 'status'
    },
    {
      header: 'Value',
      accessorKey: 'lifetimeValue'
    }
  ]
};

// No dataSource needed for inline data
<ObjectTable schema={demoTableSchema} />
```

## Individual Field Renderer Usage

You can also use field renderers directly in custom components:

```typescript
import { 
  getCellRenderer,
  CurrencyCellRenderer,
  UserCellRenderer 
} from '@object-ui/plugin-object';

// Get renderer by type
const CurrencyRenderer = getCellRenderer('currency');

// Use specific renderer
function MyCustomCell({ value, field }) {
  return (
    <div className="custom-wrapper">
      <CurrencyCellRenderer 
        value={value} 
        field={field}
      />
    </div>
  );
}

// Use in custom table
function CustomTable({ data }) {
  return (
    <table>
      <tbody>
        {data.map((row) => (
          <tr key={row.id}>
            <td>
              <UserCellRenderer 
                value={row.owner} 
                field={{ type: 'user', name: 'owner' }}
              />
            </td>
            <td>
              <CurrencyCellRenderer
                value={row.amount}
                field={{ 
                  type: 'currency', 
                  name: 'amount',
                  currency: 'USD'
                }}
              />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
```

## Field Type Feature Matrix

| Field Type | Cell View | Form Control | Sortable | Filterable | Searchable |
|------------|-----------|--------------|----------|------------|------------|
| text | ✓ | ✓ | ✓ | ✓ | ✓ |
| textarea | ✓ | ✓ | ✓ | ✓ | ✓ |
| number | ✓ | ✓ | ✓ | ✓ | ✓ |
| currency | ✓ | ✓ | ✓ | ✓ | - |
| percent | ✓ | ✓ | ✓ | ✓ | - |
| boolean | ✓ | ✓ | ✓ | ✓ | - |
| date | ✓ | ✓ | ✓ | ✓ | - |
| datetime | ✓ | ✓ | ✓ | ✓ | - |
| select | ✓ | ✓ | ✓ | ✓ | ✓ |
| email | ✓ | ✓ | ✓ | ✓ | ✓ |
| phone | ✓ | ✓ | ✓ | ✓ | ✓ |
| url | ✓ | ✓ | ✓ | ✓ | ✓ |
| file | ✓ | ✓ | - | - | - |
| image | ✓ | ✓ | - | - | - |
| lookup | ✓ | ✓ | ✓ | ✓ | ✓ |
| formula | ✓ | Read-only | ✓ | - | - |
| summary | ✓ | Read-only | ✓ | - | - |
| user | ✓ | ✓ | ✓ | ✓ | ✓ |
| password | Masked | ✓ | - | - | - |

✓ = Supported | - = Not applicable
