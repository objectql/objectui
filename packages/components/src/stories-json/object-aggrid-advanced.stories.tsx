import type { Meta, StoryObj } from '@storybook/react';
import { SchemaRenderer } from '../SchemaRenderer';
import type { BaseSchema } from '@object-ui/types';

const meta = {
  title: 'Plugins/Data Views/Object AgGrid Advanced',
  component: SchemaRenderer,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    schema: { table: { disable: true } },
  },
} satisfies Meta<any>;

export default meta;
type Story = StoryObj<typeof meta>;

const renderStory = (args: any) => <SchemaRenderer schema={args as unknown as BaseSchema} />;

// Mock data source for demonstration
const createMockDataSource = (objectName: string, data: any[]) => {
  const mockSchema = {
    name: objectName,
    label: objectName.charAt(0).toUpperCase() + objectName.slice(1),
    fields: {} as any
  };

  // Infer fields from data
  if (data.length > 0) {
    const firstRow = data[0];
    Object.keys(firstRow).forEach(key => {
      let type = 'text';
      const value = firstRow[key];
      
      if (typeof value === 'number') type = 'number';
      else if (typeof value === 'boolean') type = 'boolean';
      else if (key.includes('email')) type = 'email';
      else if (key.includes('phone')) type = 'phone';
      else if (key.includes('url') || key.includes('website')) type = 'url';
      else if (key.includes('date')) type = 'date';
      else if (key.includes('price') || key.includes('cost') || key.includes('amount') || key.includes('salary')) type = 'currency';
      else if (key.includes('percent') || key.includes('rate')) type = 'percent';
      
      mockSchema.fields[key] = {
        name: key,
        label: key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' '),
        type,
        sortable: true,
        filterable: true,
        editable: key !== 'id' // All fields except ID are editable
      };
    });
  }

  return {
    find: async () => ({
      data,
      total: data.length,
      page: 1,
      pageSize: data.length,
      hasMore: false
    }),
    getObjectSchema: async () => mockSchema
  };
};

// Sample data for advanced examples
const employeesData = [
  { 
    id: '1', 
    name: 'Alice Johnson', 
    email: 'alice.j@company.com', 
    department: 'Engineering',
    position: 'Senior Developer',
    salary: 95000,
    start_date: '2020-01-15',
    status: 'Active'
  },
  { 
    id: '2', 
    name: 'Bob Smith', 
    email: 'bob.s@company.com', 
    department: 'Marketing',
    position: 'Marketing Manager',
    salary: 72000,
    start_date: '2021-03-20',
    status: 'Active'
  },
  { 
    id: '3', 
    name: 'Carol Davis', 
    email: 'carol.d@company.com', 
    department: 'Sales',
    position: 'Sales Representative',
    salary: 68000,
    start_date: '2021-06-10',
    status: 'Active'
  },
  { 
    id: '4', 
    name: 'David Wilson', 
    email: 'david.w@company.com', 
    department: 'Engineering',
    position: 'Lead Engineer',
    salary: 102000,
    start_date: '2019-08-01',
    status: 'Active'
  },
  { 
    id: '5', 
    name: 'Eve Brown', 
    email: 'eve.b@company.com', 
    department: 'HR',
    position: 'HR Specialist',
    salary: 65000,
    start_date: '2022-02-14',
    status: 'On Leave'
  },
  { 
    id: '6', 
    name: 'Frank Miller', 
    email: 'frank.m@company.com', 
    department: 'Engineering',
    position: 'Software Engineer',
    salary: 88000,
    start_date: '2021-11-03',
    status: 'Active'
  },
  { 
    id: '7', 
    name: 'Grace Lee', 
    email: 'grace.l@company.com', 
    department: 'Marketing',
    position: 'Content Writer',
    salary: 58000,
    start_date: '2022-05-22',
    status: 'Active'
  },
  { 
    id: '8', 
    name: 'Henry Clark', 
    email: 'henry.c@company.com', 
    department: 'Sales',
    position: 'Sales Manager',
    salary: 85000,
    start_date: '2020-09-15',
    status: 'Active'
  },
];

const ordersData = [
  { 
    id: 'ORD-001', 
    customer: 'Acme Corp',
    product: 'Enterprise License',
    quantity: 10,
    amount: 15750,
    date: '2024-01-15',
    status: 'Delivered'
  },
  { 
    id: 'ORD-002', 
    customer: 'TechStart Inc',
    product: 'Professional Plan',
    quantity: 5,
    amount: 8500,
    date: '2024-01-18',
    status: 'Shipped'
  },
  { 
    id: 'ORD-003', 
    customer: 'Global Solutions',
    product: 'Enterprise License',
    quantity: 15,
    amount: 22300,
    date: '2024-01-20',
    status: 'Processing'
  },
  { 
    id: 'ORD-004', 
    customer: 'Innovation Labs',
    product: 'Professional Plan',
    quantity: 8,
    amount: 12100,
    date: '2024-01-22',
    status: 'Delivered'
  },
  { 
    id: 'ORD-005', 
    customer: 'Future Systems',
    product: 'Starter Plan',
    quantity: 20,
    amount: 9800,
    date: '2024-01-25',
    status: 'Shipped'
  },
];

// Advanced Stories

export const WithStatusBarAndAggregations: Story = {
  render: renderStory,
  name: 'Status Bar & Aggregations',
  args: {
    type: 'object-aggrid',
    objectName: 'employees',
    dataSource: createMockDataSource('employees', employeesData),
    pagination: true,
    pageSize: 10,
    theme: 'quartz',
    height: 550,
    rowSelection: 'multiple',
    statusBar: {
      enabled: true,
      aggregations: ['count', 'sum', 'avg', 'min', 'max']
    },
    columnConfig: {
      resizable: true,
      sortable: true,
      filterable: true
    }
  } as any,
};

export const WithContextMenu: Story = {
  render: renderStory,
  name: 'Context Menu',
  args: {
    type: 'object-aggrid',
    objectName: 'employees',
    dataSource: createMockDataSource('employees', employeesData),
    pagination: true,
    pageSize: 10,
    theme: 'quartz',
    height: 500,
    contextMenu: {
      enabled: true,
      items: ['copy', 'copyWithHeaders', 'separator', 'export', 'autoSizeAll']
    },
    columnConfig: {
      resizable: true,
      sortable: true,
      filterable: true
    }
  } as any,
};

export const InlineEditingWithSelection: Story = {
  render: renderStory,
  name: 'Inline Editing + Row Selection',
  args: {
    type: 'object-aggrid',
    objectName: 'orders',
    dataSource: createMockDataSource('orders', ordersData),
    editable: true,
    singleClickEdit: true,
    pagination: true,
    pageSize: 10,
    theme: 'alpine',
    height: 500,
    rowSelection: 'multiple',
    columnConfig: {
      resizable: true,
      sortable: true,
      filterable: true
    }
  } as any,
};

export const FullFeatured: Story = {
  render: renderStory,
  name: 'Full Featured (All Options)',
  args: {
    type: 'object-aggrid',
    objectName: 'employees',
    dataSource: createMockDataSource('employees', employeesData),
    editable: true,
    singleClickEdit: false,
    pagination: true,
    pageSize: 5,
    theme: 'quartz',
    height: 600,
    rowSelection: 'multiple',
    animateRows: true,
    enableRangeSelection: true,
    exportConfig: {
      enabled: true,
      fileName: 'employees.csv'
    },
    statusBar: {
      enabled: true,
      aggregations: ['count', 'sum', 'avg']
    },
    contextMenu: {
      enabled: true,
      items: ['copy', 'copyWithHeaders', 'separator', 'export', 'autoSizeAll']
    },
    columnConfig: {
      resizable: true,
      sortable: true,
      filterable: true
    }
  } as any,
};

export const AlpineThemeFullFeatured: Story = {
  render: renderStory,
  name: 'Alpine Theme (Full Featured)',
  args: {
    type: 'object-aggrid',
    objectName: 'orders',
    dataSource: createMockDataSource('orders', ordersData),
    editable: true,
    singleClickEdit: true,
    pagination: true,
    pageSize: 5,
    theme: 'alpine',
    height: 550,
    rowSelection: 'multiple',
    exportConfig: {
      enabled: true,
      fileName: 'orders.csv'
    },
    statusBar: {
      enabled: true,
      aggregations: ['count', 'sum']
    },
    contextMenu: {
      enabled: true,
      items: ['copy', 'export', 'autoSizeAll']
    },
    columnConfig: {
      resizable: true,
      sortable: true,
      filterable: true
    }
  } as any,
};

export const BalhamThemeWithExport: Story = {
  render: renderStory,
  name: 'Balham Theme + Export',
  args: {
    type: 'object-aggrid',
    objectName: 'employees',
    dataSource: createMockDataSource('employees', employeesData),
    pagination: true,
    pageSize: 10,
    theme: 'balham',
    height: 500,
    rowSelection: 'multiple',
    exportConfig: {
      enabled: true,
      fileName: 'employees-balham.csv',
      onlySelected: true
    },
    columnConfig: {
      resizable: true,
      sortable: true,
      filterable: true
    }
  } as any,
};

export const MaterialThemeWithStatusBar: Story = {
  render: renderStory,
  name: 'Material Theme + Status Bar',
  args: {
    type: 'object-aggrid',
    objectName: 'orders',
    dataSource: createMockDataSource('orders', ordersData),
    pagination: true,
    pageSize: 10,
    theme: 'material',
    height: 550,
    rowSelection: 'multiple',
    statusBar: {
      enabled: true,
      aggregations: ['count', 'sum', 'avg']
    },
    columnConfig: {
      resizable: true,
      sortable: true,
      filterable: true
    }
  } as any,
};
