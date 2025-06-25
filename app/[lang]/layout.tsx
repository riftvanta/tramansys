import React from 'react';
import type { Metadata, Viewport } from 'next';
import { AuthProvider } from '@/lib/contexts/auth-context';
import { getLocaleDirection, type Locale } from '@/lib/i18n-client';
import '../globals.css';

export async function generateStaticParams() {
  return [{ lang: 'en' }, { lang: 'ar' }];
}

export const metadata: Metadata = {
  title: 'TramAnSys - Financial Transfer Management',
  description: 'Mobile-first PWA for financial transfer management between exchange offices and admin',
  keywords: ['financial', 'transfer', 'management', 'exchange', 'Jordan', 'mobile'],
  authors: [{ name: 'TramAnSys Team' }],
  creator: 'TramAnSys',
  publisher: 'TramAnSys',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'TramAnSys',
  },
  icons: {
    icon: '/icon-192x192.png',
    apple: '/apple-touch-icon.png',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#3b82f6',
  colorScheme: 'light',
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await params;
  const direction = getLocaleDirection(lang);
  
  return (
    <html lang={lang} dir={direction} className="h-full">
      <body className="h-full">
        <div id="root" className="min-h-full">
          <AuthProvider>
            {children}
          </AuthProvider>
        </div>
      </body>
    </html>
  );
} 