export const AccountView = {
  listViews: {
    all_accounts: {
      name: 'all_accounts',
      label: 'All Accounts',
      type: 'grid' as const,
      data: { provider: 'object' as const, object: 'account' },
      columns: ['name', 'industry', 'type', 'annual_revenue', 'rating', 'owner'],
      sort: [{ field: 'name', order: 'asc' as const }],
    },
    active_accounts: {
      name: 'active_accounts',
      label: 'Active Customers',
      type: 'grid' as const,
      data: { provider: 'object' as const, object: 'account' },
      columns: ['name', 'industry', 'annual_revenue', 'phone', 'owner'],
      filter: ['type', '=', 'Customer'],
      sort: [{ field: 'annual_revenue', order: 'desc' as const }],
    },
  },
  form: {
    data: { provider: 'object' as const, object: 'account' },
    sections: [
      {
        label: 'Basic Information',
        columns: 2,
        fields: ['name', 'industry', 'type', 'rating', 'website', 'phone', 'employees', 'owner'],
      },
      {
        label: 'Financial',
        columns: 2,
        fields: ['annual_revenue', 'tags'],
      },
      {
        label: 'Address',
        columns: 2,
        fields: ['billing_address', 'shipping_address', 'latitude', 'longitude'],
      },
      {
        label: 'Additional Details',
        columns: 1,
        collapsible: true,
        fields: ['linkedin_url', 'founded_date', 'description', 'created_at'],
      },
    ],
  },
};
