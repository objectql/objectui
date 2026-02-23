/**
 * CRM Example — i18n locale exports
 *
 * Provides translations for all CRM metadata labels in 10 languages:
 * en, zh, ja, ko, de, fr, es, pt, ru, ar
 */
export { default as en, type CrmTranslationKeys } from './en';
export { default as zh } from './zh';
export { default as ja } from './ja';
export { default as ko } from './ko';
export { default as de } from './de';
export { default as fr } from './fr';
export { default as es } from './es';
export { default as pt } from './pt';
export { default as ru } from './ru';
export { default as ar } from './ar';

import en from './en';
import zh from './zh';
import ja from './ja';
import ko from './ko';
import de from './de';
import fr from './fr';
import es from './es';
import pt from './pt';
import ru from './ru';
import ar from './ar';

/** All CRM locale bundles keyed by language code */
export const crmLocales = { en, zh, ja, ko, de, fr, es, pt, ru, ar } as const;

/** Supported CRM locale codes */
export type CrmLocaleCode = keyof typeof crmLocales;
