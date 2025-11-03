import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/backend/utils/db';
import Test from '@/backend/models/Test';
import { publishQuickQuizStarted } from '@/backend/utils/socket-server';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id: testId } = await params;

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

    // Publish quiz start event via Socket.IO to notify all participants
    await publishQuickQuizStarted(testId);

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
