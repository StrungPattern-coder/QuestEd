import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/backend/utils/db';
import TeamsIntegration from '@/backend/models/TeamsIntegration';
import { verifyToken } from '@/backend/middleware/auth';
import { teamsService } from '@/backend/utils/teamsService';
import { decrypt, encrypt } from '@/backend/utils/encryption';

export const dynamic = 'force-dynamic';

/**
 * GET /api/integrations/teams/teams
 * Get user's Microsoft Teams list
 */
export async function GET(request: NextRequest) {
  try {
    await connectDB();

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

    // Find active integration with tokens
    const integration = await TeamsIntegration.findOne({
      userId: decoded.userId,
      isActive: true,
    }).select('+accessToken +refreshToken');

    if (!integration) {
      return NextResponse.json(
        { error: 'Teams not connected' },
        { status: 404 }
      );
    }

    // Check if token needs refresh
    let accessToken = decrypt(integration.accessToken);

    if (integration.isTokenExpired()) {
      // Refresh token
      const tokenResponse = await teamsService.refreshAccessToken(
        integration.refreshToken,
        integration.tenantId
      );

      // Update stored tokens
      integration.accessToken = encrypt(tokenResponse.access_token);
      integration.refreshToken = encrypt(tokenResponse.refresh_token);
      integration.tokenExpiresAt = new Date(Date.now() + tokenResponse.expires_in * 1000);
      await integration.save();

      accessToken = tokenResponse.access_token;
    }

    // Get teams from Microsoft Graph API
    const teams = await teamsService.getTeams(accessToken);

    return NextResponse.json({ teams });
  } catch (error: any) {
    console.error('Get Teams error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch teams' },
      { status: 500 }
    );
  }
}
