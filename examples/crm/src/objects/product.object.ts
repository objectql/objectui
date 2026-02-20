import { ObjectSchema, Field } from '@objectstack/spec/data';

export const ProductObject = ObjectSchema.create({
  name: 'product',
  label: 'Product',
  icon: 'package',
  description: 'Product catalog with pricing, inventory, and categorization',
  fields: {
    name: Field.text({ label: 'Product Name', required: true, searchable: true, placeholder: 'Enter product name' }),
    sku: Field.text({ label: 'SKU', required: true, searchable: true, unique: true, helpText: 'Stock Keeping Unit — must be unique' }),
    category: Field.select([
      { value: 'Electronics', label: 'Electronics', color: 'blue' },
      { value: 'Furniture', label: 'Furniture', color: 'yellow' },
      { value: 'Clothing', label: 'Clothing', color: 'pink' },
      { value: 'Services', label: 'Services', color: 'green' },
    ], { label: 'Category' }),
    price: Field.currency({ label: 'Price', scale: 2, helpText: 'Unit price in USD' }),
    stock: Field.number({ label: 'Stock', helpText: 'Current inventory count' }),
    weight: Field.number({ label: 'Weight (kg)', scale: 2, helpText: 'Shipping weight in kilograms' }),
    manufacturer: Field.text({ label: 'Manufacturer', searchable: true }),
    is_active: Field.boolean({ label: 'Active', defaultValue: true, helpText: 'Inactive products are hidden from the catalog' }),
    tags: Field.select({
      options: [
        { label: 'New Arrival', value: 'new', color: 'green' },
        { label: 'Best Seller', value: 'best_seller', color: 'purple' },
        { label: 'On Sale', value: 'on_sale', color: 'red' },
        { label: 'Clearance', value: 'clearance', color: 'yellow' },
      ],
      multiple: true,
      label: 'Tags',
    }),
    description: Field.richtext({ label: 'Description' }),
    image: Field.url({ label: 'Image URL' })
  }
});
