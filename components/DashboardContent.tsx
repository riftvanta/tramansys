'use client';

import React, { useEffect, useState } from 'react';
import { useRequireAuth } from '@/lib/contexts/auth-context';
import { formatCurrencyForLocale, type Locale } from '@/lib/i18n-client';
import LanguageSwitcher from './LanguageSwitcher';

interface DashboardContentProps {
  locale: Locale;
}

export default function DashboardContent({ locale }: DashboardContentProps) {
  const { user } = useRequireAuth();
  const [dictionary, setDictionary] = useState<any>(null);

  useEffect(() => {
    const loadDictionary = async () => {
      try {
        const dict = await import(`../dictionaries/${locale}.json`);
        setDictionary(dict.default);
      } catch (error) {
        console.error('Failed to load dictionary:', error);
        // Fallback to English
        const fallback = await import('../dictionaries/en.json');
        setDictionary(fallback.default);
      }
    };

    loadDictionary();
  }, [locale]);

  if (!dictionary) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const stats = {
    totalOrders: 156,
    totalVolume: 452300,
    pendingOrders: 8,
    activeExchanges: 12,
    todayOrders: 23,
    todayVolume: 45230,
    platformBalance: 175000,
    processingOrders: 5
  };

  return (
    <div className="space-y-6">
      {/* Header with Language Switcher */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {dictionary.dashboard.title}
          </h1>
          <p className="mt-1 text-gray-600">
            {locale === 'ar' 
              ? dictionary.dashboard.welcome 
              : `${dictionary.dashboard.welcome}, ${user?.username}!`
            }
          </p>
        </div>
                 <LanguageSwitcher currentLocale={locale} />
      </div>

      {/* Today's Overview */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">
          {dictionary.dashboard.todayOverview}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {/* Total Orders */}
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
              </div>
              <div className="ms-4">
                <p className="text-sm font-medium text-blue-800">{dictionary.dashboard.stats.totalOrders}</p>
                <p className="text-2xl font-bold text-blue-900">{stats.totalOrders}</p>
                <p className="text-xs text-blue-700">+{stats.todayOrders} {dictionary.dashboard.stats.completedToday.toLowerCase()}</p>
              </div>
            </div>
          </div>

          {/* Pending Orders */}
          <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-yellow-600 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div className="ms-4">
                <p className="text-sm font-medium text-yellow-800">{dictionary.dashboard.stats.pendingOrders}</p>
                <p className="text-2xl font-bold text-yellow-900">{stats.pendingOrders}</p>
                <p className="text-xs text-yellow-700">{dictionary.dashboard.stats.needAttention}</p>
              </div>
            </div>
          </div>

          {/* Total Volume */}
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
              </div>
              <div className="ms-4">
                <p className="text-sm font-medium text-green-800">{dictionary.dashboard.stats.totalVolume}</p>
                <p className="text-2xl font-bold text-green-900">{formatCurrencyForLocale(stats.totalVolume, 'JOD')}</p>
                <p className="text-xs text-green-700">+{formatCurrencyForLocale(stats.todayVolume, 'JOD')} {dictionary.dates.today.toLowerCase()}</p>
              </div>
            </div>
          </div>

          {/* Platform Balance */}
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
              </div>
              <div className="ms-4">
                <p className="text-sm font-medium text-purple-800">{dictionary.dashboard.stats.platformBalance}</p>
                <p className="text-2xl font-bold text-purple-900">{formatCurrencyForLocale(stats.platformBalance, 'JOD')}</p>
                <p className="text-xs text-purple-700">{dictionary.dashboard.stats.acrossAllBanks}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">{dictionary.dashboard.quickActions}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <button className="bg-green-600 hover:bg-green-700 text-white p-4 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
            <div className="flex flex-col items-center text-center">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
              <h4 className="mt-2 font-medium">{dictionary.dashboard.actions.manageExchanges}</h4>
              <p className="mt-1 text-sm text-white/80">Manage exchange offices</p>
            </div>
          </button>
          <button className="bg-purple-600 hover:bg-purple-700 text-white p-4 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500">
            <div className="flex flex-col items-center text-center">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <h4 className="mt-2 font-medium">{dictionary.dashboard.actions.viewReports}</h4>
              <p className="mt-1 text-sm text-white/80">View financial reports</p>
            </div>
          </button>
          <button className="bg-indigo-600 hover:bg-indigo-700 text-white p-4 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            <div className="flex flex-col items-center text-center">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <h4 className="mt-2 font-medium">{dictionary.dashboard.actions.systemSettings}</h4>
              <p className="mt-1 text-sm text-white/80">Configure system settings</p>
            </div>
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">{dictionary.dashboard.recentActivity}</h3>
          <button className="text-sm text-primary-600 hover:text-primary-700 font-medium">
            {dictionary.dashboard.viewAll}
          </button>
        </div>
        <div className="space-y-3">
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            <div className="flex-1">
              <p className="text-sm text-gray-900">New order #ORD-2024-001 created</p>
              <p className="text-xs text-gray-500">2 minutes ago</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
            <div className="flex-1">
                             <p className="text-sm text-gray-900">Exchange office &quot;Al-Quds Exchange&quot; updated</p>
              <p className="text-xs text-gray-500">15 minutes ago</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
            <div className="flex-1">
              <p className="text-sm text-gray-900">Order #ORD-2024-002 pending review</p>
              <p className="text-xs text-gray-500">1 hour ago</p>
            </div>
          </div>
        </div>
      </div>


    </div>
  );
} 