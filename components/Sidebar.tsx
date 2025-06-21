'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  HomeIcon,
  UsersIcon,
  BanknotesIcon,
  BuildingLibraryIcon,
  ClipboardDocumentListIcon,
  Cog6ToothIcon,
  ChartBarIcon,
  ArrowsRightLeftIcon,
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon
} from '@heroicons/react/24/outline';

interface SidebarProps {
  collapsed: boolean;
  mobileOpen: boolean;
  onToggle: () => void;
  onMobileToggle: () => void;
}

const menuItems = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: HomeIcon,
  },
  {
    name: 'Orders',
    href: '/dashboard/orders',
    icon: ClipboardDocumentListIcon,
  },
  {
    name: 'Exchanges',
    href: '/dashboard/exchanges',
    icon: ArrowsRightLeftIcon,
  },
  {
    name: 'Users',
    href: '/dashboard/users',
    icon: UsersIcon,
  },
  {
    name: 'Banks',
    href: '/dashboard/banks',
    icon: BuildingLibraryIcon,
  },
  {
    name: 'Platform Banks',
    href: '/dashboard/platform-banks',
    icon: BanknotesIcon,
  },
  {
    name: 'Analytics',
    href: '/dashboard/analytics',
    icon: ChartBarIcon,
  },
  {
    name: 'Settings',
    href: '/dashboard/settings',
    icon: Cog6ToothIcon,
  },
];

export default function Sidebar({ collapsed, mobileOpen, onToggle }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop Sidebar */}
      <div className={`fixed top-0 left-0 z-30 h-full bg-white shadow-lg border-r border-gray-200 transition-all duration-300 ease-in-out ${
        collapsed ? 'w-16' : 'w-64'
      } hidden md:block`}>
        
        {/* Logo Section */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          {!collapsed && (
            <div className="flex items-center">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">T</span>
              </div>
              <span className="ml-2 text-lg font-semibold text-gray-900">TramAnSys</span>
            </div>
          )}
          {collapsed && (
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center mx-auto">
              <span className="text-white font-bold text-sm">T</span>
            </div>
          )}
        </div>

        {/* Toggle Button */}
        <div className="absolute -right-3 top-20 z-40">
          <button
            onClick={onToggle}
            className="w-6 h-6 bg-white border border-gray-200 rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition-shadow"
          >
            {collapsed ? (
              <ChevronDoubleRightIcon className="w-3 h-3 text-gray-600" />
            ) : (
              <ChevronDoubleLeftIcon className="w-3 h-3 text-gray-600" />
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
                        ? 'bg-primary-50 text-primary-700 border-r-2 border-primary-600'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <item.icon className={`${collapsed ? 'w-5 h-5' : 'w-5 h-5 mr-3'} ${
                      isActive ? 'text-primary-600' : 'text-gray-400'
                    }`} />
                    {!collapsed && <span>{item.name}</span>}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>

      {/* Mobile Sidebar */}
      <div className={`fixed top-0 left-0 z-50 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out md:hidden ${
        mobileOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        
        {/* Logo Section */}
        <div className="flex items-center p-4 border-b border-gray-200">
          <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">T</span>
          </div>
          <span className="ml-2 text-lg font-semibold text-gray-900">TramAnSys</span>
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
                        ? 'bg-primary-50 text-primary-700 border-r-2 border-primary-600'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <item.icon className={`w-5 h-5 mr-3 ${
                      isActive ? 'text-primary-600' : 'text-gray-400'
                    }`} />
                    <span>{item.name}</span>
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