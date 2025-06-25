import React from 'react';
import { getDictionary, type Locale } from '@/lib/i18n';
import AdminLayout from './AdminLayout';

interface AdminLayoutWrapperProps {
  children: React.ReactNode;
  locale: Locale;
}

export default async function AdminLayoutWrapper({ children, locale }: AdminLayoutWrapperProps) {
  const dictionary = await getDictionary(locale);

  return (
    <AdminLayout dictionary={dictionary} locale={locale}>
      {children}
    </AdminLayout>
  );
} 