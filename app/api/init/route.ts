import { NextResponse } from 'next/server';
import { initializeDatabase } from '@/lib/database-init';

export async function POST() {
  try {
    console.log('Starting database initialization...');
    
    const result = await initializeDatabase({
      createDefaultAdmin: true,
      adminUsername: 'admin',
      adminPassword: 'admin123',
      createSampleBanks: true,
      createSamplePlatformBanks: true,
      skipExisting: false, // Don't skip existing for debugging
    });

    console.log('Initialization result:', JSON.stringify(result, null, 2));

    return NextResponse.json({
      success: result.success,
      message: result.success ? 'Database initialized successfully' : 'Database initialization completed with errors',
      errors: result.errors,
      details: result,
    }, { status: result.success ? 200 : 500 });

  } catch (error) {
    console.error('Database initialization error:', error);
    return NextResponse.json({
      success: false,
      message: 'Database initialization error',
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Database initialization endpoint. Use POST to initialize.',
    endpoints: {
      POST: '/api/init - Initialize database with admin user and sample data'
    }
  });
} 