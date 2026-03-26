/**
 * Safe translation hook for field widgets.
 * Falls back to English defaults when no I18nProvider is available.
 */
import { useObjectTranslation } from '@object-ui/i18n';

const FIELD_DEFAULTS: Record<string, string> = {
  'common.selectOption': 'Select an option',
  'common.select': 'Select...',
  'common.search': 'Search',
  'table.selected': '{{count}} selected',
};

export function useFieldTranslation() {
  try {
    const result = useObjectTranslation();
    // Test if i18n is properly configured
    const testValue = result.t('common.selectOption');
    if (testValue === 'common.selectOption') {
      // i18n not configured — use defaults
      return {
        t: (key: string, options?: Record<string, unknown>) => {
          let value = FIELD_DEFAULTS[key] || key;
          if (options) {
            for (const [k, v] of Object.entries(options)) {
              value = value.replace(`{{${k}}}`, String(v));
            }
          }
          return value;
        },
      };
    }
    return { t: result.t };
  } catch {
    return {
      t: (key: string, options?: Record<string, unknown>) => {
        let value = FIELD_DEFAULTS[key] || key;
        if (options) {
          for (const [k, v] of Object.entries(options)) {
            value = value.replace(`{{${k}}}`, String(v));
          }
        }
        return value;
      },
    };
  }
}
