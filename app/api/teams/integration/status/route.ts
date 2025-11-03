import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/backend/utils/db';
import TeamsIntegration from '@/backend/models/TeamsIntegration';
import jwt from 'jsonwebtoken';
import { MicrosoftGraphClient, refreshAccessToken } from '@/backend/utils/microsoftGraph';

/**
 * GET /api/teams/integration/status
 * Get Teams integration status for current user
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

    // Find integration
    const integration = await TeamsIntegration.findOne({
      userId: decoded.userId,
      isActive: true,
    }).select('-accessToken -refreshToken'); // Don't expose tokens

    if (!integration) {
      return NextResponse.json({
        connected: false,
        integration: null,
      });
    }

    // Check if token needs refresh
    const needsRefresh = integration.isTokenExpired();

    return NextResponse.json({
      connected: true,
      needsRefresh,
      integration: {
        id: integration._id,
        accountType: integration.accountType,
        displayName: integration.displayName,
        email: integration.email,
        connectedAt: integration.connectedAt,
        lastSyncAt: integration.lastSyncAt,
      },
    });
  } catch (error: any) {
    console.error('Error checking Teams status:', error);
    return NextResponse.json(
      { error: 'Failed to check integration status' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/teams/integration/status
 * Disconnect Teams integration
 */
export async function DELETE(request: NextRequest) {
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

    // Delete integration
    await TeamsIntegration.findOneAndDelete({
      userId: decoded.userId,
    });

    return NextResponse.json({
      message: 'Teams integration disconnected successfully',
    });
  } catch (error: any) {
    console.error('Error disconnecting Teams:', error);
    return NextResponse.json(
      { error: 'Failed to disconnect integration' },
      { status: 500 }
    );
  }
}
