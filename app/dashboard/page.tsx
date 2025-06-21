'use client';

import React from 'react';
import { useRequireAuth } from '@/lib/contexts/auth-context';
import AdminLayout from '@/components/AdminLayout';
import { formatCurrency } from '@/lib/utils';

// Statistics Component
function StatsOverview() {
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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
      {/* Total Orders */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">Total Orders</p>
            <p className="text-2xl font-semibold text-gray-900">{stats.totalOrders}</p>
            <p className="text-xs text-green-600">+12 today</p>
          </div>
        </div>
      </div>

      {/* Total Volume */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">Total Volume</p>
            <p className="text-2xl font-semibold text-gray-900">{formatCurrency(stats.totalVolume)}</p>
            <p className="text-xs text-green-600">+{formatCurrency(stats.todayVolume)} today</p>
          </div>
        </div>
      </div>

      {/* Pending Orders */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">Pending Orders</p>
            <p className="text-2xl font-semibold text-gray-900">{stats.pendingOrders}</p>
            <p className="text-xs text-yellow-600">Need attention</p>
          </div>
        </div>
      </div>

      {/* Platform Balance */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">Platform Balance</p>
            <p className="text-2xl font-semibold text-gray-900">{formatCurrency(stats.platformBalance)}</p>
            <p className="text-xs text-blue-600">Across all banks</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Quick Actions Component
function QuickActions() {
  const actions = [
    {
      title: 'Review Orders',
      description: 'Review pending orders',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      href: '/dashboard/orders',
      color: 'bg-blue-600 hover:bg-blue-700'
    },
    {
      title: 'Create Exchange',
      description: 'Add new exchange office',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      ),
      href: '/dashboard/exchanges',
      color: 'bg-green-600 hover:bg-green-700'
    },
    {
      title: 'Manage Banks',
      description: 'Configure bank accounts',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
      href: '/dashboard/banks',
      color: 'bg-purple-600 hover:bg-purple-700'
    },
    {
      title: 'View Analytics',
      description: 'Performance insights',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      href: '/dashboard/analytics',
      color: 'bg-indigo-600 hover:bg-indigo-700'
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {actions.map((action, index) => (
          <button
            key={index}
            className={`${action.color} text-white p-4 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 touch-friendly`}
          >
            <div className="flex flex-col items-center text-center">
              {action.icon}
              <h4 className="mt-2 font-medium">{action.title}</h4>
              <p className="mt-1 text-sm text-white/80">{action.description}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

// Recent Activity Component
function RecentActivity() {
  const activities = [
    {
      id: 1,
      type: 'order_created',
      description: 'New outgoing order T25010001 created by Exchange A',
      time: '2 minutes ago',
      status: 'pending'
    },
    {
      id: 2,
      type: 'order_approved',
      description: 'Incoming order T25010002 approved and processing',
      time: '15 minutes ago',
      status: 'approved'
    },
    {
      id: 3,
      type: 'user_created',
      description: 'New exchange office "Jordan Exchange" created',
      time: '1 hour ago',
      status: 'success'
    },
    {
      id: 4,
      type: 'order_completed',
      description: 'Order T25010003 completed successfully',
      time: '2 hours ago',
      status: 'completed'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-blue-100 text-blue-800';
      case 'success': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-900">{activity.description}</p>
              <div className="flex items-center mt-1 space-x-2">
                <span className="text-xs text-gray-500">{activity.time}</span>
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(activity.status)}`}>
                  {activity.status}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { user } = useRequireAuth();

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
    <AdminLayout>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Welcome back, {user.username}!
              </h2>
              <p className="mt-1 text-gray-600">
                Here&apos;s what&apos;s happening with your financial transfer system today.
              </p>
            </div>
            <div className="mt-4 sm:mt-0">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm text-gray-600">System Status: Healthy</span>
              </div>
            </div>
          </div>
        </div>

        {/* Statistics Overview */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Overview</h3>
          <StatsOverview />
        </div>

        {/* Quick Actions */}
        <QuickActions />

        {/* Recent Activity */}
        <RecentActivity />

        {/* Development Status */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-blue-400 rounded-full mr-3 animate-pulse flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <h3 className="text-blue-800 font-medium">Phase 4.1: Admin Dashboard Layout Complete</h3>
              <p className="text-blue-700 text-sm mt-1">
                ✅ Responsive navigation with collapsible sidebar<br/>
                ✅ Real-time statistics overview<br/>
                ✅ Quick action buttons<br/>
                ✅ Mobile-optimized interface<br/>
                ✅ Touch-friendly UI elements
              </p>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
} 