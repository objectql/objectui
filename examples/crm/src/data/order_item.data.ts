export const OrderItemData = {
  object: 'order_item',
  mode: 'upsert' as const,
  records: [
    { id: "li1", name: 'LI-001', order: "ORD-2024-001", product: "Workstation Pro Laptop", quantity: 5, unit_price: 2499.99, discount: 0, line_total: 12499.95, item_type: 'product' },
    { id: "li2", name: 'LI-002', order: "ORD-2024-001", product: "Wireless Ergonomic Mouse", quantity: 10, unit_price: 89.99, discount: 0, line_total: 899.90, item_type: 'product' },
    { id: "li3", name: 'LI-003', order: "ORD-2024-001", product: "Premium Support (Annual)", quantity: 1, unit_price: 5000.00, discount: 58.8, line_total: 2060.00, item_type: 'service', notes: 'First year premium support included' },
    { id: "li4", name: 'LI-004', order: "ORD-2024-002", product: "Wireless Ergonomic Mouse", quantity: 2, unit_price: 89.99, discount: 5, line_total: 170.98, item_type: 'product' },
    { id: "li5", name: 'LI-005', order: "ORD-2024-002", product: "Studio Noise Cancelling Headphones", quantity: 1, unit_price: 349.99, discount: 0, line_total: 349.99, item_type: 'product' },
    { id: "li6", name: 'LI-006', order: "ORD-2024-003", product: "Executive Mesh Chair", quantity: 1, unit_price: 549.99, discount: 0, line_total: 549.99, item_type: 'product' },
    { id: "li7", name: 'LI-007', order: "ORD-2024-003", product: "Premium Support (Annual)", quantity: 1, unit_price: 5000.00, discount: 0, line_total: 5000.00, item_type: 'service' },
    { id: "li8", name: 'LI-008', order: "ORD-2024-004", product: "Implementation Service (Hourly)", quantity: 120, unit_price: 250.00, discount: 10, line_total: 27000.00, item_type: 'service', notes: 'Automation implementation hours' },
    { id: "li9", name: 'LI-009', order: "ORD-2024-004", product: "Workstation Pro Laptop", quantity: 5, unit_price: 2499.99, discount: 10, line_total: 11249.96, item_type: 'product' },
    { id: "li10", name: 'LI-010', order: "ORD-2024-007", product: "4K UltraWide Monitor", quantity: 6, unit_price: 899.99, discount: 0, line_total: 5399.94, item_type: 'product' },
    { id: "li11", name: 'LI-011', order: "ORD-2024-007", product: "Adjustable Standing Desk", quantity: 3, unit_price: 799.99, discount: 25, line_total: 1800.00, item_type: 'product' },
    { id: "li12", name: 'LI-012', order: "ORD-2024-005", product: "Implementation Service (Hourly)", quantity: 5, unit_price: 250.00, discount: 0, line_total: 1250.00, item_type: 'service' },
  ]
};
