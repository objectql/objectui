import { ObjectSchema, Field } from '@objectstack/spec/data';

export const AccountObject = ObjectSchema.create({
  name: 'account',
  label: 'Account',
  icon: 'building-2',
  description: 'Company and organization records for customer relationship management',
  fields: {
    name: Field.text({ label: 'Account Name', required: true, searchable: true, placeholder: 'Enter company name' }),
    industry: Field.select(['Technology', 'Finance', 'Healthcare', 'Retail', 'Manufacturing', 'Services'], { label: 'Industry', helpText: 'Primary industry vertical' }),
    rating: Field.select([
      { value: 'hot', label: 'Hot', color: 'red' },
      { value: 'warm', label: 'Warm', color: 'yellow' },
      { value: 'cold', label: 'Cold', color: 'blue' },
    ], { label: 'Rating', helpText: 'Account engagement temperature' }),
    type: Field.select(['Customer', 'Partner', 'Reseller', 'Vendor'], { label: 'Type', defaultValue: 'Customer' }),
    annual_revenue: Field.currency({ label: 'Annual Revenue', helpText: 'Estimated yearly revenue in USD' }),
    website: Field.url({ label: 'Website', placeholder: 'https://example.com' }),
    phone: Field.phone({ label: 'Phone', placeholder: '+1-555-000-0000' }),
    employees: Field.number({ label: 'Employees', helpText: 'Total headcount' }),
    billing_address: Field.textarea({ label: 'Billing Address' }),
    shipping_address: Field.textarea({ label: 'Shipping Address', helpText: 'Leave blank if same as billing' }),
    description: Field.richtext({ label: 'Description', helpText: 'Detailed account notes and background' }),
    tags: Field.select({
      options: [
        { label: 'Enterprise', value: 'enterprise', color: 'purple' },
        { label: 'SMB', value: 'smb', color: 'blue' },
        { label: 'Startup', value: 'startup', color: 'green' },
        { label: 'Government', value: 'government', color: 'gray' },
        { label: 'Strategic', value: 'strategic', color: 'red' },
      ],
      multiple: true,
      label: 'Tags',
    }),
    linkedin_url: Field.url({ label: 'LinkedIn', placeholder: 'https://linkedin.com/company/...' }),
    founded_date: Field.date({ label: 'Founded Date' }),
    latitude: Field.number({ label: 'Latitude', scale: 6 }),
    longitude: Field.number({ label: 'Longitude', scale: 6 }),
    owner: Field.lookup('user', { label: 'Owner' }),
    created_at: Field.datetime({ label: 'Created Date', readonly: true })
  }
});
