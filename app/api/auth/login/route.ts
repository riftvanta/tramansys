import { NextRequest, NextResponse } from 'next/server';
import { authenticateUser, signToken } from '@/lib/auth';
import { ApiResponse } from '@/types';

// Force Node.js runtime for crypto operations
export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    // Authenticate user
    const authResult = await authenticateUser(username, password);

    if (!authResult.success) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: authResult.error,
      }, { status: 401 });
    }

    // Create JWT token
    const token = signToken({
      userId: authResult.user!.id,
      username: authResult.user!.username,
      role: authResult.user!.role,
    });

    // Create response with session cookie
    const response = NextResponse.json<ApiResponse>({
      success: true,
      data: {
        user: authResult.user,
        message: 'Login successful',
      },
    });

    // Set HTTP-only cookie with JWT token
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60, // 24 hours
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Login API error:', error);
    return NextResponse.json<ApiResponse>({
      success: false,
      error: 'Internal server error',
    }, { status: 500 });
  }
}

// Handle unsupported methods
export async function GET() {
  return NextResponse.json<ApiResponse>({
    success: false,
    error: 'Method not allowed',
  }, { status: 405 });
} 