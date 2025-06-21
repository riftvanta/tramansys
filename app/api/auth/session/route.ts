import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, findUserById, createSessionPayload } from '@/lib/auth';
import { ApiResponse } from '@/types';

// Force Node.js runtime for crypto operations
export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  try {
    // Get token from cookie
    const token = request.cookies.get('auth-token')?.value;

    if (!token) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'No authentication token found',
      }, { status: 401 });
    }

    // Verify token
    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Invalid or expired token',
      }, { status: 401 });
    }

    // Get user from database
    const user = await findUserById(payload.userId);
    if (!user) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'User not found',
      }, { status: 401 });
    }

    // Return user session data
    const sessionData = createSessionPayload(user);
    return NextResponse.json<ApiResponse>({
      success: true,
      data: { user: sessionData },
    });
  } catch (error) {
    console.error('Session API error:', error);
    return NextResponse.json<ApiResponse>({
      success: false,
      error: 'Internal server error',
    }, { status: 500 });
  }
}

// Handle unsupported methods
export async function POST() {
  return NextResponse.json<ApiResponse>({
    success: false,
    error: 'Method not allowed',
  }, { status: 405 });
} 