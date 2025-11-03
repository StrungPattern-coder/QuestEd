import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/backend/utils/db';
import TeamsIntegration from '@/backend/models/TeamsIntegration';
import jwt from 'jsonwebtoken';
import { MicrosoftGraphClient, refreshAccessToken } from '@/backend/utils/microsoftGraph';

/**
 * GET /api/teams/integration/teams
 * Get all Teams the user is a member of
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

    // Get teams from Microsoft Graph
    const graphClient = new MicrosoftGraphClient(accessToken);
    const teams = await graphClient.getUserTeams();

    // Update last sync time
    integration.lastSyncAt = new Date();
    await integration.save();

    return NextResponse.json({
      teams,
    });
  } catch (error: any) {
    console.error('Error fetching Teams:', error);
    return NextResponse.json(
      { error: 'Failed to fetch Teams' },
      { status: 500 }
    );
  }
}
