import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/backend/utils/db';
import Test from '@/backend/models/Test';

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

    // Mark the test as completed
    test.isCompleted = true;
    test.endTime = new Date();
    await test.save();

    return NextResponse.json({
      message: 'Quiz completed successfully',
      test: {
        _id: test._id,
        isCompleted: test.isCompleted,
        endTime: test.endTime,
      },
    });
  } catch (error: any) {
    console.error('Complete quiz error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to complete quiz' },
      { status: 500 }
    );
  }
}
