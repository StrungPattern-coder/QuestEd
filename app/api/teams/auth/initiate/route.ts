import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/backend/utils/db';
import { getAuthorizationUrl } from '@/backend/utils/microsoftGraph';
import jwt from 'jsonwebtoken';

// Force dynamic rendering (required for Next.js 14+)
export const dynamic = 'force-dynamic';

/**
 * GET /api/teams/auth/initiate
 * Initiate Microsoft Teams OAuth flow
 */
export async function GET(request: NextRequest) {
  try {
    // Verify user authentication
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;

    await connectDB();

    // Generate state parameter for CSRF protection
    const state = JSON.stringify({
      userId: decoded.userId,
      timestamp: Date.now(),
      nonce: Math.random().toString(36).substring(7),
    });

    // Encode state to base64
    const encodedState = Buffer.from(state).toString('base64');

    // Get redirect URI from environment
    const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/api/teams/auth/callback`;

    // Generate authorization URL
    const authUrl = getAuthorizationUrl(redirectUri, encodedState);

    return NextResponse.json({
      authUrl,
      state: encodedState,
    });
  } catch (error: any) {
    console.error('Error initiating Teams auth:', error);
    return NextResponse.json(
      { error: 'Failed to initiate Teams authentication' },
      { status: 500 }
    );
  }
}
