/**
 * Resolves an I18nLabel to a plain string.
 * I18nLabel can be either a string or an object { key, defaultValue?, params? }.
 * When it's an object, we return the defaultValue or the key as fallback.
 */
export function resolveI18nLabel(label: string | { key: string; defaultValue?: string; params?: Record<string, any> } | undefined): string | undefined {
  if (label === undefined || label === null) return undefined;
  if (typeof label === 'string') return label;
  return label.defaultValue || label.key;
}
