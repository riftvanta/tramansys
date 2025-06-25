'use client';

import React from 'react';
import { useAuth } from '@/lib/contexts/auth-context';
import { type Locale } from '@/lib/i18n-client';

interface HeaderProps {
  user: any;
  onMobileMenuToggle: () => void;
  onSidebarToggle: () => void;
  sidebarCollapsed: boolean;
  dictionary?: any;
  locale?: Locale;
}

export default function Header({ user, onMobileMenuToggle, onSidebarToggle, dictionary, locale }: HeaderProps) {
  const { logout } = useAuth();
  const isRTL = locale === 'ar';

  const handleLogout = async () => {
    await logout();
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-20">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Left side - Mobile menu button and title */}
          <div className="flex items-center">
            {/* Mobile menu button */}
            <button
              onClick={onMobileMenuToggle}
              className="md:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
            >
              <span className="sr-only">{dictionary?.common?.close || 'Open main menu'}</span>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            {/* Desktop sidebar toggle */}
            <button
              onClick={onSidebarToggle}
              className="hidden md:block p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
            >
              <span className="sr-only">Toggle sidebar</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            {/* Page title - hidden on mobile when sidebar collapsed */}
            <div className={isRTL ? 'mr-4' : 'ml-4'}>
              <h1 className="text-xl font-semibold text-gray-900">{dictionary?.dashboard?.title || 'Admin Dashboard'}</h1>
            </div>
          </div>

          {/* Right side - User info and actions */}
          <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-4' : 'space-x-4'}`}>
            
            {/* Notifications */}
            <button className="p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500">
              <span className="sr-only">{dictionary?.common?.view || 'View notifications'}</span>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
              </svg>
            </button>

            {/* User profile section */}
            <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-3' : 'space-x-3'}`}>
              {/* Status indicator */}
              <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-2' : 'space-x-2'}`}>
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="hidden sm:block text-sm text-gray-600">
                  {locale === 'ar' ? 'متصل' : 'Online'}
                </span>
              </div>

              {/* User info */}
              <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-2' : 'space-x-2'}`}>
                <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-medium text-sm">{user.username.charAt(0).toUpperCase()}</span>
                </div>
                <div className="hidden sm:block">
                  {!(locale === 'ar' && user.username === 'admin') && (
                    <p className="text-sm font-medium text-gray-900">{user.username}</p>
                  )}
                  <p className="text-xs text-gray-500">
                    {user.role === 'admin' 
                      ? (locale === 'ar' ? 'المسؤول' : 'Administrator') 
                      : (locale === 'ar' ? 'مكتب صرافة' : 'Exchange')
                    }
                  </p>
                </div>
              </div>

              {/* Logout button */}
              <button
                onClick={handleLogout}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200"
              >
                <svg 
                  className={`w-4 h-4 ${isRTL ? 'ml-1 rotate-180' : 'mr-1'}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span className="hidden sm:inline">{dictionary?.auth?.logout || 'Logout'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
} 