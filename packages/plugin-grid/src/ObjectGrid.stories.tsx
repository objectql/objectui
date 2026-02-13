import type { Meta, StoryObj } from '@storybook/react';
import { SchemaRenderer, SchemaRendererProvider } from '@object-ui/react';
import type { BaseSchema } from '@object-ui/types';
import { createStorybookDataSource } from '@storybook-config/datasource';

const meta = {
  title: 'Plugins/ObjectGrid',
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

const dataSource = createStorybookDataSource();

const renderStory = (args: any) => (
  <SchemaRendererProvider dataSource={dataSource}>
    <SchemaRenderer schema={args as unknown as BaseSchema} />
  </SchemaRendererProvider>
);

export const Default: Story = {
  render: renderStory,
  args: {
    type: 'object-grid',
    objectName: 'Employee',
    columns: [
      { field: 'id', header: 'ID', width: 80 },
      { field: 'name', header: 'Name', sortable: true, filterable: true },
      { field: 'email', header: 'Email', sortable: true, filterable: true },
      { field: 'department', header: 'Department', sortable: true },
      { field: 'status', header: 'Status', sortable: true },
    ],
    data: [
      { id: 1, name: 'Alice Johnson', email: 'alice@example.com', department: 'Engineering', status: 'Active' },
      { id: 2, name: 'Bob Smith', email: 'bob@example.com', department: 'Marketing', status: 'Active' },
      { id: 3, name: 'Carol White', email: 'carol@example.com', department: 'Sales', status: 'Inactive' },
      { id: 4, name: 'Dave Brown', email: 'dave@example.com', department: 'Engineering', status: 'Active' },
      { id: 5, name: 'Eve Davis', email: 'eve@example.com', department: 'HR', status: 'Active' },
    ],
    pagination: true,
    pageSize: 10,
    className: 'w-full',
  } as any,
};

export const WithRowActions: Story = {
  render: renderStory,
  args: {
    type: 'object-grid',
    objectName: 'Task',
    columns: [
      { field: 'id', header: 'ID', width: 80 },
      { field: 'title', header: 'Title', sortable: true, filterable: true },
      { field: 'assignee', header: 'Assignee', sortable: true },
      { field: 'priority', header: 'Priority', sortable: true },
      { field: 'status', header: 'Status', sortable: true },
    ],
    actions: [
      { label: 'View', action: 'view' },
      { label: 'Edit', action: 'edit' },
      { label: 'Delete', action: 'delete', variant: 'destructive' },
    ],
    data: [
      { id: 1, title: 'Fix login bug', assignee: 'Alice', priority: 'High', status: 'In Progress' },
      { id: 2, title: 'Add dark mode', assignee: 'Bob', priority: 'Medium', status: 'To Do' },
      { id: 3, title: 'Update docs', assignee: 'Carol', priority: 'Low', status: 'Done' },
    ],
    pagination: true,
    pageSize: 10,
    className: 'w-full',
  } as any,
};

/**
 * CRM Deals Pipeline — demonstrates professional data formatting:
 * - Currency with thousand separators (Amount column, right-aligned)
 * - Percentage with progress bar (Probability column, right-aligned)
 * - Formatted dates (Close Date column)
 * - Colored badges for stage/status (Stage column)
 * - Bold clickable name as primary link (Name column)
 * - Empty value placeholder (Account column)
 */
export const CRMDeals: Story = {
  name: 'CRM Deals Pipeline',
  render: renderStory,
  args: {
    type: 'object-grid',
    objectName: 'Deal',
    columns: [
      { field: 'name', label: 'Name', link: true, sortable: true },
      { field: 'account', label: 'Account' },
      { field: 'stage', label: 'Stage', type: 'select', sortable: true },
      { field: 'amount', label: 'Amount', type: 'currency', sortable: true },
      { field: 'probability', label: 'Probability', type: 'percent', sortable: true },
      { field: 'close_date', label: 'Close Date', type: 'date', sortable: true },
    ],
    data: [
      { _id: '1', name: 'ObjectStack Enterprise License', account: '', stage: 'Closed Won', amount: 150000, probability: 100, close_date: '2024-01-15T00:00:00.000Z' },
      { _id: '2', name: 'Cloud Migration Project', account: 'Acme Corp', stage: 'Negotiation', amount: 85000, probability: 60, close_date: '2024-03-20T00:00:00.000Z' },
      { _id: '3', name: 'Annual Support Renewal', account: '', stage: 'Proposal', amount: 42000, probability: 80, close_date: '2024-02-28T00:00:00.000Z' },
      { _id: '4', name: 'Custom Integration Development', account: 'TechFlow Inc', stage: 'Qualification', amount: 230000, probability: 30, close_date: '2024-06-15T00:00:00.000Z' },
      { _id: '5', name: 'Data Analytics Platform', account: '', stage: 'Closed Lost', amount: 95000, probability: 0, close_date: '2024-01-10T00:00:00.000Z' },
      { _id: '6', name: 'Security Audit Contract', account: 'SecureNet', stage: 'Closed Won', amount: 67500, probability: 100, close_date: '2024-02-01T00:00:00.000Z' },
      { _id: '7', name: 'Mobile App Development', account: '', stage: 'Discovery', amount: 180000, probability: 15, close_date: '2024-08-30T00:00:00.000Z' },
    ],
    pagination: false,
    className: 'w-full',
  } as any,
};

export const EditableGrid: Story = {
  render: renderStory,
  args: {
    type: 'object-grid',
    objectName: 'Product',
    columns: [
      { field: 'sku', header: 'SKU', width: 100, editable: false },
      { field: 'name', header: 'Name', sortable: true },
      { field: 'price', header: 'Price', sortable: true },
      { field: 'stock', header: 'Stock', sortable: true },
    ],
    data: [
      { sku: 'SKU-001', name: 'Widget A', price: '$19.99', stock: 50 },
      { sku: 'SKU-002', name: 'Widget B', price: '$29.99', stock: 30 },
      { sku: 'SKU-003', name: 'Widget C', price: '$9.99', stock: 120 },
    ],
    editable: true,
    pagination: false,
    className: 'w-full',
  } as any,
};
