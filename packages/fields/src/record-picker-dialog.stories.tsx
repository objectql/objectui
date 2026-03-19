import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import { RecordPickerDialog } from './widgets/RecordPickerDialog';
import type { DataSource } from '@object-ui/types';

/**
 * **RecordPickerDialog** — Enterprise-grade record picker for lookup fields.
 *
 * Features: skeleton loading, sticky table header, column sort,
 * keyboard navigation, page jump, inline filter bar, column resize,
 * and responsive layout.
 */
const meta = {
  title: 'Fields/RecordPickerDialog',
  component: RecordPickerDialog,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof RecordPickerDialog>;

export default meta;
type Story = StoryObj<typeof RecordPickerDialog>;

/* ------------------------------------------------------------------ */
/*  Mock data used by all stories                                     */
/* ------------------------------------------------------------------ */

const MOCK_ORDERS = [
  { id: '1', order_number: 'ORD-2024-001', amount: 15459.99, status: 'Paid',      order_date: '2024-01-15' },
  { id: '2', order_number: 'ORD-2024-002', amount: 289.50,   status: 'Pending',   order_date: '2024-01-18' },
  { id: '3', order_number: 'ORD-2024-003', amount: 5549.99,  status: 'Shipped',   order_date: '2024-02-05' },
  { id: '4', order_number: 'ORD-2024-004', amount: 42500.00, status: 'Delivered', order_date: '2024-02-20' },
  { id: '5', order_number: 'ORD-2024-005', amount: 1250.00,  status: 'Draft',     order_date: '2024-03-01' },
  { id: '6', order_number: 'ORD-2024-006', amount: 8999.94,  status: 'Paid',      order_date: '2024-03-15' },
  { id: '7', order_number: 'ORD-2024-007', amount: 3200.00,  status: 'Shipped',   order_date: '2024-04-02' },
  { id: '8', order_number: 'ORD-2024-008', amount: 750.00,   status: 'Pending',   order_date: '2024-04-10' },
  { id: '9', order_number: 'ORD-2024-009', amount: 19800.00, status: 'Delivered', order_date: '2024-04-22' },
  { id: '10', order_number: 'ORD-2024-010', amount: 4500.00, status: 'Paid',      order_date: '2024-05-01' },
  { id: '11', order_number: 'ORD-2024-011', amount: 670.00,  status: 'Draft',     order_date: '2024-05-08' },
  { id: '12', order_number: 'ORD-2024-012', amount: 12345.67, status: 'Shipped',  order_date: '2024-05-15' },
];

/** Simulate async DataSource.find with pagination + search */
function createMockDataSource(): DataSource {
  return {
    find: async (_objectName: string, params: any) => {
      await new Promise(r => setTimeout(r, 400)); // simulate latency
      let data = [...MOCK_ORDERS];

      // Search filter
      if (params?.$search) {
        const q = params.$search.toLowerCase();
        data = data.filter(
          r =>
            r.order_number.toLowerCase().includes(q) ||
            r.status.toLowerCase().includes(q),
        );
      }

      // Sort
      if (params?.$orderby) {
        const entries = Object.entries(params.$orderby);
        if (entries.length > 0) {
          const [field, dir] = entries[0] as [string, string];
          data.sort((a: any, b: any) => {
            if (a[field] < b[field]) return dir === 'asc' ? -1 : 1;
            if (a[field] > b[field]) return dir === 'asc' ? 1 : -1;
            return 0;
          });
        }
      }

      const total = data.length;
      const skip = params?.$skip ?? 0;
      const top = params?.$top ?? 10;
      return { data: data.slice(skip, skip + top), total };
    },
    findOne: async () => null,
    create: async () => ({}),
    update: async () => ({}),
    delete: async () => ({}),
  } as unknown as DataSource;
}

/* ------------------------------------------------------------------ */
/*  Story wrapper — opens the dialog inside a button toggle           */
/* ------------------------------------------------------------------ */

function DialogDemo(props: Partial<React.ComponentProps<typeof RecordPickerDialog>>) {
  const [open, setOpen] = useState(true);
  const [selected, setSelected] = useState<any>(undefined);
  const ds = React.useMemo(() => createMockDataSource(), []);

  return (
    <div className="flex flex-col items-center gap-4 p-6">
      <button
        className="rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground shadow"
        onClick={() => setOpen(true)}
        type="button"
      >
        Open Record Picker
      </button>
      {selected && (
        <p className="text-sm text-muted-foreground">
          Selected: <code className="font-mono text-foreground">{JSON.stringify(selected)}</code>
        </p>
      )}
      <RecordPickerDialog
        open={open}
        onOpenChange={setOpen}
        title="Order"
        dataSource={ds}
        objectName="orders"
        columns={[
          { field: 'order_number', label: 'Order Number' },
          { field: 'amount', label: 'Amount' },
          { field: 'status', label: 'Status' },
          { field: 'order_date', label: 'Order Date' },
        ]}
        displayField="order_number"
        pageSize={5}
        onSelect={(v: any) => setSelected(v)}
        {...props}
      />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Stories                                                           */
/* ------------------------------------------------------------------ */

/** Default single-select dialog with 4 columns, pagination, and search. */
export const Default: Story = {
  render: () => <DialogDemo />,
};

/** Multi-select mode with confirm/cancel footer. */
export const MultiSelect: Story = {
  render: () => <DialogDemo multiple />,
};

/** With inline filter columns for interactive filtering. */
export const WithFilters: Story = {
  render: () => (
    <DialogDemo
      filterColumns={[
        { field: 'status', label: 'Status', type: 'select', options: [
          { label: 'Paid', value: 'Paid' },
          { label: 'Pending', value: 'Pending' },
          { label: 'Shipped', value: 'Shipped' },
          { label: 'Delivered', value: 'Delivered' },
          { label: 'Draft', value: 'Draft' },
        ]},
        { field: 'order_number', label: 'Order Number', type: 'text' },
      ]}
    />
  ),
};
