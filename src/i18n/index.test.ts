/**
 * i18n 模块测试
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { getTranslations, detectSystemLocale, SUPPORTED_LOCALES, Locale } from './index';

function flattenKeys(value: Record<string, unknown>, prefix = ''): string[] {
  return Object.entries(value).flatMap(([key, nestedValue]) => {
    const nextKey = prefix ? `${prefix}.${key}` : key;
    if (nestedValue && typeof nestedValue === 'object' && !Array.isArray(nestedValue)) {
      return flattenKeys(nestedValue as Record<string, unknown>, nextKey);
    }
    return [nextKey];
  });
}

describe('i18n', () => {
  describe('SUPPORTED_LOCALES', () => {
    it('should have 2 supported locales', () => {
      expect(SUPPORTED_LOCALES.length).toBe(2);
    });

    it('should include zh-CN and en', () => {
      const codes = SUPPORTED_LOCALES.map(l => l.code);
      expect(codes).toContain('zh-CN');
      expect(codes).toContain('en');
    });

    it('should have name and nativeName for each locale', () => {
      SUPPORTED_LOCALES.forEach(locale => {
        expect(locale.name).toBeTruthy();
        expect(locale.nativeName).toBeTruthy();
      });
    });
  });

  describe('getTranslations', () => {
    it('returns translations for each supported locale', () => {
      for (const locale of SUPPORTED_LOCALES) {
        const t = getTranslations(locale.code as Locale);
        expect(t).toBeDefined();
        expect(t.common).toBeDefined();
      }
    });

    it('keeps the same translation key tree across all locales', () => {
      const zhCNKeys = flattenKeys(getTranslations('zh-CN') as Record<string, unknown>).sort();

      for (const locale of ['en'] as const) {
        expect(flattenKeys(getTranslations(locale) as Record<string, unknown>).sort()).toEqual(zhCNKeys);
      }
    });

    it('should fallback to zh-CN for unknown locale', () => {
      const t = getTranslations('unknown' as Locale);
      const zhCN = getTranslations('zh-CN');
      expect(t).toEqual(zhCN);
    });
  });

  describe('detectSystemLocale', () => {
    afterEach(() => {
      vi.unstubAllGlobals();
    });

    it('should detect zh-CN for Chinese Simplified', () => {
      vi.stubGlobal('navigator', { language: 'zh-CN' });
      expect(detectSystemLocale()).toBe('zh-CN');
    });

    it('should map Traditional Chinese to zh-CN when only Simplified Chinese is bundled', () => {
      vi.stubGlobal('navigator', { language: 'zh-TW' });
      expect(detectSystemLocale()).toBe('zh-CN');
    });

    it('should map Hong Kong Chinese to zh-CN when only Simplified Chinese is bundled', () => {
      vi.stubGlobal('navigator', { language: 'zh-HK' });
      expect(detectSystemLocale()).toBe('zh-CN');
    });

    it('should detect en for English', () => {
      vi.stubGlobal('navigator', { language: 'en-US' });
      expect(detectSystemLocale()).toBe('en');
    });

    it('should default Japanese to zh-CN when the locale pack is unavailable', () => {
      vi.stubGlobal('navigator', { language: 'ja-JP' });
      expect(detectSystemLocale()).toBe('zh-CN');
    });

    it('should default to zh-CN for unknown languages', () => {
      vi.stubGlobal('navigator', { language: 'de-DE' });
      expect(detectSystemLocale()).toBe('zh-CN');
    });
  });
});
