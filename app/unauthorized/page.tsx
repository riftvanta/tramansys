'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/contexts/auth-context';

export default function UnauthorizedPage() {
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleGoBack = () => {
    if (user) {
      router.push('/dashboard');
    } else {
      router.push('/login');
    }
  };

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-error-50 to-secondary-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-8">
        {/* Error Icon */}
        <div className="mx-auto h-24 w-24 bg-error-100 rounded-full flex items-center justify-center">
          <svg
            className="h-12 w-12 text-error-600"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.314 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>

        {/* Error Message */}
        <div className="space-y-4">
          <h1 className="text-4xl font-bold text-error-600">403</h1>
          <h2 className="text-2xl font-bold text-secondary-900">
            Access Denied
          </h2>
          <p className="text-secondary-600">
            You do not have permission to access this page.
          </p>
        </div>

        {/* User Info */}
        {user && (
          <div className="card bg-secondary-50 border-secondary-200">
            <div className="text-sm text-secondary-600">
              <p>Logged in as: <span className="font-medium text-secondary-900">{user.username}</span></p>
              <p>Role: <span className="font-medium text-secondary-900">{user.role === 'admin' ? 'Admin' : 'Exchange'}</span></p>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="space-y-4">
          <button
            onClick={handleGoBack}
            className="btn btn-primary w-full"
          >
            {user ? 'Go to Dashboard' : 'Go to Login'}
          </button>
          
          {user && (
            <button
              onClick={handleLogout}
              className="btn btn-secondary w-full"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </div>
  );
} 