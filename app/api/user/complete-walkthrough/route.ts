import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/backend/utils/db';
import User from '@/backend/models/User';
import { verifyToken } from '@/backend/middleware/auth';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    // Verify authentication
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);
    
    if (!decoded || !decoded.userId) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    // Update user's walkthrough status
    const user = await User.findByIdAndUpdate(
      decoded.userId,
      { walkthroughCompleted: true },
      { new: true, select: 'name email role walkthroughCompleted' }
    );

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'Walkthrough marked as completed',
      walkthroughCompleted: user.walkthroughCompleted,
    });
  } catch (error: any) {
    console.error('Error marking walkthrough as completed:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update walkthrough status' },
      { status: 500 }
    );
  }
}
