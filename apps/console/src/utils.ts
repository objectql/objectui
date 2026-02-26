/**
 * Utility functions for ObjectStack Console
 */

import type { NavigationItem } from '@object-ui/types';

/**
 * Resolves an I18nLabel to a plain string.
 * I18nLabel can be either a string or an object { key, defaultValue?, params? }.
 * When it's an object and a `t` function is provided, it looks up the key
 * in the i18n system. Otherwise it returns the defaultValue or the key as fallback.
 */
export function resolveI18nLabel(
  label: string | { key: string; defaultValue?: string; params?: Record<string, any> } | undefined,
  t?: (key: string, options?: any) => string,
): string | undefined {
  if (label === undefined || label === null) return undefined;
  if (typeof label === 'string') return label;
  if (t) return t(label.key, { defaultValue: label.defaultValue, ...label.params });
  return label.defaultValue || label.key;
}

// ---------------------------------------------------------------------------
// CRM Navigation i18n helpers
// ---------------------------------------------------------------------------

/**
 * Map from CRM navigation item IDs to CRM i18n `navigation.*` keys.
 * This allows translating navigation labels when the user switches locale.
 */
const CRM_NAV_I18N_MAP: Record<string, string> = {
  nav_dashboard: 'dashboard',
  nav_contacts: 'contacts',
  nav_accounts: 'accounts',
  nav_opportunities: 'opportunities',
  nav_pipeline: 'pipeline',
  nav_projects: 'projects',
  nav_events: 'calendar',
  nav_sales: 'sales',
  nav_orders: 'orders',
  nav_products: 'products',
  nav_order_items: 'lineItems',
  nav_reports: 'reports',
  nav_sales_report: 'salesReport',
  nav_pipeline_report: 'pipelineReport',
  nav_getting_started: 'gettingStarted',
  nav_settings: 'settings',
  nav_help: 'help',
};

/**
 * Recursively translate navigation item labels using CRM i18n keys.
 * Falls back to the original label when no translation is found.
 */
export function translateCrmNavigation(
  items: NavigationItem[],
  t: (key: string, options?: any) => string,
): NavigationItem[] {
  return items.map((item) => {
    const i18nKey = CRM_NAV_I18N_MAP[item.id];
    const translatedLabel = i18nKey
      ? t(`crm.navigation.${i18nKey}`, { defaultValue: item.label })
      : item.label;
    return {
      ...item,
      label: translatedLabel,
      children: item.children
        ? translateCrmNavigation(item.children, t)
        : undefined,
    };
  });
}

/**
 * Map from CRM dashboard widget IDs to CRM i18n `dashboard.widgets.*` keys.
 */
const CRM_WIDGET_I18N_MAP: Record<string, string> = {
  total_revenue: 'totalRevenue',
  active_deals: 'activeDeals',
  win_rate: 'winRate',
  avg_deal_size: 'avgDealSize',
  revenue_trends: 'revenueTrends',
  lead_source: 'leadSource',
  pipeline_by_stage: 'pipelineByStage',
  top_products: 'topProducts',
  recent_opportunities: 'recentOpportunities',
  revenue_by_account: 'revenueByAccount',
  avg_deal_by_stage: 'avgDealSizeByStage',
  orders_by_status: 'ordersByStatus',
};

/**
 * Translate CRM dashboard widget titles using CRM i18n keys.
 * Falls back to the original title when no translation is found.
 */
export function translateCrmDashboardWidgets(
  widgets: any[],
  t: (key: string, options?: any) => string,
): any[] {
  return widgets.map((widget) => {
    const i18nKey = CRM_WIDGET_I18N_MAP[widget.id];
    if (!i18nKey) return widget;
    return {
      ...widget,
      title: t(`crm.dashboard.widgets.${i18nKey}`, { defaultValue: widget.title }),
    };
  });
}

/**
 * Format a record title using the titleFormat pattern
 * @param titleFormat Pattern like "{name} - {email}" or "{firstName} {lastName}"
 * @param record The record data object
 * @returns Formatted title string
 */
export function formatRecordTitle(titleFormat: string | undefined, record: any): string {
  if (!titleFormat || !record) {
    return record?.id || record?._id || 'Record';
  }

  // Replace {fieldName} patterns with actual values
  return titleFormat.replace(/\{(\w+)\}/g, (_match, fieldName) => {
    const value = record[fieldName];
    if (value === null || value === undefined) {
      return '';
    }
    return String(value);
  });
}

/**
 * Get display name for a record using titleFormat or fallback
 * @param objectDef Object definition with optional titleFormat
 * @param record The record data
 * @returns Display name for the record
 */
export function getRecordDisplayName(objectDef: any, record: any): string {
  if (objectDef?.titleFormat) {
    return formatRecordTitle(objectDef.titleFormat, record);
  }
  
  // Fallback: Try common name fields
  return record?.name || record?.title || record?.label || record?.id || record?._id || 'Untitled';
}
