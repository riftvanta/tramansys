'use client';

import React, { useState, useEffect } from 'react';
import { useRequireAuth } from '@/lib/contexts/auth-context';
import { type Locale } from '@/lib/i18n-client';
import Sidebar from './Sidebar';
import Header from './Header';

interface AdminLayoutProps {
  children: React.ReactNode;
  dictionary?: any;
  locale?: Locale;
}

export default function AdminLayout({ children, dictionary, locale }: AdminLayoutProps) {
  const { user } = useRequireAuth();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isRTL = locale === 'ar';

  // Close mobile menu when screen size changes
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Mobile backdrop */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <Sidebar 
        collapsed={sidebarCollapsed}
        mobileOpen={mobileMenuOpen}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        onMobileToggle={() => setMobileMenuOpen(!mobileMenuOpen)}
        dictionary={dictionary}
        locale={locale}
      />

      {/* Main content */}
      <div className={`transition-all duration-300 ease-in-out ${
        isRTL 
          ? (sidebarCollapsed ? 'md:mr-16' : 'md:mr-64')
          : (sidebarCollapsed ? 'md:ml-16' : 'md:ml-64')
      }`}>
        {/* Header */}
        <Header 
          user={user}
          onMobileMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)}
          onSidebarToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
          sidebarCollapsed={sidebarCollapsed}
          dictionary={dictionary}
          locale={locale}
        />

        {/* Page content */}
        <main className="px-4 py-6 sm:px-6 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  );
} 