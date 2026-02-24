export const CrmDashboard = {
  name: 'crm_dashboard',
  label: 'CRM Overview',
  description: 'Revenue metrics, pipeline analytics, and deal insights',
  widgets: [
    // --- KPI Row ---
    {
      title: 'Total Revenue',
      type: 'metric' as const,
      object: 'opportunity',
      layout: { x: 0, y: 0, w: 1, h: 1 },
      options: {
        label: 'Total Revenue',
        value: '$652,000',
        trend: { value: 12.5, direction: 'up' as const, label: 'vs last month' },
        icon: 'DollarSign'
      }
    },
    {
      title: 'Active Deals',
      type: 'metric' as const,
      object: 'opportunity',
      layout: { x: 1, y: 0, w: 1, h: 1 },
      options: {
        label: 'Active Deals',
        value: '5',
        trend: { value: 2.1, direction: 'down' as const, label: 'vs last month' },
        icon: 'Briefcase'
      }
    },
    {
      title: 'Win Rate',
      type: 'metric' as const,
      object: 'opportunity',
      layout: { x: 2, y: 0, w: 1, h: 1 },
      options: {
        label: 'Win Rate',
        value: '42%',
        trend: { value: 4.3, direction: 'up' as const, label: 'vs last month' },
        icon: 'Trophy'
      }
    },
    {
      title: 'Avg Deal Size',
      type: 'metric' as const,
      object: 'opportunity',
      layout: { x: 3, y: 0, w: 1, h: 1 },
      options: {
        label: 'Avg Deal Size',
        value: '$93,000',
        trend: { value: 1.2, direction: 'up' as const, label: 'vs last month' },
        icon: 'BarChart3'
      }
    },

    // --- Row 2: Charts (provider: 'object' — dynamic aggregation) ---
    {
        title: 'Revenue Trends',
        type: 'area' as const,
        object: 'opportunity',
        categoryField: 'stage',
        valueField: 'expected_revenue',
        aggregate: 'sum',
        layout: { x: 0, y: 1, w: 3, h: 2 },
        options: {
            xField: 'stage',
            yField: 'expected_revenue',
            data: {
                provider: 'object' as const,
                object: 'opportunity',
                aggregate: { field: 'expected_revenue', function: 'sum' as const, groupBy: 'stage' }
            }
        },
    },
    {
        title: 'Lead Source',
        type: 'donut' as const,
        object: 'opportunity',
        categoryField: 'lead_source',
        valueField: 'count',
        aggregate: 'count',
        layout: { x: 3, y: 1, w: 1, h: 2 },
        options: {
            xField: 'lead_source',
            yField: 'count',
            data: {
                provider: 'object' as const,
                object: 'opportunity',
                aggregate: { field: 'count', function: 'count' as const, groupBy: 'lead_source' }
            }
        },
    },

    // --- Row 3: More Charts (provider: 'object' — dynamic aggregation) ---
    {
        title: 'Pipeline by Stage',
        type: 'bar' as const,
        object: 'opportunity',
        categoryField: 'stage',
        valueField: 'amount',
        aggregate: 'sum',
        layout: { x: 0, y: 3, w: 2, h: 2 },
        options: {
            xField: 'stage',
            yField: 'amount',
            data: {
                provider: 'object' as const,
                object: 'opportunity',
                aggregate: { field: 'amount', function: 'sum' as const, groupBy: 'stage' }
            }
        },
    },
    {
        title: 'Top Products',
        type: 'bar' as const,
        object: 'product',
        categoryField: 'category',
        valueField: 'price',
        aggregate: 'sum',
        layout: { x: 2, y: 3, w: 2, h: 2 },
        options: {
            xField: 'category',
            yField: 'price',
            data: {
                provider: 'object' as const,
                object: 'product',
                aggregate: { field: 'price', function: 'sum' as const, groupBy: 'category' }
            }
        },
    },

    // --- Row 4: Table (provider: 'object' — dynamic data) ---
    {
        title: 'Recent Opportunities',
        type: 'table' as const,
        object: 'opportunity',
        layout: { x: 0, y: 5, w: 4, h: 2 },
        options: {
            columns: [
                { header: 'Opportunity Name', accessorKey: 'name' }, 
                { header: 'Amount', accessorKey: 'amount' }, 
                { header: 'Stage', accessorKey: 'stage' },
                { header: 'Close Date', accessorKey: 'close_date' }
            ],
            data: {
                provider: 'object' as const,
                object: 'opportunity',
            }
        },
    },

    // --- Row 5: Dynamic KPI from Object Data ---
    {
        title: 'Revenue by Account',
        type: 'bar' as const,
        object: 'opportunity',
        categoryField: 'account',
        valueField: 'amount',
        aggregate: 'sum',
        layout: { x: 0, y: 7, w: 4, h: 2 },
        options: {
            xField: 'account',
            yField: 'amount',
            data: {
                provider: 'object' as const,
                object: 'opportunity',
                aggregate: { field: 'amount', function: 'sum' as const, groupBy: 'account' }
            }
        },
    }
  ]
};
