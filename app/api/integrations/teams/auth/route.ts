import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/backend/middleware/auth';
import { teamsService } from '@/backend/utils/teamsService';
import crypto from 'crypto';

export const dynamic = 'force-dynamic';

/**
 * GET /api/integrations/teams/auth
 * Initiate Microsoft Teams OAuth flow
 */
export async function GET(request: NextRequest) {
  try {
    // Verify user authentication
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);

    if (!decoded || !decoded.userId) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    // Get account type from query params (personal or work)
    const { searchParams } = new URL(request.url);
    const accountType = searchParams.get('accountType') as 'personal' | 'work' || 'work';

    // Generate secure state token with user info
    const state = Buffer.from(
      JSON.stringify({
        userId: decoded.userId,
        accountType,
        timestamp: Date.now(),
        nonce: crypto.randomBytes(16).toString('hex'),
      })
    ).toString('base64');

    // Get authorization URL
    const authUrl = teamsService.getAuthorizationUrl(state, accountType);

    return NextResponse.json({ authUrl });
  } catch (error: any) {
    console.error('Teams auth initiation error:', error);
    return NextResponse.json(
      { error: 'Failed to initiate Teams authentication' },
      { status: 500 }
    );
  }
}
