import { describe, expect, it } from 'vitest';

import en from '@/i18n/locales/en';
import zhCN from '@/i18n/locales/zh-CN';

const locales = [
  ['en', en],
  ['zh-CN', zhCN],
] as const;

describe('auth locale consistency', () => {
  it('uses an 8-character minimum in placeholders and validation messages', () => {
    for (const [locale, messages] of locales) {
      expect(messages.auth.passwordPlaceholder, `${locale} placeholder`).toContain('8');
      expect(messages.auth.passwordTooShort, `${locale} error`).toContain('8');
    }
  });
});
