import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/backend/utils/db';
import Test from '@/backend/models/Test';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await params;

    const test = await Test.findById(id).populate('questions');

    if (!test) {
      return NextResponse.json(
        { error: 'Quiz not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      test: {
        _id: test._id,
        title: test.title,
        description: test.description,
        hostName: test.hostName,
        joinCode: test.joinCode,
        isActive: test.isActive,
        isCompleted: test.isCompleted,
        timeLimitPerQuestion: test.timeLimitPerQuestion,
        questions: test.questions,
      },
    });
  } catch (error: any) {
    console.error('Fetch quiz error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch quiz' },
      { status: 500 }
    );
  }
}
