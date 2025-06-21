import React from 'react';

// Testing permissions fix for Firebase Functions deployment
export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-primary-900 mb-2">
              TramAnSys
            </h1>
            <p className="text-secondary-600 text-lg">
              Financial Transfer Management System
            </p>
          </div>

          {/* Welcome Card */}
          <div className="card mb-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-primary-600"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-secondary-900 mb-2">
                Welcome to TramAnSys
              </h2>
              <p className="text-secondary-600 mb-4">
                Secure financial transfer management for exchange offices in Jordan
              </p>
            </div>
          </div>

          {/* Features */}
          <div className="space-y-4 mb-8">
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 bg-success-100 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-success-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-secondary-700">Real-time order management</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 bg-success-100 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-success-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-secondary-700">Mobile-optimized interface</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 bg-success-100 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-success-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-secondary-700">Secure file management</span>
            </div>
          </div>

          {/* Action Button */}
          <div className="text-center">
            <button className="btn btn-primary w-full">
              Get Started
            </button>
          </div>

          {/* Status */}
          <div className="text-center mt-6">
            <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-warning-100 text-warning-800">
              <div className="w-2 h-2 bg-warning-400 rounded-full mr-2 animate-pulse"></div>
              Phase 1: Setup Complete
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 