import React from 'react';
import { getDictionary, type Locale } from '@/lib/i18n';
import LoginForm from '@/components/LoginForm';

export default async function LoginPage({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await params;
  const dictionary = await getDictionary(lang);

  return <LoginForm dictionary={dictionary} locale={lang} />;
} 