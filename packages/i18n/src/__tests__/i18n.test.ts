import { describe, it, expect, beforeEach } from 'vitest';
import {
  createI18n,
  getDirection,
  getAvailableLanguages,
  builtInLocales,
  isRTL,
  RTL_LANGUAGES,
  formatDate,
  formatDateTime,
  formatCurrency,
  formatNumber,
} from '../index';

describe('@object-ui/i18n', () => {
  describe('createI18n', () => {
    it('creates an i18next instance with default config', () => {
      const i18n = createI18n({ detectBrowserLanguage: false });
      expect(i18n).toBeDefined();
      expect(i18n.language).toBe('en');
    });

    it('creates an instance with specified default language', () => {
      const i18n = createI18n({ defaultLanguage: 'zh', detectBrowserLanguage: false });
      expect(i18n.language).toBe('zh');
    });

    it('loads all built-in locales', () => {
      const i18n = createI18n({ detectBrowserLanguage: false });
      const langs = getAvailableLanguages(i18n);
      expect(langs).toContain('en');
      expect(langs).toContain('zh');
      expect(langs).toContain('ja');
      expect(langs).toContain('ko');
      expect(langs).toContain('de');
      expect(langs).toContain('fr');
      expect(langs).toContain('es');
      expect(langs).toContain('pt');
      expect(langs).toContain('ru');
      expect(langs).toContain('ar');
      expect(langs.length).toBeGreaterThanOrEqual(10);
    });

    it('translates common keys in English', () => {
      const i18n = createI18n({ defaultLanguage: 'en', detectBrowserLanguage: false });
      expect(i18n.t('common.save')).toBe('Save');
      expect(i18n.t('common.cancel')).toBe('Cancel');
      expect(i18n.t('common.delete')).toBe('Delete');
      expect(i18n.t('common.loading')).toBe('Loading...');
      expect(i18n.t('common.selectOption')).toBe('Select an option');
      expect(i18n.t('common.select')).toBe('Select...');
    });

    it('translates new form keys in English', () => {
      const i18n = createI18n({ defaultLanguage: 'en', detectBrowserLanguage: false });
      expect(i18n.t('form.createTitle', { object: 'Contact' })).toBe('Create Contact');
      expect(i18n.t('form.editTitle', { object: 'Contact' })).toBe('Edit Contact');
      expect(i18n.t('form.createDescription', { object: 'Contact' })).toBe('Add a new Contact to your database.');
      expect(i18n.t('form.editDescription', { object: 'Contact' })).toBe('Update details for Contact');
      expect(i18n.t('form.saveRecord')).toBe('Save Record');
    });

    it('translates common keys in Chinese', () => {
      const i18n = createI18n({ defaultLanguage: 'zh', detectBrowserLanguage: false });
      expect(i18n.t('common.save')).toBe('保存');
      expect(i18n.t('common.cancel')).toBe('取消');
      expect(i18n.t('common.delete')).toBe('删除');
      expect(i18n.t('common.loading')).toBe('加载中...');
      expect(i18n.t('common.selectOption')).toBe('请选择');
      expect(i18n.t('common.select')).toBe('选择...');
    });

    it('translates new form keys in Chinese', () => {
      const i18n = createI18n({ defaultLanguage: 'zh', detectBrowserLanguage: false });
      expect(i18n.t('form.createTitle', { object: '联系人' })).toBe('新建联系人');
      expect(i18n.t('form.editTitle', { object: '联系人' })).toBe('编辑联系人');
      expect(i18n.t('form.createDescription', { object: '联系人' })).toBe('向数据库添加新的联系人。');
      expect(i18n.t('form.editDescription', { object: '联系人' })).toBe('更新联系人的详情');
      expect(i18n.t('form.saveRecord')).toBe('保存记录');
    });

    it('translates toolbarEnabledCount in Chinese (not English fallback)', () => {
      const i18n = createI18n({ defaultLanguage: 'zh', detectBrowserLanguage: false });
      expect(i18n.t('console.objectView.toolbarEnabledCount', { count: 3, total: 5 })).toBe('已启用 3/5 项');
    });

    it('translates common keys in Japanese', () => {
      const i18n = createI18n({ defaultLanguage: 'ja', detectBrowserLanguage: false });
      expect(i18n.t('common.save')).toBe('保存');
      expect(i18n.t('common.cancel')).toBe('キャンセル');
    });

    it('translates common keys in Korean', () => {
      const i18n = createI18n({ defaultLanguage: 'ko', detectBrowserLanguage: false });
      expect(i18n.t('common.save')).toBe('저장');
      expect(i18n.t('common.cancel')).toBe('취소');
    });

    it('supports interpolation in validation messages', () => {
      const i18n = createI18n({ defaultLanguage: 'en', detectBrowserLanguage: false });
      expect(i18n.t('validation.required', { field: 'Name' })).toBe('Name is required');
      expect(i18n.t('validation.minLength', { field: 'Password', min: 8 })).toBe(
        'Password must be at least 8 characters',
      );
    });

    it('supports interpolation in Chinese', () => {
      const i18n = createI18n({ defaultLanguage: 'zh', detectBrowserLanguage: false });
      expect(i18n.t('validation.required', { field: '姓名' })).toBe('姓名不能为空');
    });

    it('falls back to English for unknown language', () => {
      const i18n = createI18n({ defaultLanguage: 'xx', fallbackLanguage: 'en', detectBrowserLanguage: false });
      expect(i18n.t('common.save')).toBe('Save');
    });

    it('merges custom resources with built-in locales', () => {
      const i18n = createI18n({
        defaultLanguage: 'en',
        detectBrowserLanguage: false,
        resources: {
          en: { custom: { greeting: 'Hello!' } },
        },
      });
      expect(i18n.t('custom.greeting')).toBe('Hello!');
      // Built-in translations still work
      expect(i18n.t('common.save')).toBe('Save');
    });

    it('changes language dynamically', async () => {
      const i18n = createI18n({ defaultLanguage: 'en', detectBrowserLanguage: false });
      expect(i18n.t('common.save')).toBe('Save');

      await i18n.changeLanguage('zh');
      expect(i18n.language).toBe('zh');
      expect(i18n.t('common.save')).toBe('保存');

      await i18n.changeLanguage('ja');
      expect(i18n.language).toBe('ja');
      expect(i18n.t('common.save')).toBe('保存');
    });
  });

  describe('getDirection', () => {
    it('returns ltr for English', () => {
      expect(getDirection('en')).toBe('ltr');
    });

    it('returns ltr for Chinese', () => {
      expect(getDirection('zh')).toBe('ltr');
    });

    it('returns rtl for Arabic', () => {
      expect(getDirection('ar')).toBe('rtl');
    });

    it('returns ltr for unknown languages', () => {
      expect(getDirection('xx')).toBe('ltr');
    });
  });

  describe('isRTL', () => {
    it('returns true for Arabic', () => {
      expect(isRTL('ar')).toBe(true);
    });

    it('returns false for English', () => {
      expect(isRTL('en')).toBe(false);
    });

    it('returns false for Chinese', () => {
      expect(isRTL('zh')).toBe(false);
    });
  });

  describe('RTL_LANGUAGES', () => {
    it('includes Arabic', () => {
      expect(RTL_LANGUAGES).toContain('ar');
    });

    it('includes Hebrew', () => {
      expect(RTL_LANGUAGES).toContain('he');
    });
  });

  describe('builtInLocales', () => {
    it('has 10 built-in language packs', () => {
      expect(Object.keys(builtInLocales).length).toBe(10);
    });

    it('all locales have the same top-level keys', () => {
      const enKeys = Object.keys(builtInLocales.en).sort();
      for (const [lang, locale] of Object.entries(builtInLocales)) {
        const keys = Object.keys(locale).sort();
        expect(keys).toEqual(enKeys);
      }
    });

    it('all locales have common section keys matching English', () => {
      const enCommonKeys = Object.keys(builtInLocales.en.common).sort();
      for (const [lang, locale] of Object.entries(builtInLocales)) {
        const keys = Object.keys(locale.common).sort();
        expect(keys).toEqual(enCommonKeys);
      }
    });
  });

  describe('formatDate', () => {
    it('formats a date with default options', () => {
      const result = formatDate(new Date(2026, 0, 15), { locale: 'en' });
      expect(result).toContain('Jan');
      expect(result).toContain('15');
      expect(result).toContain('2026');
    });

    it('formats a date with short style', () => {
      const result = formatDate(new Date(2026, 0, 15), { locale: 'en', style: 'short' });
      expect(result).toContain('15');
    });

    it('returns string for invalid dates', () => {
      const result = formatDate('invalid-date');
      expect(result).toBe('invalid-date');
    });
  });

  describe('formatCurrency', () => {
    it('formats USD by default', () => {
      const result = formatCurrency(1234.56, { locale: 'en' });
      expect(result).toContain('1,234.56');
    });

    it('formats EUR', () => {
      const result = formatCurrency(1234.56, { locale: 'de', currency: 'EUR' });
      expect(result).toContain('1.234,56');
    });

    it('formats CNY', () => {
      const result = formatCurrency(1234.56, { locale: 'zh', currency: 'CNY' });
      expect(result).toContain('1,234.56');
    });
  });

  describe('formatNumber', () => {
    it('formats a number with default locale', () => {
      const result = formatNumber(1234567.89, { locale: 'en' });
      expect(result).toContain('1,234,567.89');
    });

    it('formats with compact notation', () => {
      const result = formatNumber(1234567, { locale: 'en', notation: 'compact' });
      expect(result).toContain('M'); // e.g. 1.2M
    });
  });
});
