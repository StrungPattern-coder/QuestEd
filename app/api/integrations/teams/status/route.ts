import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/backend/utils/db';
import TeamsIntegration from '@/backend/models/TeamsIntegration';
import { verifyToken } from '@/backend/middleware/auth';
import { teamsService } from '@/backend/utils/teamsService';
import { decrypt } from '@/backend/utils/encryption';

export const dynamic = 'force-dynamic';

/**
 * GET /api/integrations/teams/status
 * Get user's Teams integration status
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

    // Find active integration
    const integration = await TeamsIntegration.findOne({
      userId: decoded.userId,
      isActive: true,
    });

    if (!integration) {
      return NextResponse.json({ 
        connected: false,
        integration: null
      });
    }

    // Return integration status (without sensitive tokens)
    return NextResponse.json({
      connected: true,
      integration: {
        accountType: integration.accountType,
        email: integration.email,
        displayName: integration.displayName,
        connectedAt: integration.connectedAt,
        lastSyncAt: integration.lastSyncAt,
      },
    });
  } catch (error: any) {
    console.error('Get Teams status error:', error);
    return NextResponse.json(
      { error: 'Failed to get integration status' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/integrations/teams/status
 * Disconnect Teams integration
 */
export async function DELETE(request: NextRequest) {
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

    // Deactivate integration
    await TeamsIntegration.updateMany(
      { userId: decoded.userId },
      { isActive: false }
    );

    return NextResponse.json({ 
      success: true,
      message: 'Teams integration disconnected'
    });
  } catch (error: any) {
    console.error('Disconnect Teams error:', error);
    return NextResponse.json(
      { error: 'Failed to disconnect integration' },
      { status: 500 }
    );
  }
}
