import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/backend/utils/db';
import Test from '@/backend/models/Test';
import Ably from 'ably';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const testId = params.id;

    // Find and update the test
    const test = await Test.findById(testId);

    if (!test) {
      return NextResponse.json(
        { error: 'Quiz not found' },
        { status: 404 }
      );
    }

    // Mark the test as started
    test.isActive = true;
    test.startTime = new Date();
    await test.save();

    // Publish quiz start event via Ably to notify all participants
    const ablyKey = process.env.ABLY_API_KEY || process.env.NEXT_PUBLIC_ABLY_KEY;
    if (ablyKey) {
      const ably = new Ably.Rest({ key: ablyKey });
      const channel = ably.channels.get(`quick-quiz-${testId}`);
      
      await channel.publish('quiz-started', {
        testId,
        startTime: new Date(),
      });
    }

    return NextResponse.json({
      message: 'Quiz started successfully',
      test: {
        _id: test._id,
        isActive: test.isActive,
        startTime: test.startTime,
      },
    });
  } catch (error: any) {
    console.error('Start quiz error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to start quiz' },
      { status: 500 }
    );
  }
}
