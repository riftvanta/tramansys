import React from 'react';
import type { Metadata, Viewport } from 'next';
import { AuthProvider } from '@/lib/contexts/auth-context';
import './globals.css';

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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
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