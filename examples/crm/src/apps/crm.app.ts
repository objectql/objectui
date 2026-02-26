import { App } from '@objectstack/spec/ui';

export const CrmApp = App.create({
  name: 'crm_app',
  label: { key: 'crm.app.name', defaultValue: 'CRM' },
  icon: 'briefcase',
  description: { key: 'crm.app.description', defaultValue: 'Sales pipeline, accounts, and customer management' },
  branding: {
    primaryColor: '#3B82F6',
    logo: 'https://objectstack.ai/logo.svg',
    favicon: 'https://objectstack.ai/logo.svg',
  },
  navigation: [
    {
      id: 'nav_dashboard',
      type: 'dashboard',
      dashboardName: 'crm_dashboard',
      label: { key: 'crm.navigation.dashboard', defaultValue: 'Dashboard' },
      icon: 'layout-dashboard'
    },
    {
      id: 'nav_contacts',
      type: 'object',
      objectName: 'contact',
      label: { key: 'crm.navigation.contacts', defaultValue: 'Contacts' },
      icon: 'users'
    },
    {
      id: 'nav_accounts',
      type: 'object',
      objectName: 'account',
      label: { key: 'crm.navigation.accounts', defaultValue: 'Accounts' },
      icon: 'building-2'
    },
    {
      id: 'nav_opportunities',
      type: 'object',
      objectName: 'opportunity',
      label: { key: 'crm.navigation.opportunities', defaultValue: 'Opportunities' },
      icon: 'trending-up'
    },
    {
      id: 'nav_pipeline',
      type: 'object',
      objectName: 'opportunity',
      viewName: 'pipeline',
      label: { key: 'crm.navigation.pipeline', defaultValue: 'Pipeline' },
      icon: 'kanban-square'
    },
    {
      id: 'nav_projects',
      type: 'object',
      objectName: 'project_task',
      label: { key: 'crm.navigation.projects', defaultValue: 'Projects' },
      icon: 'kanban-square'
    },
    {
      id: 'nav_events',
      type: 'object',
      objectName: 'event',
      viewName: 'calendar',
      label: { key: 'crm.navigation.calendar', defaultValue: 'Calendar' },
      icon: 'calendar'
    },
    {
      id: 'nav_sales',
      type: 'group',
      label: { key: 'crm.navigation.sales', defaultValue: 'Sales' },
      icon: 'banknote',
      children: [
         {
            id: 'nav_orders',
            type: 'object',
            objectName: 'order',
            label: { key: 'crm.navigation.orders', defaultValue: 'Orders' },
            icon: 'shopping-cart'
         },
         {
            id: 'nav_products',
            type: 'object',
            objectName: 'product',
            label: { key: 'crm.navigation.products', defaultValue: 'Products' },
            icon: 'package'
         },
         {
            id: 'nav_order_items',
            type: 'object',
            objectName: 'order_item',
            label: { key: 'crm.navigation.lineItems', defaultValue: 'Line Items' },
            icon: 'list-ordered'
         }
      ]
    },
    {
      id: 'nav_reports',
      type: 'group',
      label: { key: 'crm.navigation.reports', defaultValue: 'Reports' },
      icon: 'file-bar-chart',
      children: [
        {
          id: 'nav_sales_report',
          type: 'report',
          reportName: 'sales_report',
          label: { key: 'crm.navigation.salesReport', defaultValue: 'Sales Report' },
          icon: 'bar-chart-3'
        },
        {
          id: 'nav_pipeline_report',
          type: 'report',
          reportName: 'pipeline_report',
          label: { key: 'crm.navigation.pipelineReport', defaultValue: 'Pipeline Report' },
          icon: 'pie-chart'
        }
      ]
    },
    {
      id: 'nav_getting_started',
      type: 'page',
      pageName: 'crm_getting_started',
      label: { key: 'crm.navigation.gettingStarted', defaultValue: 'Getting Started' },
      icon: 'rocket'
    },
    {
      id: 'nav_settings',
      type: 'page',
      pageName: 'crm_settings',
      label: { key: 'crm.navigation.settings', defaultValue: 'Settings' },
      icon: 'settings'
    },
    {
      id: 'nav_help',
      type: 'page',
      pageName: 'crm_help',
      label: { key: 'crm.navigation.help', defaultValue: 'Help' },
      icon: 'help-circle'
    }
  ]
});
