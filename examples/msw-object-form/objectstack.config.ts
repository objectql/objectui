import { defineStack } from '@objectstack/spec';

/**
 * Contact Object Definition
 * Used for demonstrating ObjectForm with various field types
 */
export const ContactObject = {
  name: 'contact',
  label: 'Contact',
  description: 'Contact management object for testing ObjectForm',
  icon: 'user',
  titleFormat: '{name}',
  enable: {
    apiEnabled: true,
    trackHistory: false,
    feeds: false,
    activities: false,
    mru: true,
  },
  fields: {
    id: { 
      name: 'id', 
      label: 'ID', 
      type: 'text', 
      required: true 
    },
    name: { 
      name: 'name', 
      label: 'Full Name', 
      type: 'text', 
      required: true,
      max_length: 100
    },
    email: { 
      name: 'email', 
      label: 'Email', 
      type: 'email', 
      required: true 
    },
    phone: { 
      name: 'phone', 
      label: 'Phone Number', 
      type: 'phone' 
    },
    company: { 
      name: 'company', 
      label: 'Company', 
      type: 'text' 
    },
    position: { 
      name: 'position', 
      label: 'Position', 
      type: 'text' 
    },
    notes: { 
      name: 'notes', 
      label: 'Notes', 
      type: 'textarea' 
    },
    is_active: { 
      name: 'is_active', 
      label: 'Active', 
      type: 'boolean', 
      defaultValue: true 
    },
    priority: { 
      name: 'priority', 
      label: 'Priority', 
      type: 'number', 
      defaultValue: 5,
      min: 1,
      max: 10
    },
    // New fields for testing all types
    salary: {
      name: 'salary',
      label: 'Salary (Currency)',
      type: 'currency',
      precision: 2
    },
    commission_rate: {
      name: 'commission_rate',
      label: 'Commission Rate (Percent)',
      type: 'percent',
      precision: 2
    },
    birthdate: {
      name: 'birthdate',
      label: 'Birth Date (Date)',
      type: 'date'
    },
    last_contacted: {
      name: 'last_contacted',
      label: 'Last Contacted (DateTime)',
      type: 'datetime'
    },
    available_time: {
      name: 'available_time',
      label: 'Preferred Time (Time)',
      type: 'time'
    },
     profile_url: {
      name: 'profile_url',
      label: 'LinkedIn Profile (URL)',
      type: 'url'
    },
    department: {
      name: 'department',
      label: 'Department (Select)',
      type: 'select',
      options: [
        { label: 'Sales', value: 'sales' },
        { label: 'Marketing', value: 'marketing' },
        { label: 'Engineering', value: 'engineering' },
        { label: 'HR', value: 'hr' }
      ]
    },
    resume: {
      name: 'resume',
      label: 'Resume (File)',
      type: 'file'
    },
    avatar: {
      name: 'avatar',
      label: 'Avatar (Image)',
      type: 'image'
    },
    created_at: { 
      name: 'created_at', 
      label: 'Created At', 
      type: 'datetime' 
    }
  }
};

/**
 * App Configuration
 */
export default defineStack({
  name: 'contact_app',
  label: 'Contact Management',
  description: 'MSW + ObjectForm Example with ObjectStack',
  version: '1.0.0',
  icon: 'users',
  branding: {
    primaryColor: '#3b82f6',
    logo: '/assets/logo.png',
  },
  objects: [
    ContactObject
  ],
  navigation: [
    {
      id: 'group_contacts',
      type: 'group',
      label: 'Contacts',
      children: [
        { 
          id: 'nav_contacts',
          type: 'object', 
          objectName: 'contact',
          label: 'All Contacts'
        }
      ]
    }
  ],
  manifest: {
    data: [
      {
        object: 'contact',
        records: [
          {
            id: '1',
            name: 'John Doe',
            email: 'john.doe@example.com',
            phone: '+1234567890',
            company: 'Acme Corp',
            position: 'Software Engineer',
            notes: 'Initial contact from tech conference',
            is_active: true,
            priority: 8,
            salary: 120000,
            commission_rate: 0.05,
            birthdate: '1990-05-15',
            last_contacted: new Date('2024-05-01T10:00:00').toISOString(),
            available_time: '09:00:00',
            profile_url: 'https://linkedin.com/in/johndoe',
            department: 'engineering',
            created_at: new Date('2024-01-15').toISOString()
          },
          {
            id: '2',
            name: 'Jane Smith',
            email: 'jane.smith@example.com',
            phone: '+1987654321',
            company: 'Tech Solutions',
            position: 'Product Manager',
            notes: 'Met at product launch event',
            is_active: true,
            priority: 7,
            salary: 135000,
            commission_rate: 0.1,
            birthdate: '1988-11-20',
            last_contacted: new Date('2024-05-02T14:30:00').toISOString(),
            available_time: '14:00:00',
            profile_url: 'https://linkedin.com/in/janesmith',
            department: 'marketing',
            created_at: new Date('2024-02-20').toISOString()
          },
          {
            id: '3',
            name: 'Bob Johnson',
            email: 'bob.johnson@example.com',
            phone: '+1555123456',
            company: 'StartupXYZ',
            position: 'CTO',
            notes: '',
            is_active: false,
            priority: 5,
            salary: 180000,
            commission_rate: 0,
            birthdate: '1985-03-30',
            last_contacted: new Date('2024-04-15T09:00:00').toISOString(),
            available_time: '10:30:00',
            profile_url: 'https://linkedin.com/in/bobjohnson',
            department: 'engineering',
            created_at: new Date('2024-03-10').toISOString()
          }
        ]
      }
    ]
  }
});
