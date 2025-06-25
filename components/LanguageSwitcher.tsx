'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { type Locale } from '@/lib/i18n-client';

interface LanguageSwitcherProps {
  currentLocale: Locale;
}

export default function LanguageSwitcher({ currentLocale }: LanguageSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [dictionary, setDictionary] = useState<any>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const loadDictionary = async () => {
      try {
        const dict = await import(`../dictionaries/${currentLocale}.json`);
        setDictionary(dict.default);
      } catch (error) {
        console.error('Failed to load dictionary:', error);
        // Fallback to English
        const fallback = await import('../dictionaries/en.json');
        setDictionary(fallback.default);
      }
    };

    loadDictionary();
  }, [currentLocale]);

  if (!dictionary) {
    return (
      <div className="w-32 h-10 bg-gray-200 animate-pulse rounded-md"></div>
    );
  }

  const switchLanguage = (newLocale: Locale) => {
    // Remove current locale from path and add new locale
    const pathWithoutLocale = pathname.replace(/^\/(en|ar)/, '');
    const newPath = `/${newLocale}${pathWithoutLocale}`;
    
    router.push(newPath);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
      >
        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
        </svg>
        <span className="hidden sm:inline">
          {currentLocale === 'en' ? dictionary.languages.english : dictionary.languages.arabic}
        </span>
        <span className="sm:hidden">
          {currentLocale === 'en' ? 'EN' : 'AR'}
        </span>
        <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-50">
          <div className="py-1">
            <button
              onClick={() => switchLanguage('en')}
              className={`flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 ${
                currentLocale === 'en' ? 'bg-primary-50 text-primary-700' : ''
              }`}
            >
              <span className="mr-3">🇺🇸</span>
              {dictionary.languages.english}
              {currentLocale === 'en' && (
                <svg className="w-4 h-4 ml-auto text-primary-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </button>
            <button
              onClick={() => switchLanguage('ar')}
              className={`flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 ${
                currentLocale === 'ar' ? 'bg-primary-50 text-primary-700' : ''
              }`}
            >
              <span className="mr-3">🇯🇴</span>
              {dictionary.languages.arabic}
              {currentLocale === 'ar' && (
                <svg className="w-4 h-4 ml-auto text-primary-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Backdrop for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
} 