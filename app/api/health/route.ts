import { NextResponse } from 'next/server';

/**
 * Health check endpoint for Render.com
 * This helps Render know when the app is ready to serve traffic
 * Reduces/eliminates the loading screen
 */
export async function GET() {
  return NextResponse.json(
    { 
      status: 'healthy',
      timestamp: new Date().toISOString(),
      service: 'QuestEd',
      socketIO: 'active'
    },
    { status: 200 }
  );
}
