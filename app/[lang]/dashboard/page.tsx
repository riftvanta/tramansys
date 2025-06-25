import React from 'react';
import { type Locale } from '@/lib/i18n-client';
import AdminLayoutWrapper from '@/components/AdminLayoutWrapper';
import DashboardContent from '@/components/DashboardContent';

export default async function DashboardPage({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await params;

  return (
    <AdminLayoutWrapper locale={lang}>
      <DashboardContent locale={lang} />
    </AdminLayoutWrapper>
  );
} 