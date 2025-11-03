import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/backend/utils/db';
import Test from '@/backend/models/Test';
import { publishQuickQuizParticipantJoined } from '@/backend/utils/socket-server';

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const { joinCode, participantName } = await request.json();

    if (!joinCode || !participantName) {
      return NextResponse.json(
        { error: 'Join code and participant name are required' },
        { status: 400 }
      );
    }

    // Find test by join code
    const test = await Test.findOne({ 
      joinCode: joinCode.toUpperCase(),
      isCompleted: false, // Only check if not completed
    });

    if (!test) {
      return NextResponse.json(
        { error: 'Quiz not found or has ended' },
        { status: 404 }
      );
    }

    // Publish participant join event via Socket.IO
    await publishQuickQuizParticipantJoined(String(test._id), {
      participantName,
      joinedAt: new Date(),
    });

    // For quick quizzes, we don't create user accounts
    // Just verify the quiz exists and is joinable
    return NextResponse.json({
      message: 'Successfully joined quiz',
      test: {
        _id: test._id,
        title: test.title,
        hostName: test.hostName,
        timeLimitPerQuestion: test.timeLimitPerQuestion,
      },
      participantName,
    });
  } catch (error: any) {
    console.error('Join quiz error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to join quiz' },
      { status: 500 }
    );
  }
}
