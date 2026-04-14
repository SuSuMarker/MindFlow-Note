import zhCN from './locales/zh-CN';
import en from './locales/en';

export type Locale = 'zh-CN' | 'en';

export interface LocaleInfo {
  code: Locale;
  name: string;
  nativeName: string;
}

export const SUPPORTED_LOCALES: LocaleInfo[] = [
  { code: 'zh-CN', name: 'Simplified Chinese', nativeName: '简体中文' },
  { code: 'en', name: 'English', nativeName: 'English' },
];

const locales: Record<Locale, typeof zhCN> = {
  'zh-CN': zhCN,
  'en': en,
};

export function getTranslations(locale: Locale) {
  return locales[locale] || locales['zh-CN'];
}

export function detectSystemLocale(): Locale {
  const lang = navigator.language;
  if (lang.startsWith('zh')) return 'zh-CN';
  if (lang.startsWith('en')) return 'en';
  return 'zh-CN'; // 默认简体中文
}

export type Translations = typeof zhCN;
