export const OrderData = {
  object: 'order',
  mode: 'upsert' as const,
  records: [
    { id: "o1", name: 'ORD-2024-001', customer: "Bob Smith", account: "Salesforce Tower", order_date: new Date('2024-01-15'), amount: 15459.99, status: 'paid', payment_method: 'Wire Transfer', shipping_address: '415 Mission St, San Francisco, CA 94105', tracking_number: '1Z999AA10123456784' },
    { id: "o2", name: 'ORD-2024-002', customer: "Charlie Brown", account: "Global Financial Services", order_date: new Date('2024-01-18'), amount: 289.50, status: 'pending', payment_method: 'Credit Card', discount: 5 },
    { id: "o3", name: 'ORD-2024-003', customer: "Diana Prince", account: "London Consulting Grp", order_date: new Date('2024-02-05'), amount: 5549.99, status: 'shipped', payment_method: 'Wire Transfer', shipping_address: '10 Downing St, London, UK', tracking_number: 'GB999AA20234567890' },
    { id: "o4", name: 'ORD-2024-004', customer: "Evan Wright", account: "Berlin AutoWorks", order_date: new Date('2024-02-20'), amount: 42500.00, status: 'delivered', payment_method: 'Invoice', shipping_address: 'Industriepark 12, Berlin, Germany', discount: 10 },
    { id: "o5", name: 'ORD-2024-005', customer: "Alice Johnson", account: "ObjectStack HQ", order_date: new Date('2024-03-01'), amount: 1250.00, status: 'draft', payment_method: 'PayPal' },
    { id: "o6", name: 'ORD-2024-006', customer: "Fiona Gallagher", account: "Paris Fashion House", order_date: new Date('2024-03-10'), amount: 899.99, status: 'cancelled', payment_method: 'Credit Card', notes: 'Customer requested cancellation before shipment' },
    { id: "o7", name: 'ORD-2024-007', customer: "George Martin", account: "Salesforce Tower", order_date: new Date('2024-03-15'), amount: 8999.94, status: 'paid', payment_method: 'Check', shipping_address: '415 Mission St, San Francisco, CA 94105' },
  ]
};
