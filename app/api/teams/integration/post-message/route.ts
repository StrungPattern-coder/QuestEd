import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/backend/utils/db';
import TeamsIntegration from '@/backend/models/TeamsIntegration';
import jwt from 'jsonwebtoken';
import { MicrosoftGraphClient, refreshAccessToken } from '@/backend/utils/microsoftGraph';

// Force dynamic rendering (required for Next.js 14+)
export const dynamic = 'force-dynamic';

/**
 * POST /api/teams/integration/post-message
 * Post a message to a Teams channel
 */
export async function POST(request: NextRequest) {
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

    const body = await request.json();
    const { teamId, channelId, message, title, buttons } = body;

    // Validate required fields
    if (!teamId || !channelId || !message) {
      return NextResponse.json(
        { error: 'teamId, channelId, and message are required' },
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

    // Post message to Teams
    const graphClient = new MicrosoftGraphClient(accessToken);
    
    if (title || buttons) {
      // Post as card with title and optional buttons
      await graphClient.postCardToChannel(teamId, channelId, title || 'QuestEd', message, buttons);
    } else {
      // Post as simple message
      await graphClient.postMessageToChannel(teamId, channelId, message);
    }

    return NextResponse.json({
      success: true,
      message: 'Message posted successfully',
    });
  } catch (error: any) {
    console.error('Error posting message:', error);
    return NextResponse.json(
      { error: 'Failed to post message to Teams' },
      { status: 500 }
    );
  }
}
