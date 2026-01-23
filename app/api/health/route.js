// app/api/health/route.js
import { NextResponse } from 'next/server';
import { checkDatabaseHealth } from '@/lib/queries';

export async function GET() {
  try {
    const dbHealthy = await checkDatabaseHealth();
    
    if (!dbHealthy) {
      return NextResponse.json(
        { 
          status: 'unhealthy',
          database: 'disconnected',
          timestamp: new Date().toISOString()
        },
        { status: 503 }
      );
    }

    return NextResponse.json({
      status: 'healthy',
      database: 'connected',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Health Check Error:', error);
    return NextResponse.json(
      { 
        status: 'error',
        database: 'error',
        message: error.message,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic';