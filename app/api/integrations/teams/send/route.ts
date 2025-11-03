import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/backend/utils/db';
import TeamsIntegration from '@/backend/models/TeamsIntegration';
import User from '@/backend/models/User';
import { verifyToken } from '@/backend/middleware/auth';
import { teamsService } from '@/backend/utils/teamsService';
import { decrypt, encrypt } from '@/backend/utils/encryption';

export const dynamic = 'force-dynamic';

/**
 * POST /api/integrations/teams/send
 * Send notification to Teams channel
 */
export async function POST(request: NextRequest) {
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

    // Parse request body
    const body = await request.json();
    const { teamId, channelId, type, data } = body;

    if (!teamId || !channelId || !type) {
      return NextResponse.json(
        { error: 'Team ID, Channel ID, and notification type are required' },
        { status: 400 }
      );
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

    // Get user details
    const user = await User.findById(decoded.userId);
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
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

    let success = false;

    // Send notification based on type
    if (type === 'quiz') {
      const { quizTitle, joinCode } = data;
      const card = teamsService.createQuizNotificationCard(
        quizTitle,
        joinCode,
        user.name
      );
      success = await teamsService.sendAdaptiveCard(
        accessToken,
        teamId,
        channelId,
        card
      );
    } else if (type === 'test') {
      const { testTitle, deadline } = data;
      const card = teamsService.createTestAssignmentCard(
        testTitle,
        deadline,
        user.name
      );
      success = await teamsService.sendAdaptiveCard(
        accessToken,
        teamId,
        channelId,
        card
      );
    } else if (type === 'message') {
      const { message } = data;
      success = await teamsService.sendMessageToChannel(
        accessToken,
        teamId,
        channelId,
        message
      );
    } else {
      return NextResponse.json(
        { error: 'Invalid notification type' },
        { status: 400 }
      );
    }

    if (success) {
      return NextResponse.json({ 
        success: true,
        message: 'Notification sent to Teams channel'
      });
    } else {
      return NextResponse.json(
        { error: 'Failed to send notification' },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('Send Teams notification error:', error);
    return NextResponse.json(
      { error: 'Failed to send notification' },
      { status: 500 }
    );
  }
}
