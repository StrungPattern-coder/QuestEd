import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/backend/utils/db';
import TeamsIntegration from '@/backend/models/TeamsIntegration';
import jwt from 'jsonwebtoken';
import { MicrosoftGraphClient, refreshAccessToken } from '@/backend/utils/microsoftGraph';

// Force dynamic rendering (required for Next.js 14+)
export const dynamic = 'force-dynamic';

/**
 * GET /api/teams/integration/channels?teamId=xxx
 * Get all channels for a specific Team
 */
export async function GET(request: NextRequest) {
  try {
    // Verify authentication
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;

    const { searchParams } = new URL(request.url);
    const teamId = searchParams.get('teamId');

    if (!teamId) {
      return NextResponse.json(
        { error: 'teamId parameter is required' },
        { status: 400 }
      );
    }

    await connectDB();

    // Find integration with tokens
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

    // Check if token is expired and refresh if needed
    let accessToken = integration.accessToken;
    if (integration.isTokenExpired()) {
      try {
        const tokenResponse = await refreshAccessToken(integration.refreshToken);
        integration.accessToken = tokenResponse.access_token;
        integration.refreshToken = tokenResponse.refresh_token;
        integration.tokenExpiresAt = new Date(Date.now() + tokenResponse.expires_in * 1000);
        await integration.save();
        accessToken = tokenResponse.access_token;
      } catch (error) {
        return NextResponse.json(
          { error: 'Failed to refresh token. Please reconnect Teams.' },
          { status: 401 }
        );
      }
    }

    // Get channels from Microsoft Graph
    const graphClient = new MicrosoftGraphClient(accessToken);
    const channels = await graphClient.getTeamChannels(teamId);

    return NextResponse.json({
      channels,
    });
  } catch (error: any) {
    console.error('Error fetching channels:', error);
    return NextResponse.json(
      { error: 'Failed to fetch channels' },
      { status: 500 }
    );
  }
}
