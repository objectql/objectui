/**
 * @object-ui/i18n - Convention-based Object & Field Label i18n
 *
 * Provides automatic translation resolution for object metadata labels
 * using Salesforce-style convention-based key generation.
 *
 * The app namespace (e.g. "crm") is discovered dynamically from loaded
 * i18next resources — no hardcoded app names in platform code.
 *
 * Convention Rules:
 * | What               | Auto-generated key                              | Fallback              |
 * |--------------------|-------------------------------------------------|-----------------------|
 * | Object label       | {ns}.objects.{objectName}.label                  | objectDef.label       |
 * | Object description | {ns}.objects.{objectName}.description             | objectDef.description |
 * | Field label        | {ns}.fields.{objectName}.{fieldName}              | field.label           |
 *
 * @module useObjectLabel
 */

import { useObjectTranslation } from './provider';

/**
 * Built-in Object UI top-level locale keys — not app namespaces.
 * Update this set when new top-level platform translation keys are added
 * to `packages/i18n/src/locales/en.ts` to prevent them from being treated
 * as app namespaces during dynamic namespace discovery.
 */
const BUILTIN_KEYS = new Set([
  'common', 'validation', 'form', 'table', 'grid', 'calendar',
  'list', 'kanban', 'chart', 'dashboard', 'configPanel',
  'appDesigner', 'console', 'errors', 'detail',
]);

/**
 * Hook for convention-based auto-resolution of object and field labels.
 *
 * Automatically constructs i18n keys from object/field names and looks up
 * translations, falling back to the plain-string label when no translation exists.
 *
 * The app namespace is discovered dynamically from loaded i18next resources
 * by finding top-level keys that contain an `objects` sub-key.
 *
 * @example
 * ```tsx
 * const { objectLabel, fieldLabel } = useObjectLabel();
 * <h1>{objectLabel(objectDef)}</h1>
 * ```
 */
export function useObjectLabel() {
  const { t, i18n } = useObjectTranslation();

  /**
   * Discover app namespace(s) from loaded i18next resources.
   * Returns top-level keys (outside built-in Object UI keys) that contain
   * an `objects`, `fields`, or `apps` sub-key — e.g. "crm" when resources
   * include crm.objects.* or crm.apps.*.
   */
  const getAppNamespaces = (): string[] => {
    if (!i18n || typeof i18n.getResourceBundle !== 'function') return [];
    const lang = i18n.language || 'en';
    const bundle = i18n.getResourceBundle(lang, 'translation') as Record<string, any> | undefined;
    if (!bundle) return [];
    return Object.keys(bundle).filter(
      (key) => !BUILTIN_KEYS.has(key) && bundle[key] && typeof bundle[key] === 'object'
        && (bundle[key].objects || bundle[key].fields || bundle[key].apps),
    );
  };

  /**
   * Strip an ObjectStack namespace prefix (e.g. `crm__lead` → `lead`) so that
   * translations authored against short object names still resolve when the
   * runtime presents fully-qualified names. The first `__` separates the
   * package namespace from the base name; everything after is preserved.
   */
  const stripNamespace = (name: string): string => {
    const idx = name.indexOf('__');
    return idx > 0 ? name.slice(idx + 2) : name;
  };

  /** Try resolving a key across all discovered app namespaces. */
  const resolve = (suffixes: string | string[], fallback: string): string => {
    const suffixList = Array.isArray(suffixes) ? suffixes : [suffixes];
    try {
      const namespaces = getAppNamespaces();
      for (const ns of namespaces) {
        for (const suffix of suffixList) {
          const key = `${ns}.${suffix}`;
          const translated = t(key, { defaultValue: '' });
          if (translated && translated !== key && translated !== '') {
            return translated;
          }
        }
      }
    } catch {
      // Graceful degradation when i18n provider is not available
    }
    return fallback;
  };

  /** Build suffix candidates: prefer the given name, fall back to the base (unprefixed) name. */
  const objectSuffixes = (objectName: string, tail: string): string[] => {
    const base = stripNamespace(objectName);
    return base !== objectName
      ? [`objects.${objectName}.${tail}`, `objects.${base}.${tail}`]
      : [`objects.${objectName}.${tail}`];
  };

  const fieldSuffixes = (objectName: string, fieldName: string): string[] => {
    const base = stripNamespace(objectName);
    return base !== objectName
      ? [`fields.${objectName}.${fieldName}`, `fields.${base}.${fieldName}`]
      : [`fields.${objectName}.${fieldName}`];
  };

  return {
    /**
     * Resolve translated object label, falling back to objectDef.label.
     */
    objectLabel: (objectDef: { name: string; label: string }) =>
      resolve(objectSuffixes(objectDef.name, 'label'), objectDef.label),

    /**
     * Resolve translated object description, falling back to objectDef.description.
     */
    objectDescription: (objectDef: { name: string; description?: string }) => {
      if (!objectDef.description) return undefined;
      return resolve(objectSuffixes(objectDef.name, 'description'), objectDef.description);
    },

    /**
     * Resolve translated field label, falling back to the provided fallback string.
     */
    fieldLabel: (objectName: string, fieldName: string, fallback: string) =>
      resolve(fieldSuffixes(objectName, fieldName), fallback),

    /**
     * Resolve translated app label, falling back to appDef.label.
     * Looks up `{ns}.apps.{appName}.label` from loaded i18next resources.
     */
    appLabel: (appDef: { name: string; label?: string }) =>
      resolve(`apps.${appDef.name}.label`, appDef.label ?? appDef.name),

    /**
     * Resolve translated app description, falling back to appDef.description.
     * Returns the translated value even when metadata has no description —
     * translation-only descriptions (defined only in i18n bundles) are common
     * in examples where the app metadata is English-only.
     */
    appDescription: (appDef: { name: string; description?: string }) => {
      const fallback = appDef.description ?? '';
      const resolved = resolve(`apps.${appDef.name}.description`, fallback);
      return resolved || undefined;
    },
  };
}

/**
 * Safe wrapper for useObjectLabel that falls back to identity functions
 * when no I18nProvider is available. Suitable for plugin components that
 * may be rendered outside an i18n context.
 */
export function useSafeFieldLabel() {
  try {
    const { fieldLabel } = useObjectLabel();
    return { fieldLabel };
  } catch {
    return {
      fieldLabel: (_objectName: string, _fieldName: string, fallback: string) => fallback,
    };
  }
}
