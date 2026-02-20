import { ObjectSchema, Field } from '@objectstack/spec/data';

export const OrderObject = ObjectSchema.create({
  name: 'order',
  label: 'Order',
  icon: 'shopping-cart',
  description: 'Customer orders with line items, shipping, and payment tracking',
  fields: {
    name: Field.text({ label: 'Order Number', required: true, searchable: true, unique: true, placeholder: 'ORD-YYYY-NNN' }),
    customer: Field.lookup('contact', { label: 'Customer', required: true }),
    account: Field.lookup('account', { label: 'Account', helpText: 'Billing account for this order' }),
    amount: Field.currency({ label: 'Total Amount', scale: 2 }),
    discount: Field.percent({ label: 'Discount', scale: 1, helpText: 'Order-level discount percentage' }),
    status: Field.select([
      { value: 'Draft', label: 'Draft', color: 'gray' },
      { value: 'Pending', label: 'Pending', color: 'yellow' },
      { value: 'Paid', label: 'Paid', color: 'green' },
      { value: 'Shipped', label: 'Shipped', color: 'blue' },
      { value: 'Delivered', label: 'Delivered', color: 'purple' },
      { value: 'Cancelled', label: 'Cancelled', color: 'red' },
    ], { label: 'Status', defaultValue: 'Draft' }),
    payment_method: Field.select(['Credit Card', 'Wire Transfer', 'PayPal', 'Invoice', 'Check'], { label: 'Payment Method' }),
    order_date: Field.date({ label: 'Order Date', defaultValue: 'now' }),
    shipping_address: Field.textarea({ label: 'Shipping Address', placeholder: 'Street, City, State, ZIP' }),
    tracking_number: Field.text({ label: 'Tracking Number', placeholder: 'e.g. 1Z999AA10123456784' }),
    notes: Field.richtext({ label: 'Notes', helpText: 'Internal order notes and special instructions' })
  }
});
