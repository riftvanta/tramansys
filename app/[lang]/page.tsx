import React from 'react';
import { getDictionary, type Locale } from '@/lib/i18n';
import Link from 'next/link';

export default async function HomePage({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await params;
  const dictionary = await getDictionary(lang);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8 text-center">
        <div>
          <div className="mx-auto h-20 w-20 bg-primary-600 rounded-full flex items-center justify-center mb-6">
            <span className="text-white font-bold text-2xl">T</span>
          </div>
          <h1 className="text-4xl font-bold text-secondary-900 mb-2">
            TramAnSys
          </h1>
          <p className="text-lg text-secondary-600 mb-8">
            Financial Transfer Management System
          </p>
        </div>

        <div className="space-y-4">
          <Link
            href={`/${lang}/login`}
            className="w-full inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200"
          >
            {dictionary.auth.login}
          </Link>
          
          <div className="text-center">
            <p className="text-sm text-secondary-500">
              {lang === 'en' ? 'Secure financial transfer management for Jordan' : 'نظام إدارة التحويلات المالية الآمن للأردن'}
            </p>
          </div>
        </div>

        {/* Language Switcher */}
        <div className="flex justify-center space-x-4">
          <Link
            href={`/en${lang === 'ar' ? '/' : ''}`}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              lang === 'en'
                ? 'bg-primary-100 text-primary-700'
                : 'text-secondary-600 hover:text-secondary-900'
            }`}
          >
            English
          </Link>
          <Link
            href={`/ar${lang === 'en' ? '/' : ''}`}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              lang === 'ar'
                ? 'bg-primary-100 text-primary-700'
                : 'text-secondary-600 hover:text-secondary-900'
            }`}
          >
            العربية
          </Link>
        </div>

        {/* Demo Information */}
        <div className="bg-white/50 backdrop-blur-sm rounded-lg p-4 border border-white/20">
          <h3 className="text-sm font-medium text-secondary-800 mb-2">
            {lang === 'en' ? 'Demo Access' : 'وصول تجريبي'}
          </h3>
          <div className="text-xs text-secondary-600 space-y-1">
            <div>
              <strong>{lang === 'en' ? 'Admin:' : 'مدير:'}</strong> admin / admin123
            </div>
            <div>
              <strong>{lang === 'en' ? 'Exchange:' : 'صرافة:'}</strong> exchange / exchange123
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 