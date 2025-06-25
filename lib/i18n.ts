import 'server-only';

export type Locale = 'en' | 'ar';

export const locales: Locale[] = ['en', 'ar'] as const;
export const defaultLocale: Locale = 'en';

const dictionaries = {
  en: () => import('../dictionaries/en.json').then((module) => module.default),
  ar: () => import('../dictionaries/ar.json').then((module) => module.default),
};

export const getDictionary = async (locale: Locale) => {
  return dictionaries[locale]?.() ?? dictionaries.en();
};

export function getLocaleDirection(locale: Locale): 'ltr' | 'rtl' {
  return locale === 'ar' ? 'rtl' : 'ltr';
}

export function getOppositeDirection(direction: 'ltr' | 'rtl'): 'ltr' | 'rtl' {
  return direction === 'ltr' ? 'rtl' : 'ltr';
}

export function formatCurrencyForLocale(
  amount: number, 
  currency: string = 'JOD', 
  locale: Locale = 'en'
): string {
  const localeCode = locale === 'ar' ? 'ar-JO' : 'en-JO';
  
  return new Intl.NumberFormat(localeCode, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatDateForLocale(
  date: Date | string, 
  locale: Locale = 'en',
  options: Intl.DateTimeFormatOptions = {}
): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const localeCode = locale === 'ar' ? 'ar-JO' : 'en-JO';
  
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    ...options,
  };
  
  return new Intl.DateTimeFormat(localeCode, defaultOptions).format(dateObj);
}

export function formatNumberForLocale(
  number: number,
  locale: Locale = 'en',
  options: Intl.NumberFormatOptions = {}
): string {
  const localeCode = locale === 'ar' ? 'ar-JO' : 'en-JO';
  return new Intl.NumberFormat(localeCode, options).format(number);
}

export function isValidLocale(locale: string): locale is Locale {
  return locales.includes(locale as Locale);
}

export function getLocalizedPath(path: string, locale: Locale): string {
  // Remove leading slash and locale prefix if they exist
  const cleanPath = path.replace(/^\/(en|ar)/, '').replace(/^\//, '');
  
  // For default locale, return path without locale prefix
  if (locale === defaultLocale) {
    return cleanPath ? `/${cleanPath}` : '/';
  }
  
  // For non-default locales, add locale prefix
  return cleanPath ? `/${locale}/${cleanPath}` : `/${locale}`;
} 