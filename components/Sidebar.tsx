'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { type Locale } from '@/lib/i18n-client';
// Using inline SVG icons instead of Heroicons to avoid module loading issues
const icons = {
  HomeIcon: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  ),
  ClipboardDocumentListIcon: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  ),
  ArrowsRightLeftIcon: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
    </svg>
  ),
  UsersIcon: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
    </svg>
  ),
  BuildingLibraryIcon: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
    </svg>
  ),
  BanknotesIcon: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
    </svg>
  ),
  ChartBarIcon: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  ),
  Cog6ToothIcon: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  ChevronDoubleLeftIcon: () => (
    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
    </svg>
  ),
  ChevronDoubleRightIcon: () => (
    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
    </svg>
  ),
};

interface SidebarProps {
  collapsed: boolean;
  mobileOpen: boolean;
  onToggle: () => void;
  onMobileToggle: () => void;
  dictionary?: any;
  locale?: Locale;
}

export default function Sidebar({ collapsed, mobileOpen, onToggle, dictionary, locale }: SidebarProps) {
  const pathname = usePathname();
  const isRTL = locale === 'ar';

  // Menu items with translation keys
  const menuItems = [
    {
      name: dictionary?.navigation?.dashboard || 'Dashboard',
      href: `/${locale}/dashboard`,
      icon: icons.HomeIcon,
    },
    {
      name: dictionary?.navigation?.orders || 'Orders',
      href: `/${locale}/dashboard/orders`,
      icon: icons.ClipboardDocumentListIcon,
    },
    {
      name: dictionary?.navigation?.exchanges || 'Exchanges',
      href: `/${locale}/dashboard/exchanges`,
      icon: icons.ArrowsRightLeftIcon,
    },
    {
      name: dictionary?.navigation?.users || 'Users',
      href: `/${locale}/dashboard/users`,
      icon: icons.UsersIcon,
    },
    {
      name: dictionary?.navigation?.banks || 'Banks',
      href: `/${locale}/dashboard/banks`,
      icon: icons.BuildingLibraryIcon,
    },
    {
      name: dictionary?.navigation?.platformBanks || 'Platform Banks',
      href: `/${locale}/dashboard/platform-banks`,
      icon: icons.BanknotesIcon,
    },
    {
      name: dictionary?.navigation?.analytics || 'Analytics',
      href: `/${locale}/dashboard/analytics`,
      icon: icons.ChartBarIcon,
    },
    {
      name: dictionary?.navigation?.settings || 'Settings',
      href: `/${locale}/dashboard/settings`,
      icon: icons.Cog6ToothIcon,
    },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <div className={`fixed top-0 ${isRTL ? 'right-0' : 'left-0'} z-30 h-full bg-white shadow-lg ${isRTL ? 'border-l' : 'border-r'} border-gray-200 transition-all duration-300 ease-in-out ${
        collapsed ? 'w-16' : 'w-64'
      } hidden md:block`}>
        
        {/* Logo Section */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          {!collapsed && (
            <div className="flex items-center">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">T</span>
              </div>
              <span className={`${isRTL ? 'mr-2' : 'ml-2'} text-lg font-semibold text-gray-900`}>TramAnSys</span>
            </div>
          )}
          {collapsed && (
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center mx-auto">
              <span className="text-white font-bold text-sm">T</span>
            </div>
          )}
        </div>

        {/* Toggle Button */}
        <div className={`absolute ${isRTL ? '-left-3' : '-right-3'} top-20 z-40`}>
          <button
            onClick={onToggle}
            className="w-6 h-6 bg-white border border-gray-200 rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition-shadow"
          >
            {collapsed ? (
              isRTL ? <icons.ChevronDoubleLeftIcon /> : <icons.ChevronDoubleRightIcon />
            ) : (
              isRTL ? <icons.ChevronDoubleRightIcon /> : <icons.ChevronDoubleLeftIcon />
            )}
          </button>
        </div>

        {/* Navigation */}
        <nav className="mt-4 px-2">
          <ul className="space-y-1">
            {menuItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                      isActive
                        ? `bg-primary-50 text-primary-700 ${isRTL ? 'border-l-2' : 'border-r-2'} border-primary-600`
                        : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <div className={`${collapsed ? '' : isRTL ? 'ml-3' : 'mr-3'} ${
                      isActive ? 'text-primary-600' : 'text-gray-400'
                    }`}>
                      <item.icon />
                    </div>
                    {!collapsed && <span className={isRTL ? 'text-right' : 'text-left'}>{item.name}</span>}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>

      {/* Mobile Sidebar */}
      <div className={`fixed top-0 ${isRTL ? 'right-0' : 'left-0'} z-50 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out md:hidden ${
        mobileOpen ? 'translate-x-0' : (isRTL ? 'translate-x-full' : '-translate-x-full')
      }`}>
        
        {/* Logo Section */}
        <div className="flex items-center p-4 border-b border-gray-200">
          <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">T</span>
          </div>
          <span className={`${isRTL ? 'mr-2' : 'ml-2'} text-lg font-semibold text-gray-900`}>TramAnSys</span>
        </div>

        {/* Navigation */}
        <nav className="mt-4 px-2">
          <ul className="space-y-1">
            {menuItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                      isActive
                        ? `bg-primary-50 text-primary-700 ${isRTL ? 'border-l-2' : 'border-r-2'} border-primary-600`
                        : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <div className={`${isRTL ? 'ml-3' : 'mr-3'} ${
                      isActive ? 'text-primary-600' : 'text-gray-400'
                    }`}>
                      <item.icon />
                    </div>
                    <span className={isRTL ? 'text-right' : 'text-left'}>{item.name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </>
  );
} 